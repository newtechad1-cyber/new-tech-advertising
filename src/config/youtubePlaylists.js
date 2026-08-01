/**
 * Stable playlist vocabulary for the NTA YouTube Learning System.
 *
 * `slug` is the permanent internal identity. `title` may be improved later
 * without breaking lesson/video relationships. `legacyTitles` preserves
 * compatibility with records created before playlist identities existed.
 */
export const YOUTUBE_PLAYLISTS = [
  { slug: 'nta-growth-show', title: 'The NTA Growth Show', collectionSlug: null, displayOrder: 1, legacyTitles: ['NTA Growth Show'] },
  { slug: 'start-here', title: 'Start Here', collectionSlug: 'start-here', displayOrder: 2, legacyTitles: [] },
  { slug: 'nta-journal', title: 'NTA Journal', collectionSlug: 'nta-journal', displayOrder: 3, legacyTitles: [] },
  { slug: 'nta-principles', title: 'NTA Principles', collectionSlug: 'nta-principles', displayOrder: 4, legacyTitles: ['Marketing Lessons'] },
  { slug: 'building-trust', title: 'Building Trust', collectionSlug: 'building-trust', displayOrder: 5, legacyTitles: [] },
  { slug: 'future-of-marketing', title: 'Future of Marketing', collectionSlug: 'future-of-marketing', displayOrder: 6, legacyTitles: ['AI Explained'] },
  { slug: 'building-better-businesses', title: 'Building Better Businesses', collectionSlug: 'building-better-businesses', displayOrder: 7, legacyTitles: ['Business Growth'] },
  { slug: 'website-strategy', title: 'Website Strategy', collectionSlug: 'building-better-businesses', displayOrder: 8, legacyTitles: [] },
  { slug: 'local-business', title: 'Local Business', collectionSlug: 'future-of-marketing', displayOrder: 9, legacyTitles: [] },
  { slug: 'services', title: 'Services', collectionSlug: null, displayOrder: 10, legacyTitles: [] },
  { slug: 'case-studies', title: 'Case Studies', collectionSlug: 'success-stories', displayOrder: 11, legacyTitles: [] },
];

export function getYouTubePlaylistBySlug(slug) {
  return YOUTUBE_PLAYLISTS.find(playlist => playlist.slug === slug) || null;
}

export function getYouTubePlaylistByTitle(title) {
  return YOUTUBE_PLAYLISTS.find(playlist =>
    playlist.title === title || playlist.legacyTitles.includes(title)
  ) || null;
}
