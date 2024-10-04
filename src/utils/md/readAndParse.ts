import { readFile, readdir, stat } from "fs/promises";
import { existsSync, readFileSync } from "fs";
import matter from "gray-matter";
import path, { basename } from "path";
import slugify from "slugify";
import { BracketLink, Frontmatter } from "../../validation/md";
import { type Locale } from "../../validation/i18n";
import { dataStore } from "./dataStore";
import { NOTES_PATH } from "./consts";

export const removeMdxExtension = (path: string) => path.replace(/\.mdx?$/, "");

export type Backlink = { title: string; slug: string; excerpt: string | null };

/**
 * Walks down a path and recursively collects all of the filepaths
 */
const walkPath = async (dir: string): Promise<string[]> => {
  if (!existsSync(dir)) {
    throw new Error(`Directory ${dir} does not exist`);
  }
  const files = await readdir(dir);
  const promises = files.map(async (file) => {
    const filepath = path.join(dir, file);
    const stats = await stat(filepath);
    if (stats.isDirectory()) {
      return walkPath(filepath);
    } else {
      return [filepath];
    }
  });
  const results = await Promise.all(promises);
  return results.flat();
};

export const getSlugFromFilepath = (path: string): string =>
  removeMdxExtension(basename(path));

export const getSlugFromTitle = (title: string): string =>
  slugify(title, { lower: true });

/**
 * Returns an array of all file paths in the notes directory
 * that match the provided locale, if provided.
 * @param {Locale} locale - the locale to filter by
 * @returns {Promise<string[]>} - an array of file paths
 */
export const getNotePaths = async (locale?: Locale): Promise<string[]> => {
  const paths = await walkPath(NOTES_PATH);
  if (!locale) {
    return paths;
  }
  return paths.filter(path => {
    const source = readFileSync(path, "utf-8");
    const rawFrontmatter = matter(source).data;
    const frontmatter = Frontmatter.parse(rawFrontmatter);
    // bounce early if the locale doesn't match
    return frontmatter.language === locale;
  })
}

/**
 * Finds all tags that are included in the frontmatter of the articles.
 * Returns a map of tag slugs to tag names, and a set of unique tags.
 */
export const getNoteTopics = async (
  locale: Locale,
): Promise<{
  slugToTopic: Record<string, string>;
  articleTopics: Set<string>;
}> => {
  let { slugToTopic, articleTopics } = dataStore[locale];
  if (slugToTopic && articleTopics) {
    return {
      slugToTopic,
      articleTopics,
    };
  }
  const newSlugToTopic: Record<string, string> = {};
  const newArticleTopics = new Set<string>();
  // Loop through all articles and extract topic and frontmatter
  const notePaths = await getNotePaths(locale);
  for (const notePath of notePaths) {
    const source = await readFile(notePath, "utf-8");
    const rawFrontmatter = matter(source).data;
    const frontmatter = Frontmatter.parse(rawFrontmatter);
    for (const tag of frontmatter.tags ?? []) {
      newArticleTopics.add(tag);
      newSlugToTopic[slugify(tag, { lower: true })] = tag;
    }
  }
  dataStore[locale].slugToTopic = newSlugToTopic;
  dataStore[locale].articleTopics = newArticleTopics;
  return {
    slugToTopic: dataStore[locale].slugToTopic,
    articleTopics: dataStore[locale].articleTopics,
  };
};

/**
 * Creates a map of article titles to their corresonding slugs.
 * Also includes frontmatter aliases for lookup. For example,
 * if the page "Interactive Teaching" has an alias of
 * "Interactive Teaching MOC", the slug can be found through either.
 * Includes links that are mentioned but don't exist yet.
 */
