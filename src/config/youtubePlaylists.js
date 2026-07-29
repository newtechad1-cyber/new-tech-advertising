/**
 * Stable playlist vocabulary for the NTA YouTube Learning System.
 *
 * `slug` is the permanent internal identity. `title` may be improved later
 * without breaking lesson/video relationships. `legacyTitles` preserves
 * compatibility with records created before playlist identities existed.
 */
export const YOUTUBE_PLAYLISTS = [
  { slug: 'start-here', title: 'Start Here', collectionSlug: 'start-here', displayOrder: 1, legacyTitles: [] },
  { slug: 'nta-journal', title: 'NTA Journal', collectionSlug: 'nta-journal', displayOrder: 2, legacyTitles: [] },
  { slug: 'nta-principles', title: 'NTA Principles', collectionSlug: 'nta-principles', displayOrder: 3, legacyTitles: ['Marketing Lessons'] },
  { slug: 'building-trust', title: 'Building Trust', collectionSlug: 'building-trust', displayOrder: 4, legacyTitles: [] },
  { slug: 'future-of-marketing', title: 'Future of Marketing', collectionSlug: 'future-of-marketing', displayOrder: 5, legacyTitles: ['AI Explained'] },
  { slug: 'building-better-businesses', title: 'Building Better Businesses', collectionSlug: 'building-better-businesses', displayOrder: 6, legacyTitles: ['Business Growth'] },
  { slug: 'website-strategy', title: 'Website Strategy', collectionSlug: 'building-better-businesses', displayOrder: 7, legacyTitles: [] },
  { slug: 'local-business', title: 'Local Business', collectionSlug: 'future-of-marketing', displayOrder: 8, legacyTitles: [] },
  { slug: 'services', title: 'Services', collectionSlug: null, displayOrder: 9, legacyTitles: [] },
  { slug: 'case-studies', title: 'Case Studies', collectionSlug: 'success-stories', displayOrder: 10, legacyTitles: [] },
];

export function getYouTubePlaylistBySlug(slug) {
  return YOUTUBE_PLAYLISTS.find(playlist => playlist.slug === slug) || null;
}

export function getYouTubePlaylistByTitle(title) {
  return YOUTUBE_PLAYLISTS.find(playlist =>
    playlist.title === title || playlist.legacyTitles.includes(title)
  ) || null;
}

