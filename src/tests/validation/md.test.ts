import { describe, expect, it } from "vitest";
import { BracketLink, Frontmatter, Heading } from "@validation/md";

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

describe("Frontmatter", () => {
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

const exampleBracketLink = {
 title: "Christ's first miracle",
 link: "[[Christ's first miracle]]",
 excerpt: "This can be most clearly seen during Christ's first miracle at the wedding feast"
}

describe("bracketLink", () => {
  it("parses a valid bracket link", () => {
   expect(BracketLink.parse(exampleBracketLink)).toEqual(exampleBracketLink); 
  })
  it("parses a bracket link with an alias", () => {
    expect(BracketLink.parse({
      ...exampleBracketLink, 
      alias: "turning water into wine"
    })).toEqual({
      ...exampleBracketLink, 
      alias: "turning water into wine"
    }); 
  })
  it("throws on missing title", () => {
    expect(() => BracketLink.parse({
      ...exampleBracketLink,
      title: undefined
    })).toThrow()
  })
  it("throws on missing link", () => {
    expect(() => BracketLink.parse({
      ...exampleBracketLink,
      link: undefined
    })).toThrow()
  })
  it("throws on missing excerpt", () => {
    expect(() => BracketLink.parse({
      ...exampleBracketLink,
      excerpt: undefined
    })).toThrow()
  })
})

const exampleHeading = {
  id: "christlike-prayer",
  text: "Christlike Prayer",
  level: 2
}

describe("Heading", () => {
  it("parses a valid heading", () => {
    expect(Heading.parse(exampleHeading)).toEqual(exampleHeading)
  })
  it("throws on missing id", () => {
    expect(() => Heading.parse({
      ...exampleHeading,
      id: undefined
    })).toThrow()
  })
  it("throws on missing text", () => {
    expect(() => Heading.parse({
      ...exampleHeading,
      text: undefined
    })).toThrow()
  })
  it("throws on invalid heading level", () => {
    expect(() => Heading.parse({
      ...exampleHeading,
      level: 7
    })).toThrow()
  })
})
