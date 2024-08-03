import { headingObserver } from "@utils/headingObserver";
import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * @vitest-environment jsdom
 */

const getBoundingClientRectValues = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  height: 0,
  width: 0,
  x: 0,
  y: 0,
  toJSON: () => {},
};

describe("headingObserver", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="table-of-contents">
        <a href="#heading1">Heading 1</a>
        <a href="#heading2">Heading 2</a>
      </div>
      <h1 id="article-title">Article Title</h1>
      <div id="article-body">
        <h2 id="heading1">Heading 1</h2>
        <h3 id="heading2">Heading 2</h3>
      </div>
    `;
  });

  it("should highlight the closest heading link in the table of contents", () => {
    const articleTitle = document.querySelector("#article-title");
    const heading1 = document.querySelector("#heading1");
    const heading2 = document.querySelector("#heading2");

    if (!articleTitle || !heading1 || !heading2) {
      throw new Error("Test elements not found");
    }

    // Mock getBoundingClientRect to control the distances
    articleTitle.getBoundingClientRect = vi.fn(() => ({
      ...getBoundingClientRectValues,
      top: 100,
    }));
    heading1.getBoundingClientRect = vi.fn(() => ({
      ...getBoundingClientRectValues,
      top: 200,
    }));
    heading2.getBoundingClientRect = vi.fn(() => ({
      ...getBoundingClientRectValues,
      top: 50,
    }));

    headingObserver();

    const tocLinks = document.querySelectorAll("#table-of-contents a");
    expect(tocLinks[0].classList.contains("!text-emerald-500")).toBe(false);
    expect(tocLinks[0].classList.contains("font-bold")).toBe(false);
    expect(tocLinks[1].classList.contains("!text-emerald-500")).toBe(true);
    expect(tocLinks[1].classList.contains("font-bold")).toBe(true);
  });

  it("Should return early if no article title found", () => {
    const articleTitle = document.querySelector("#article-title");
    articleTitle?.remove();

    expect(headingObserver()).toEqual(undefined);
  });
});
