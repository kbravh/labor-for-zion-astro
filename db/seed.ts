import { Analytics, db } from "astro:db";
import type { Locale } from "@validation/i18n";
import { nanoid } from "nanoid";
import { localeMap } from "../src/utils/i18n/locales";
import { getTitleAndSlugMaps } from "../src/utils/md/readAndParse";

// Generate random date within the last 90 days
function randomDate(): Date {
	const now = new Date();
	const daysAgo = Math.floor(Math.random() * 90);
	const hoursAgo = Math.floor(Math.random() * 24);
	const minutesAgo = Math.floor(Math.random() * 60);
	return new Date(
		now.getTime() -
			daysAgo * 24 * 60 * 60 * 1000 -
			hoursAgo * 60 * 60 * 1000 -
			minutesAgo * 60 * 1000,
	);
}

// Random UTM parameters
function randomUTM() {
	const sources = [
		"google",
		"facebook",
		"twitter",
		"instagram",
		"linkedin",
		"newsletter",
		"direct",
		null,
	];
	const mediums = ["cpc", "social", "email", "referral", "organic", null];
	const campaigns = [
		"spring_launch",
		"summer_promo",
		"fall_webinar",
		"winter_sale",
		null,
	];
	const contents = ["banner", "sidebar", "footer", "header", "article", null];
	const terms = [
		"scripture_study",
		"family_council",
		"come_follow_me",
		"personal_revelation",
		null,
	];

	return {
		utm_source: sources[Math.floor(Math.random() * sources.length)],
		utm_medium: mediums[Math.floor(Math.random() * mediums.length)],
		utm_campaign: campaigns[Math.floor(Math.random() * campaigns.length)],
		utm_content: contents[Math.floor(Math.random() * contents.length)],
		utm_term: terms[Math.floor(Math.random() * terms.length)],
	};
}

// Random screen resolutions
function randomScreenResolution(): string {
	const resolutions = [
		"1920x1080",
		"2560x1440",
		"1366x768",
		"1440x900",
		"3840x2160",
		"1280x720",
		"1680x1050",
		"1024x768",
		"3440x1440",
		"1536x864",
		"2880x1800",
		"1600x900",
		"414x896",
		"360x740",
		"390x844",
		"428x926",
		"320x568",
		"393x851",
		"412x915",
	];
	return resolutions[Math.floor(Math.random() * resolutions.length)];
}

// Random referrers
function randomReferrer(): string | null {
	const referrers = [
		"https://www.google.com/",
		"https://www.bing.com/",
		"https://www.facebook.com/",
		"https://www.instagram.com/",
		"https://www.linkedin.com/",
		"https://www.churchofjesuschrist.org/",
		"https://www.youtube.com/",
		"https://www.reddit.com/",
		null,
	];
	return referrers[Math.floor(Math.random() * referrers.length)];
}

// https://astro.build/db/seed
export default async function seed() {
	// Get available locales from localeMap
	const locales = Object.keys(localeMap) as Locale[];
	// Define type for analytics entries based on table structure
	type AnalyticsEntry = {
		id: string;
		slug: string;
		locale: string;
		utm_source?: string | null;
		utm_medium?: string | null;
		utm_campaign?: string | null;
		utm_content?: string | null;
		utm_term?: string | null;
		referrer?: string | null;
		screen_resolution?: string;
		timestamp: Date;
	};

	const analyticsEntries: AnalyticsEntry[] = [];

	// For each locale, get available slugs and create random entries
	for (const locale of locales) {
		// Get slugs for this locale
		const { slugToTitle } = await getTitleAndSlugMaps(locale);

		// For each slug, create a random number of analytics entries
		for (const slug of Object.keys(slugToTitle)) {
			// Generate between 5 and 20 entries for each slug
			const entriesCount = 5 + Math.floor(Math.random() * 16);

			for (let i = 0; i < entriesCount; i++) {
				analyticsEntries.push({
					id: nanoid(),
					slug,
					locale,
					...randomUTM(),
					referrer: randomReferrer(),
					screen_resolution: randomScreenResolution(),
					timestamp: randomDate(),
				});
			}
		}
	}

	// Insert all generated entries
	await db.insert(Analytics).values(analyticsEntries);

	console.log(`Seeded ${analyticsEntries.length} analytics entries`);
}
