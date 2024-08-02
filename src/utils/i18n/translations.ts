import type {Locale} from '@validation/i18n';
import {routeMap, type Route} from './routes';
import {navigationStrings, type Navigation} from './navigation';
import { metaMap, type Meta } from './meta';

type Translations = {
  [k in Locale]: {
    meta: {
      [k in Meta]: string;
    }
    navigation: {
      [k in Navigation]: string;
    };
    route: {
      [k in Route]: string;
    };
  };
};

export const translations: Translations = {
  en: {
    meta: metaMap.en,
    navigation: navigationStrings.en,
    route: routeMap.en,
  },
  es: {
    meta: metaMap.es,
    navigation: navigationStrings.es,
    route: routeMap.es,
  },
};
