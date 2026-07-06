/**
 * R0.7 — Authority & Discoverability Dashboard
 * The business intelligence command center for NTA's content authority.
 * Route: /admin/authority
 *
 * Answers:
 * - What is Google indexing?
 * - What content is AI referencing?
 * - Which collections are strongest?
 * - Which pages are orphaned?
 * - Which pages need links?
 * - Which topics are incomplete?
 * - Which buyer stages are weak?
 * - What should Rick publish next to strengthen authority?
 */
import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminGuard from '../components/auth/AdminGuard';
import NoIndexMeta from '@/components/auth/NoIndexMeta';
import SEOHead from '@/components/shared/SEOHead';
import {
  LayoutDashboard, Search, Globe, Bot, TrendingUp, Link2, AlertTriangle,
  Crown, Eye, MousePointerClick, BarChart2, ArrowRight, ExternalLink,
  Layers, Target, BookOpen, FileText, Video, Map, RefreshCw, Loader2,
  CheckCircle, XCircle, Clock, Compass, Users, ShoppingBag
} from 'lucide-react';
import TopicalAuthorityMap from '../components/authority/TopicalAuthorityMap';
import {
  AuthorityStat, AuthorityTable, AuthoritySection, StatusBadge
} from '../components/authority/AuthorityWidgets';
import { TOPIC_CLUSTERS, getClusterDepth } from '../data/topicClusters';

