import type { Locale } from "@validation/i18n";

export type UI = "menu" | "backlinks" | "page" | "next" | "previous";

export type UIStrings = {
  [k in Locale]: {
    [k in UI]: string;
  };
};

export const uiStrings: UIStrings = {
  en: {
    menu: "Menu",
    backlinks: "Pages that reference this note:",
    next: 'Next page',
    page: 'Page',
    previous: 'Previous page'
  },
  es: {
    menu: "Menú",
    backlinks: "Páginas que mencionan esta nota:",
    next: 'Siguiente',
    page: 'Página',
    previous: 'Anterior'
  },
} as const;
