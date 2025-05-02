import { generateRssFeed } from "@utils/rss";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ site }) =>
	generateRssFeed({ locale: "en", site });
