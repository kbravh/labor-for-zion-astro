import { NOW, column, defineDb, defineTable } from "astro:db";

const Analytics = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		slug: column.text(),
		locale: column.text(),
		utm_source: column.text({ optional: true }),
		utm_medium: column.text({ optional: true }),
		utm_campaign: column.text({ optional: true }),
		utm_content: column.text({ optional: true }),
		utm_term: column.text({ optional: true }),
		referrer: column.text({ optional: true }),
		screen_resolution: column.text({ optional: true }),
		timestamp: column.date({ default: NOW }),
	},
	indexes: [{ on: ["slug", "locale"] }],
});

// https://astro.build/db/config
export default defineDb({
	tables: {
		Analytics,
	},
});
