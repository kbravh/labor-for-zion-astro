import type { Locale } from "@validation/i18n";

export type UI =
  | "backlinks"
  | "empty"
  | "menu"
  | "next"
  | "notes_about"
  | "page"
  | "previous"
  | "recent"
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
    notes_about: "Notes about: ",
    page: "Page",
    previous: "Previous page",
    recent: "Recent articles",
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
    notes_about: "Notas sobre: ",
    page: "Página",
    previous: "Anterior",
    recent: "Artículos recientes",
    rss: "Fuente RSS",
    toc: "Índice",
    views: "Vistas de página",
  },
} as const;
