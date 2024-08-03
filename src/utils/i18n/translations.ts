import type { Locale } from "@validation/i18n";
import { routeMap, type Route } from "./routes";
import { uiMap, type UI } from "./ui";
import { metaMap, type Meta } from "./meta";
import { projectMap, type Project } from "./projects";

type Translations = {
  [k in Locale]: {
    meta: {
      [k in Meta]: string;
    };
    project: {
      [k in Project]: {
        title: string;
        description: string;
      };
    };
    route: {
      [k in Route]: string;
    };
    ui: {
      [k in UI]: string;
    };
  };
};

export const translations: Translations = {
  en: {
    meta: metaMap.en,
    ui: uiMap.en,
    route: routeMap.en,
    project: projectMap.en,
  },
  es: {
    meta: metaMap.es,
    ui: uiMap.es,
    route: routeMap.es,
    project: projectMap.es,
  },
};
