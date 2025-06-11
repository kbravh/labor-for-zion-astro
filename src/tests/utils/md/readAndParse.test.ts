import { normalize } from "node:path";
import {
	addLinks,
	cleanupExcerpt,
	getArticles,
	getBacklinks,
	getEmbedLinks,
	getLastUpdatedDateFromSlug,
	getNotePaths,
	getNoteTopics,
	getOutgoingLinks,
	getSlugFromFilepath,
	getSlugFromTitle,
	getSlugToPathMap,
	getTitleAndSlugMaps,
	getTranslationMap,
	removeMdxExtension,
} from "@utils/md/readAndParse";
import { type fs, vol } from "memfs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { testFiles } from "./testFiles";

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

// the file system doesn't work with relative paths well
vi.mock("@utils/md/consts", () => ({
	NOTES_PATH: "/notes",
}));

beforeEach(() => {
	// Reset the virtual file system before each test
	vol.reset();
	vol.fromJSON(testFiles);
});

describe("removeMdxExtension", () => {
	it("should remove the .mdx extension from a file name", () => {
		const fileName = "testFile.mdx";
		const expected = "testFile";
		expect(removeMdxExtension(fileName)).toBe(expected);
	});

	it("should remove the .mdx extension from a file name with multiple dots", () => {
		const fileName = "test.file.mdx";
		const expected = "test.file";
		expect(removeMdxExtension(fileName)).toBe(expected);
	});

	it("should remove the .md extension from a file name", () => {
		const fileName = "testFile.md";
		const expected = "testFile";
		expect(removeMdxExtension(fileName)).toBe(expected);
	});

	it("should remove the .md extension from a file name with multiple dots", () => {
		const fileName = "test.file.md";
		const expected = "test.file";
		expect(removeMdxExtension(fileName)).toBe(expected);
	});

	it("should not alter a file name with no extension", () => {
		const fileName = "testFile";
		const expected = "testFile";
		expect(removeMdxExtension(fileName)).toBe(expected);
	});

	it("should not alter a file name with a dot in the name and no md(x) extension", () => {
		const fileName = "test.file";
		const expected = "test.file";
		expect(removeMdxExtension(fileName)).toBe(expected);
	});
});

describe("getSlugFromFilepath", () => {
	it("should return the file name without the extension", () => {
		const filePath = "/path/to/testFile.mdx";
		const expected = "testFile";
		expect(getSlugFromFilepath(filePath)).toBe(expected);
	});

	it("should return the file name without the extension with multiple dots", () => {
		const filePath = "/path/to/test.file.mdx";
		const expected = "test.file";
		expect(getSlugFromFilepath(filePath)).toBe(expected);
	});

	it("should return the file name without the extension for .md files", () => {
		const filePath = "/path/to/testFile.md";
		const expected = "testFile";
		expect(getSlugFromFilepath(filePath)).toBe(expected);
	});

	it("should return the file name without the extension for .md files with multiple dots", () => {
		const filePath = "/path/to/test.file.md";
		const expected = "test.file";
		expect(getSlugFromFilepath(filePath)).toBe(expected);
	});

	it("should return the file name without the extension for files with no extension", () => {
		const filePath = "/path/to/testFile";
		const expected = "testFile";
		expect(getSlugFromFilepath(filePath)).toBe(expected);
	});

	it("should return the file name without the extension for files with a dot in the name and no md(x) extension", () => {
		const filePath = "/path/to/test.file";
		const expected = "test.file";
		expect(getSlugFromFilepath(filePath)).toBe(expected);
	});
});

describe("getSlugFromTitle", () => {
	it("should return the title in kebab case", () => {
		const title = "This is a test title";
		const expected = "this-is-a-test-title";
		expect(getSlugFromTitle(title)).toBe(expected);
	});

	it("should return the title in kebab case with special characters", () => {
		const title = "This is a test title$";
		const expected = "this-is-a-test-titledollar";
		expect(getSlugFromTitle(title)).toBe(expected);
	});

	it("should return the title in kebab case with numbers", () => {
		const title = "This is a test title 123";
		const expected = "this-is-a-test-title-123";
		expect(getSlugFromTitle(title)).toBe(expected);
	});
});

