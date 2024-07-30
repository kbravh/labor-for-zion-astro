import {
  expandScriptureReference,
  isScriptureReference,
  parseScriptureReference,
  processScriptureReference,
  type RawScriptureReference,
  type ScriptureReference,
} from '../../utils/scriptures';
import {describe, expect, it} from 'vitest';

describe.concurrent('isScriptureReference', () => {
  it('ignores regular title', () => {
    expect(isScriptureReference('And My Father Dwelt in a Tent')).toBeFalsy();
  });
  it('ignores title with numbers', () => {
    expect(isScriptureReference('The 4 Gospels')).toBeFalsy();
  });
  it('recognizes a single verse', () => {
    expect(isScriptureReference('2 Nephi 25.26')).toBeTruthy();
  });
  it('recognizes a single verse with a colon', () => {
    expect(isScriptureReference('2 Nephi 25:26')).toBeTruthy();
  });
  it('recognizes a verse range', () => {
    expect(isScriptureReference('Doctrine & Covenants 111.12-14')).toBeTruthy();
  });
  it('recognizes multiple verse ranges', () => {
    expect(
      isScriptureReference('Joseph Smith-History 1.2-4,7-9-12')
    ).toBeTruthy();
  });
});

describe('parseScriptureReference', () => {
  it('parses an empty reference', () => {
    expect(parseScriptureReference('')).toStrictEqual({
      book: undefined,
      chapter: undefined,
      verses: undefined,
    });
  });
  it('parses single verse', () => {
    expect(
      parseScriptureReference('2 Nephi 25.26')
    ).toStrictEqual<RawScriptureReference>({
      book: '2 Nephi',
      chapter: '25',
      verses: '26',
    });
  });
  it('parses verse range', () => {
    expect(
      parseScriptureReference('Alma 7.11-13')
    ).toStrictEqual<RawScriptureReference>({
      book: 'Alma',
      chapter: '7',
      verses: '11-13',
    });
  });
  it('parses multiple verse ranges', () => {
    expect(
      parseScriptureReference('Alma 7.11-13,15,17-19')
    ).toStrictEqual<RawScriptureReference>({
      book: 'Alma',
      chapter: '7',
      verses: '11-13,15,17-19',
    });
  });
});

describe('processScriptureReference', () => {
  it('returns early for a nonexistent book', () => {
    expect(
      processScriptureReference({
        book: 'Enoch',
        chapter: '3',
        verses: '2',
      })
    ).toStrictEqual(null);
  });
  it('processes a single verse', () => {
    expect(
      processScriptureReference({
        book: '2 Nephi',
        chapter: '25',
        verses: '26',
      })
    ).toStrictEqual<ScriptureReference>({
      book: '2 Nephi',
      work: 'Book of Mormon',
      chapter: 25,
      verses: [26],
    });
  });
  it('processes a verse range', () => {
    expect(
      processScriptureReference({
        book: 'Alma',
        chapter: '7',
        verses: '11-13',
      })
    ).toStrictEqual<ScriptureReference>({
      book: 'Alma',
      work: 'Book of Mormon',
      chapter: 7,
      verses: [11, 12, 13],
    });
  });
  it('processes multiple verse ranges', () => {
    expect(
      processScriptureReference({
        book: 'Alma',
        chapter: '7',
        verses: '11-13,15,17-19',
      })
    ).toStrictEqual<ScriptureReference>({
      book: 'Alma',
      work: 'Book of Mormon',
      chapter: 7,
      verses: [11, 12, 13, 15, 17, 18, 19],
    });
  });
});

