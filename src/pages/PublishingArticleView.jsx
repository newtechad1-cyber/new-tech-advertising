/**
 * P-001 NTA Publishing Engine — Article Detail View
 * Full article management: edit content, workflow, channel adaptation,
 * YouTube Knowledge Engine, scheduling.
 * Route: /admin/publishing-engine/article/:id?
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminGuard from '../components/auth/AdminGuard';
import NoIndexMeta from '@/components/auth/NoIndexMeta';
import { toast } from 'sonner';
import {
  ArrowLeft, Newspaper, Save, Loader2, Trash2,
  FileEdit, Share2, Youtube, BookOpen, Clock
} from 'lucide-react';
import { CHANNEL_LIST, formatDate } from '../components/publishing-engine/publishingData';
import ArticleEditor from '../components/publishing-engine/ArticleEditor';
import ChannelPanel from '../components/publishing-engine/ChannelPanel';
import WorkflowBar from '../components/publishing-engine/WorkflowBar';
import YouTubePanel from '../components/youtube-engine/YouTubePanel';

const VIEW_TABS = [
  { id: 'edit',     label: 'Content',    icon: FileEdit },
  { id: 'channels', label: 'Channels',   icon: Share2 },
  { id: 'youtube',  label: 'YouTube',    icon: Youtube },
  { id: 'workflow', label: 'Workflow',   icon: Clock },
];

export default function PublishingArticleView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const articleId = searchParams.get('id');
  const isNew = !articleId;

  const [article, setArticle] = useState(null);
  const [targets, setTargets] = useState([]);
  const [youtubeData, setYoutubeData] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activeView, setActiveView] = useState('edit');

  const loadArticle = useCallback(async () => {
    if (!articleId) return;
    try {
      const [articlesData, targetsData] = await Promise.all([
        base44.entities.PublishingArticle.filter({ id: articleId }),
        base44.entities.PublishingTarget.filter({ article_id: articleId }),
      ]);
      if (articlesData[0]) {
        setArticle(articlesData[0]);
      }
      setTargets(targetsData);

      // Load YouTube data if it exists
      try {
        const ytData = await base44.entities.YouTubeKnowledge.filter({ related_journal_id: articleId });
        if (ytData[0]) setYoutubeData(ytData[0]);
      } catch (e) {
        // Entity may not exist yet
      }
    } catch (err) {
      console.error('Failed to load article:', err);
      toast.error('Failed to load article');
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => { loadArticle(); }, [loadArticle]);

  // Save article
  async function handleSaveArticle(formData) {
    setSaving(true);
    try {
      const now = new Date().toISOString().split('T')[0];
      if (isNew) {
        const created = await base44.entities.PublishingArticle.create({
          ...formData,
          status: 'Draft',
          created_date: now,
          updated_date: now,
        });
        toast.success('Article created');
        navigate(`/PublishingArticleView?id=${created.id}`, { replace: true });
      } else {
        await base44.entities.PublishingArticle.update(articleId, {
          ...formData,
          updated_date: now,
        });
        setArticle(prev => ({ ...prev, ...formData, updated_date: now }));
        toast.success('Article saved');
      }
    } catch (err) {
      console.error('Save failed:', err);
      toast.error('Failed to save article');
    } finally {
      setSaving(false);
    }
  }

  // Workflow status change
  async function handleStatusChange(newStatus) {
    if (!articleId) return;
    setSaving(true);
    try {
      const now = new Date().toISOString().split('T')[0];
      const updates = { status: newStatus, updated_date: now };
      if (newStatus === 'Approved') updates.approved_date = now;
      if (newStatus === 'Published') updates.published_date = now;

      await base44.entities.PublishingArticle.update(articleId, updates);
      setArticle(prev => ({ ...prev, ...updates }));
      toast.success(`Status changed to ${newStatus}`);

      // When queued, auto-create targets for all selected channels if they don't exist
      if (newStatus === 'Queued' || newStatus === 'Approved') {
        const channels = article?.publish_to_channels || CHANNEL_LIST;
        const existingChannels = targets.map(t => t.channel);
        const newChannels = channels.filter(ch => !existingChannels.includes(ch));

        if (newChannels.length > 0) {
          const created = await Promise.all(
            newChannels.map(ch =>
              base44.entities.PublishingTarget.create({
                article_id: articleId,
                article_title: article?.title || '',
                channel: ch,
                status: 'Pending',
                adapted_title: article?.title || '',
                created_date: now,
              })
            )
          );
          setTargets(prev => [...prev, ...created]);
          toast.success(`Created ${newChannels.length} channel targets`);
        }
      }
    } catch (err) {
      console.error('Status change failed:', err);
      toast.error('Failed to change status');
    } finally {
      setSaving(false);
    }
  }

  // Update a publishing target
  async function handleUpdateTarget(channel, updates) {
    const existing = targets.find(t => t.channel === channel);
    const now = new Date().toISOString().split('T')[0];

    try {
      if (existing) {
        await base44.entities.PublishingTarget.update(existing.id, updates);
        setTargets(prev => prev.map(t => t.channel === channel ? { ...t, ...updates } : t));
      } else {
        const created = await base44.entities.PublishingTarget.create({
          article_id: articleId,
          article_title: article?.title || '',
          channel,
          status: 'Pending',
          created_date: now,
          ...updates,
        });
        setTargets(prev => [...prev, created]);
      }
    } catch (err) {
      console.error('Target update failed:', err);
      toast.error(`Failed to update ${channel}`);
    }
  }

  // Save YouTube data
  async function handleSaveYouTube(data) {
    try {
      if (youtubeData?.id) {
        await base44.entities.YouTubeKnowledge.update(youtubeData.id, data);
        setYoutubeData(prev => ({ ...prev, ...data }));
      } else {
        const created = await base44.entities.YouTubeKnowledge.create({
          ...data,
          related_journal_id: articleId,
          related_journal_title: article?.title || '',
          video_title: data.video_title || article?.title || '',
          publish_status: data.publish_status || 'Idea',
          created_date: new Date().toISOString().split('T')[0],
        });
        setYoutubeData(created);
      }
      toast.success('YouTube data saved');
    } catch (err) {
      console.error('YouTube save failed:', err);
      toast.error('Failed to save YouTube data');
    }
  }

  // Delete article
  async function handleDelete() {
    if (!articleId || !window.confirm('Delete this article and all its channel targets?')) return;
    setSaving(true);
    try {
      // Delete targets
      await Promise.all(targets.map(t => base44.entities.PublishingTarget.delete(t.id)));
      // Delete YouTube data
      if (youtubeData?.id) {
        await base44.entities.YouTubeKnowledge.delete(youtubeData.id);
      }
      // Delete article
      await base44.entities.PublishingArticle.delete(articleId);
      toast.success('Article deleted');
      navigate('/PublishingEngine');
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminGuard>
      <NoIndexMeta />
      <div className="min-h-screen bg-slate-950 text-white">
        {/* Header */}
        <header className="border-b border-slate-800 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/PublishingEngine"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-lg font-bold truncate max-w-md">
                  {isNew ? 'New Article' : (article?.title || 'Loading...')}
                </h1>
                <p className="text-xs text-slate-500">
                  {isNew ? 'Create a new publishing article' : `Last updated ${formatDate(article?.updated_date)}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isNew && (
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* View tabs */}
        {!isNew && (
          <nav className="border-b border-slate-800 px-6">
            <div className="max-w-7xl mx-auto flex items-center gap-1">
              {VIEW_TABS.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
                      activeView === tab.id
                        ? 'border-blue-500 text-white'
                        : 'border-transparent text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </nav>
        )}

        {/* Content */}
        <main className="max-w-7xl mx-auto px-6 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <>
              {/* Edit view (always shown for new articles) */}
              {(activeView === 'edit' || isNew) && (
                <ArticleEditor
                  article={article}
                  onSave={handleSaveArticle}
                  onCancel={() => navigate('/PublishingEngine')}
                  saving={saving}
                />
              )}

              {/* Channels view */}
              {activeView === 'channels' && !isNew && (
                <ChannelPanel
                  article={article}
                  targets={targets}
                  onUpdateTarget={handleUpdateTarget}
                />
              )}

              {/* YouTube view */}
              {activeView === 'youtube' && !isNew && (
                <div className="max-w-3xl">
                  <YouTubePanel
                    youtubeData={youtubeData}
                    onChange={(data) => setYoutubeData(data)}
                    articleTitle={article?.title}
                  />
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleSaveYouTube(youtubeData || {})}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save YouTube Data'}
                    </button>
                  </div>
                </div>
              )}

              {/* Workflow view */}
              {activeView === 'workflow' && !isNew && (
                <div className="max-w-3xl">
                  <WorkflowBar
                    article={article}
                    onStatusChange={handleStatusChange}
                    saving={saving}
                  />

                  {/* Workflow timeline */}
                  <div className="mt-8 p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Timeline</h3>
                    <div className="space-y-3">
                      {article?.created_date && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 rounded-full bg-slate-400" />
                          <span className="text-slate-400">Created</span>
                          <span className="text-slate-500">{formatDate(article.created_date)}</span>
                        </div>
                      )}
                      {article?.approved_date && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 rounded-full bg-blue-400" />
                          <span className="text-blue-400">Approved</span>
                          <span className="text-slate-500">{formatDate(article.approved_date)}</span>
                        </div>
                      )}
                      {article?.published_date && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                          <span className="text-green-400">Published</span>
                          <span className="text-slate-500">{formatDate(article.published_date)}</span>
                        </div>
                      )}

                      {/* Channel publish events */}
                      {targets
                        .filter(t => t.status === 'Published' && t.published_date)
                        .sort((a, b) => (a.published_date || '').localeCompare(b.published_date || ''))
                        .map((t, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-green-400">Published to {t.channel}</span>
                            <span className="text-slate-500">{formatDate(t.published_date)}</span>
                            {t.platform_url && (
                              <a href={t.platform_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:underline">
                                View →
                              </a>
                            )}
                          </div>
                        ))
                      }

                      {/* Reviewer notes */}
                      {article?.reviewer_notes && (
                        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <p className="text-xs font-semibold text-amber-400 mb-1">Reviewer Notes</p>
                          <p className="text-sm text-slate-300">{article.reviewer_notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </AdminGuard>
  );
}
