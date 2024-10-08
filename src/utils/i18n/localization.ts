import type { Locale } from "@validation/i18n";

export type Localization =
  | "english"
  | "read_this_in"
  | "spanish"
  | "change_language";

export type LocalizationMap = {
  [k in Locale]: {
    [k in Localization]: string;
  };
};

export const localizationMap: LocalizationMap = {
  en: {
    english: "English",
    spanish: "Spanish",
    read_this_in: "Read this article in",
    change_language: "Change language",
  },
  es: {
    english: "Inglés",
    spanish: "Español",
    read_this_in: "Lee este artículo en",
    change_language: "Cambiar lenguaje",
  },
};
