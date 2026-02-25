import { Analytics, count, countDistinct, db, desc, max, sql } from "astro:db";

export async function getTotalViews() {
	const result = await db.select({ count: count() }).from(Analytics);
	return result[0]?.count ?? 0;
}

export async function getUniquePageCount() {
	const result = await db
		.select({
			count: sql<number>`COUNT(DISTINCT ${Analytics.slug} || '/' || ${Analytics.locale})`,
		})
		.from(Analytics);
	return result[0]?.count ?? 0;
}

export async function getPageViewsBySlug() {
	return db
		.select({
			slug: Analytics.slug,
			locale: Analytics.locale,
			views: count(),
			lastVisit: max(Analytics.timestamp),
		})
		.from(Analytics)
		.groupBy(Analytics.slug, Analytics.locale)
		.orderBy(desc(count()));
}

export async function getReferrerBreakdown() {
	return db
		.select({
			referrer: Analytics.referrer,
			views: count(),
		})
		.from(Analytics)
		.groupBy(Analytics.referrer)
		.orderBy(desc(count()));
}

export async function getUtmSourceBreakdown() {
	return db
		.select({
			utmSource: Analytics.utm_source,
			views: count(),
		})
		.from(Analytics)
		.groupBy(Analytics.utm_source)
		.orderBy(desc(count()));
}

export async function getRecentViews(limit = 50) {
	return db
		.select({
			slug: Analytics.slug,
			locale: Analytics.locale,
			referrer: Analytics.referrer,
			screenResolution: Analytics.screen_resolution,
			timestamp: Analytics.timestamp,
		})
		.from(Analytics)
		.orderBy(desc(Analytics.timestamp))
		.limit(limit);
}

export async function getDateRange() {
	const result = await db
		.select({
			earliest: sql<string>`MIN(${Analytics.timestamp})`,
			latest: sql<string>`MAX(${Analytics.timestamp})`,
		})
		.from(Analytics);
	return {
		earliest: result[0]?.earliest ? new Date(result[0].earliest) : null,
		latest: result[0]?.latest ? new Date(result[0].latest) : null,
	};
}
