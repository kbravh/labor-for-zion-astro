export const splitArray = <T>(groups: number, items: T[]): T[][] => {
  if (groups < 1) {
    throw new Error('Group must be 1 or greater');
  }
  const collection: T[][] = [];
  let counter = 0;

  // Split into sub-arrays using modulo and columns
  while (counter < groups) {
    const set = items.filter((_, i) => i % groups === counter);
    collection.push(set);
    counter++;
  }

  return collection;
};

export const dedupeArray = <T>(
  array: T[],
  keySelector: (item: T) => any
): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const key = keySelector(item);
    if (seen.has(key)) {
      return false;
    } else {
      seen.add(key);
      return true;
    }
  });
};
