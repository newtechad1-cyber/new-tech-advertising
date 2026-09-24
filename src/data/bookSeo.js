// Public facts for NTA's two free books. Keep identifiers and publication
// dates out until an official edition record supplies them.
export const BOOK_PAGES = [
  {
    path: '/better-business-book',
    title: 'The Better Business Building Book',
    description: 'A practical business guide from Rick Hesse about business foundations, customer trust, relationships, useful systems, and sustainable growth.',
    image: 'https://newtechadvertising.com/images/books/the-better-business-building-book.webp',
    companionPath: '/practical-ai-for-small-business',
    companionTitle: 'Practical AI for Small Business',
  },
  {
    path: '/practical-ai-for-small-business',
    title: 'Practical AI for Small Business',
    description: 'A plainspoken guide from Rick Hesse about using AI for real small-business work while preserving human judgment and customer trust.',
    image: 'https://media.base44.com/images/public/691f41a18de4a7f498c8f884/919f0b245_Practical_AI_for_Small_BusinessBookFrontCover.png',
    companionPath: '/better-business-book',
    companionTitle: 'The Better Business Building Book',
  },
];

export function getBookByPath(pathname) {
  return BOOK_PAGES.find(book => book.path === String(pathname || '').replace(/\/+$/, '')) || null;
}

export function bookSchemaFor(book) {
  if (!book) return null;
  const url = 'https://newtechadvertising.com' + book.path;
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': url + '#book',
    name: book.title,
    description: book.description,
    url,
    image: book.image,
    inLanguage: 'en',
    author: { '@type': 'Person', name: 'Rick Hesse', url: 'https://newtechadvertising.com/about' },
    publisher: { '@type': 'Organization', name: 'New Tech Advertising', url: 'https://newtechadvertising.com' },
  };
}
