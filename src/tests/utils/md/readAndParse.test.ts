import { describe, it, expect, beforeEach, vi } from "vitest";
import { fs, vol } from "memfs";
import {
  getNotePaths,
  getSlugFromFilepath,
  getSlugFromTitle,
  removeMdxExtension,
} from "@utils/md/readAndParse";

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
      "/notes/testFile1.mdx": "",
      "/notes/testFile2.mdx": "",
      "/notes/testFile3.mdx": "",
    };

    vol.fromJSON(files, "/");

    const expected = [
      "/notes/testFile1.mdx",
      "/notes/testFile2.mdx",
      "/notes/testFile3.mdx",
    ];

    expect(await getNotePaths()).toEqual(expected);
  });

  it("should throw an error if the directory does not exist", async () => {
    await expect(getNotePaths()).rejects.toThrowError();
  });
});
