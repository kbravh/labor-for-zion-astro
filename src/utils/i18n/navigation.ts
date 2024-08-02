import type {Locale} from '@validation/i18n';

export type Navigation = 'menu';

export type NavigationStrings = {
  [k in Locale]: {
    [k in Navigation]: string;
  };
};

export const navigationStrings: NavigationStrings = {
  en: {
    menu: 'Menu',
  },
  es: {
    menu: 'Menú',
  },
} as const;
