import { basename } from "node:path";
import db from "@astrojs/db";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import { getLastUpdatedDateFromSlug } from "./src/utils/md/readAndParse";
import { LOCALES } from "./src/validation/i18n";

// https://astro.build/config
export default defineConfig({
	site: import.meta.env.PROD
		? "https://laborforzion.com"
		: "http://localhost:4321",

	i18n: {
		defaultLocale: "en",
		locales: ["en", "es"],
	},

	env: {
		schema: {
			ASTRO_DB_REMOTE_URL: envField.string({
				context: "server",
				access: "secret",
			}),
			ASTRO_DB_APP_TOKEN: envField.string({
				context: "server",
				access: "secret",
			}),
		},
	},

	integrations: [
		sitemap({
			filter: (page) =>
				page !== "https://laborforzion.com/quiz" &&
				page !== "https://laborforzion.com/analytics",
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
