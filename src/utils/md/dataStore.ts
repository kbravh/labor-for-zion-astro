import { Locale, LOCALES } from "@validation/i18n";
import type { Backlink } from "./readAndParse";
import { writeFile } from "@utils/file";

type LocalizedData = {
  slugToTopic: Record<string, string> | undefined;
  articleTopics: Set<string> | undefined;
  titleToSlug: Record<string, string> | undefined;
  slugToTitle: Record<string, string> | undefined;
  slugToPath: Record<string, string> | undefined;
  titlesWithBacklinks: Record<string, Backlink[]> | undefined;
};

type RawData = Record<Locale, LocalizedData>;

const rawData: RawData = LOCALES.reduce((acc, locale) => {
  acc[locale] = {
    slugToTopic: undefined,
    articleTopics: undefined,
    titleToSlug: undefined,
    slugToTitle: undefined,
    slugToPath: undefined,
    titlesWithBacklinks: undefined,
  };
  return acc;
}, {} as RawData);

const proxyCache: Partial<Record<Locale, LocalizedData>> = {};

const createLocaleProxy = (locale: Locale, data: LocalizedData) => {
  return new Proxy(data, {
    set: (target, key, value) => {
      if (key in target) {
        target[key as keyof LocalizedData] = value;
        writeFile(`${locale}_${key.toString()}`, value);
        return true;
      } else {
        throw new Error(`Invalid data key: ${key.toString()}`);
      }
    },
    get: (target, key) => {
      if (key in target) {
        return target[key as keyof LocalizedData];
      } else {
        throw new Error(`Invalid data key: ${key.toString()}`);
      }
    }
  });
};

export const dataStore = new Proxy(rawData, {
  get: (target, locale) => {
    if (Locale.safeParse(locale).success) {
      if (!proxyCache[locale as Locale]) {
        proxyCache[locale as Locale] = createLocaleProxy(locale as Locale, target[locale as Locale]);
      }
      return proxyCache[locale as Locale];
    } else {
      throw new Error(`Invalid locale: ${locale.toString()}`);
    }
  }
});
