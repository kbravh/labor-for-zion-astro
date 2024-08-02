import { Locale } from "@validation/i18n";

/**
 * Takes Astro.currentLocale and provides the actual locale.
 * @param locale - Call this with Astro.currentLocale
 * @returns Locale
 */
export const getLocale = (locale: string | undefined): Locale => {
  if (!locale) {
    throw new Error('No locale found');
  }
  const parsed = Locale.safeParse(locale);
  if (!parsed.success) {
    throw new Error(`Locale ${locale} not supported`);
  }
  return parsed.data;
};
