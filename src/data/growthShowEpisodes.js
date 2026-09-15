import { flagshipArticleToolsVsSystem } from '@/data/flagshipArticles';

/**
 * Explicit public episodes that remain available before Base44 data migration.
 * A Base44 record with the same YouTube ID replaces the seed record.
 */
export const SEED_GROWTH_SHOW_EPISODES = [{
  "id": "seed-growth-show-PmXSEkj03ak",
  "title": "Your Business Comes First. Technology Comes Second.",
  "slug": "before-you-add-ai-understand-your-business",
  "summary": "Rick Hesse and Free AI Guy explore why discovery comes before technology, why people remain central to business systems, and how collaboration with AI supports human judgment.",
  "status": "Published",
  "featured": true,
  "youtube_video_id": "PmXSEkj03ak",
  "source_article_slug": "websites-as-salespeople",
  "publishing_article_id": "6a4bddd0f29cfc0dcba4d1ad",
  "playlist_slug": "nta-growth-show",
  "related_journal_issue_ids": [
    "issue-7-are-you-building-a-business-or-just-a-website",
    "6aa9466a35dc8d8f40d934ba"
  ],
  "related_book_slugs": [
    "better-business-book",
    "practical-ai-for-small-business"
  ],
  "cta_text": "Read the related lesson",
  "cta_url": "/websites-as-salespeople",
  "notes": "Rick approved this September 15, 2026 release and published Journal #7 in Core. Public episode and Journal records synchronized after the website copy remained in Review. Related subscriber campaign 9 is already sent; do not resend.",
  "episode_number": 7,
  "thumbnail_url": "https://i.ytimg.com/vi/PmXSEkj03ak/maxresdefault.jpg",
  "published_date": "2026-09-15"
}, {
  id: 'growth-show-episode-001',
  episode_number: 1,
  title: "They Sold Me the Tools. They Didn't Give Me a System.",
  slug: 'they-sold-me-the-tools-they-didnt-give-me-a-system',
  summary: 'Rick Hesse and the NTA Growth Guide explore why access to advertising and AI tools is not the same as having a connected business growth system.',
  status: 'Published',
  published_date: '2026-07-25',
  featured: true,
  youtube_video_id: 'bRuUdNZZzwQ',
  source_canon_id: flagshipArticleToolsVsSystem.id,
  source_article_slug: flagshipArticleToolsVsSystem.slug,
  playlist_slug: 'nta-growth-show',
  related_journal_issue_ids: ['seed-journal-issue-1'],
  related_book_slugs: ['better-business-book', 'practical-ai-for-small-business'],
  cta_text: 'Start a Growth Conversation',
  cta_url: '/growth-conversation',
}];

/**
 * The flagship article remains authoritative in flagshipArticles.js. This
 * adapter makes that source available to the relationship graph.
 */
export const GROWTH_SHOW_SOURCE_ARTICLES = [{
  ...flagshipArticleToolsVsSystem,
  canon_id: flagshipArticleToolsVsSystem.id,
  summary: flagshipArticleToolsVsSystem.primaryPrinciple,
  canonical_url: `/knowledge/articles/${flagshipArticleToolsVsSystem.slug}`,
  status: 'Published',
  related_lesson_ids: [],
}];

export const GROWTH_SHOW_TESTIMONIALS = {
  '6lhiYFHFsCQ': {
    label: 'A viewer’s response',
    quote: 'I like this one. Very useful, and I will put it into practice.',
    attribution: 'Pete Gardner',
    business: 'Cattleman’s Dining',
    location: 'Belmond, Iowa',
    context: 'Pete shared this after watching the Growth Show conversation about how AI can help a person direct more work without carrying every detail alone.',
  },
};
