/**
 * E-005 Editorial Dashboard
 * Command center for the entire NTA publishing operation.
 * Manages all queues, performance metrics, and one-click publishing.
 * Route: /admin/editorial
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminGuard from '../components/auth/AdminGuard';
import NoIndexMeta from '@/components/auth/NoIndexMeta';
import { toast } from 'sonner';
import * as LucideIcons from 'lucide-react';
import {
  LayoutDashboard, RefreshCw, Loader2, Plus,
  FileEdit, Clock, Send, Mail, Youtube, Share2,
  BookOpen, Calendar, TrendingUp, Search, Eye,
  Heart, Play, Newspaper, GraduationCap, Rss,
  MapPin, ArrowRight, Zap, BarChart2, Globe,
  Linkedin, Twitter, Archive, Facebook
} from 'lucide-react';
import {
  CHANNELS, CHANNEL_LIST, STATUS_COLORS, formatDate
} from '../components/publishing-engine/publishingData';
import {
  StatWidget, QueueWidget, PerformanceWidget,
  MonthlyThemesWidget, OneClickPublishWidget, MiniCalendarWidget
} from '../components/publishing-engine/EditorialWidgets';

export default function EditorialDashboard() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [targets, setTargets] = useState([]);
  const [youtubeEntries, setYoutubeEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (showToast = false) => {
    try {
      const [articlesData, targetsData] = await Promise.all([
        base44.entities.PublishingArticle.list('-created_date', 200),
        base44.entities.PublishingTarget.list('-created_date', 1000),
      ]);
      setArticles(articlesData);
      setTargets(targetsData);

      // Try loading YouTube entries
      try {
        const ytData = await base44.entities.YouTubeKnowledge.list('-created_date', 100);
        setYoutubeEntries(ytData);
      } catch (e) { /* entity may not exist */ }

      if (showToast) toast.success('Dashboard refreshed');
    } catch (err) {
      console.error('Failed to load data:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Computed Data ─────────────────────────────────────────────────────────

  const drafts = useMemo(() =>
    articles.filter(a => a.status === 'Draft').map(a => ({
      title: a.title,
      subtitle: `${a.content_type || 'Article'} · Created ${formatDate(a.created_date)}`,
      date: a.created_date,
      id: a.id,
      badge: a.content_type,
      badgeColor: 'bg-slate-800 text-slate-400',
    })),
  [articles]);

  const scheduledTargets = useMemo(() =>
    targets.filter(t => t.status === 'Scheduled').sort((a, b) =>
      (a.scheduled_date + (a.scheduled_time || '')).localeCompare(b.scheduled_date + (b.scheduled_time || ''))
    ).map(t => {
      const cfg = CHANNELS[t.channel];
      const Icon = LucideIcons[cfg?.icon] || LucideIcons.Circle;
      const c = STATUS_COLORS[cfg?.color] || STATUS_COLORS.blue;
      return {
        title: t.article_title || 'Article',
        subtitle: `${cfg?.label || t.channel} · ${formatDate(t.scheduled_date)} ${t.scheduled_time || '07:00'}`,
        date: t.scheduled_date,
        channelIcon: Icon,
        channelColor: c.text,
        id: t.article_id,
      };
    }),
  [targets]);

  const publishedArticles = useMemo(() =>
    articles.filter(a => a.status === 'Published').map(a => {
      const articleTargets = targets.filter(t => t.article_id === a.id);
      const pubCount = articleTargets.filter(t => t.status === 'Published').length;
      return {
        title: a.title,
        subtitle: `${pubCount} channels · Published ${formatDate(a.published_date)}`,
        date: a.published_date,
        id: a.id,
        badge: `${pubCount}ch`,
        badgeColor: 'bg-green-500/10 text-green-400',
      };
    }),
  [articles, targets]);

  // Channel-specific queues
  function getChannelQueue(channel) {
    return targets
      .filter(t => t.channel === channel && (t.status === 'Scheduled' || t.status === 'Adapted'))
      .map(t => {
        const cfg = CHANNELS[channel];
        const Icon = LucideIcons[cfg?.icon] || LucideIcons.Circle;
        const c = STATUS_COLORS[cfg?.color] || STATUS_COLORS.blue;
        return {
          title: t.article_title || 'Article',
          subtitle: t.status === 'Scheduled' ? `${formatDate(t.scheduled_date)} ${t.scheduled_time || '07:00'}` : 'Adapted — not scheduled',
          date: t.scheduled_date,
          channelIcon: Icon,
          channelColor: c.text,
          id: t.article_id,
          badge: t.status,
          badgeColor: t.status === 'Scheduled' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400',
        };
      });
  }

  const newsletterQueue = useMemo(() => getChannelQueue('Email'), [targets]);
  const youtubeQueue = useMemo(() => getChannelQueue('YouTube'), [targets]);
  const socialQueue = useMemo(() => [
    ...getChannelQueue('Facebook'),
    ...getChannelQueue('LinkedIn'),
    ...getChannelQueue('X'),
    ...getChannelQueue('GBP'),
  ], [targets]);
  const learningQueue = useMemo(() => getChannelQueue('LearningCenter'), [targets]);

  // Performance metrics (from engagement data on targets)
  const topPerforming = useMemo(() => {
    const articleMetrics = {};
    targets.filter(t => t.status === 'Published').forEach(t => {
      if (!articleMetrics[t.article_id]) {
        articleMetrics[t.article_id] = { title: t.article_title, clicks: 0, impressions: 0, reactions: 0, channels: 0 };
      }
      articleMetrics[t.article_id].clicks += t.engagement_clicks || 0;
      articleMetrics[t.article_id].impressions += t.engagement_impressions || 0;
      articleMetrics[t.article_id].reactions += t.engagement_reactions || 0;
      articleMetrics[t.article_id].channels++;
    });
    return Object.values(articleMetrics).sort((a, b) => b.impressions - a.impressions);
  }, [targets]);

  const mostRead = useMemo(() =>
    topPerforming.filter(a => a.clicks > 0).sort((a, b) => b.clicks - a.clicks).map(a => ({
      title: a.title, metric: a.clicks, subtitle: `${a.channels} channels`
    })),
  [topPerforming]);

  const mostShared = useMemo(() =>
    topPerforming.filter(a => a.reactions > 0).sort((a, b) => b.reactions - a.reactions).map(a => ({
      title: a.title, metric: a.reactions, subtitle: `${a.channels} channels`
    })),
  [topPerforming]);

  const mostViewedVideos = useMemo(() =>
    youtubeEntries.filter(y => y.engagement_views > 0).sort((a, b) => b.engagement_views - a.engagement_views).map(y => ({
      title: y.video_title, metric: y.engagement_views, subtitle: y.playlist || ''
    })),
  [youtubeEntries]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  function openArticle(item) {
    if (item.id) navigate(`/PublishingArticleView?id=${item.id}`);
  }

  async function handleOneClickPublish(article) {
    // Mark all scheduled targets as Published
    const scheduledTargets = article.targets.filter(t => t.status === 'Scheduled');
    const now = new Date().toISOString().split('T')[0];

    try {
      await Promise.all(
        scheduledTargets.map(t =>
          base44.entities.PublishingTarget.update(t.id, {
            status: 'Published',
            published_date: now,
          })
        )
      );
      // Update article status
      await base44.entities.PublishingArticle.update(article.id, {
        status: 'Published',
        published_date: now,
      });
      toast.success(`Published "${article.title}" to ${scheduledTargets.length} channels`);
      await loadData();
    } catch (err) {
      console.error('Publish failed:', err);
      toast.error('Publishing failed');
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadData(true);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AdminGuard>
      <NoIndexMeta />
      <div className="min-h-screen bg-slate-950 text-white">
        {/* Header */}
        <header className="border-b border-slate-800 px-6 py-4">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight">Editorial Dashboard</h1>
                <p className="text-xs text-slate-500">Manage the entire publishing operation</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleRefresh} disabled={refreshing} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors disabled:opacity-50">
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <Link to="/PublishingEngine" className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:text-white transition-colors">
                <Newspaper className="w-3.5 h-3.5" /> Publishing Engine
              </Link>
              <button
                onClick={() => navigate('/PublishingArticleView')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" /> New Article
              </button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-[1400px] mx-auto px-6 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* ── Top Stats Row ─────────────────────────────────────────── */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <StatWidget icon={FileEdit} label="Drafts" value={drafts.length} color="slate" />
                <StatWidget icon={Clock} label="Scheduled" value={scheduledTargets.length} color="purple" />
                <StatWidget icon={Send} label="Published" value={publishedArticles.length} color="green" />
                <StatWidget icon={Newspaper} label="Total Articles" value={articles.length} color="blue" />
                <StatWidget icon={Youtube} label="YouTube" value={youtubeEntries.length} color="red" />
                <StatWidget icon={Share2} label="Channels Active" value={
                  new Set(targets.filter(t => t.status === 'Published').map(t => t.channel)).size
                } color="amber" sub={`of ${CHANNEL_LIST.length} total`} />
              </div>

              {/* ── One-Click Publish ─────────────────────────────────────── */}
              <OneClickPublishWidget
                articles={articles}
                targets={targets}
                onPublish={handleOneClickPublish}
              />

              {/* ── Queue Row ────────────────────────────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <QueueWidget
                  title="Drafts"
                  icon={FileEdit}
                  color="slate"
                  items={drafts}
                  emptyText="No drafts — create a new article"
                  onItemClick={openArticle}
                />
                <QueueWidget
                  title="Newsletter Queue"
                  icon={Mail}
                  color="purple"
                  items={newsletterQueue}
                  emptyText="No emails scheduled"
                  onItemClick={openArticle}
                />
                <QueueWidget
                  title="YouTube Queue"
                  icon={Youtube}
                  color="red"
                  items={youtubeQueue}
                  emptyText="No videos queued"
                  onItemClick={openArticle}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <QueueWidget
                  title="Social Queue"
                  icon={Share2}
                  color="sky"
                  items={socialQueue}
                  emptyText="No social posts queued"
                  onItemClick={openArticle}
                />
                <QueueWidget
                  title="Learning Center"
                  icon={GraduationCap}
                  color="amber"
                  items={learningQueue}
                  emptyText="No learning content queued"
                  onItemClick={openArticle}
                />
                <QueueWidget
                  title="Recently Published"
                  icon={Send}
                  color="green"
                  items={publishedArticles}
                  emptyText="Nothing published yet"
                  onItemClick={openArticle}
                />
              </div>

              {/* ── Calendar + Themes Row ─────────────────────────────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <MiniCalendarWidget targets={targets} />
                </div>
                <MonthlyThemesWidget articles={articles} />
              </div>

              {/* ── Performance Row ───────────────────────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <PerformanceWidget
                  title="Top Performing"
                  icon={TrendingUp}
                  color="green"
                  items={topPerforming.slice(0, 5).map(a => ({
                    title: a.title, metric: a.impressions.toLocaleString(), subtitle: `${a.channels} channels`
                  }))}
                  metricLabel="impressions"
                />
                <PerformanceWidget
                  title="Most Read"
                  icon={Eye}
                  color="blue"
                  items={mostRead}
                  metricLabel="clicks"
                />
                <PerformanceWidget
                  title="Most Shared"
                  icon={Heart}
                  color="red"
                  items={mostShared}
                  metricLabel="reactions"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <PerformanceWidget
                  title="Most Viewed Videos"
                  icon={Play}
                  color="red"
                  items={mostViewedVideos}
                  metricLabel="views"
                />
                {/* Search queries would come from GSC data — placeholder */}
                <PerformanceWidget
                  title="Search Queries"
                  icon={Search}
                  color="amber"
                  items={[]}
                  metricLabel="clicks"
                />
                {/* Placeholder for future data */}
                <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
                    <BarChart2 className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-bold text-white">Publishing Velocity</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-lg font-black text-white">
                          {articles.filter(a => {
                            const d = a.published_date;
                            if (!d) return false;
                            const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
                            return new Date(d) >= weekAgo;
                          }).length}
                        </p>
                        <p className="text-[10px] text-slate-500">This Week</p>
                      </div>
                      <div>
                        <p className="text-lg font-black text-white">
                          {articles.filter(a => {
                            const d = a.published_date;
                            if (!d) return false;
                            const monthAgo = new Date(); monthAgo.setDate(monthAgo.getDate() - 30);
                            return new Date(d) >= monthAgo;
                          }).length}
                        </p>
                        <p className="text-[10px] text-slate-500">This Month</p>
                      </div>
                      <div>
                        <p className="text-lg font-black text-white">{publishedArticles.length}</p>
                        <p className="text-[10px] text-slate-500">All Time</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  );
}
