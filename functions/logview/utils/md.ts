import { readFileSync } from "fs";

const readFile = (key: string) => {
  const data = readFileSync(`./data/${key}.json`, "utf-8");
  return JSON.parse(data);
};

export const getTitleAndSlugMaps = () => {
  const slugToTitle = readFile("slugToTitle");

  return {
    slugToTitle,
  };
};
