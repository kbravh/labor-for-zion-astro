import OldTestament from '../data/Old Testament.json';
import NewTestament from '../data/New Testament.json';
import BookOfMormon from '../data/Book of Mormon.json';
import DoctrineAndCovenants from '../data/Doctrine and Covenants.json';
import PearlOfGreatPrice from '../data/Pearl of Great Price.json';

enum works {
  'Old Testament' = 'Old Testament',
  'New Testament' = 'New Testament',
  'Book of Mormon' = 'Book of Mormon',
  'Doctrine and Covenants' = 'Doctrine and Covenants',
  'Official Declarations' = 'Official Declarations',
  'Pearl of Great Price' = 'Pearl of Great Price',
}

type Work = keyof typeof works;


type Verse = {
  number: number;
  text: string;
};

type Chapter = {
  number: number;
  summary: string;
  verses: Verse[];
};

type Book = {
  name: string;
  chapters: Chapter[];
};

type Scripture = {
  name: string;
  link: string;
  books: Book[];
};

const books: Record<string, Work> = {
  Genesis: 'Old Testament',
  Exodus: 'Old Testament',
  Leviticus: 'Old Testament',
  Numbers: 'Old Testament',
  Deuteronomy: 'Old Testament',
  Joshua: 'Old Testament',
  Judges: 'Old Testament',
  Ruth: 'Old Testament',
  '1 Samuel': 'Old Testament',
  '2 Samuel': 'Old Testament',
  '1 Kings': 'Old Testament',
  '2 Kings': 'Old Testament',
  '1 Chronicles': 'Old Testament',
  '2 Chronicles': 'Old Testament',
  Ezra: 'Old Testament',
  Nehemiah: 'Old Testament',
  Esther: 'Old Testament',
  Job: 'Old Testament',
  Psalms: 'Old Testament',
  Psalm: 'Old Testament',
  Proverbs: 'Old Testament',
  Ecclesiastes: 'Old Testament',
  'Song of Solomon': 'Old Testament',
  Isaiah: 'Old Testament',
  Jeremiah: 'Old Testament',
  Lamentations: 'Old Testament',
  Ezekiel: 'Old Testament',
  Daniel: 'Old Testament',
  Hosea: 'Old Testament',
  Joel: 'Old Testament',
  Amos: 'Old Testament',
  Obadiah: 'Old Testament',
  Jonah: 'Old Testament',
  Micah: 'Old Testament',
  Nahum: 'Old Testament',
  Habakkuk: 'Old Testament',
  Zephaniah: 'Old Testament',
  Haggai: 'Old Testament',
  Zechariah: 'Old Testament',
  Malachi: 'Old Testament',
  Matthew: 'New Testament',
  Mark: 'New Testament',
  Luke: 'New Testament',
  John: 'New Testament',
  Acts: 'New Testament',
  Romans: 'New Testament',
  '1 Corinthians': 'New Testament',
  '2 Corinthians': 'New Testament',
  Galatians: 'New Testament',
  Ephesians: 'New Testament',
  Philippians: 'New Testament',
  Colossians: 'New Testament',
  '1 Thessalonians': 'New Testament',
  '2 Thessalonians': 'New Testament',
  '1 Timothy': 'New Testament',
  '2 Timothy': 'New Testament',
  Titus: 'New Testament',
  Philemon: 'New Testament',
  Hebrews: 'New Testament',
  James: 'New Testament',
  '1 Peter': 'New Testament',
  '2 Peter': 'New Testament',
  '1 John': 'New Testament',
  '2 John': 'New Testament',
  '3 John': 'New Testament',
  Jude: 'New Testament',
  Revelation: 'New Testament',
  '1 Nephi': 'Book of Mormon',
  '2 Nephi': 'Book of Mormon',
  Jacob: 'Book of Mormon',
  Enos: 'Book of Mormon',
  Jarom: 'Book of Mormon',
  Omni: 'Book of Mormon',
  'Words of Mormon': 'Book of Mormon',
  Mosiah: 'Book of Mormon',
  Alma: 'Book of Mormon',
  Helaman: 'Book of Mormon',
  '3 Nephi': 'Book of Mormon',
  '4 Nephi': 'Book of Mormon',
  Mormon: 'Book of Mormon',
  Ether: 'Book of Mormon',
  Moroni: 'Book of Mormon',
  Moses: 'Pearl of Great Price',
  Abraham: 'Pearl of Great Price',
  'Joseph Smith—Matthew': 'Pearl of Great Price',
  'Joseph Smith—History': 'Pearl of Great Price',
  'Articles of Faith': 'Pearl of Great Price',
  'Doctrine and Covenants': 'Doctrine and Covenants',
  'Official Declaration': 'Official Declarations',
} as const;

const SCRIPTURE_REGEX =
  /(?<book>[\w\s]+)\s(?<chapter>\d{1,3})[.:](?<verses>[\d,\-]+)/;
export const isScriptureReference = (title: string): boolean =>
  SCRIPTURE_REGEX.test(title);

export type RawScriptureReference = {
  book: string;
  chapter: string;
  verses: string;
};
export const parseScriptureReference = (
  title: string
): RawScriptureReference => {
  const matches = title.match(SCRIPTURE_REGEX);
  const {book, chapter, verses} = matches?.groups || {};
  return {
    book,
    chapter,
    verses,
  };
};

export type ScriptureReference = {
  work: string;
  book: string;
  chapter: number;
  verses: number[];
};

export const processScriptureReference = (
  reference: RawScriptureReference
): ScriptureReference | null => {
  const {book} = reference;
  const work = books[book];
  if (!work) {
    return null;
  }
  const chapter = parseInt(reference.chapter);
  const verses = reference.verses.split(',');

  const expandedVerses = verses.reduce((result: number[], verse) => {
    if (verse.includes('-')) {
      const [start, end] = verse.split('-').map(Number); // Convert to numbers

      for (let i = start; i <= end; i++) {
        result.push(i);
      }
    } else {
      result.push(Number(verse));
    }

    return result;
  }, []);

  return {
    book,
    work,
    chapter,
    verses: expandedVerses,
  };
};

export const expandScriptureReference = (
  reference: ScriptureReference
): string[] => {
  let work: Scripture | null;

  switch (reference.work) {
    case works['Old Testament']:
      work = OldTestament as Scripture;
      break;
    case works['New Testament']:
      work = NewTestament as Scripture;
      break;
    case works['Book of Mormon']:
      work = BookOfMormon as Scripture;
      break;
    case works['Doctrine and Covenants']:
      work = DoctrineAndCovenants as Scripture;
      break;
    case works['Pearl of Great Price']:
      work = PearlOfGreatPrice as Scripture;
      break;
    default:
      work = null;
  }

  if (!work) {
    return [];
  }

  const book = work.books.find(book => book.name === reference.book);
  return reference.verses.flatMap(verse => {
    const text = book?.chapters[reference.chapter - 1].verses[verse - 1].text;
    return !!text ? [`${verse}. ${text}`] : [];
  });
};
