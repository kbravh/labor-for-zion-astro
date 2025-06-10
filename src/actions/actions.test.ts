import { ActionError } from "astro:actions";
import { Analytics, and, count, db, eq } from "astro:db";
import { getTitleAndSlugMaps } from "@utils/md/readAndParse";
import { describe, expect, it } from "vitest";
import { getPageViewsActor, logPageViewActor } from "./actors";

describe("actions", () => {
	describe("logPageViewActor", () => {
		it("throws an ActionError if the slug is not valid", async () => {
			await expect(async () =>
				logPageViewActor({
					slug: "test",
					locale: "en",
				}),
			).rejects.toThrowError(ActionError);
		});
		it("throws an ActionError if the locale is not valid", async () => {
			const { slugToTitle } = await getTitleAndSlugMaps("en");
			await expect(async () =>
				logPageViewActor({
					slug: Object.keys(slugToTitle)[0],
					locale: "invalid",
				}),
			).rejects.toThrowError(ActionError);
		});
		it("returns the page view count", async () => {
			const { slugToTitle } = await getTitleAndSlugMaps("en");
			const slug = Object.keys(slugToTitle)[0];
			const result = await logPageViewActor({
				slug,
				locale: "en",
			});
			const dbCount = await db
				.select({ count: count() })
				.from(Analytics)
				.where(and(eq(Analytics.slug, slug), eq(Analytics.locale, "en")));
			expect(result.count).toBe(dbCount[0].count);
		});
	});
	describe("getPageViewsActor", () => {
		it("returns the page view count", async () => {
			const { slugToTitle } = await getTitleAndSlugMaps("en");
			const slug = Object.keys(slugToTitle)[0];
			const result = await getPageViewsActor({
				slug,
				locale: "en",
			});
			const dbCount = await db
				.select({ count: count() })
				.from(Analytics)
				.where(and(eq(Analytics.slug, slug), eq(Analytics.locale, "en")));
			expect(result).toBe(dbCount[0].count);
		});
	});
});
