import type {Locale} from '@validation/i18n';
import {routeMap, type Route} from './routes';

type Translations = {
  [k in Locale]: {
    navigation: {
      [k in Route]: string;
    };
  };
};

export const translations: Translations = {
  en: {
    navigation: routeMap.en,
  },
  es: {
    navigation: routeMap.es,
  }
};