export const getTitleAndSlugMaps = async (
  locale: Locale,
): Promise<{
  titleToSlug: Record<string, string>;
  slugToTitle: Record<string, string>;
}> => {
  const { titleToSlug, slugToTitle } = dataStore[locale];

  if (titleToSlug && slugToTitle) {
    return { titleToSlug, slugToTitle };
  }
  const titleMap: Record<string, string> = {};
  const slugMap: Record<string, string> = {};
  // this creates a map of all titles and aliases to their corresponding slug
  const notePaths = await getNotePaths(locale);
  for (const article of notePaths) {
    const source = await readFile(article, "utf-8");
    const frontmatter = Frontmatter.parse(matter(source).data);
    titleMap[frontmatter.title] = getSlugFromFilepath(article);
    slugMap[getSlugFromFilepath(article)] = frontmatter.title;
    frontmatter.aliases?.forEach((alias) => {
      titleMap[alias] = getSlugFromFilepath(article);
    });
    // check all backlinks to create slugs for pages that don't exist yet
    const bracketLinks = getOutgoingLinks(source);
    for (const { title } of bracketLinks) {
      if (!titleMap[title]) {
        titleMap[title] = getSlugFromTitle(title);
        slugMap[getSlugFromTitle(title)] = title;
      }
    }
  }

  dataStore[locale].titleToSlug = titleMap;
  dataStore[locale].slugToTitle = slugMap;
  return {
    titleToSlug: dataStore[locale].titleToSlug,
    slugToTitle: dataStore[locale].slugToTitle,
  };
};

/**
 * Creates a map of slugs to their respective filepaths. This is necessary to
 * support nested filepaths.
 */
export const getSlugToPathMap = async (
  locale: Locale,
): Promise<Record<string, string>> => {
  const { slugToPath } = dataStore[locale];
  if (slugToPath) {
    return slugToPath;
  }

  let map: Record<string, string> = {};
  const notePaths = await getNotePaths(locale);
  map = notePaths.reduce((accumulator, path) => {
    const slug = getSlugFromFilepath(path);
    accumulator[slug] = path;
    return accumulator;
  }, map);

  dataStore[locale].slugToPath = map;
  return dataStore[locale].slugToPath;
};

/**
 * Takes a fresh Md[x] file, checks for double-bracket links, and
 * converts them to regular website links. If a double-bracket link
 * has an alias (e.g. [[Teaching|teaching]]), it will respect the alias.
 * @param locale - the locale; used for collecting the correct slugs and paths
 * @param titleToSlug - the map created by @getTitleAndSlugMaps
 * @param source - the fresh, raw text of the mdx file
 * @returns the mdx file with Link components added in
 */
export const addLinks = async (
  locale: Locale,
  titleToSlug: Record<string, string>,
  source: string,
): Promise<string> => {
  // Replace embed links with content first
  let embedLinks = getEmbedLinks(source);
  let firstEmbed = true;
  const slugToPathMap = await getSlugToPathMap(locale);
  do {
    for (const { link, title } of embedLinks) {
      const slug = titleToSlug[title];
      if (!slug) {
        throw new Error(`Slug not found for embed of ${title}!`);
      }
      // fetch markdown file content
      const filePath = slugToPathMap[slug];
      if (!filePath) {
        throw new Error(
          `File path not found for the slug ${slug} while trying to embed`,
        );
      }
      let rawEmbed = await readFile(filePath, "utf-8");
      let embed = matter(rawEmbed).content;
      // remove frontmatter
      if (firstEmbed) {
        // provide an indication that this is an embed and provide a link to the original note
        embed =
          `\n\n---\n\n` +
          embed +
          // TODO - add hoverunderline back in once I get marked renderers working
          // `\n\n<span className="text-sm">From note <HoverUnderline><a href="/${slug}">${title}</a></HoverUnderline></span>\n\n---\n\n`;
          `\n\n<span className="text-sm">From note <a href="/notes/${slug}">${title}</a></span>\n\n---\n\n`;
      }
      source = source.replace(link, embed);
      firstEmbed = false;
      // look for new embed links in the embeds we just created
      embedLinks = getEmbedLinks(source);
    }
  } while (embedLinks.length);

  const bracketLinks = getOutgoingLinks(source);

  for (const { link, title, alias } of bracketLinks) {
    const slug = titleToSlug[title];
    if (!slug) {
      // ? - create a placeholder page for linked, non-existent pages?
      console.warn(`No slug found for ${link}`);
    }
    source = source.replace(
      link,
      slug
        ? `<a href="/notes/${slug}">${alias ?? title}</a>`
        : (alias ?? title),
    );
  }
  return source;
};

/**
 * Searches md[x] text for any double-bracket links and returns
 * the link with brackets, its text, its alias, and an excerpt if it exists.
 * Takes a regex pattern to use to find bracket link matches. Returns
 * a new function that takes the mdx source.
 */
