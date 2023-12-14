import {parseHTML} from 'linkedom';
import type {Heading} from '../validation/md';

export const getHeadings = (source: string): Heading[] => {
  const headings: Heading[] = [];
  const {document} = parseHTML(source);
  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
    const id = heading.getAttribute('id');
    if (!id) {
      return;
    }
    headings.push({
      id,
      text: heading.textContent ?? '',
      level: parseInt(heading.tagName[1]),
    });
  });
  return headings;
};