describe("getNotePaths", () => {
	it("should return an array of file paths", async () => {
		const files = {
			"/notes/dir/testFile2.mdx": "",
			"/notes/testFile1.mdx": "",
			"/notes/testFile3.mdx": "",
		};

		vol.reset();
		vol.fromJSON(files, "/");

		const expected = [
			"/notes/dir/testFile2.mdx",
			"/notes/testFile1.mdx",
			"/notes/testFile3.mdx",
		].map(normalize);

		expect(await getNotePaths()).toEqual(expected);
	});

	it("should throw an error if the directory does not exist", async () => {
		vol.reset();
		await expect(getNotePaths()).rejects.toThrowError();
	});
});

describe("getNoteTopics", () => {
	beforeEach(() => {
		vol.fromJSON(testFiles);
	});
	it("should return an array of topics", async () => {
		const expected = {
			articleTopics: new Set(["Book of Mormon", "Jewish tradition"]),
			slugToTopic: {
				"book-of-mormon": "Book of Mormon",
				"jewish-tradition": "Jewish tradition",
			},
		};
		expect(await getNoteTopics("en")).toEqual(expected);
	});
});

describe("getTitleAndSlugMaps", () => {
	beforeEach(() => {
		vol.fromJSON(testFiles);
	});
	it("should generate a map of titles to slugs and slugs to titles", async () => {
		const expected = {
			slugToTitle: {
				"and-my-father-dwelt-in-a-tent": "And My Father Dwelt in a Tent",
				"1-nephi-1.2": "1 Nephi 1.2",
				"1-nephi-2.15": "1 Nephi 2.15",
				"1-nephi-3.16": "1 Nephi 3.16",
				"john-11.35": "John 11.35",
			},
			titleToSlug: {
				"1 Nephi 1.2": "1-nephi-1.2",
				"1 Nephi 2.15": "1-nephi-2.15",
				"1 Nephi 3.16": "1-nephi-3.16",
				"And My Father Dwelt in a Tent": "and-my-father-dwelt-in-a-tent",
				"John 11.35": "john-11.35",
			},
		};
		const results = await getTitleAndSlugMaps("en");
		expect(results.slugToTitle).toEqual(expected.slugToTitle);
		expect(results.titleToSlug).toEqual(expected.titleToSlug);
	});
});

describe("getSlugToPathMap", () => {
	beforeEach(() => {
		vol.fromJSON(testFiles);
	});

	it("should generate a map of slugs to file paths", async () => {
		const expected = {
			"and-my-father-dwelt-in-a-tent": normalize(
				"/notes/en/2024/01/and-my-father-dwelt-in-a-tent.md",
			),
		};
		const results = await getSlugToPathMap("en");
		expect(results).toEqual(expected);
	});
});

describe("addLinks", () => {
	it("should add links to references in the text", async () => {
		const locale = "en";
		const titleToSlug = {
			"1 Nephi 1.2": "1-nephi-1.2",
			"1 Nephi 2.15": "1-nephi-2.15",
			"1 Nephi 3.16": "1-nephi-3.16",
			"And My Father Dwelt in a Tent": "and-my-father-dwelt-in-a-tent",
			"John 11.35": "john-11.35",
		};
		const text = `The most memorized Christian scripture is without a doubt "Jesus wept." ([[John 11.35]]). A very close second, at least among members of the Church, is "And my father dwelt in a tent" ([[1 Nephi 2.15]]). While it's a convenient scripture to memorize, it raises an interesting question: why did Nephi feel the need to include this detail as he was looking back on his experiences and writing this record after so many years?`;
		const expected = `The most memorized Christian scripture is without a doubt "Jesus wept." (<a href="/notes/john-11.35">John 11.35</a>). A very close second, at least among members of the Church, is "And my father dwelt in a tent" (<a href="/notes/1-nephi-2.15">1 Nephi 2.15</a>). While it's a convenient scripture to memorize, it raises an interesting question: why did Nephi feel the need to include this detail as he was looking back on his experiences and writing this record after so many years?`;
		expect(await addLinks(locale, titleToSlug, text)).toBe(expected);
	});
});

