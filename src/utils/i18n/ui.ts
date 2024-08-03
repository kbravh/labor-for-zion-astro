import type { Locale } from "@validation/i18n";

export type UI =
  | "backlinks"
  | "empty"
  | "menu"
  | "next"
  | "page"
  | "previous"
  | "rss"
  | "toc"
  | "views";

export type UIMap = {
  [k in Locale]: {
    [k in UI]: string;
  };
};

export const uiMap: UIMap = {
  en: {
    backlinks: "Pages that reference this note:",
    empty:
      "This page hasn't been created yet! But if it has been mentioned somewhere else, you can see those references below.",
    menu: "Menu",
    next: "Next page",
    page: "Page",
    previous: "Previous page",
    rss: "Grab the RSS Feed",
    toc: "Table of Contents",
    views: "Page views",
  },
  es: {
    backlinks: "Páginas que mencionan esta nota:",
    empty:
      "Esta página aún no se ha creado! Pero si ha sido mencionado en otro lado, podrás ver esas referencias aquí.",
    menu: "Menú",
    next: "Siguiente",
    page: "Página",
    previous: "Anterior",
    rss: "Fuente RSS",
    toc: "Índice",
    views: "Vistas de página",
  },
} as const;
