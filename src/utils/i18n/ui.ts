import type {Locale} from '@validation/i18n';

export type UI = 'menu' | 'backlinks';

export type UIStrings = {
  [k in Locale]: {
    [k in UI]: string;
  };
};

export const uiStrings: UIStrings = {
  en: {
    menu: 'Menu',
    backlinks: 'Pages that reference this note:'
  },
  es: {
    menu: 'Menú',
    backlinks: 'Páginas que mencionan esta nota:'
  },
} as const;
