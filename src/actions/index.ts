import { ActionError, defineAction } from "astro:actions";
import { Analytics, and, count, db, eq } from "astro:db";
import { z } from "astro:schema";
import { getTitleAndSlugMaps } from "@utils/md/readAndParse";
import { isValidLocale } from "@validation/i18n";

export const server = {
	logPageView: defineAction({
		input: z.object({
			slug: z.string(),
			locale: z.string(),
			utm_source: z.string().optional(),
			utm_medium: z.string().optional(),
			utm_campaign: z.string().optional(),
			utm_content: z.string().optional(),
			utm_term: z.string().optional(),
			referrer: z.string().optional(),
			screenResolution: z.string().optional(),
		}),
		handler: async (data) => {
			if (!isValidLocale(data.locale)) {
				throw new ActionError({
					code: "BAD_REQUEST",
					message: "Not a valid locale",
				});
			}

			const { slugToTitle } = await getTitleAndSlugMaps(data.locale);
			const set = new Set(Object.keys(slugToTitle));

			if (!set.has(data.slug)) {
				throw new ActionError({
					code: "BAD_REQUEST",
					message: "Slug not found",
				});
			}

			return db.insert(Analytics).values(data);
		},
	}),
	getPageViews: defineAction({
		input: z.object({
			slug: z.string(),
			locale: z.string(),
		}),
		handler: async ({ slug, locale }) => {
			const result = await db
				.select({ count: count() })
				.from(Analytics)
				.where(and(eq(Analytics.slug, slug), eq(Analytics.locale, locale)));

			return result[0]?.count ?? 0;
		},
	}),
};
