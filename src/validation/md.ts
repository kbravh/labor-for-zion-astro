import { z } from "zod";

export const Frontmatter = z.object({
	title: z.string(),
	description: z.string(),
	date: z.coerce.date(),
	// A coerced undefined will be set to the epoch.
	updated: z.coerce
		.date()
		// so if we get the epoch, we'll replace it  with undefined
		.transform((date) => (date.getTime() ? date : undefined))
		.optional(),
	language: z.enum(["en", "es"]),
	aliases: z.string().array().optional(),
	tags: z.string().array().optional(),
	translations: z
		.object({
			en: z.string().optional(),
			es: z.string().optional(),
		})
		.optional(),
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

export const Heading = z.object({
	// the slugified id
	id: z.string(),
	// the text of the heading
	text: z.string(),
	// the level of the heading
	level: z.number().positive().max(6),
});

export type Heading = z.infer<typeof Heading>;
