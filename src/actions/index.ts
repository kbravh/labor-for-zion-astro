import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getPageViewsActor, logPageViewActor } from "./actors";

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
			screen_resolution: z.string().optional(),
		}),
		handler: async (data) => logPageViewActor(data),
	}),
	getPageViews: defineAction({
		input: z.object({
			slug: z.string(),
			locale: z.string(),
		}),
		handler: async ({ slug, locale }) => getPageViewsActor({ slug, locale }),
	}),
};
