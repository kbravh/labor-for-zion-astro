import type { Locale } from "@validation/i18n";

export type Meta =
  | "site"
  | "description"
  | "themeReference"
  | "theme1"
  | "theme2";

export type MetaMap = {
  [k in Locale]: {
    [k in Meta]: string;
  };
};

export const metaMap: MetaMap = {
  en: {
    site: "Labor For Zion",
    description:
      "A collection of notes, talks, and tools centered around gospel topics, focused on the doctrine of the Church of Jesus Christ of Latter-Day Saints.",
    theme1: `"But the laborer in Zion shall labor for Zion;`,
    theme2: `for if they labor for money they shall perish."`,
    themeReference: "2 Nephi 26:31",
  },
  es: {
    site: "Obrero en Sión",
    description:
      "Una colección de notas, discursos, y herramientas centrados en el evangelio, con un enfoque en la doctrina de la Iglesia de Jesucristo de los Santos de los Últimos Días.",
    theme1: `"Mas el obrero en Sion trabajará para Sion;`,
    theme2: `porque si trabaja por dinero, perecerá."`,
    themeReference: "2 Nefi 26:31",
  },
};
