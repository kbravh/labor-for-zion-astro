import { ActionError } from "astro:actions";
import { Analytics, and, count, db, eq, sql } from "astro:db";
import { getTitleAndSlugMaps } from "@utils/md/readAndParse";
import { isValidLocale } from "@validation/i18n";

export const logPageViewActor = async (data: {
	slug: string;
	locale: string;
	utm_source?: string;
	utm_medium?: string;
	utm_campaign?: string;
	utm_content?: string;
	utm_term?: string;
	referrer?: string;
	screen_resolution?: string;
}) => {
	if (!isValidLocale(data.locale)) {
		throw new ActionError({
			code: "BAD_REQUEST",
			message: "Not a valid locale",
		});
	}

	const { slugToTitle } = await getTitleAndSlugMaps(data.locale);
	const set = new Set(Object.keys(slugToTitle));

	if (!set.has(data.slug)) {
		throw new ActionError({
			code: "BAD_REQUEST",
			message: "Slug not found",
		});
	}

	// Insert the analytics data and get the page view count in one operation
	const result = await db
		.insert(Analytics)
		.values(data)
		.returning({
			count: sql`(SELECT COUNT(*) FROM ${Analytics} WHERE ${Analytics.slug} = ${data.slug} AND ${Analytics.locale} = ${data.locale})`,
		});

	return { count: Number(result[0]?.count) || 0 };
};

export const getPageViewsActor = async (data: {
	slug: string;
	locale: string;
}) => {
	const result = await db
		.select({ count: count() })
		.from(Analytics)
		.where(
			and(eq(Analytics.slug, data.slug), eq(Analytics.locale, data.locale)),
		);

	return result[0]?.count ?? 0;
};
