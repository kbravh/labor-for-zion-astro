import type { Locale } from "@validation/i18n";

export type UI = "menu" | "backlinks" | "page" | "next" | "previous" | "toc";

export type UIMap = {
  [k in Locale]: {
    [k in UI]: string;
  };
};

export const uiMap: UIMap = {
  en: {
    menu: "Menu",
    backlinks: "Pages that reference this note:",
    next: "Next page",
    page: "Page",
    previous: "Previous page",
    toc: "Table of Contents",
  },
  es: {
    menu: "Menú",
    backlinks: "Páginas que mencionan esta nota:",
    next: "Siguiente",
    page: "Página",
    previous: "Anterior",
    toc: "Índice",
  },
} as const;
