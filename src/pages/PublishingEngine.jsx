/**
 * P-001 NTA Publishing Engine — Main Dashboard
 * One article becomes every marketing asset.
 * Route: /admin/publishing-engine
 *
 * Tabs: Pipeline | Articles | Schedule | Settings
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminGuard from '../components/auth/AdminGuard';
import NoIndexMeta from '@/components/auth/NoIndexMeta';
import { toast } from 'sonner';
import {
  Newspaper, LayoutDashboard, FileText, Calendar, Settings,
  RefreshCw, Loader2, Plus, Zap
} from 'lucide-react';
import PipelineOverview from '../components/publishing-engine/PipelineOverview';
import ArticleList from '../components/publishing-engine/ArticleList';
import PublishingCalendar from '../components/publishing-engine/PublishingCalendar';

const TABS = [
  { id: 'pipeline',  label: 'Pipeline',  icon: LayoutDashboard },
  { id: 'articles',  label: 'Articles',  icon: FileText },
  { id: 'schedule',  label: 'Schedule',  icon: Calendar },
];

export default function PublishingEngine() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pipeline');
  const [articles, setArticles] = useState([]);
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (showToast = false) => {
    try {
      const [articlesData, targetsData] = await Promise.all([
        base44.entities.PublishingArticle.list('-created_date', 100),
        base44.entities.PublishingTarget.list('-created_date', 500),
      ]);
      setArticles(articlesData);
      setTargets(targetsData);
      if (showToast) toast.success('Data refreshed');
    } catch (err) {
      console.error('Failed to load publishing data:', err);
      toast.error('Failed to load publishing data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleRefresh() {
    setRefreshing(true);
    await loadData(true);
  }

  function handleSelectArticle(article) {
    navigate(`/PublishingArticleView?id=${article.id}`);
  }

  function handleNewArticle() {
    navigate('/PublishingArticleView');
  }

  function handleSelectTarget(target) {
    if (target.article_id) {
      navigate(`/PublishingArticleView?id=${target.article_id}`);
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight">Publishing Engine</h1>
                <p className="text-xs text-slate-500">One article → every marketing asset</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleNewArticle}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" /> New Article
              </button>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <nav className="border-b border-slate-800 px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
                    activeTab === tab.id
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

        {/* Content */}
        <main className="max-w-7xl mx-auto px-6 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <>
              {activeTab === 'pipeline' && (
                <PipelineOverview articles={articles} targets={targets} />
              )}
              {activeTab === 'articles' && (
                <ArticleList
                  articles={articles}
                  targets={targets}
                  onSelectArticle={handleSelectArticle}
                  onNewArticle={handleNewArticle}
                />
              )}
              {activeTab === 'schedule' && (
                <PublishingCalendar
                  targets={targets}
                  onSelectTarget={handleSelectTarget}
                />
              )}
            </>
          )}
        </main>
      </div>
    </AdminGuard>
  );
}