describe("getOutgoingLinks", () => {
	it("should return an array of outgoing links", async () => {
		const text = `The most memorized Christian scripture is without a doubt "Jesus wept." ([[John 11.35]]). A very close second, at least among members of the Church, is "And my father dwelt in a tent" ([[1 Nephi 2.15]]). While it's a convenient scripture to memorize, it raises an interesting question: why did Nephi feel the need to include this detail as he was looking back on his experiences and writing this record after so many years?`;
		const expected = [
			{
				excerpt:
					'memorized Christian scripture is without a doubt "Jesus wept." ( John 11.35 ). A very close second,',
				link: "[[John 11.35]]",
				title: "John 11.35",
			},
			{
				excerpt:
					'Church, is "And my father dwelt in a tent" ( 1 Nephi 2.15 ). While it\'s a convenient',
				link: "[[1 Nephi 2.15]]",
				title: "1 Nephi 2.15",
			},
		];
		expect(getOutgoingLinks(text)).toEqual(expected);
	});
	it("should return an empty array if there are no outgoing links", () => {
		const text = `The most memorized Christian scripture is without a doubt "Jesus wept." A very close second, at least among members of the Church, is "And my father dwelt in a tent". While it's a convenient scripture to memorize, it raises an interesting question: why did Nephi feel the need to include this detail as he was looking back on his experiences and writing this record after so many years?`;
		expect(getOutgoingLinks(text)).toEqual([]);
	});
	it("should provide the alias if present", () => {
		const text = `The most memorized Christian scripture is without a doubt "Jesus wept." ([[John 11.35|Jesus wept]]). A very close second, at least among members of the Church, is "And my father dwelt in a tent" ([[1 Nephi 2.15]]). While it's a convenient scripture to memorize, it raises an interesting question: why did Nephi feel the need to include this detail as he was looking back on his experiences and writing this record after so many years?`;
		const expected = [
			{
				alias: "Jesus wept",
				excerpt:
					'memorized Christian scripture is without a doubt "Jesus wept." ( Jesus wept ). A very close second,',
				link: "[[John 11.35|Jesus wept]]",
				title: "John 11.35",
			},
			{
				alias: undefined,
				excerpt:
					'Church, is "And my father dwelt in a tent" ( 1 Nephi 2.15 ). While it\'s a convenient',
				link: "[[1 Nephi 2.15]]",
				title: "1 Nephi 2.15",
			},
		];
		expect(getOutgoingLinks(text)).toEqual(expected);
	});
	it("should parse sequential links", () => {
		const text =
			'we will be guided and purified by it throughout our lives until "we shall see [God] as he is" ([[1 John 3.2]], [[Moroni 7.48]]).';
		const expected = [
			{
				excerpt:
					'lives until "we shall see [God] as he is" ( 1 John 3.2 , [[Moroni 7.48]]).',
				link: "[[1 John 3.2]]",
				title: "1 John 3.2",
			},
			{
				excerpt:
					'"we shall see [God] as he is" ([[1 John 3.2]], Moroni 7.48 ).',
				link: "[[Moroni 7.48]]",
				title: "Moroni 7.48",
			},
		];
		expect(getOutgoingLinks(text)).toEqual(expected);
	});
});

