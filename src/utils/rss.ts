import rss, { type RSSFeedItem } from "@astrojs/rss";
import MarkdownIt from "markdown-it";
import MarkdownItAnchor from "markdown-it-anchor";
import MarkdownItFootnote from "markdown-it-footnote";
import sanitizeHtml from "sanitize-html";

import {
  addLinks,
  getSlugFromFilepath,
  getTitleAndSlugMaps,
  notePaths,
} from "@utils/md/readAndParse";
import { readFileSync } from "fs";
import matter from "gray-matter";
import { Frontmatter } from "@validation/md";
import type { Locale } from "@validation/i18n";

type GenerateRSSFeedArgs = {
  locale: Locale;
  site: URL | undefined;
};

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})
  .use(MarkdownItAnchor)
  .use(MarkdownItFootnote);

export const generateRssFeed = async ({ locale, site }: GenerateRSSFeedArgs) => {
  const { titleToSlug } = await getTitleAndSlugMaps(locale);
  return rss({
    title: "Labor for Zion",
    description:
      "A collection of notes and talks centered around gospel topics.",
    site: site ?? "https://laborforzion.com",
    items: await Promise.all(
      notePaths.toReversed().map(async (notePath): Promise<RSSFeedItem> => {
        const source = readFileSync(notePath, "utf-8");
        const document = matter(source);
        const text = await addLinks(locale, titleToSlug, document.content);
        const content = md.render(text);
        const frontmatter = document.data;
        const parsedFrontmatter = Frontmatter.parse(frontmatter);
        return {
          content: sanitizeHtml(content),
          link: `/notes/${getSlugFromFilepath(notePath)}`,
          title: parsedFrontmatter.title,
          pubDate: parsedFrontmatter.date,
          description: parsedFrontmatter.description,
        };
      }),
    ),
    customData: `<language>en-US</language>`,
    stylesheet: "/pretty-feed-v3.xsl",
  });
};
