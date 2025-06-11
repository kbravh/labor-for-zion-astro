import { LOCALES, Locale } from "@validation/i18n";

/**
 * Takes Astro.currentLocale and provides the actual locale.
 * @param locale - Call this with Astro.currentLocale
 * @returns Locale
 */
export const getLocale = (locale: string | undefined): Locale => {
	if (!locale) {
		throw new Error("No locale found");
	}
	const parsed = Locale.safeParse(locale);
	if (!parsed.success) {
		throw new Error(`Locale ${locale} not supported`);
	}
	return parsed.data;
};

/**
 * Returns available translations for a path in all locales except the current one
 * @param currentLocale - The current locale
 * @param path - The path to generate translations for
 * @returns Array of [locale, path] tuples for available translations
 */
export const getavailableLocalizations = (
	currentLocale: Locale,
	path: string,
): [Locale, string][] => {
	if (!currentLocale) {
		return [];
	}

	return LOCALES.filter((locale) => locale !== currentLocale).map(
		(locale) => [locale, path] as [Locale, string],
	);
};

export const getLocaleUrl = async (
	locale: Locale,
	path: string,
): Promise<string> => {
	if (!path.includes("notes")) {
		return path;
	}
};
