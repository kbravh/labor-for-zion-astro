import { getRelativeLocaleUrl } from "astro:i18n";
import type { Locale } from "@validation/i18n";

export const generateHreflangTags = (translations: [Locale, string][]) =>
	translations.map(
		([lang, slug]) =>
			`<link rel="alternate" href="${getRelativeLocaleUrl(lang, slug)}" hreflang="${lang}" />`,
	);
