import { generateRssFeed } from "@utils/rss";
import { describe, expect, it } from "vitest";

describe("generateRssFeed", () => {
	it("returns a Response with application/xml content type", async () => {
		const response = await generateRssFeed({
			locale: "en",
			site: new URL("https://laborforzion.com"),
		});
		expect(response).toBeInstanceOf(Response);
		expect(response.headers.get("Content-Type")).toBe("application/xml");
	});

	it("emits an English RSS channel with the English site title", async () => {
		const response = await generateRssFeed({
			locale: "en",
			site: new URL("https://laborforzion.com"),
		});
		const body = await response.text();
		expect(body).toContain("<rss");
		expect(body).toContain("<channel>");
		expect(body).toContain("<language>en</language>");
		expect(body).toContain("<title>Labor For Zion</title>");
	});

	it("emits a Spanish RSS channel with the Spanish site title", async () => {
		const response = await generateRssFeed({
			locale: "es",
			site: new URL("https://laborforzion.com"),
		});
		const body = await response.text();
		expect(body).toContain("<language>es</language>");
		expect(body).toContain("<title>Obrero en Sión</title>");
	});

	it("references the English stylesheet for the English feed", async () => {
		const response = await generateRssFeed({
			locale: "en",
			site: new URL("https://laborforzion.com"),
		});
		const body = await response.text();
		expect(body).toContain("xml-stylesheet");
		expect(body).toContain("/rss-feed.xsl");
		expect(body).not.toContain("/rss-feed-es.xsl");
	});

	it("references the Spanish stylesheet for the Spanish feed", async () => {
		const response = await generateRssFeed({
			locale: "es",
			site: new URL("https://laborforzion.com"),
		});
		const body = await response.text();
		expect(body).toContain("xml-stylesheet");
		expect(body).toContain("/rss-feed-es.xsl");
	});

	it("includes at least one item with a localized note link", async () => {
		const response = await generateRssFeed({
			locale: "en",
			site: new URL("https://laborforzion.com"),
		});
		const body = await response.text();
		expect(body).toContain("<item>");
		expect(body).toMatch(/<title>[\s\S]*?<\/title>/);
		expect(body).toMatch(/<link>https:\/\/laborforzion\.com\/en\/notes\//);
	});
});
