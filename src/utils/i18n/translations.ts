import type { Locale } from "@validation/i18n";
import { routeMap, type Route } from "./routes";
import { uiMap, type UI } from "./ui";
import { metaMap, type Meta } from "./meta";
import { projectMap, type Project } from "./projects";
import { localizationMap, type Localization } from "./localization";

type Translations = {
  [k in Locale]: {
    localization: (typeof localizationMap)[Locale];
    meta: (typeof metaMap)[Locale];
    project: (typeof projectMap)[Locale];
    route: (typeof routeMap)[Locale];
    ui: (typeof uiMap)[Locale];
  };
};

export const translations: Translations = {
  en: {
    localization: localizationMap.en,
    meta: metaMap.en,
    ui: uiMap.en,
    route: routeMap.en,
    project: projectMap.en,
  },
  es: {
    localization: localizationMap.es,
    meta: metaMap.es,
    ui: uiMap.es,
    route: routeMap.es,
    project: projectMap.es,
  },
};
