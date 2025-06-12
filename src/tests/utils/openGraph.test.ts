import { createTaglineFromTags } from "@utils/openGraph";
import { describe, expect, it } from "vitest";

describe("openGraph", () => {
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