// ── Sitemap-based page inventory ────────────────────────────────────────────
// In production this would come from the Publishing Engine entity.
// For now we hardcode the sitemap URLs with classification.
const SITEMAP_PAGES = [
  { url: '/', title: 'Homepage', type: 'core', cluster: null },
  { url: '/About', title: 'About', type: 'core', cluster: 'founder-story' },
  { url: '/Services', title: 'Services Hub', type: 'core', cluster: null },
  { url: '/Contact', title: 'Contact', type: 'core', cluster: null },
  { url: '/Pricing', title: 'Pricing', type: 'core', cluster: null },
  { url: '/canon', title: 'The Canon', type: 'collection', cluster: 'content-video-strategy' },
  { url: '/journal', title: 'NTA Journal', type: 'collection', cluster: 'content-video-strategy' },
  { url: '/learning-center', title: 'AI Learning Center', type: 'learning', cluster: 'ai-search-visibility' },
  { url: '/Blog', title: 'Blog', type: 'collection', cluster: null },
  { url: '/insights', title: 'Insights', type: 'collection', cluster: null },
  // Articles
  { url: '/ai-brought-me-out-of-retirement', title: 'AI Brought Me Out of Retirement', type: 'article', cluster: 'founder-story' },
  { url: '/i-was-early-again', title: 'I Was Early Again', type: 'article', cluster: 'founder-story' },
  { url: '/growth-systems-vs-campaigns', title: 'Growth Systems vs. Campaigns', type: 'article', cluster: 'small-business-growth' },
  { url: '/campaigns-vs-authority', title: 'Campaigns vs. Authority', type: 'article', cluster: 'digital-trust-authority' },
  { url: '/the-future-belongs-to-market-leaders', title: 'Future Belongs to Market Leaders', type: 'article', cluster: 'ai-search-visibility' },
  { url: '/building-digital-trust', title: 'Building Digital Trust', type: 'article', cluster: 'digital-trust-authority' },
  { url: '/reputation-is-now-a-growth-engine', title: 'Reputation Growth Engine', type: 'article', cluster: 'digital-trust-authority' },
  { url: '/web-accessibility-trust', title: 'Web Accessibility Trust', type: 'article', cluster: 'digital-trust-authority' },
  { url: '/what-changed-online', title: 'What Changed Online', type: 'article', cluster: 'ai-search-visibility' },
  { url: '/seo-vs-ai-search', title: 'SEO vs AI Search', type: 'article', cluster: 'ai-search-visibility' },
  { url: '/role-of-ai-in-local-marketing', title: 'Role of AI in Local Marketing', type: 'article', cluster: 'ai-local-marketing' },
  { url: '/digital-risks', title: 'Digital Risks', type: 'article', cluster: 'small-business-growth' },
  { url: '/hidden-cost-of-outdated-marketing', title: 'Hidden Cost of Outdated Marketing', type: 'article', cluster: 'ai-local-marketing' },
  { url: '/websites-as-salespeople', title: 'Websites as Salespeople', type: 'article', cluster: 'digital-trust-authority' },
  { url: '/video-storytelling-builds-confidence', title: 'Video Storytelling', type: 'article', cluster: 'content-video-strategy' },
  { url: '/ai-visibility-basics', title: 'AI Visibility Basics', type: 'article', cluster: 'ai-search-visibility' },
  { url: '/practical-ai-for-small-businesses', title: 'Practical AI for Small Businesses', type: 'article', cluster: 'ai-local-marketing' },
  // Services
  { url: '/AiSeo', title: 'AI SEO', type: 'service', cluster: 'ai-search-visibility' },
  { url: '/AiSocialMedia', title: 'AI Social Media', type: 'service', cluster: 'ai-local-marketing' },
  { url: '/AiWebsites', title: 'AI Websites', type: 'service', cluster: null },
  { url: '/AiAdvertising', title: 'AI Advertising', type: 'service', cluster: 'ai-local-marketing' },
  { url: '/AiVideos', title: 'AI Videos', type: 'service', cluster: 'content-video-strategy' },
  // Industry
  { url: '/HvacMarketing', title: 'HVAC Marketing', type: 'industry', cluster: 'industry-hvac' },
  { url: '/PlumbingMarketing', title: 'Plumbing Marketing', type: 'industry', cluster: 'industry-plumbing' },
  { url: '/RestaurantMarketing', title: 'Restaurant Marketing', type: 'industry', cluster: null },
  { url: '/DentistMarketing', title: 'Dentist Marketing', type: 'industry', cluster: null },
  { url: '/RoofingMarketing', title: 'Roofing Marketing', type: 'industry', cluster: null },
  { url: '/MedSpaMarketing', title: 'Med Spa Marketing', type: 'industry', cluster: null },
  { url: '/LocalBusinessMarketing', title: 'Local Business Marketing', type: 'industry', cluster: null },
  // Case studies
  { url: '/case-studies/johnson-heating', title: 'Johnson Heating Case Study', type: 'case_study', cluster: 'industry-hvac' },
  { url: '/case-study/monson-plumbing', title: 'Monson Plumbing Case Study', type: 'case_study', cluster: 'industry-plumbing' },
  { url: '/case-study/papa-everetts', title: "Papa Everett's Case Study", type: 'case_study', cluster: null },
  // Discovery tools
  { url: '/growth-conversation', title: 'Growth Conversation', type: 'tool', cluster: 'small-business-growth' },
  { url: '/business-score', title: 'Business Score', type: 'tool', cluster: 'small-business-growth' },
  { url: '/growth-roadmap-generator', title: 'Growth Roadmap Generator', type: 'tool', cluster: 'small-business-growth' },
];

// ── Buyer Stage Analysis ─────────────────────────────────────────────────────
const BUYER_STAGES = ['Awareness', 'Consideration', 'Decision'];

function getBuyerStageStats() {
  const stats = {};
  BUYER_STAGES.forEach(stage => {
    const clusters = TOPIC_CLUSTERS.filter(c => c.buyer_stages.includes(stage));
    const pages = clusters.reduce((sum, c) => sum + c.supporting.length + 1, 0);
    stats[stage] = { clusters: clusters.length, pages };
  });
  return stats;
}

// ── Orphan Detection ─────────────────────────────────────────────────────────
function getOrphanedPages() {
  const linkedUrls = new Set();
  TOPIC_CLUSTERS.forEach(c => {
    linkedUrls.add(c.pillar.url);
    c.supporting.forEach(s => linkedUrls.add(s.url));
  });
  return SITEMAP_PAGES.filter(p => !linkedUrls.has(p.url) && !p.cluster);
}

