import { dataStore } from "@utils/md/dataStore";
import { type fs, vol } from "memfs";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

describe("dataStore", () => {
	beforeEach(() => {
		// Reset the virtual file system before each test
		vol.reset();
	});

	it("should write data to a file when setting a key", () => {
		const locale = "en";
		const key = "slugToTopic";
		const data = { testSlug: "testTopic" };

		dataStore[locale][key] = data;

		// Check if the file was written correctly
		const fileContent = vol.readFileSync(`data/${locale}_${key}.json`, "utf8");
		expect(fileContent).toBe(JSON.stringify(data));
	});

	it("should throw an error when setting an invalid key", () => {
		const locale = "en";
		const key = "invalidKey";
		const data = { testSlug: "testTopic" };

		expect(() => {
			// @ts-expect-error
			dataStore[locale][key] = data;
		}).toThrowError(`Invalid data key: ${key}`);
	});

	it("should read data from a file when getting a key", () => {
		const locale = "en";
		const key = "slugToTopic";
		const data = { testSlug: "testTopic" };

		vol.fromJSON({ [`data/${locale}_${key}.json`]: JSON.stringify(data) });

		expect(dataStore[locale][key]).toEqual(data);
	});

	it("should throw an error when getting an invalid key", () => {
		const locale = "en";
		const key = "invalidKey";

		expect(() => {
			// @ts-expect-error
			const _ = dataStore[locale][key];
		}).toThrowError(`Invalid data key: ${key}`);
	});

	it("should throw an error when getting an invalid locale", () => {
		const invalidLocale = "invalidLocale";

		expect(() => {
			// @ts-expect-error
			const _ = dataStore[invalidLocale];
		}).toThrowError(`Invalid locale: ${invalidLocale}`);
	});
});
