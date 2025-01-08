import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import { basename } from "path";
import { getLastUpdatedDateFromSlug } from "./src/utils/md/readAndParse";
import {LOCALES} from "./src/validation/i18n";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.PROD
    ? "https://laborforzion.com"
    : "http://localhost:4321",

  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
  },

  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => page !== "https://laborforzion.com/views",
      serialize: async (item) => {
        //Fetch the last modified date for articles
        if (/.*notes\/.+/.test(item.url)) {
          const locale = item.url.split("/").find(piece => LOCALES.includes(piece))
          const slug = basename(item.url);
          const date = await getLastUpdatedDateFromSlug(locale ?? "en", slug);
          if (!date) {
            return item;
          } else {
            return {
              ...item,
              lastmod: date.toUTCString(),
            };
          }
        }
      },
    }),
  ],

  adapter: node({
    mode: "standalone",
  }),
});