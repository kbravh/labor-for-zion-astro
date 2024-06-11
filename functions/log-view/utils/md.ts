import { readFileSync } from "fs";

// Reviver function for JSON.parse
const reviver = (key: string, value: any) => {
  if (value && value.dataType === 'Set') {
    return new Set(value.value);
  }
  return value;
};

const readFile = (key: string) => {
  const data = readFileSync(`./data/${key}.json`, 'utf-8');
  return JSON.parse(data, reviver);
};

export const getTitleAndSlugMaps = () => {
  const titleToSlug = readFile('titleToSlug')
  const slugToTitle = readFile('slugToTitle')

  return {
    titleToSlug: JSON.parse(titleToSlug, reviver),
    slugToTitle: JSON.parse(slugToTitle, reviver)
  }
}
