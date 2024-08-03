import type {Locale} from '@validation/i18n';
import {routeMap, type Route} from './routes';
import {uiStrings, type UI} from './ui';
import { metaMap, type Meta } from './meta';

type Translations = {
  [k in Locale]: {
    meta: {
      [k in Meta]: string;
    }
    ui: {
      [k in UI]: string;
    };
    route: {
      [k in Route]: string;
    };
  };
};

export const translations: Translations = {
  en: {
    meta: metaMap.en,
    ui: uiStrings.en,
    route: routeMap.en,
  },
  es: {
    meta: metaMap.es,
    ui: uiStrings.es,
    route: routeMap.es,
  },
};