describe("getEmbedLinks", () => {
	it("should return an array of embed links", async () => {
		const text = `The most memorized Christian scripture is without a doubt "Jesus wept." (![[John 11.35]]). A very close second, at least among members of the Church, is "And my father dwelt in a tent" (![[1 Nephi 2.15]]). While it's a convenient scripture to memorize, it raises an interesting question: why did Nephi feel the need to include this detail as he was looking back on his experiences and writing this record after so many years?`;
		const expected = [
			{
				excerpt:
					'memorized Christian scripture is without a doubt "Jesus wept." ( John 11.35 ). A very close second,',
				link: "![[John 11.35]]",
				title: "John 11.35",
			},
			{
				excerpt:
					'Church, is "And my father dwelt in a tent" ( 1 Nephi 2.15 ). While it\'s a convenient',
				link: "![[1 Nephi 2.15]]",
				title: "1 Nephi 2.15",
			},
		];
		expect(getEmbedLinks(text)).toEqual(expected);
	});
	it("should capture embed links with aliases", () => {
		const text = `The most memorized Christian scripture is without a doubt "Jesus wept." (![[John 11.35|Jesus wept]]). A very close second, at least among members of the Church, is "And my father dwelt in a tent" (![[1 Nephi 2.15]]). While it's a convenient scripture to memorize, it raises an interesting question: why did Nephi feel the need to include this detail as he was looking back on his experiences and writing this record after so many years?`;
		const expected = [
			{
				alias: "Jesus wept",
				excerpt:
					'memorized Christian scripture is without a doubt "Jesus wept." ( Jesus wept ). A very close second,',
				link: "![[John 11.35|Jesus wept]]",
				title: "John 11.35",
			},
			{
				alias: undefined,
				excerpt:
					'Church, is "And my father dwelt in a tent" ( 1 Nephi 2.15 ). While it\'s a convenient',
				link: "![[1 Nephi 2.15]]",
				title: "1 Nephi 2.15",
			},
		];
		expect(getEmbedLinks(text)).toEqual(expected);
	});
	it("should not match regular bracket links", async () => {
		const text = `The most memorized Christian scripture is without a doubt "Jesus wept." ([[John 11.35]]). A very close second, at least among members of the Church, is "And my father dwelt in a tent" ([[1 Nephi 2.15]]). While it's a convenient scripture to memorize, it raises an interesting question: why did Nephi feel the need to include this detail as he was looking back on his experiences and writing this record after so many years?`;
		expect(getEmbedLinks(text)).toEqual([]);
	});
	it("should return an empty array if there are no embed links", () => {
		const text = `The most memorized Christian scripture is without a doubt "Jesus wept." A very close second, at least among members of the Church, is "And my father dwelt in a tent". While it's a convenient scripture to memorize, it raises an interesting question: why did Nephi feel the need to include this detail as he was looking back on his experiences and writing this record after so many years?`;
		expect(getEmbedLinks(text)).toEqual([]);
	});
});

describe("cleanupExcerpt", () => {
	it("should remove the link from the excerpt", () => {
		const excerpt = {
			alias: undefined,
			excerpt:
				'the Church, is "And my father dwelt in a tent" (1 Nephi 2.15). While',
			link: "![[1 Nephi 2.15]]",
			title: "1 Nephi 2.15",
		};
		const expected =
			'the Church, is "And my father dwelt in a tent" (1 Nephi 2.15). While';
		expect(cleanupExcerpt(excerpt)).toBe(expected);
	});
	it("should remove the link from the excerpt with an alias", () => {
		const excerpt = {
			alias: "Jesus wept",
			excerpt:
				'most memorized Christian scripture is without a doubt "Jesus wept." (Jesus wept). A',
			link: "![[John 11.35|Jesus wept]]",
			title: "John 11.35",
		};
		const expected =
			'most memorized Christian scripture is without a doubt "Jesus wept." (Jesus wept). A';
		expect(cleanupExcerpt(excerpt)).toBe(expected);
	});
});

describe("getBacklinks", () => {
	it("should return an array of backlinks", async () => {
		const expected = {
			"1 Nephi 1.2": [
				{
					excerpt:
						'of the Jews and the language of the Egyptians" ( 1 Nephi 1.2 ). His family also had',
					slug: "and-my-father-dwelt-in-a-tent",
					title: "And My Father Dwelt in a Tent",
				},
			],
			"1 Nephi 2.15": [
				{
					excerpt:
						'Church, is "And my father dwelt in a tent" ( 1 Nephi 2.15 ). While it\'s a convenient',
					slug: "and-my-father-dwelt-in-a-tent",
					title: "And My Father Dwelt in a Tent",
				},
			],
			"1 Nephi 3.16": [
				{
					excerpt:
						'the "gold and silver, and all manner of riches" ( 1 Nephi 3.16 ) to purchase the brass',
					slug: "and-my-father-dwelt-in-a-tent",
					title: "And My Father Dwelt in a Tent",
				},
			],
			"John 11.35": [
				{
					excerpt:
						'memorized Christian scripture is without a doubt "Jesus wept." ( John 11.35 ). A very close second,',
					slug: "and-my-father-dwelt-in-a-tent",
					title: "And My Father Dwelt in a Tent",
				},
			],
		};
		expect(await getBacklinks("en")).toEqual(expected);
	});
});

