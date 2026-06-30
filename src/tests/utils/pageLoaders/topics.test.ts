import { topicGetStaticPaths } from "@utils/pageLoaders/topics";
import { type fs, vol } from "memfs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { testFiles } from "../md/testFiles";

vi.mock("node:fs", async () => {
	const memfs = await vi.importActual<{ fs: typeof fs }>("memfs");
	return memfs.fs;
});

vi.mock("node:fs/promises", async () => {
	const memfs: { fs: typeof fs } = await vi.importActual<{ fs: typeof fs }>(
		"memfs",
	);
	return memfs.fs.promises;
});

vi.mock("@utils/md/consts", () => ({
	NOTES_PATH: "/notes",
}));

beforeEach(() => {
	vol.reset();
	vol.fromJSON(testFiles);
});

const makePaginate = () =>
	vi.fn((data: unknown, opts: { params: unknown; pageSize: number }) => ({
		params: opts.params,
		props: { page: { data, pageSize: opts.pageSize } },
	}));

describe("topicGetStaticPaths", () => {
	it("returns a flat array (not nested)", async () => {
		const paginate = makePaginate();
		const result = await topicGetStaticPaths("en")({
			paginate,
			// biome/eslint: unused but required by GetStaticPaths shape
		} as unknown as Parameters<ReturnType<typeof topicGetStaticPaths>>[0]);

		expect(Array.isArray(result)).toBe(true);
		// every entry must be a single page object, never an array
		for (const entry of result) {
			expect(Array.isArray(entry)).toBe(false);
			expect(entry).toHaveProperty("params");
			expect(entry).toHaveProperty("props");
		}
	});

	it("includes every topic from getNoteTopics('en') with slugified params.topic", async () => {
		const paginate = makePaginate();
		const result = await topicGetStaticPaths("en")({
			paginate,
		} as unknown as Parameters<ReturnType<typeof topicGetStaticPaths>>[0]);

		const topicParams = result.map(
			(entry) => (entry.params as { topic: string }).topic,
		);

		expect(topicParams).toEqual(
			expect.arrayContaining(["book-of-mormon", "jewish-tradition"]),
		);
		expect(topicParams).toHaveLength(2);
		// confirm lowercase + hyphenated
		for (const slug of topicParams) {
			expect(slug).toBe(slug.toLowerCase());
			expect(slug).not.toMatch(/\s/);
		}
	});

	it("forwards pageSize: 5 into every paginate call", async () => {
		const paginate = makePaginate();
		await topicGetStaticPaths("en")({
			paginate,
		} as unknown as Parameters<ReturnType<typeof topicGetStaticPaths>>[0]);

		expect(paginate).toHaveBeenCalled();
		for (const call of paginate.mock.calls) {
			const opts = call[1] as { pageSize: number };
			expect(opts.pageSize).toBe(5);
		}
	});

	it("forwards getArticles({ topic }) matching posts to paginate", async () => {
		const paginate = makePaginate();
		await topicGetStaticPaths("en")({
			paginate,
		} as unknown as Parameters<ReturnType<typeof topicGetStaticPaths>>[0]);

		// "Book of Mormon" topic should produce a paginate call whose posts
		// include the english article slug
		const bookOfMormonCall = paginate.mock.calls.find((call) => {
			const opts = call[1] as { params: { topic: string } };
			return opts.params.topic === "book-of-mormon";
		});
		expect(bookOfMormonCall).toBeDefined();

		const posts = bookOfMormonCall?.[0] as { slug: string }[];
		expect(Array.isArray(posts)).toBe(true);
		expect(posts.map((p) => p.slug)).toContain(
			"and-my-father-dwelt-in-a-tent",
		);

		const jewishCall = paginate.mock.calls.find((call) => {
			const opts = call[1] as { params: { topic: string } };
			return opts.params.topic === "jewish-tradition";
		});
		expect(jewishCall).toBeDefined();
		const jewishPosts = jewishCall?.[0] as { slug: string }[];
		expect(jewishPosts.map((p) => p.slug)).toContain(
			"and-my-father-dwelt-in-a-tent",
		);
	});

	it("is callable for the 'es' locale and returns an array", async () => {
		const paginate = makePaginate();
		const result = await topicGetStaticPaths("es")({
			paginate,
		} as unknown as Parameters<ReturnType<typeof topicGetStaticPaths>>[0]);

		expect(Array.isArray(result)).toBe(true);
	});
});
