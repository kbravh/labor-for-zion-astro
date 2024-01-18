import {readdirSync, readFileSync, statSync} from 'fs';
import path, {basename} from 'path';
import {BracketLink, Frontmatter} from '../validation/md';
import matter from 'gray-matter';
import slugify from 'slugify';

export const NOTES_PATH = path.join(process.cwd(), 'notes');

export const removeMdxExtension = (path: string) => path.replace(/\.mdx?$/, '');

const walkPath = (dir: string): string[] => {
  const files = readdirSync(dir);
  return files.flatMap(file => {
    const filepath = path.join(dir, file);
    const stats = statSync(filepath);
    if (stats.isDirectory()) {
      return walkPath(filepath);
    } else {
      return [filepath];
    }
  });
};

export const getSlugFromFilepath = (path: string): string =>
  removeMdxExtension(basename(path));

export const getSlugFromTitle = (title: string): string =>
  slugify(title, {lower: true});
export const notePaths = walkPath(NOTES_PATH);

let slugToTopic: Record<string, string> | undefined;
let articleTopics: Set<string> | undefined;

/**
 * Finds all tags that are included in the frontmatter of the articles.
 * Returns a map of tag slugs to tag names, and a set of unique tags.
 */
export const getNoteTopics = async (): Promise<{
  slugToTopic: Record<string, string>;
  articleTopics: Set<string>;
}> => {
  if (slugToTopic && articleTopics) {
    return {
      slugToTopic,
      articleTopics,
    };
  }
  const newSlugToTopic: Record<string, string> = {};
  const newArticleTopics = new Set<string>();
  // Loop through all articles and extract topic and frontmatter
  for (const notePath of notePaths) {
    const source = readFileSync(notePath, 'utf-8');
    const frontmatter = Frontmatter.parse(matter(source).data);
    for (const tag of frontmatter.tags ?? []) {
      newArticleTopics.add(tag);
      newSlugToTopic[slugify(tag, {lower: true})] = tag;
    }
  }
  slugToTopic = newSlugToTopic;
  articleTopics = newArticleTopics;
  return {
    slugToTopic,
    articleTopics,
  };
};

//TODO - experiment with replacing these with Maps
let titleToSlug: Record<string, string>;
let slugToTitle: Record<string, string>;
/**
 * Creates a map of article titles to their corresonding slugs.
 * Also includes frontmatter aliases for lookup. For example,
 * if the page "Interactive Teaching" has an alias of
 * "Interactive Teaching MOC", the slug can be found through either.
 * Includes links that are mentioned but don't exist yet.
 */
export const getTitleAndSlugMaps = (): {
  titleToSlug: Record<string, string>;
  slugToTitle: Record<string, string>;
} => {
  if (titleToSlug && slugToTitle) {
    return {titleToSlug, slugToTitle};
  }
  const titleMap: Record<string, string> = {};
  const slugMap: Record<string, string> = {};
  // this creates a map of all titles and aliases to their corresponding slug
  for (const article of notePaths) {
    const source = readFileSync(article, 'utf-8');
    const frontmatter = Frontmatter.parse(matter(source).data);
    titleMap[frontmatter.title] = getSlugFromFilepath(article);
    slugMap[getSlugFromFilepath(article)] = frontmatter.title;
    frontmatter.aliases?.forEach(alias => {
      titleMap[alias] = getSlugFromFilepath(article);
    });
    // check all backlinks to create slugs for pages that don't exist yet
    const bracketLinks = getOutgoingLinks(source);
    for (const {title} of bracketLinks) {
      if (!titleMap[title]) {
        titleMap[title] = getSlugFromTitle(title);
        slugMap[getSlugFromTitle(title)] = title;
      }
    }
  }

  titleToSlug = titleMap;
  slugToTitle = slugMap;
  return {titleToSlug, slugToTitle};
};

let slugToPath: Record<string, string>;
/**
 * Creates a map of slugs to their respective filepaths. This is necessary to
 * support nested filepaths.
 */
