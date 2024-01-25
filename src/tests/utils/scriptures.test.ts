import {isScriptureReference} from '../../utils/scriptures';
import {describe, expect, it} from 'vitest';

describe('isScriptureReference', () => {
  it('ignores regular title', () => {
    expect(isScriptureReference('And My Father Dwelt in a Tent')).toBeFalsy();
  });
  it('ignores title with numbers', () => {
    expect(isScriptureReference('The 4 Gospels')).toBeFalsy();
  });
  it('recognizes a single verse', () => {
    expect(isScriptureReference('Book of Mormon 25.26')).toBeTruthy();
  });
  it('recognizes a single verse with a colon', () => {
    expect(isScriptureReference('Book of Mormon 25:26')).toBeTruthy();
  });
  it('recognizes a verse range', () => {
    expect(isScriptureReference('Doctrine & Covenants 111.12-14')).toBeTruthy();
  });
  it('recognizes multiple verse ranges', () => {
    expect(isScriptureReference('Joseph Smith-History 1.2-4,7-9-12')).toBeTruthy();
  });
});