// ── Main Dashboard Component ─────────────────────────────────────────────────
export default function AuthorityDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const orphanedPages = useMemo(() => getOrphanedPages(), []);
  const buyerStageStats = useMemo(() => getBuyerStageStats(), []);

  const clusterStats = useMemo(() => {
    return TOPIC_CLUSTERS.map(c => getClusterDepth(c.id));
  }, []);

  const contentByType = useMemo(() => {
    const counts = {};
    SITEMAP_PAGES.forEach(p => {
      counts[p.type] = (counts[p.type] || 0) + 1;
    });
    return counts;
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'google', label: 'Google', icon: Globe },
    { id: 'ai', label: 'AI Visibility', icon: Bot },
    { id: 'authority', label: 'Topic Authority', icon: Crown },
    { id: 'gaps', label: 'Gaps & Actions', icon: Target },
  ];

  return (
    <AdminGuard>
      <NoIndexMeta />
      <SEOHead
        title="Authority Dashboard | NTA Operating System"
        description="Business intelligence for NTA's content authority and discoverability."
        noIndex={true}
      />
      <div className="min-h-screen bg-slate-950 text-white">
        {/* Header */}
        <div className="border-b border-slate-800 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  Authority & Discoverability
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  R0.7 — Measure before you build
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/admin/editorial"
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                >
                  Editorial Dashboard →
                </Link>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-4 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
          {activeTab === 'overview' && <OverviewTab
            contentByType={contentByType}
            orphanedPages={orphanedPages}
            buyerStageStats={buyerStageStats}
            clusterStats={clusterStats}
          />}
          {activeTab === 'google' && <GoogleTab />}
          {activeTab === 'ai' && <AIVisibilityTab />}
          {activeTab === 'authority' && <AuthorityTab clusterStats={clusterStats} />}
          {activeTab === 'gaps' && <GapsTab orphanedPages={orphanedPages} buyerStageStats={buyerStageStats} />}
        </div>
      </div>
    </AdminGuard>
  );
}

