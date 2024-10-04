import { describe, it, expect, beforeEach, vi } from "vitest";
import { fs, vol } from "memfs";
import {removeMdxExtension} from "@utils/md/readAndParse";

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
