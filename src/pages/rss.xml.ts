import rss from '@astrojs/rss';
import MarkdownIt from 'markdown-it';
import MarkdownItAnchor from 'markdown-it-anchor';
import MarkdownItFootnote from 'markdown-it-footnote';
import sanitizeHtml from 'sanitize-html';

import {
  addLinks,
  getSlugFromFilepath,
  getTitleAndSlugMaps,
  notePaths,
} from '../utils/mdUtils';
import {readFileSync} from 'fs';
import matter from 'gray-matter';
import {Frontmatter} from '../validation/md';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})
  .use(MarkdownItAnchor)
  .use(MarkdownItFootnote);

export function get(context: any) {
  const {titleToSlug} = getTitleAndSlugMaps();
  return rss({
    title: 'Labor for Zion',
    description: 'A collection of notes and talks centered around gospel topics.',
    site: context.site,
    items: notePaths.map(notePath => {
      const source = readFileSync(notePath, 'utf-8');
      const document = matter(source);
      const text = addLinks(titleToSlug, document.content);
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
    customData: `<language>en-US</language>`,
    stylesheet: '/pretty-feed-v3.xsl',
  });
}
