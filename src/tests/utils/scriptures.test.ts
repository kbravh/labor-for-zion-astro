import {isScriptureReference} from '../../utils/scriptures';

describe('isScriptureReference', () => {
  it('ignores regular title', () => {
    expect(isScriptureReference('And My Father Dwelt in a Tent')).toBeFalsy();
  });
  it('ignores title with numbers', () => {
    expect(isScriptureReference('And My Father Dwelt in a Tent')).toBeFalsy();
  });
  it('recognizes a single verse', () => {
    expect(isScriptureReference('And My Father Dwelt in a Tent')).toBeTruthy();
  });
  it('recognizes a verse range', () => {
    expect(isScriptureReference('And My Father Dwelt in a Tent')).toBeTruthy();
  });
  it('recognizes multiple verse ranges', () => {
    expect(isScriptureReference('And My Father Dwelt in a Tent')).toBeTruthy();
  });
});
