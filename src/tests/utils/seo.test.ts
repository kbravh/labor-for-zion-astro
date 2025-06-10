import { generateHreflangTags } from "@utils/seo";
import { LOCALES, type Locale } from "@validation/i18n";
import { describe, expect, it, vi } from "vitest";

// Mock the getRelativeLocaleUrl function from astro:i18n
vi.mock("astro:i18n", () => ({
	getRelativeLocaleUrl: vi.fn((locale, path) => `/${locale}/${path}`),
}));

describe("SEO", () => {
	describe("generateHreflangTags", () => {
		it("should generate correct hreflang tags for a set of translations", () => {
			const translations: [Locale, string][] = [
				["en", "be-humble-as-christ-was"],
				["es", "ser-humilde-como-cristo-lo-fue"],
			];

			const tags = generateHreflangTags(translations);

			expect(tags).toHaveLength(2);
			expect(tags[0]).toBe(
				'<link rel="alternate" href="/en/be-humble-as-christ-was" hreflang="en" />',
			);
			expect(tags[1]).toBe(
				'<link rel="alternate" href="/es/ser-humilde-como-cristo-lo-fue" hreflang="es" />',
			);
		});

		it("should handle empty translations array", () => {
			const tags = generateHreflangTags([]);

			expect(tags).toHaveLength(0);
			expect(tags).toEqual([]);
		});

		it("should work with the available locales", () => {
			// Only use the locales defined in the Locale type
			const translations: [Locale, string][] = LOCALES.map((locale, index) => {
				return [locale, `page-${index}`];
			});

			const tags = generateHreflangTags(translations);

			expect(tags).toHaveLength(LOCALES.length);
			LOCALES.forEach((locale, index) => {
				expect(tags[index]).toBe(
					`<link rel="alternate" href="/${locale}/page-${index}" hreflang="${locale}" />`,
				);
			});
		});
	});
});
