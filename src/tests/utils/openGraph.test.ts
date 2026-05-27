import { createTaglineFromTags, generateSocialImage } from "@utils/openGraph";
import { describe, expect, it } from "vitest";

const baseConfig = {
	cloudName: "drn1fmjus",
	titleColor: "",
	taglineColor: "",
};

describe("openGraph", () => {
	describe("generateSocialImage", () => {
		it("uses defaults with only title + imagePublicID", () => {
			const url = generateSocialImage({
				...baseConfig,
				title: "Hello",
				imagePublicID: "my-image",
			});
			expect(url).toContain("https://res.cloudinary.com/drn1fmjus");
			expect(url).toContain("w_1280,h_669");
			expect(url).toContain("l_text:arial_64:Hello");
			expect(url).not.toContain("l_text:arial_48");
			expect(url.endsWith("/laborforzion/my-image")).toBe(true);
		});

		it("includes both title and tagline overlays when tagline provided", () => {
			const url = generateSocialImage({
				...baseConfig,
				title: "Hello",
				tagline: "World",
				imagePublicID: "my-image",
			});
			expect(url).toContain("l_text:arial_64:Hello");
			expect(url).toContain("l_text:arial_48:World");
			const titleIdx = url.indexOf("l_text:arial_64:Hello");
			const taglineIdx = url.indexOf("l_text:arial_48:World");
			expect(titleIdx).toBeLessThan(taglineIdx);
			expect(url.slice(titleIdx, taglineIdx)).toContain("/");
		});

		it("titleColor/taglineColor override textColor", () => {
			const url = generateSocialImage({
				...baseConfig,
				title: "T",
				tagline: "Tag",
				imagePublicID: "img",
				textColor: "111111",
				titleColor: "ff0000",
				taglineColor: "00ff00",
			});
			expect(url).toContain("co_rgb:ff0000");
			expect(url).toContain("co_rgb:00ff00");
			expect(url).not.toContain("co_rgb:111111");
		});

		it("falls back to textLeftOffset when title/tagline left offsets are null", () => {
			const url = generateSocialImage({
				...baseConfig,
				title: "T",
				tagline: "Tag",
				imagePublicID: "img",
				textLeftOffset: 321,
				titleLeftOffset: null,
				taglineLeftOffset: null,
			});
			const xMatches = url.match(/x_\d+/g) ?? [];
			expect(xMatches).toContain("x_321");
			expect(xMatches.filter((s) => s === "x_321")).toHaveLength(2);
		});

		it("includes version segment when provided, excludes when null", () => {
			const withVersion = generateSocialImage({
				...baseConfig,
				title: "T",
				imagePublicID: "img",
				version: "v1234",
			});
			expect(withVersion).toContain("/v1234/laborforzion/img");

			const withoutVersion = generateSocialImage({
				...baseConfig,
				title: "T",
				imagePublicID: "img",
				version: null,
			});
			expect(withoutVersion).not.toContain("v1234");
			expect(withoutVersion).toMatch(/[^/]+\/laborforzion\/img$/);
		});

		it("double-encodes commas and slashes in title via cleanText", () => {
			const url = generateSocialImage({
				...baseConfig,
				title: "Faith, Hope & Charity / Love",
				imagePublicID: "img",
			});
			expect(url).toContain("%252C");
			expect(url).toContain("%252F");
			expect(url).not.toMatch(/%2C(?!5)/);
			expect(url).not.toMatch(/%2F(?!5)/);
		});
	});

	describe("createTaglineFromTags", () => {
		it("should convert an array of tags into hashtags", () => {
			const tags = ["Sacrament", "Old Testament", "Miracles"];
			const result = createTaglineFromTags(tags);
			expect(result).toBe("#sacrament #old-testament #miracles");
		});

		it("should handle tags with special characters and spaces", () => {
			const tags = ["Law of Moses", "Book of Mormon", "Come Follow Me"];
			const result = createTaglineFromTags(tags);
			expect(result).toBe("#law-of-moses #book-of-mormon #come-follow-me");
		});

		it("should handle empty array", () => {
			const tags: string[] = [];
			const result = createTaglineFromTags(tags);
			expect(result).toBe("");
		});

		it("should handle undefined input", () => {
			const result = createTaglineFromTags(undefined);
			expect(result).toBe("");
		});

		it("should properly slugify international language tags", () => {
			const tags = ["Humildad", "Oración", "Espíritu Santo"];
			const result = createTaglineFromTags(tags);
			expect(result).toBe("#humildad #oracion #espiritu-santo");
		});
	});
});
