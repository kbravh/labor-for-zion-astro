import type { Locale } from "@validation/i18n";

export type Meta = 'site' | 'description';

export type MetaMap = {
  [k in Locale]: {
    [k in Meta]: string
  }
}

export const metaMap: MetaMap = {
  en: {
    site: 'Labor For Zion',
    description: 'A collection of notes, talks, and tools centered around gospel topics.'
  },
  es: {
    site: 'Obrero en Sión',
    description: 'Una colección de notas, discursos, y herramientas centrados en el evangelio.'
  },
}
