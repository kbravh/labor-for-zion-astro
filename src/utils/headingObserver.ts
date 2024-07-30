export const headingObserver = () => {
  const tocLinks = document.querySelectorAll('#table-of-contents a[href^="#"]');
  const articleTitle = document.querySelector('#article-title');
  const headings = document.querySelectorAll(
    '#article-body h2, #article-body h3, #article-body h4, #article-body h5, #article-body h6'
  );
  let closestHeading: Element | null = null;
  let closestHeadingDistance = Number.MAX_VALUE;

  if (!articleTitle) return;

  const titleBoundingRect = articleTitle?.getBoundingClientRect();

  const titleDistance = Math.abs(titleBoundingRect.top);
  if (titleDistance < closestHeadingDistance && titleDistance <= 300) {
    closestHeading = articleTitle;
    closestHeadingDistance = titleDistance;
  }

  headings.forEach(heading => {
    const boundingRect = heading.getBoundingClientRect();
    const distance = Math.abs(boundingRect.top);
    if (distance < closestHeadingDistance && boundingRect.top <= 300) {
      closestHeading = heading;
      closestHeadingDistance = distance;
    }
  });

  if (closestHeading) {
    tocLinks.forEach(link => {
      link.classList.remove('!text-emerald-500', 'font-bold');
      if (link.getAttribute('href') === `#${closestHeading?.id}`) {
        link.classList.add('!text-emerald-500', 'font-bold');
      }
    });
  }
};
