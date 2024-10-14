import type { Locale } from "@validation/i18n";

export type localeMap = {
  [k in Locale]: {
    [k in Locale]: string;
  }
}

export const localeMap: localeMap = {
  en: {
    en: "English",
    es: "Spanish",
  },
  es: {
    en: "Inglés",
    es: "Español",
  },
} as const;