const getBracketLinks =
  (pattern: RegExp) =>
  (source: string): BracketLink[] => {
    const links: BracketLink[] = [];
    const outgoingLinks = [...source.matchAll(pattern)];
    for (const outgoingLink of outgoingLinks) {
      if (!outgoingLink[0]) {
        console.error("A match was not found in the outgoing link result.");
        continue;
      }
      // if we found a match, we should have capturing groups
      // but we have to keep typescript happy and ensure they're defined
      const [excerpt, link, text] = outgoingLink;
      if (!link || !text) {
        continue;
      }
      const [title = "", alias] = text?.split("|");
      links.push({
        link,
        title,
        alias,
        excerpt: cleanupExcerpt({ excerpt, link, title, alias }),
      });
    }
    return links;
  };

// Finds [[Link]] style note links
export const getOutgoingLinks = getBracketLinks(
  /(?:\w+\W+){0,10}(\[\[([^\[\]]+)\]\])(?:\W+\w+\W){0,10}/gi,
);

// Finds ![[Link]] style embed links
export const getEmbedLinks = getBracketLinks(
  /(?:\w+\W+){0,10}(!\[\[([^\[\]]+)\]\])(?:\W+\w+\W){0,10}/gi,
);

export const cleanupExcerpt = ({
  excerpt,
  link,
  title,
  alias,
}: {
  excerpt: string;
  link: string;
  title: string;
  alias?: string;
}): string =>
  excerpt
    .replace(/\n/g, " ")
    .replace(link, alias ?? title)
    .trim();

/**
 * Provides a map of titles and aliases to all backlinks from other files.
 */
export const getBacklinks = async (
  locale: Locale,
): Promise<Record<string, Backlink[]>> => {
  const { titlesWithBacklinks } = dataStore[locale];

  if (titlesWithBacklinks) {
    return titlesWithBacklinks;
  }
  const map: Record<string, Backlink[]> = {};
  const { titleToSlug } = await getTitleAndSlugMaps(locale);

  const notePaths = await getNotePaths();
  for (const articlePath of notePaths) {
    const source = await readFile(articlePath, "utf-8");
    const frontmatter = Frontmatter.parse(matter(source).data);
    const title = frontmatter.title;
    const slug = titleToSlug[title];
    if (!slug) {
      throw new Error(`Slug not found for ${title}!`);
    }
    // this will catch embed links too
    const links = getOutgoingLinks(source);
    for (const { title: reference, excerpt, link } of links) {
      map[reference] = [
        ...(map[reference] ?? []),
        { slug, title, excerpt: excerpt === link ? null : excerpt },
      ];
    }
  }

  dataStore[locale].titlesWithBacklinks = map;
  return dataStore[locale].titlesWithBacklinks;
};

export interface PostListing {
  slug: string;
  frontmatter: Frontmatter;
}

interface Filter {
  topic?: string;
  locale?: Locale;
}

/**
 * Returns an array of all articles sorted by date (most recent first).
 */
export const getArticles = async (filter?: Filter): Promise<PostListing[]> => {
  let posts: PostListing[] = [];
  // Loop through all articles and extract slug and frontmatter
  const notePaths = await getNotePaths();
  for (const articlePath of notePaths) {
    const source = await readFile(articlePath, "utf-8");
    const frontmatter = matter(source).data;
    const parsedFrontmatter = Frontmatter.parse(frontmatter);
    if (filter?.topic && !parsedFrontmatter.tags?.includes(filter.topic)) {
      continue;
    }
    if (filter?.locale && parsedFrontmatter.language !== filter.locale) {
      continue;
    }
    posts.push({
      frontmatter: parsedFrontmatter,
      slug: getSlugFromFilepath(articlePath),
    });
  }

  // sort posts by written at date, recent to old
  posts = posts.toSorted(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime(),
  );

  return posts;
};

// Returns `updated` if defined, otherwise returns the initial publish date
export const getLastUpdatedDateFromSlug = async (
  locale: Locale,
  slug: string,
): Promise<Date | undefined> => {
  const slugToPathMap = await getSlugToPathMap(locale);
  const path = slugToPathMap[slug];
  if (!path) {
    return;
  }

  const source = readFileSync(path, "utf-8");
  const { date, updated } = Frontmatter.parse(matter(source).data);
  const lastUpdated = updated || date;
  return lastUpdated;
};
