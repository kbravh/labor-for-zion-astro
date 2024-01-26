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
  it('expands a single verse', () => {
    expect(
      expandScriptureReference({
        book: '2 Nephi',
        work: 'Book of Mormon',
        chapter: 25,
        verses: [26],
      })
    ).toStrictEqual([
      '26. And we talk of Christ, we rejoice in Christ, we preach of Christ, we prophesy of Christ, and we write according to our prophecies, that our children may know to what source they may look for a remission of their sins.',
    ]);
  });
  it('expands a verse range', () => {
    expect(
      expandScriptureReference({
        book: 'Alma',
        work: 'Book of Mormon',
        chapter: 7,
        verses: [11, 12, 13],
      })
    ).toStrictEqual([
      '11. And he shall go forth, suffering pains and afflictions and temptations of every kind; and this that the word might be fulfilled which saith he will take upon him the pains and the sicknesses of his people.',
      '12. And he will take upon him death, that he may loose the bands of death which bind his people; and he will take upon him their infirmities, that his bowels may be filled with mercy, according to the flesh, that he may know according to the flesh how to succor his people according to their infirmities.',
      '13. Now the Spirit knoweth all things; nevertheless the Son of God suffereth according to the flesh that he might take upon him the sins of his people, that he might blot out their transgressions according to the power of his deliverance; and now behold, this is the testimony which is in me.',
    ]);
  });
  it('expands multiple verse ranges', () => {
    expect(
      expandScriptureReference({
        book: 'Alma',
        work: 'Book of Mormon',
        chapter: 7,
        verses: [11, 12, 13, 15, 17, 18, 19],
      })
    ).toStrictEqual([
      '11. And he shall go forth, suffering pains and afflictions and temptations of every kind; and this that the word might be fulfilled which saith he will take upon him the pains and the sicknesses of his people.',
      '12. And he will take upon him death, that he may loose the bands of death which bind his people; and he will take upon him their infirmities, that his bowels may be filled with mercy, according to the flesh, that he may know according to the flesh how to succor his people according to their infirmities.',
      '13. Now the Spirit knoweth all things; nevertheless the Son of God suffereth according to the flesh that he might take upon him the sins of his people, that he might blot out their transgressions according to the power of his deliverance; and now behold, this is the testimony which is in me.',
      '15. Yea, I say unto you come and fear not, and lay aside every sin, which easily doth beset you, which doth bind you down to destruction, yea, come and go forth, and show unto your God that ye are willing to repent of your sins and enter into a covenant with him to keep his commandments, and witness it unto him this day by going into the waters of baptism.',
      '17. And now my beloved brethren, do you believe these things? Behold, I say unto you, yea, I know that ye believe them; and the way that I know that ye believe them is by the manifestation of the Spirit which is in me. And now because your faith is strong concerning that, yea, concerning the things which I have spoken, great is my joy.',
      '18. For as I said unto you from the beginning, that I had much desire that ye were not in the state of dilemma like your brethren, even so I have found that my desires have been gratified.',
      '19. For I perceive that ye are in the paths of righteousness; I perceive that ye are in the path which leads to the kingdom of God; yea, I perceive that ye are making his paths straight.',
    ]);
  });
});
