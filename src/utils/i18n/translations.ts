import type {Locale} from '@validation/i18n';
import {routeMap, type Route} from './routes';
import {navigationStrings, type Navigation} from './navigation';

type Translations = {
  [k in Locale]: {
    route: {
      [k in Route]: string;
    };
    navigation: {
      [k in Navigation]: string;
    };
  };
};

export const translations: Translations = {
  en: {
    route: routeMap.en,
    navigation: navigationStrings.en,
  },
  es: {
    route: routeMap.es,
    navigation: navigationStrings.es,
  },
};
