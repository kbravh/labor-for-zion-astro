import { getHeadings } from "@utils/htmlUtils";
import { Heading } from "@validation/md";
import { describe, it, expect } from "vitest";

describe("HTML Utilities", () => {
  describe("getHeadings", () => {
    it("parses headings correctly", () => {
      const html = `
      <div>
        <h1 id="title">Title</h1>
        <h2>No ID</h2>
        <h2 id="2">Level 2</h2>
        <h3 id="3">Level 3</h3>
        <h4 id="4">Level 4</h4>
        <h5 id="5">Level 5</h5>
        <h6 id="6">Level 6</h6>
      </div>
      `;
      expect(getHeadings(html)).toMatchInlineSnapshot(`
        [
          {
            "id": "title",
            "level": 1,
            "text": "Title",
          },
          {
            "id": "2",
            "level": 2,
            "text": "Level 2",
          },
          {
            "id": "3",
            "level": 3,
            "text": "Level 3",
          },
          {
            "id": "4",
            "level": 4,
            "text": "Level 4",
          },
          {
            "id": "5",
            "level": 5,
            "text": "Level 5",
          },
          {
            "id": "6",
            "level": 6,
            "text": "Level 6",
          },
        ]
      `);
    });
  });
});
