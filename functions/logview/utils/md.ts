import type { Locale } from "@validation/i18n";
import { readFileSync } from "fs";

const readFile = (key: string) => {
  const data = readFileSync(`./data/${key}.json`, "utf-8");
  return JSON.parse(data);
};

export const getTitleAndSlugMaps = (locale: Locale) => {
  const slugToTitle = readFile(`${locale}_slugToTitle`);

  return {
    slugToTitle,
  };
};