describe('expandScriptureReference', () => {
  it('returns early from a non-existent work', () => {
    expect(
      expandScriptureReference({
        book: 'Enoch',
        chapter: 3,
        verses: [2],
        work: 'Apocrypha',
      })
    ).toStrictEqual([]);
  });
  describe('Old Testament', () => {
    it('expands a single verse', () => {
      expect(
        expandScriptureReference({
          book: 'Ruth',
          work: 'Old Testament',
          chapter: 3,
          verses: [5],
        })
      ).toMatchSnapshot();
    });
    it('expands a verse range', () => {
      expect(
        expandScriptureReference({
          book: 'Genesis',
          work: 'Old Testament',
          chapter: 1,
          verses: [1, 2, 3],
        })
      ).toMatchSnapshot();
    });
    it('expands multiple verse ranges', () => {
      expect(
        expandScriptureReference({
          book: 'Job',
          work: 'Old Testament',
          chapter: 3,
          verses: [2, 11, 12, 20, 21],
        })
      ).toMatchSnapshot()
    });
  });
  describe('New Testament', () => {
    it('expands a single verse', () => {
      expect(
        expandScriptureReference({
          book: 'Acts',
          work: 'New Testament',
          chapter: 6,
          verses: [4],
        })
      ).toMatchSnapshot()
    });
    it('expands a verse range', () => {
      expect(
        expandScriptureReference({
          book: 'Galatians',
          work: 'New Testament',
          chapter: 4,
          verses: [28, 29],
        })
      ).toMatchSnapshot()
    });
    it('expands multiple verse ranges', () => {
      expect(
        expandScriptureReference({
          book: 'Revelation',
          work: 'New Testament',
          chapter: 11,
          verses: [1, 3, 4, 7, 8],
        })
      ).toMatchSnapshot()
    });
  });
  describe('Book of Mormon', () => {
    it('expands a single verse', () => {
      expect(
        expandScriptureReference({
          book: '2 Nephi',
          work: 'Book of Mormon',
          chapter: 25,
          verses: [26],
        })
      ).toMatchSnapshot()
    });
    it('expands a verse range', () => {
      expect(
        expandScriptureReference({
          book: 'Alma',
          work: 'Book of Mormon',
          chapter: 7,
          verses: [11, 12, 13],
        })
      ).toMatchSnapshot()
    });
    it('expands multiple verse ranges', () => {
      expect(
        expandScriptureReference({
          book: 'Alma',
          work: 'Book of Mormon',
          chapter: 7,
          verses: [11, 12, 13, 15, 17, 18, 19],
        })
      ).toMatchSnapshot()
    });
  });
  describe('Doctrine and Covenants', () => {
    it('expands a single verse', () => {
      expect(
        expandScriptureReference({
          book: 'Doctrine and Covenants',
          work: 'Doctrine and Covenants',
          chapter: 4,
          verses: [1],
        })
      ).toMatchSnapshot()
    });
    it('expands a verse range', () => {
      expect(
        expandScriptureReference({
          book: 'Doctrine and Covenants',
          work: 'Doctrine and Covenants',
          chapter: 18,
          verses: [2, 3, 4],
        })
      ).toMatchSnapshot()
    });
    it('expands multiple verse ranges', () => {
      expect(
        expandScriptureReference({
          book: 'Doctrine and Covenants',
          work: 'Doctrine and Covenants',
          chapter: 88,
          verses: [4, 8, 9, 10, 15, 16],
        })
      ).toMatchSnapshot()
    });
  });
  describe('Pearl of Great Price', () => {
    it('expands a single verse', () => {
      expect(
        expandScriptureReference({
          book: 'Moses',
          work: 'Pearl of Great Price',
          chapter: 1,
          verses: [1],
        })
      ).toMatchSnapshot()
    });
    it('expands a verse range', () => {
      expect(
        expandScriptureReference({
          book: 'Moses',
          work: 'Pearl of Great Price',
          chapter: 1,
          verses: [10, 11],
        })
      ).toMatchSnapshot()
    });
    it('expands multiple verse ranges', () => {
      expect(
        expandScriptureReference({
          book: 'Abraham',
          work: 'Pearl of Great Price',
          chapter: 3,
          verses: [1, 7, 8, 10, 11],
        })
      ).toMatchSnapshot()
    });
  });
});
