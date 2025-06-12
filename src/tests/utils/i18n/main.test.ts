import { getLocale, getAvailableLocalizations } from "@utils/i18n/main";
import type { Locale } from "@validation/i18n";
import { describe, expect, expectTypeOf, it } from "vitest";

describe("i18n utilities", () => {
	describe("getLocale", () => {
		// Runtime tests
		it("returns the locale when it's valid", () => {
			expect(getLocale("en")).toBe("en");
			expect(getLocale("es")).toBe("es");
		});

		it("throws an error when locale is undefined", () => {
			expect(() => getLocale(undefined)).toThrowError("No locale found");
		});

		it("throws an error when locale is not supported", () => {
			expect(() => getLocale("fr")).toThrowError("Locale fr not supported");
			expect(() => getLocale("de")).toThrowError("Locale de not supported");
		});

		// Type tests
		it("properly converts the type", () => {
			// Verify type transformations - these lines don't execute but are type-checked
			type AstroCurrentLocale = string | undefined;
			const astroLocale: AstroCurrentLocale = "en";
			const locale = getLocale(astroLocale);

			// This should compile - locale is now of type Locale
			expectTypeOf(locale).toEqualTypeOf<Locale>();
		});
	});

	describe("getavailableLocalizations", () => {
		// Runtime tests
		it("returns translations for all other locales", () => {
			// When current locale is English, should return Spanish
			const enResult = getAvailableLocalizations("en", "/test-path");
			expect(enResult).toEqual([["es", "/test-path"]]);

			// When current locale is Spanish, should return English
			const esResult = getAvailableLocalizations("es", "/test-path");
			expect(esResult).toEqual([["en", "/test-path"]]);
		});

		it("returns empty array if the current locale is invalid", () => {
			// @ts-expect-error Testing with invalid locale
			expect(getAvailableLocalizations(undefined, "/test-path")).toEqual([]);
		});

		it("uses the provided path for each locale", () => {
			const result = getAvailableLocalizations("en", "/custom-path");
			expect(result).toEqual([["es", "/custom-path"]]);
		});

		it("can handle root path", () => {
			const result = getAvailableLocalizations("en", "/");
			expect(result).toEqual([["es", "/"]]);
		});
	});
});
