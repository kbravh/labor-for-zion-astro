import { describe, expect, it } from "vitest";
import { Frontmatter } from "@validation/md";

const example = {
  title: "Be Humble as Christ Was",
  description: "Learn how to develop Christlike humility through scriptural examples and the power of prayer.",
  date: "2024-06-18T10:50:10.508803600-04:00",
  updated: undefined,
  language: "en",
  tags: ["Humility", "Prayer"],
  translations: {
    es: "ser-humilde-como-cristo-lo-fue"
  }
}

describe("frontmatter", () => {
  it("parses valid frontmatter", () => {
    expect(Frontmatter.parse(example)).toEqual({
      ...example,
      date: new Date(example.date)
    });
  })
  it("parses frontmatter with valid updated", () => {
    expect(Frontmatter.parse({
      ...example,
      updated: "2024-06-19T10:50:10.508803600-04:00",
    })).toEqual({
      ...example,
      date: new Date(example.date),
      updated: new Date("2024-06-19T10:50:10.508803600-04:00"),
    });
  })
  it("throws if title is missing", () => {
    expect(() => Frontmatter.parse({
      ...example, title: undefined
    })).toThrow();
  })
  it("throws if description is missing", () => {
    expect(() => Frontmatter.parse({
      ...example, description: undefined
    })).toThrow();
  })
  it("throws if date is missing", () => {
    expect(() => Frontmatter.parse({
      ...example, date: undefined
    })).toThrow();
  })
  it("throws if language is not supported", () => {
    expect(() => Frontmatter.parse({
      ...example, language: "fr"
    })).toThrow();
  })
  it("throws if date is invalid", () => {
    expect(() => Frontmatter.parse({
      ...example, date: "not a date"
    })).toThrow();
  })
  it("throws if updated is invalid", () => {
    expect(() => Frontmatter.parse({
      ...example, updated: "not a date"
    })).toThrow();
  })
})
