const notice = (e) => new Notice(e, 5e3); // 5 seconds
const log = (e) => console.log(e);

const works = ['Old Testament', 'New Testament', 'Book of Mormon', 'Doctrine and Covenants', 'Official Declarations', 'Pearl of Great Price'];

const books = {
  'Old Testament': [
    'Genesis',
    'Exodus',
    'Leviticus',
    'Numbers',
    'Deuteronomy',
    'Joshua',
    'Judges',
    'Ruth',
    '1 Samuel',
    '2 Samuel',
    '1 Kings',
    '2 Kings',
    '1 Chronicles',
    '2 Chronicles',
    'Ezra',
    'Nehemiah',
    'Esther',
    'Job',
    'Psalms',
    'Proverbs',
    'Ecclesiastes',
    'Song of Solomon',
    'Isaiah',
    'Jeremiah',
    'Lamentations',
    'Ezekiel',
    'Daniel',
    'Hosea',
    'Joel',
    'Amos',
    'Obadiah',
    'Jonah',
    'Micah',
    'Nahum',
    'Habakkuk',
    'Zephaniah',
    'Haggai',
    'Zechariah',
    'Malachi',
  ],
  'New Testament': [
    'Matthew',
    'Mark',
    'Luke',
    'John',
    'Acts',
    'Romans',
    '1 Corinthians',
    '2 Corinthians',
    'Galatians',
    'Ephesians',
    'Philippians',
    'Colossians',
    '1 Thessalonians',
    '2 Thessalonians',
    '1 Timothy',
    '2 Timothy',
    'Titus',
    'Philemon',
    'Hebrews',
    'James',
    '1 Peter',
    '2 Peter',
    '1 John',
    '2 John',
    '3 John',
    'Jude',
    'Revelation',
  ],
  'Book of Mormon': ['1 Nephi', '2 Nephi', 'Jacob', 'Enos', 'Jarom', 'Omni', 'Words of Mormon', 'Mosiah', 'Alma', 'Helaman', '3 Nephi', '4 Nephi', 'Mormon', 'Ether', 'Moroni'],
  // Doctrine and Covenants and Official Declarations are special cases, as they don't have books
  'Pearl of Great Price': ['Moses', 'Abraham', 'Joseph Smith—Matthew', 'Joseph Smith—History', 'Articles of Faith'],
};

function parseScriptureReference(input) {
  const reference = input.replace(/[\[\]]/g, ''); // Remove brackets
  const chapterAndVerses = reference.split('.'); // Split chapter and verses

  const chapter = parseInt(chapterAndVerses[0]);
  const verses = chapterAndVerses[1].split(','); // Split individual verses

  // Expand range
  const expandedVerses = verses.reduce((result, verse) => {
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
    chapter: chapter,
    verses: expandedVerses,
  };
}

module.exports = async (quickadd) => {
  const selectedWork = await quickadd.quickAddApi.suggester(works, works);
  const selectedBook = ['Doctrine and Covenants', 'Official Declarations'].includes(selectedWork) ? selectedWork : await quickadd.quickAddApi.suggester(books[selectedWork], books[selectedWork]);
  const selection = await quickadd.quickAddApi.inputPrompt('Chapters and verses', '5.2-6');
  const reference = parseScriptureReference(selection);

  let leadingTitle;
  switch (selectedWork) {
    case 'Doctrine and Covenants':
      leadingTitle = 'Doctrine and Covenants';
      break;
    case 'Official Declarations':
      leadingTitle = 'Official Declaration';
      break;
    default:
      leadingTitle = selectedBook;
      break;
  }

  // create new cluster
  quickadd.variables = {
    selection,
    filename: `${leadingTitle} ${selection}`,
    chapter: reference.chapter,
    verses: reference.verses
      .map(
        // ###### 27 ![[Ether 12.27#^verse]]
        (verse) => `###### ${verse} ![[${leadingTitle} ${reference.chapter}.${verse}#^verse]]`,
      )
      .join('\n\n'),
    book: selectedBook,
    work: selectedWork,
  };
};
