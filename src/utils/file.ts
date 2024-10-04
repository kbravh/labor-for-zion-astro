import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";

export const writeFile = (key: string | symbol, data: unknown) => {
  // Handle serialization of Sets
  const replacer = (_: string, value: any) => {
    if (value instanceof Set) {
      return [...value];
    }
    return value;
  };

  // filepath is relative to where npm run build is run from
  const filename = `data/${key.toString()}.json`;

  // create the path if it doesn't exist
  if (!existsSync("data")) {
    mkdirSync("data", {recursive: true});
  }

  // erase the old file and create a new one
  if (existsSync(filename)) {
    rmSync(filename);
  }

  writeFileSync(filename, JSON.stringify(data, replacer));
};
