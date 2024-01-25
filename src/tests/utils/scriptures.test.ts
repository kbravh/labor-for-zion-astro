import {
  isScriptureReference,
  parseScriptureReference,
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
