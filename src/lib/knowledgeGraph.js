/**
 * R0.6.2 — Knowledge Graph Engine
 * Central intelligence layer for the Rick Hesse Knowledge System.
 *
 * All recommendations, related content, reader journeys, homepage sections,
 * publishing queues, and navigation derive from this engine.
 *
 * Rule 1: PublishingArticle is the single source of truth.
 * Rule 2: Everything is data-driven — no hardcoded collections or relationships.
 * Rule 3: The Knowledge Graph powers all content discovery.
 * Rule 4: Every asset is a first-class knowledge object with relationships.
 *
 * Usage:
 *   import { useKnowledgeGraph } from '@/lib/knowledgeGraph';
 *   const kg = useKnowledgeGraph();
 *   const related = kg.getRelatedContent(canonId);
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import {
  ALL_SEED_ASSETS, SEED_COLLECTIONS, SEED_YOUTUBE_VIDEOS,
  SEED_JOURNAL_ENTRIES,
} from '@/data/canonSeed';

// ─── Cache Layer ────────────────────────────────────────────────────────────
// Prevents redundant entity fetches within a session.
let _cache = { articles: null, collections: null, videos: null, journals: null, ts: 0 };
const CACHE_TTL = 60_000; // 1 minute

function isCacheFresh() {
  return _cache.ts && Date.now() - _cache.ts < CACHE_TTL;
}

export function invalidateCache() {
  _cache = { articles: null, collections: null, videos: null, journals: null, ts: 0 };
}

// ─── Seed Data Defaults ─────────────────────────────────────────────────────
// When entities are empty (migration not yet run), use canon seed data so
// the public Knowledge Library, Journal, and Collections are immediately usable.
function withSeedFallback(entities, seedData) {
  return (entities && entities.length > 0) ? entities : seedData;
}

// ─── Data Loader ────────────────────────────────────────────────────────────
async function loadAll() {
  if (isCacheFresh()) {
    return {
      articles: _cache.articles,
      collections: _cache.collections,
      videos: _cache.videos,
      journals: _cache.journals,
    };
  }

  const [articles, collections, videos, journals] = await Promise.all([
    base44.entities.PublishingArticle.list('-created_date', 500).catch(() => []),
    base44.entities.CanonCollection.list('display_order', 100).catch(() => []),
    base44.entities.YouTubeKnowledge.list('-created_date', 200).catch(() => []),
    base44.entities.JournalIssue.list('-date', 200).catch(() => []),
  ]);

  // Fallback to seed data when entities are empty (pre-migration state)
  const result = {
    articles: withSeedFallback(articles, ALL_SEED_ASSETS),
    collections: withSeedFallback(collections, SEED_COLLECTIONS),
    videos: withSeedFallback(videos, SEED_YOUTUBE_VIDEOS.map((v, i) => ({ id: `seed-vid-${i}`, ...v }))),
    journals: withSeedFallback(journals, SEED_JOURNAL_ENTRIES),
  };

  _cache = { ...result, ts: Date.now() };
  return result;
}

// ─── Index Builders ─────────────────────────────────────────────────────────
function buildIndexes(articles) {
  const byCanonId = {};
  const byAssetType = {};
  const byBuyerStage = {};
  const byCollection = {};
  const byTheme = {};

  for (const a of articles) {
    if (a.canon_id) byCanonId[a.canon_id] = a;

    const atype = a.asset_type || 'article';
    if (!byAssetType[atype]) byAssetType[atype] = [];
    byAssetType[atype].push(a);

    if (a.buyer_stage) {
      if (!byBuyerStage[a.buyer_stage]) byBuyerStage[a.buyer_stage] = [];
      byBuyerStage[a.buyer_stage].push(a);
    }

    for (const slug of (a.collection_slugs || [])) {
      if (!byCollection[slug]) byCollection[slug] = [];
      byCollection[slug].push(a);
    }

    if (a.primary_theme) {
      if (!byTheme[a.primary_theme]) byTheme[a.primary_theme] = [];
      byTheme[a.primary_theme].push(a);
    }
  }

  return { byCanonId, byAssetType, byBuyerStage, byCollection, byTheme };
}

// ─── Relationship Engine ────────────────────────────────────────────────────
function resolveRelated(article, byCanonId) {
  if (!article) return { reading: [], watching: [], learning: [], services: [], caseStudies: [], industries: [], geos: [], journal: [] };

  const reading = (article.related_articles || [])
    .map(id => byCanonId[id])
    .filter(Boolean);

  const watching = (article.related_video_ids || [])
    .map(vid => {
      // Find article with this video
      const match = Object.values(byCanonId).find(a => a.video_url?.includes(vid));
      return match || { title: `Video ${vid}`, video_url: `https://www.youtube.com/embed/${vid}`, canon_id: vid };
    });

  const learning = (article.related_lesson_ids || [])
    .map(id => byCanonId[id])
    .filter(Boolean);

  const services = (article.related_services || [])
    .map(slug => {
      const match = Object.values(byCanonId).find(a => a.slug === slug && a.asset_type === 'service_page');
      return match || { title: slug, slug, asset_type: 'service_page' };
    });

  const caseStudies = (article.related_case_study_ids || [])
    .map(id => byCanonId[id])
    .filter(Boolean);

  const industries = (article.related_industry_slugs || [])
    .map(slug => {
      const match = Object.values(byCanonId).find(a => a.slug === slug && a.asset_type === 'industry_page');
      return match || { title: slug, slug, asset_type: 'industry_page' };
    });

  const geos = (article.related_geo_slugs || [])
    .map(slug => {
      const match = Object.values(byCanonId).find(a => a.slug === slug && a.asset_type === 'geo_page');
      return match || { title: slug, slug, asset_type: 'geo_page' };
    });

  return { reading, watching, learning, services, caseStudies, industries, geos };
}

// ─── Health Metrics ─────────────────────────────────────────────────────────
function computeHealth(articles, collections, videos) {
  const published = articles.filter(a => a.status === 'Published');
  const withRelations = published.filter(a =>
    (a.related_articles?.length > 0) ||
    (a.related_video_ids?.length > 0) ||
    (a.related_case_study_ids?.length > 0) ||
    (a.related_services?.length > 0)
  );
  const withVideo = published.filter(a => a.has_video);
  const orphans = published.filter(a =>
    (!a.collection_slugs || a.collection_slugs.length === 0) &&
    (!a.related_articles || a.related_articles.length === 0)
  );
  const duplicates = published.filter(a => a.canonical_status === 'secondary' || a.canonical_status === 'redirect');
  const indexed = published.filter(a => a.index_status === 'indexed');
  const notIndexed = published.filter(a => a.index_status === 'not_indexed' || a.index_status === 'unknown');

  const avgEvergreen = published.length > 0
    ? Math.round(published.reduce((s, a) => s + (a.evergreen_score || 0), 0) / published.length * 10) / 10
    : 0;
  const avgAuthority = published.length > 0
    ? Math.round(published.reduce((s, a) => s + (a.authority_score || 0), 0) / published.length * 10) / 10
    : 0;
  const avgQuality = published.length > 0
    ? Math.round(published.reduce((s, a) => s + (a.content_quality_score || 0), 0) / published.length * 10) / 10
    : 0;

  const collectionHealth = collections.map(c => {
    const entryCount = (c.entry_canon_ids || []).length;
    return { slug: c.slug, title: c.title, entryCount, status: c.status };
  });

  return {
    totalAssets: published.length,
    withRelations: withRelations.length,
    relationCoverage: published.length > 0 ? Math.round(withRelations.length / published.length * 100) : 0,
    withVideo: withVideo.length,
    orphans: orphans.length,
    orphanList: orphans,
    duplicates: duplicates.length,
    duplicateList: duplicates,
    indexed: indexed.length,
    notIndexed: notIndexed.length,
    avgEvergreen,
    avgAuthority,
    avgQuality,
    collectionHealth,
    totalCollections: collections.length,
    totalVideos: videos.length,
    buyerStageDistribution: {
      Awareness: articles.filter(a => a.buyer_stage === 'Awareness').length,
      Consideration: articles.filter(a => a.buyer_stage === 'Consideration').length,
      Decision: articles.filter(a => a.buyer_stage === 'Decision').length,
    },
  };
}

// ─── Homepage Feed ──────────────────────────────────────────────────────────
function buildHomepageFeed(articles, collections, journals) {
  const published = articles.filter(a => a.status === 'Published');

  // Featured articles (for "Start Here" or hero)
  const featured = published
    .filter(a => a.featured)
    .sort((a, b) => (a.suggested_reading_order || 99) - (b.suggested_reading_order || 99))
    .slice(0, 5);

  // Latest journal entries
  const latestJournal = journals
    .filter(j => j.status === 'Published')
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 3);

  // Featured collections
  const featuredCollections = collections
    .filter(c => c.featured && c.status === 'Published')
    .sort((a, b) => (a.display_order || 99) - (b.display_order || 99))
    .slice(0, 4);

  // Popular articles (highest authority + quality scores)
  const popular = published
    .filter(a => a.asset_type === 'article' || a.asset_type === 'lesson')
    .sort((a, b) => ((b.authority_score || 0) + (b.content_quality_score || 0)) - ((a.authority_score || 0) + (a.content_quality_score || 0)))
    .slice(0, 6);

  // Featured video
  const featuredVideo = published
    .filter(a => a.has_video && a.featured)
    .sort((a, b) => (a.suggested_reading_order || 99) - (b.suggested_reading_order || 99))[0] || null;

  // Case studies
  const caseStudies = published
    .filter(a => a.asset_type === 'case_study')
    .slice(0, 3);

  // Latest build logs
  const buildLogs = published
    .filter(a => a.asset_type === 'build_log')
    .sort((a, b) => (b.published_date || '').localeCompare(a.published_date || ''))
    .slice(0, 3);

  return { featured, latestJournal, featuredCollections, popular, featuredVideo, caseStudies, buildLogs };
}

// ─── Canonical Resolution ───────────────────────────────────────────────────
function getDuplicateGroups(articles) {
  const groups = {};
  for (const a of articles) {
    if (a.canonical_status === 'secondary' || a.canonical_status === 'redirect') {
      const target = a.canonical_target || 'unresolved';
      if (!groups[target]) groups[target] = { canonical: null, secondaries: [] };
      groups[target].secondaries.push(a);
    }
    if (a.canonical_status === 'canonical') {
      if (!groups[a.canon_id]) groups[a.canon_id] = { canonical: null, secondaries: [] };
      groups[a.canon_id].canonical = a;
    }
  }
  return Object.values(groups).filter(g => g.secondaries.length > 0);
}

// ─── Theme Palette (for UI) ────────────────────────────────────────────────
export const THEME_COLORS = {
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    text: 'text-blue-400',    solid: 'bg-blue-600',    gradient: 'from-blue-600 to-blue-400' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', solid: 'bg-emerald-600', gradient: 'from-emerald-600 to-emerald-400' },
  purple:  { bg: 'bg-purple-500/10',  border: 'border-purple-500/20',  text: 'text-purple-400',  solid: 'bg-purple-600',  gradient: 'from-purple-600 to-purple-400' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   text: 'text-amber-400',   solid: 'bg-amber-600',   gradient: 'from-amber-600 to-amber-400' },
  rose:    { bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    text: 'text-rose-400',    solid: 'bg-rose-600',    gradient: 'from-rose-600 to-rose-400' },
  cyan:    { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20',    text: 'text-cyan-400',    solid: 'bg-cyan-600',    gradient: 'from-cyan-600 to-cyan-400' },
  orange:  { bg: 'bg-orange-500/10',  border: 'border-orange-500/20',  text: 'text-orange-400',  solid: 'bg-orange-600',  gradient: 'from-orange-600 to-orange-400' },
  indigo:  { bg: 'bg-indigo-500/10',  border: 'border-indigo-500/20',  text: 'text-indigo-400',  solid: 'bg-indigo-600',  gradient: 'from-indigo-600 to-indigo-400' },
  teal:    { bg: 'bg-teal-500/10',    border: 'border-teal-500/20',    text: 'text-teal-400',    solid: 'bg-teal-600',    gradient: 'from-teal-600 to-teal-400' },
  red:     { bg: 'bg-red-500/10',     border: 'border-red-500/20',     text: 'text-red-400',     solid: 'bg-red-600',     gradient: 'from-red-600 to-red-400' },
};

export const ASSET_TYPE_META = {
  article:       { icon: 'FileText',      label: 'Article',       plural: 'Articles' },
  lesson:        { icon: 'GraduationCap', label: 'Lesson',        plural: 'Lessons' },
  case_study:    { icon: 'BarChart3',     label: 'Case Study',    plural: 'Case Studies' },
  service_page:  { icon: 'Briefcase',     label: 'Service',       plural: 'Services' },
  industry_page: { icon: 'Building2',     label: 'Industry',      plural: 'Industries' },
  geo_page:      { icon: 'MapPin',        label: 'Geo Page',      plural: 'Geo Pages' },
  video:         { icon: 'PlayCircle',    label: 'Video',         plural: 'Videos' },
  journal_entry: { icon: 'BookOpen',      label: 'Journal',       plural: 'Journal Entries' },
  build_log:     { icon: 'Hammer',        label: 'Build Log',     plural: 'Build Logs' },
};

export const BUYER_STAGE_COLORS = {
  Awareness:     { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20' },
  Consideration: { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20' },
  Decision:      { bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20' },
};

// ─── React Hook ─────────────────────────────────────────────────────────────
export function useKnowledgeGraph() {
  const [data, setData] = useState({ articles: [], collections: [], videos: [], journals: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      invalidateCache();
      const result = await loadAll();
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Knowledge Graph load failed:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll()
      .then(result => { setData(result); setError(null); })
      .catch(err => { console.error('Knowledge Graph load failed:', err); setError(err); })
      .finally(() => setLoading(false));
  }, []);

  const indexes = useMemo(() => buildIndexes(data.articles), [data.articles]);

  const api = useMemo(() => ({
    // Data
    articles: data.articles,
    collections: data.collections,
    videos: data.videos,
    journals: data.journals,
    loading,
    error,
    refresh,

    // Lookups
    getByCanonId: (id) => indexes.byCanonId[id] || null,
    getByAssetType: (type) => indexes.byAssetType[type] || [],
    getByBuyerStage: (stage) => indexes.byBuyerStage[stage] || [],
    getByCollection: (slug) => indexes.byCollection[slug] || [],
    getByTheme: (theme) => indexes.byTheme[theme] || [],

    // Published filter
    getPublished: () => data.articles.filter(a => a.status === 'Published'),
    getPublishedByType: (type) => (indexes.byAssetType[type] || []).filter(a => a.status === 'Published'),

    // Relationships
    getRelatedContent: (canonId) => resolveRelated(indexes.byCanonId[canonId], indexes.byCanonId),

    // Collections with resolved entries
    getCollectionWithEntries: (slug) => {
      const col = data.collections.find(c => c.slug === slug);
      if (!col) return null;
      const entries = (col.entry_canon_ids || [])
        .map(id => indexes.byCanonId[id])
        .filter(Boolean);
      return { ...col, entries };
    },

    // All collections with entry counts
    getCollectionsWithCounts: () => data.collections.map(c => ({
      ...c,
      resolvedEntryCount: (c.entry_canon_ids || []).filter(id => indexes.byCanonId[id]).length,
    })),

    // Homepage feed
    getHomepageFeed: () => buildHomepageFeed(data.articles, data.collections, data.journals),

    // Health
    getHealth: () => computeHealth(data.articles, data.collections, data.videos),

    // Canonical management
    getDuplicateGroups: () => getDuplicateGroups(data.articles),

    // Search
    search: (query) => {
      if (!query || !query.trim()) return data.articles.filter(a => a.status === 'Published');
      const q = query.toLowerCase();
      return data.articles.filter(a => {
        if (a.status !== 'Published') return false;
        return (
          (a.title || '').toLowerCase().includes(q) ||
          (a.subtitle || '').toLowerCase().includes(q) ||
          (a.summary || '').toLowerCase().includes(q) ||
          (a.search_keywords || '').toLowerCase().includes(q) ||
          (a.primary_theme || '').toLowerCase().includes(q) ||
          (a.canon_id || '').toLowerCase().includes(q) ||
          (a.tags || []).some(t => t.toLowerCase().includes(q))
        );
      });
    },

    // Reader journey — get next/prev in a collection
    getJourneyPosition: (canonId, collectionSlug) => {
      const col = data.collections.find(c => c.slug === collectionSlug);
      if (!col) return null;
      const ids = col.entry_canon_ids || [];
      const idx = ids.indexOf(canonId);
      if (idx === -1) return null;
      return {
        current: idx + 1,
        total: ids.length,
        prev: idx > 0 ? indexes.byCanonId[ids[idx - 1]] : null,
        next: idx < ids.length - 1 ? indexes.byCanonId[ids[idx + 1]] : null,
        progress: Math.round(((idx + 1) / ids.length) * 100),
      };
    },

    // Internal linking suggestions — assets that SHOULD link to each other but don't yet
    getInternalLinkSuggestions: () => {
      const suggestions = [];
      const published = data.articles.filter(a => a.status === 'Published' && a.canon_id);

      for (const a of published) {
        // Find assets with shared themes but no explicit relationship
        const sameTheme = (indexes.byTheme[a.primary_theme] || [])
          .filter(b => b.canon_id !== a.canon_id && b.status === 'Published');

        for (const b of sameTheme) {
          const aLinks = a.related_articles || [];
          const bLinks = b.related_articles || [];
          if (!aLinks.includes(b.canon_id) && !bLinks.includes(a.canon_id)) {
            suggestions.push({
              from: a,
              to: b,
              reason: `Shared theme: ${a.primary_theme}`,
            });
          }
        }
      }

      // Deduplicate (A→B and B→A)
      const seen = new Set();
      return suggestions.filter(s => {
        const key = [s.from.canon_id, s.to.canon_id].sort().join('|');
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    },
  }), [data, indexes, loading, error, refresh]);

  return api;
}

// ─── Standalone Helpers (no React) ──────────────────────────────────────────
export async function fetchKnowledgeGraphData() {
  return loadAll();
}

export { buildIndexes, resolveRelated, computeHealth, buildHomepageFeed, getDuplicateGroups };
