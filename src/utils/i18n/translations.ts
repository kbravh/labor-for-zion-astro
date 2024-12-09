import type { Locale } from "@validation/i18n";
import { routeMap } from "./routes";
import { uiMap } from "./ui";
import { metaMap } from "./meta";
import { projectMap } from "./projects";
import { localeMap } from "./locales";
import { localizationMap } from "./localization";

type Translations = {
  [k in Locale]: {
    locale: (typeof localeMap)[Locale];
    localization: (typeof localizationMap)[Locale];
    meta: (typeof metaMap)[Locale];
    project: (typeof projectMap)[Locale];
    route: (typeof routeMap)[Locale];
    ui: (typeof uiMap)[Locale];
  };
};

export const translations: Translations = {
  en: {
    locale: localeMap.en,
    localization: localizationMap.en,
    meta: metaMap.en,
    ui: uiMap.en,
    route: routeMap.en,
    project: projectMap.en,
  },
  es: {
    locale: localeMap.es,
    localization: localizationMap.es,
    meta: metaMap.es,
    ui: uiMap.es,
    route: routeMap.es,
    project: projectMap.es,
  },
};
