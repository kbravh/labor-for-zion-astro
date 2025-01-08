import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { PrismaClient } from "@prisma/client";

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
    }),
    handler: async (data) => prisma.analytics.create({ data }),
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