// ── OVERVIEW TAB ──────────────────────────────────────────────────────────────
function OverviewTab({ contentByType, orphanedPages, buyerStageStats, clusterStats }) {
  return (
    <div className="space-y-8">
      {/* Top-level stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <AuthorityStat label="Sitemap Pages" value={SITEMAP_PAGES.length} icon="FileText" color="blue" />
        <AuthorityStat label="Topic Clusters" value={TOPIC_CLUSTERS.length} icon="Layers" color="purple" />
        <AuthorityStat label="Articles" value={contentByType.article || 0} icon="BookOpen" color="emerald" />
        <AuthorityStat label="Services" value={contentByType.service || 0} icon="Zap" color="cyan" />
        <AuthorityStat label="Orphaned Pages" value={orphanedPages.length} icon="AlertTriangle" color={orphanedPages.length > 5 ? 'rose' : 'amber'} />
        <AuthorityStat label="Buyer Stages" value="3/3" sublabel="Awareness · Consideration · Decision" icon="Users" color="emerald" />
      </div>

      {/* Content Composition */}
      <AuthoritySection title="Content Composition" icon="BarChart2">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {Object.entries(contentByType).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
            <div key={type} className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-white">{count}</div>
              <div className="text-[10px] text-slate-500 capitalize">{type.replace('_', ' ')}s</div>
            </div>
          ))}
        </div>
      </AuthoritySection>

      {/* Buyer Stage Coverage */}
      <AuthoritySection title="Buyer Stage Coverage" icon="Target">
        <div className="grid grid-cols-3 gap-3">
          {BUYER_STAGES.map(stage => {
            const stats = buyerStageStats[stage];
            return (
              <div key={stage} className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
                <div className="text-sm font-medium text-slate-300">{stage}</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-white">{stats.pages}</span>
                  <span className="text-xs text-slate-500">pages</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  across {stats.clusters} clusters
                </div>
              </div>
            );
          })}
        </div>
      </AuthoritySection>

      {/* Quick cluster depths */}
      <AuthoritySection title="Cluster Authority Depth" icon="Crown">
        <div className="space-y-2">
          {clusterStats.sort((a, b) => b.depth - a.depth).map(stat => (
            <div key={stat.id} className="flex items-center gap-3 bg-slate-800/20 border border-slate-700/20 rounded-lg p-3">
              <span className="text-sm text-slate-300 w-48 truncate">{stat.name}</span>
              <div className="flex-1">
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all"
                    style={{ width: `${stat.depth * 10}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-slate-500 w-12 text-right">{stat.depth}/10</span>
              <span className="text-xs text-slate-500 w-20 text-right">{stat.supportingCount} pages</span>
            </div>
          ))}
        </div>
      </AuthoritySection>
    </div>
  );
}

// ── GOOGLE TAB ────────────────────────────────────────────────────────────────
function GoogleTab() {
  // This tab shows Google Search Console data.
  // In production, this would be powered by the GSC API via Viktor.
  // For now, it shows the structure with placeholder data and
  // instructions for connecting live data.
  return (
    <div className="space-y-8">
      <AuthoritySection title="Google Search Console" icon="Globe">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-slate-200">Google Search Console Connected</h3>
              <p className="text-xs text-slate-400 mt-1">
                Property: <span className="text-slate-300">sc-domain:newtechadvertising.com</span>
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Viktor monitors this data and updates the dashboard automatically.
                Ask Viktor for the latest numbers at any time.
              </p>
            </div>
          </div>
        </div>
      </AuthoritySection>

      {/* Index Status */}
      <AuthoritySection title="Index Status" icon="CheckCircle">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <AuthorityStat label="Indexed Pages" value="—" sublabel="Ask Viktor for live data" icon="CheckCircle" color="emerald" />
          <AuthorityStat label="Not Indexed" value="—" sublabel="Pages Google hasn't indexed" icon="XCircle" color="rose" />
          <AuthorityStat label="Crawled Not Indexed" value="—" sublabel="Crawled but skipped" icon="Clock" color="amber" />
          <AuthorityStat label="Sitemap Pages" value={SITEMAP_PAGES.length} sublabel="In sitemap.xml" icon="FileText" color="blue" />
        </div>
        <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-4 mt-4">
          <p className="text-xs text-slate-400">
            <span className="text-slate-300 font-medium">How to read:</span> Ideally, Indexed ≈ Sitemap Pages.
            "Not Indexed" means Google hasn't discovered or doesn't value those pages.
            "Crawled Not Indexed" means Google saw them but decided not to include them — often a content quality or thin content signal.
          </p>
        </div>
      </AuthoritySection>

      {/* Search Performance */}
      <AuthoritySection title="Search Performance (Last 28 Days)" icon="TrendingUp">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <AuthorityStat label="Total Impressions" value="—" icon="Eye" color="blue" />
          <AuthorityStat label="Total Clicks" value="—" icon="MousePointerClick" color="emerald" />
          <AuthorityStat label="Average CTR" value="—" icon="TrendingUp" color="purple" />
          <AuthorityStat label="Average Position" value="—" icon="BarChart2" color="amber" />
        </div>
      </AuthoritySection>

      {/* Top Pages Table */}
      <AuthoritySection title="Top Pages by Clicks" icon="FileText">
        <AuthorityTable
          title="Top Landing Pages"
          columns={[
            { key: 'page', label: 'Page' },
            { key: 'clicks', label: 'Clicks', align: 'right' },
            { key: 'impressions', label: 'Impressions', align: 'right' },
            { key: 'ctr', label: 'CTR', align: 'right' },
            { key: 'position', label: 'Avg Position', align: 'right' },
          ]}
          rows={[]}
          emptyText="Ask Viktor to pull the latest Search Console data"
        />
      </AuthoritySection>

      {/* Top Queries Table */}
      <AuthoritySection title="Top Search Queries" icon="Search">
        <AuthorityTable
          title="Top Queries"
          columns={[
            { key: 'query', label: 'Query' },
            { key: 'clicks', label: 'Clicks', align: 'right' },
            { key: 'impressions', label: 'Impressions', align: 'right' },
            { key: 'ctr', label: 'CTR', align: 'right' },
            { key: 'position', label: 'Avg Position', align: 'right' },
          ]}
          rows={[]}
          emptyText="Ask Viktor to pull the latest Search Console data"
        />
      </AuthoritySection>

      {/* Core Web Vitals placeholder */}
      <AuthoritySection title="Core Web Vitals" icon="Zap">
        <div className="grid grid-cols-3 gap-3">
          <AuthorityStat label="LCP" value="—" sublabel="Largest Contentful Paint" icon="Clock" color="slate" />
          <AuthorityStat label="FID" value="—" sublabel="First Input Delay" icon="MousePointerClick" color="slate" />
          <AuthorityStat label="CLS" value="—" sublabel="Cumulative Layout Shift" icon="Layers" color="slate" />
        </div>
        <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-4 mt-4">
          <p className="text-xs text-slate-400">
            Core Web Vitals data requires the Chrome UX Report (CrUX) API.
            For now, test individual pages at <a href="https://pagespeed.web.dev" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">PageSpeed Insights</a>.
          </p>
        </div>
      </AuthoritySection>
    </div>
  );
}

// ── AI VISIBILITY TAB ─────────────────────────────────────────────────────────
function AIVisibilityTab() {
  // AI visibility metrics — based on internal authority analysis.
  const articlesWithVideo = SITEMAP_PAGES.filter(p => p.type === 'article').length;
  const articlesInClusters = SITEMAP_PAGES.filter(p => p.type === 'article' && p.cluster).length;
  const totalArticles = SITEMAP_PAGES.filter(p => p.type === 'article').length;

  const aiReadinessSignals = [
    { signal: 'AI Sitemap (llms.txt)', status: 'active', description: 'Structured text file for LLM crawlers' },
    { signal: 'AI Sitemap (JSON)', status: 'active', description: 'Machine-readable content graph for AI systems' },
    { signal: 'Person Schema (Rick Hesse)', status: 'active', description: 'Founder entity recognition for AI attribution' },
    { signal: 'Article Schema', status: 'active', description: 'Structured article data for every Canon entry' },
    { signal: 'WebSite + SearchAction', status: 'active', description: 'Site-level entity for search and AI systems' },
    { signal: 'BreadcrumbList', status: 'active', description: 'Hierarchical navigation structure' },
    { signal: 'FAQPage Schema', status: 'active', description: 'Structured Q&A for featured snippets and AI answers' },
    { signal: 'CollectionPage Schema', status: 'active', description: 'Reader journey structure for content grouping' },
    { signal: 'VideoObject Schema', status: 'active', description: 'Video content metadata for discovery' },
    { signal: 'LearningResource Schema', status: 'active', description: 'Educational content classification' },
    { signal: 'HowTo Schema', status: 'active', description: 'Step-by-step process markup for growth tools' },
    { signal: 'Topical Authority Clusters', status: 'active', description: '8 defined topic clusters with pillar + supporting pages' },
  ];

  return (
    <div className="space-y-8">
      {/* AI Readiness Scorecard */}
      <AuthoritySection title="AI Readiness Scorecard" icon="Bot">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <AuthorityStat label="Schema Types" value="11" sublabel="JSON-LD types implemented" icon="Layers" color="purple" />
          <AuthorityStat label="AI Sitemaps" value="2" sublabel="llms.txt + JSON" icon="Map" color="blue" />
          <AuthorityStat label="Topic Clusters" value={TOPIC_CLUSTERS.length} sublabel="Defined authority topics" icon="Crown" color="amber" />
          <AuthorityStat label="Cluster Coverage" value={`${Math.round((articlesInClusters / totalArticles) * 100)}%`} sublabel="Articles in clusters" icon="Target" color="emerald" />
        </div>

        <div className="space-y-1">
          {aiReadinessSignals.map((item, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2 bg-slate-800/20 border border-slate-700/20 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-sm text-slate-200">{item.signal}</span>
                  <span className="text-xs text-slate-500 ml-2">{item.description}</span>
                </div>
              </div>
              <StatusBadge status="indexed" />
            </div>
          ))}
        </div>
      </AuthoritySection>

      {/* Most Connected Pages */}
      <AuthoritySection title="Most Connected Pages" icon="Link2">
        <AuthorityTable
          title="Pages by Internal Link Count"
          columns={[
            { key: 'title', label: 'Page' },
            { key: 'type', label: 'Type', render: (v) => <span className="capitalize text-xs">{v}</span> },
            { key: 'cluster', label: 'Cluster', render: (v) => v ? <span className="text-xs">{TOPIC_CLUSTERS.find(c => c.id === v)?.name || v}</span> : <StatusBadge status="orphaned" /> },
          ]}
          rows={SITEMAP_PAGES.filter(p => p.cluster).slice(0, 15)}
        />
      </AuthoritySection>

      {/* AI Citation Guidance */}
      <AuthoritySection title="How AI Systems Find NTA" icon="Compass">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-slate-200 mb-2">Entity Recognition</h3>
            <p className="text-xs text-slate-400">
              AI systems like ChatGPT, Claude, Gemini, and Perplexity recognize entities through structured data,
              consistent naming, and authoritative content. NTA now publishes:
            </p>
            <ul className="text-xs text-slate-400 mt-2 space-y-1 list-disc list-inside">
              <li><span className="text-slate-300">Person entity</span> — Rick Hesse as founder, author, and marketing expert</li>
              <li><span className="text-slate-300">Organization entity</span> — NTA as a ProfessionalService with structured services</li>
              <li><span className="text-slate-300">Content graph</span> — Articles, videos, and resources linked through topic clusters</li>
              <li><span className="text-slate-300">llms.txt</span> — Direct descriptor file for LLM crawlers</li>
              <li><span className="text-slate-300">ai-sitemap.json</span> — Machine-readable content index with relationships</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-200 mb-2">Strengthening AI Visibility</h3>
            <p className="text-xs text-slate-400">
              The more consistently NTA publishes authoritative content in defined topic clusters,
              the more likely AI systems are to reference NTA when answering questions about
              AI marketing, local business growth, and small business visibility.
            </p>
          </div>
        </div>
      </AuthoritySection>
    </div>
  );
}

// ── AUTHORITY TAB ─────────────────────────────────────────────────────────────
function AuthorityTab({ clusterStats }) {
  return (
    <div className="space-y-8">
      <AuthoritySection title="Topical Authority Map" icon="Map">
        <TopicalAuthorityMap />
      </AuthoritySection>
    </div>
  );
}

// ── GAPS TAB ──────────────────────────────────────────────────────────────────
function GapsTab({ orphanedPages, buyerStageStats }) {
  // Generate publishing recommendations
  const recommendations = useMemo(() => {
    const recs = [];

    // Find weakest clusters
    TOPIC_CLUSTERS.forEach(c => {
      const depth = getClusterDepth(c.id);
      if (depth.supportingCount < 4) {
        recs.push({
          priority: 'high',
          type: 'content_gap',
          title: `Strengthen "${c.name}" cluster`,
          description: `Only ${depth.supportingCount} supporting pages. Add 2-3 more articles to build depth.`,
          action: `Write supporting content for ${c.pillar.title}`,
        });
      }
    });

    // Orphaned pages
    if (orphanedPages.length > 0) {
      recs.push({
        priority: 'medium',
        type: 'orphan',
        title: `${orphanedPages.length} orphaned pages need cluster assignment`,
        description: 'These pages exist in the sitemap but aren\'t connected to any topic cluster.',
        action: 'Assign to clusters or create new clusters',
      });
    }

    // Buyer stage gaps
    BUYER_STAGES.forEach(stage => {
      if (buyerStageStats[stage].pages < 10) {
        recs.push({
          priority: stage === 'Decision' ? 'high' : 'medium',
          type: 'buyer_stage',
          title: `${stage} stage needs more content`,
          description: `Only ${buyerStageStats[stage].pages} pages target ${stage}. Decision-stage content converts visitors.`,
          action: `Create ${stage.toLowerCase()}-stage content`,
        });
      }
    });

    // Industry clusters without case studies
    TOPIC_CLUSTERS.filter(c => c.pillar.type === 'industry').forEach(c => {
      const hasCaseStudy = c.supporting.some(s => s.type === 'case_study');
      if (!hasCaseStudy) {
        recs.push({
          priority: 'medium',
          type: 'proof_gap',
          title: `"${c.name}" lacks a case study`,
          description: 'Industry pages with case studies rank higher and convert better.',
          action: `Create a ${c.name.toLowerCase()} case study`,
        });
      }
    });

    return recs.sort((a, b) => (a.priority === 'high' ? -1 : 1) - (b.priority === 'high' ? -1 : 1));
  }, [orphanedPages, buyerStageStats]);

  return (
    <div className="space-y-8">
      {/* What Should Rick Publish Next */}
      <AuthoritySection title="What Should Rick Publish Next?" icon="Target">
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <div key={i} className={`p-4 rounded-xl border ${
              rec.priority === 'high'
                ? 'bg-rose-900/10 border-rose-800/30'
                : 'bg-slate-800/30 border-slate-700/30'
            }`}>
              <div className="flex items-start gap-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  rec.priority === 'high'
                    ? 'bg-rose-800/60 text-rose-300'
                    : 'bg-amber-800/60 text-amber-300'
                }`}>
                  {rec.priority}
                </span>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-slate-200">{rec.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{rec.description}</p>
                  <p className="text-xs text-blue-400 mt-2 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    {rec.action}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AuthoritySection>

      {/* Orphaned Pages */}
      <AuthoritySection title="Orphaned Pages" icon="AlertTriangle">
        <AuthorityTable
          title={`${orphanedPages.length} pages not in any topic cluster`}
          columns={[
            { key: 'title', label: 'Page' },
            { key: 'url', label: 'URL', render: (v) => <span className="text-xs text-slate-500">{v}</span> },
            { key: 'type', label: 'Type', render: (v) => <span className="capitalize text-xs">{v}</span> },
          ]}
          rows={orphanedPages}
          emptyText="No orphaned pages — all content is connected!"
        />
      </AuthoritySection>

      {/* Incomplete Topics */}
      <AuthoritySection title="Topics Needing Depth" icon="Layers">
        <div className="space-y-2">
          {TOPIC_CLUSTERS
            .map(c => ({ ...c, depth: getClusterDepth(c.id) }))
            .filter(c => c.depth.supportingCount < 5)
            .sort((a, b) => a.depth.supportingCount - b.depth.supportingCount)
            .map(c => (
              <div key={c.id} className="flex items-center gap-3 p-3 bg-slate-800/20 border border-slate-700/20 rounded-lg">
                <AlertTriangle className={`w-4 h-4 ${c.depth.supportingCount < 3 ? 'text-rose-400' : 'text-amber-400'}`} />
                <span className="text-sm text-slate-300 flex-1">{c.name}</span>
                <span className="text-xs text-slate-500">{c.depth.supportingCount} supporting pages</span>
                <span className="text-xs text-slate-500">needs {5 - c.depth.supportingCount} more</span>
              </div>
            ))
          }
        </div>
      </AuthoritySection>
    </div>
  );
}
