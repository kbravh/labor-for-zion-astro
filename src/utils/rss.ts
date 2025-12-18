import rss, { type RSSFeedItem } from "@astrojs/rss";
import MarkdownIt from "markdown-it";
import MarkdownItAnchor from "markdown-it-anchor";
import MarkdownItFootnote from "markdown-it-footnote";
import sanitizeHtml from "sanitize-html";

import { readFileSync } from "node:fs";
import {
	addLinks,
	getNotePaths,
	getSlugFromFilepath,
	getTitleAndSlugMaps,
} from "@utils/md/readAndParse";
import type { Locale } from "@validation/i18n";
import { Frontmatter } from "@validation/md";
import matter from "gray-matter";
import { translations } from "./i18n/translations";

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

const isPostFeedItem = (post: unknown): post is RSSFeedItem => {
	return !!post;
};

export const generateRssFeed = async ({
	locale,
	site,
}: GenerateRSSFeedArgs) => {
	const { titleToSlug } = await getTitleAndSlugMaps(locale);
	const notePaths = await getNotePaths(locale);
	const posts = await Promise.all(
		notePaths
			.toReversed()
			.map(async (notePath): Promise<RSSFeedItem | undefined> => {
				const source = readFileSync(notePath, "utf-8");
				const document = matter(source);
				const frontmatter = document.data;
				const parsedFrontmatter = Frontmatter.parse(frontmatter);
				const text = await addLinks(locale, titleToSlug, document.content);
				const content = md.render(text);
				return {
					content: sanitizeHtml(content),
					link: `/${locale}/notes/${getSlugFromFilepath(notePath)}`,
					title: parsedFrontmatter.title,
					pubDate: parsedFrontmatter.date,
					description: parsedFrontmatter.description,
				};
			}),
	);
	return rss({
		title: translations[locale].meta.site,
		description: translations[locale].meta.description,
		site: site ?? "https://laborforzion.com",
		items: posts.filter(isPostFeedItem),
		customData: `<language>${locale}</language>`,
		stylesheet: locale === "es" ? "/rss-feed-es.xsl" : "/rss-feed.xsl",
	});
};
