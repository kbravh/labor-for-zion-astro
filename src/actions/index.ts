import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { PrismaClient } from "@prisma/client";
import { getTitleAndSlugMaps } from "@utils/md/readAndParse";
import { isValidLocale } from "@validation/i18n";

const prisma = new PrismaClient();

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

			return prisma.analytics.create({ data });
		},
	}),
	getPageViews: defineAction({
		input: z.object({
			slug: z.string(),
			locale: z.string(),
		}),
		handler: async ({ slug, locale }) =>
			prisma.analytics.count({
				where: {
					slug,
					locale,
				},
			}),
	}),
};