describe("getArticles", () => {
	it("should return an array of articles sorted by date", async () => {
		expect(await getArticles()).toEqual([
			{
				frontmatter: {
					date: new Date("2024-06-12T15:40:16.967Z"),
					description:
						"¿Por qué Nefi sintió importante incluir este pequeño detalle acerca de su padre en su registro histórico?",
					language: "es",
					tags: ["Libro de Mormón", "Tradición judía"],
					title: "Y Mi Padre Vivía en una Tienda",
					translations: {
						en: "and-my-father-dwelt-in-a-tent",
					},
				},
				slug: "y-mi-padre-vivía-en-una-tienda",
			},
			{
				frontmatter: {
					date: new Date("2024-01-12T15:40:16.967Z"),
					description:
						"Why did Nephi feel it important to include this small detail about his father in his historical record?",
					language: "en",
					tags: ["Book of Mormon", "Jewish tradition"],
					title: "And My Father Dwelt in a Tent",
					translations: {
						es: "y-mi-padre-vivía-en-una-tienda",
					},
					updated: new Date("2024-01-19T02:46:02.850Z"),
				},
				slug: "and-my-father-dwelt-in-a-tent",
			},
		]);
	});
	it("should filter articles by locale", async () => {
		expect(await getArticles({ locale: "en" })).toEqual([
			{
				frontmatter: {
					date: new Date("2024-01-12T15:40:16.967Z"),
					description:
						"Why did Nephi feel it important to include this small detail about his father in his historical record?",
					language: "en",
					tags: ["Book of Mormon", "Jewish tradition"],
					title: "And My Father Dwelt in a Tent",
					translations: {
						es: "y-mi-padre-vivía-en-una-tienda",
					},
					updated: new Date("2024-01-19T02:46:02.850Z"),
				},
				slug: "and-my-father-dwelt-in-a-tent",
			},
		]);
	});
	it("should filter articles by topic", async () => {
		expect(await getArticles({ topic: "Libro de Mormón" })).toEqual([
			{
				frontmatter: {
					date: new Date("2024-06-12T15:40:16.967Z"),
					description:
						"¿Por qué Nefi sintió importante incluir este pequeño detalle acerca de su padre en su registro histórico?",
					language: "es",
					tags: ["Libro de Mormón", "Tradición judía"],
					title: "Y Mi Padre Vivía en una Tienda",
					translations: {
						en: "and-my-father-dwelt-in-a-tent",
					},
				},
				slug: "y-mi-padre-vivía-en-una-tienda",
			},
		]);
	});
	it("should filter articles by locale and topic", async () => {
		expect(
			await getArticles({ locale: "es", topic: "Libro de Mormón" }),
		).toEqual([
			{
				frontmatter: {
					date: new Date("2024-06-12T15:40:16.967Z"),
					description:
						"¿Por qué Nefi sintió importante incluir este pequeño detalle acerca de su padre en su registro histórico?",
					language: "es",
					tags: ["Libro de Mormón", "Tradición judía"],
					title: "Y Mi Padre Vivía en una Tienda",
					translations: {
						en: "and-my-father-dwelt-in-a-tent",
					},
				},
				slug: "y-mi-padre-vivía-en-una-tienda",
			},
		]);
	});
});

describe("getLastUpdatedFromSlug", () => {
	it("should return the last updated date for a given slug", async () => {
		expect(
			await getLastUpdatedDateFromSlug("en", "and-my-father-dwelt-in-a-tent"),
		).toEqual(new Date("2024-01-19T02:46:02.850Z"));
	});
	it("should return the original date if there is no updated date", async () => {
		expect(
			await getLastUpdatedDateFromSlug("es", "y-mi-padre-vivía-en-una-tienda"),
		).toEqual(new Date("2024-06-12T15:40:16.967Z"));
	});
});

describe("getTranslationMap", () => {
	beforeEach(() => {
		vol.fromJSON(testFiles);
	});

	it("should return a map of article slugs to their translations for English locale", async () => {
		const expected = {
			"and-my-father-dwelt-in-a-tent": {
				es: "y-mi-padre-vivía-en-una-tienda"
			}
		};
		const result = await getTranslationMap("en");
		expect(result).toEqual(expected);
	});

	it("should return a map of article slugs to their translations for Spanish locale", async () => {
		const expected = {
			"y-mi-padre-vivía-en-una-tienda": {
				en: "and-my-father-dwelt-in-a-tent"
			}
		};
		const result = await getTranslationMap("es");
		expect(result).toEqual(expected);
	});
});
