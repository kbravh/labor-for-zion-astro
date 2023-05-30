import {z} from 'zod';

export const Frontmatter = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  language: z.enum(['en_US']),
  aliases: z.string().array().optional(),
  tags: z.string().array().optional(),
});

export type Frontmatter = z.infer<typeof Frontmatter>;

export const BracketLink = z.object({
  // the raw text, including double brackets
  link: z.string(),
  // the title without brackets, not including alias
  title: z.string(),
  // just the alias, if present
  alias: z.string().optional(),
  // an excerpt of text surrounding the link
  excerpt: z.string(),
});

export type BracketLink = z.infer<typeof BracketLink>;
