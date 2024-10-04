import { describe, it, expect, beforeEach, vi } from "vitest";
import { fs, vol } from "memfs";
import {
  getNotePaths,
  getNoteTopics,
  getSlugFromFilepath,
  getSlugFromTitle,
  getTitleAndSlugMaps,
  removeMdxExtension,
} from "@utils/md/readAndParse";
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

    vol.fromJSON(files, "/");

    const expected = [
      "/notes/dir/testFile2.mdx",
      "/notes/testFile1.mdx",
      "/notes/testFile3.mdx",
    ];

    expect(await getNotePaths("/notes")).toEqual(expected);
  });

  it("should throw an error if the directory does not exist", async () => {
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
