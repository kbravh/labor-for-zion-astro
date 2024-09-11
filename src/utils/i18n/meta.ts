import type { Locale } from "@validation/i18n";

export type Meta =
  | "site"
  | "description"
  | "themeReference"
  | "theme1"
  | "theme2"
  | "about1"
  | "about2"
  | "contact";

export type MetaMap = {
  [k in Locale]: {
    [k in Meta]: string;
  };
};

export const metaMap: MetaMap = {
  en: {
    about1:
      "This site is maintained by me, Karey Higuera. I'm a software developer based out of Indianapolis, Indiana. I'm a member of the Church of Jesus Christ of Latter-Day Saints.",
    about2:
      "I served a mission for the Church from April 2015 - April 2017 in the Argentina Resistencia mission. I have a wife and young daughter, and I spend most of my time working, reading, gaming, and spending time with my family.",
    contact: "If you'd like to get in touch, feel free to reach out at",
    site: "Labor For Zion",
    description:
      "A collection of notes, talks, and tools centered around gospel topics, focused on the doctrine of the Church of Jesus Christ of Latter-Day Saints.",
    theme1: `"But the laborer in Zion shall labor for Zion;`,
    theme2: `for if they labor for money they shall perish."`,
    themeReference: "2 Nephi 26:31",
  },
  es: {
    about1: "Yo, Karey Higuera, administro este sitio web. Soy programador basado en Indianapolis, Indiana. Soy miembro de la Iglesia de Jesucristo de los Santos de los Últimos Días.",
    about2: "Serví una misión para la iglesia desde Abril 2015 - Abril 2017 in la misión Argentina Resistencia. Tengo una esposa y una hija chiquita, y paso la mayoría de mi tiempo trabajando, leyendo, jugando videojuegos, y pasando tiempo con mi familia.",
    contact: "Si te gustaría comunicarte conmigo, siéntate libre de mandarme un mensaje a",
    site: "Obrero en Sión",
    description:
      "Una colección de notas, discursos, y herramientas centrados en el evangelio, con un enfoque en la doctrina de la Iglesia de Jesucristo de los Santos de los Últimos Días.",
    theme1: `"Mas el obrero en Sion trabajará para Sion;`,
    theme2: `porque si trabaja por dinero, perecerá."`,
    themeReference: "2 Nefi 26:31",
  },
};
