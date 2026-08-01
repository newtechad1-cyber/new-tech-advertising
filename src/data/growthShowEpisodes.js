import { flagshipArticleToolsVsSystem } from '@/data/flagshipArticles';

/**
 * Explicit public episodes that remain available before Base44 data migration.
 * A Base44 record with the same YouTube ID replaces the seed record.
 */
export const SEED_GROWTH_SHOW_EPISODES = [{
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
