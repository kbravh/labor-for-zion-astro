import { basename } from "node:path";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { getLastUpdatedDateFromSlug } from "./src/utils/md/readAndParse";
import { LOCALES } from "./src/validation/i18n";

import node from "@astrojs/node";

import tailwindcss from "@tailwindcss/vite";

import db from "@astrojs/db";

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
		sitemap({
			filter: (page) => page !== "https://laborforzion.com/quiz",
			serialize: async (item) => {
				//Fetch the last modified date for articles
				if (/.*notes\/.+/.test(item.url)) {
					const locale = item.url
						.split("/")
						.find((piece) => LOCALES.includes(piece));
					const slug = basename(item.url);
					const date = await getLastUpdatedDateFromSlug(locale ?? "en", slug);
					if (!date) {
						return item;
					}
					return {
						...item,
						lastmod: date.toUTCString(),
					};
				}
			},
		}),
		db(),
	],

	adapter: node({
		mode: "standalone",
	}),

	vite: {
		plugins: [tailwindcss()],
	},
});