export const getSlugToPathMap = (): Record<string, string> => {
  if (slugToPath) {
    return slugToPath;
  }

  let map: Record<string, string> = {};

  map = notePaths.reduce((accumulator, path) => {
    const slug = getSlugFromFilepath(path);
    accumulator[slug] = path;
    return accumulator;
  }, map);

  slugToPath = map;
  return slugToPath;
};

/**
 * Takes a fresh Md[x] file, checks for double-bracket links, and
 * converts them to regular website links. If a double-bracket link
 * has an alias (e.g. [[Teaching|teaching]]), it will respect the alias.
 * @param titleToSlug - the map created by @getTitleAndSlugMaps
 * @param source - the fresh, raw text of the mdx file
 * @returns the mdx file with Link components added in
 */
export const addLinks = (
  titleToSlug: Record<string, string>,
  source: string
): string => {
  // Replace embed links with content first
  let embedLinks = getEmbedLinks(source);
  let firstEmbed = true;
  const slugToPathMap = getSlugToPathMap();
  do {
    for (const {link, title} of embedLinks) {
      const slug = titleToSlug[title];
      if (!slug) {
        throw new Error(`Slug not found for embed of ${title}!`);
      }
      // fetch markdown file content
      const filePath = slugToPathMap[slug];
      if (!filePath) {
        throw new Error(`File path not found for the slug ${slug}`);
      }
      let rawEmbed = readFileSync(filePath, 'utf-8');
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

  for (const {link, title, alias} of bracketLinks) {
    const slug = titleToSlug[title];
    if (!slug) {
      // ? - create a placeholder page for linked, non-existent pages?
      console.warn(`No slug found for ${link}`);
    }
    source = source.replace(
      link,
      slug ? `<a href="/notes/${slug}">${alias ?? title}</a>` : alias ?? title
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
        console.error('A match was not found in the outgoing link result.');
        continue;
      }
      // if we found a match, we should have capturing groups
      // but we have to keep typescript happy and ensure they're defined
      const [excerpt, link, text] = outgoingLink;
      if (!link || !text) {
        continue;
      }
      const [title = '', alias] = text?.split('|');
      links.push({
        link,
        title,
        alias,
        excerpt: cleanupExcerpt({excerpt, link, title, alias}),
      });
    }
    return links;
  };

export const getOutgoingLinks = getBracketLinks(
  /(?:\w+\W){0,10}(\[\[([^\[\]]+)\]\])(?:\W?\w+\W){0,10}/g
);
export const getEmbedLinks = getBracketLinks(
  /(?:\w+\W){0,10}(!\[\[([^\[\]]+)\]\])(?:\W?\w+\W){0,10}/g
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
    .replace(/\n/g, ' ')
    .replace(link, alias ?? title)
    .trim();

export type Backlink = {title: string; slug: string; excerpt: string | null};

let titlesWithBacklinks: Record<string, Backlink[]>;
/**
 * Provides a map of titles and aliases to all backlinks from other files.
 */
export const getBacklinks = (): Record<string, Backlink[]> => {
  if (titlesWithBacklinks) {
    return titlesWithBacklinks;
  }
  const map: Record<string, Backlink[]> = {};
  const {titleToSlug} = getTitleAndSlugMaps();

  for (const articlePath of notePaths) {
    const source = readFileSync(articlePath, 'utf-8');
    const frontmatter = Frontmatter.parse(matter(source).data);
    const title = frontmatter.title;
    const slug = titleToSlug[title];
    if (!slug) {
      throw new Error(`Slug not found for ${title}!`);
    }
    // this will catch embed links too
    const links = getOutgoingLinks(source);
    for (const {title: reference, excerpt, link} of links) {
      map[reference] = [
        ...(map[reference] ?? []),
        {slug, title, excerpt: excerpt === link ? null : excerpt},
      ];
    }
  }

  titlesWithBacklinks = map;
  return titlesWithBacklinks;
};
