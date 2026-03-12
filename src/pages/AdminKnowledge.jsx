import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Search, BookOpen, Clock, AlertCircle } from 'lucide-react';

const CATEGORY_CONFIG = {
  sales: { label: 'Sales', emoji: '🎯', color: '#3b82f6' },
  client_success: { label: 'Client Success', emoji: '👥', color: '#10b981' },
  operations: { label: 'Operations', emoji: '⚙️', color: '#8b5cf6' },
  marketing: { label: 'Marketing', emoji: '📢', color: '#f59e0b' },
  automation: { label: 'Automation', emoji: '🤖', color: '#06b6d4' },
  leadership: { label: 'Leadership', emoji: '👔', color: '#ec4899' },
  platform_training: { label: 'Platform Training', emoji: '🎓', color: '#14b8a6' },
};

const DIFFICULTY_CONFIG = {
  beginner: { label: 'Beginner', badge: 'bg-green-100 text-green-700' },
  intermediate: { label: 'Intermediate', badge: 'bg-blue-100 text-blue-700' },
  advanced: { label: 'Advanced', badge: 'bg-purple-100 text-purple-700' },
};

const STATUS_CONFIG = {
  published: { label: 'Published', badge: 'bg-emerald-100 text-emerald-700', border: 'border-l-4 border-emerald-500' },
  review_needed: { label: 'Review Needed', badge: 'bg-yellow-100 text-yellow-700', border: 'border-l-4 border-yellow-500' },
  draft: { label: 'Draft', badge: 'bg-slate-100 text-slate-700', border: 'border-l-4 border-slate-500' },
};

export default function AdminKnowledge() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    base44.entities.KnowledgeArticle.list('-last_updated', 100)
      .then((data) => {
        setArticles(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-sm animate-pulse">Loading knowledge base…</div>
      </div>
    );
  }

  // Filter articles
  const filtered = articles.filter(a => {
    if (selectedCategory !== 'all' && a.knowledge_category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && a.difficulty_level !== selectedDifficulty) return false;
    if (searchTerm && !a.article_title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // KPIs
  const publishedCount = articles.filter(a => a.article_status === 'published').length;
  const reviewNeededCount = articles.filter(a => a.article_status === 'review_needed').length;
  const activeCategories = new Set(articles.map(a => a.knowledge_category)).size;
  const avgReadTime = articles.length > 0
    ? Math.round(articles.reduce((sum, a) => sum + (a.estimated_read_time_minutes || 0), 0) / articles.length)
    : 0;
  const trainingCoverageIndex = Math.round((publishedCount / articles.length) * 100) || 0;

  // Category distribution
  const categoryDistribution = Object.keys(CATEGORY_CONFIG).map(cat => ({
    name: CATEGORY_CONFIG[cat].label,
    count: articles.filter(a => a.knowledge_category === cat).length,
    color: CATEGORY_CONFIG[cat].color,
  })).filter(item => item.count > 0);

  // Insights
  const insights = [];

  const opsArticles = articles.filter(a => a.knowledge_category === 'operations' && a.article_status === 'published');
  if (opsArticles.length > 2) {
    insights.push({
      type: 'positive',
      title: 'Operations SOP Coverage Improving Onboarding Speed',
      description: `${opsArticles.length} operations SOPs published. Streamlined runbooks reducing onboarding friction.`,
      action: '⚙️ Continue expanding operations documentation; prioritize SLA and escalation SOPs',
    });
  }

  const salesArticles = articles.filter(a => a.knowledge_category === 'sales' && a.article_status === 'published');
  if (salesArticles.length > 1) {
    insights.push({
      type: 'positive',
      title: 'Sales Process Documentation Increasing Close Consistency',
      description: `${salesArticles.length} sales process guides published. Process standardization improving team alignment.`,
      action: '🎯 Maintain sales playbook updates monthly; include case studies and win/loss analysis',
    });
  }

  const automationArticles = articles.filter(a => a.knowledge_category === 'automation' && a.article_status === 'published');
  if (automationArticles.length < 2) {
    insights.push({
      type: 'alert',
      title: 'Automation Training Content Still Limited',
      description: `Only ${automationArticles.length} automation guide(s) published. Automation system complexity growing but documentation lagging.`,
      action: '🤖 Create automation training series: rules basics, conditions, flows, performance monitoring',
    });
  }

  const draftCount = articles.filter(a => a.article_status === 'draft').length;
  if (draftCount > 2) {
    insights.push({
      type: 'alert',
      title: `${draftCount} Articles in Draft—Accelerate Publishing`,
      description: 'Draft articles represent untapped knowledge. Create publishing workflow to surface finished content.',
      action: '📝 Review draft queue; assign owners; set publication dates for top 3 articles',
    });
  }

  const reviewQueue = articles.filter(a => a.article_status === 'review_needed');
  if (reviewQueue.length > 0) {
    insights.push({
      type: 'alert',
      title: `${reviewQueue.length} Article(s) Awaiting Review`,
      description: 'Review queue blocking knowledge updates. Establish editorial schedule.',
      action: '👀 Clear review queue within 48 hours; assign subject matter expert reviewers',
    });
  }

  const handleStatusUpdate = async (articleId, newStatus) => {
    await base44.entities.KnowledgeArticle.update(articleId, { article_status: newStatus });
    setArticles(articles.map(a => a.id === articleId ? { ...a, article_status: newStatus } : a));
    setSelectedArticle(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">📚</div>
            <h1 className="text-3xl font-black text-slate-900">NTA Knowledge Base</h1>
          </div>
          <p className="text-slate-600 text-sm">Centralized operational SOPs, processes, and training guides</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Published SOPs</p>
            <p className="text-3xl font-black text-emerald-600">{publishedCount}</p>
            <p className="text-xs text-slate-600 mt-2">Live documentation</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Review Needed</p>
            <p className="text-3xl font-black text-yellow-600">{reviewNeededCount}</p>
            <p className="text-xs text-slate-600 mt-2">Editorial queue</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Categories Active</p>
            <p className="text-3xl font-black text-blue-600">{activeCategories}</p>
            <p className="text-xs text-slate-600 mt-2">Knowledge areas</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Avg Read Time</p>
            <p className="text-3xl font-black text-purple-600">{avgReadTime}m</p>
            <p className="text-xs text-slate-600 mt-2">Per article</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Coverage Index</p>
            <p className="text-3xl font-black text-cyan-600">{trainingCoverageIndex}%</p>
            <p className="text-xs text-slate-600 mt-2">Knowledge complete</p>
          </div>
        </div>

        {/* SECTION 2 — Search & Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
              }`}
            >
              All Categories
            </button>
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedCategory === key
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
                }`}
              >
                {config.emoji} {config.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg"
            >
              <option value="all">All Difficulty Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* SECTION 3 — Article Grid */}
        <div>
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Knowledge Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length > 0 ? (
              filtered.map(article => {
                const categoryConfig = CATEGORY_CONFIG[article.knowledge_category];
                const difficultyConfig = DIFFICULTY_CONFIG[article.difficulty_level];
                const statusConfig = STATUS_CONFIG[article.article_status];
                return (
                  <button
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className={`rounded-xl p-5 text-left transition-all hover:shadow-lg ${statusConfig.border} bg-white border border-slate-200`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{article.article_title}</h4>
                        <p className="text-xs text-slate-600 mt-1">{categoryConfig.emoji} {categoryConfig.label}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${statusConfig.badge} flex-shrink-0 capitalize`}>
                        {article.article_status}
                      </span>
                    </div>

                    {/* Summary */}
                    <p className="text-xs text-slate-600 mb-3 line-clamp-2">{article.summary}</p>

                    {/* Meta */}
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-600">{article.estimated_read_time_minutes || 0} min read</span>
                      </div>
                      <span className={`font-semibold px-2 py-0.5 rounded ${difficultyConfig.badge} capitalize`}>
                        {difficultyConfig.label}
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-12">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No articles found matching your filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 5 — Knowledge Coverage Distribution */}
        {categoryDistribution.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Knowledge Distribution by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryDistribution} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12, color: '#1e293b' }}
                  formatter={(val) => [val, 'Articles']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {categoryDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* SECTION 6 — Intelligence Feed */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Knowledge Intelligence</h3>
            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div key={idx} className={`border rounded-xl p-5 ${
                  insight.type === 'positive'
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-rose-50 border-rose-200'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">
                      {insight.type === 'positive' ? '✓' : '⚠️'}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-black ${insight.type === 'positive' ? 'text-emerald-900' : 'text-rose-900'}`}>
                        {insight.title}
                      </h4>
                      <p className={`text-sm mt-1 ${insight.type === 'positive' ? 'text-emerald-800' : 'text-rose-800'}`}>
                        {insight.description}
                      </p>
                      <div className={`mt-3 text-xs font-bold ${insight.type === 'positive' ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {insight.action}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    {CATEGORY_CONFIG[selectedArticle.knowledge_category].emoji} {CATEGORY_CONFIG[selectedArticle.knowledge_category].label}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${DIFFICULTY_CONFIG[selectedArticle.difficulty_level].badge} capitalize`}>
                    {DIFFICULTY_CONFIG[selectedArticle.difficulty_level].label}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">{selectedArticle.article_title}</h3>
              </div>
              <button onClick={() => setSelectedArticle(null)} className="text-slate-400 hover:text-slate-600 text-2xl flex-shrink-0">×</button>
            </div>

            <div className="space-y-6 mb-6 pb-6 border-b border-slate-200">
              {/* Summary */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Summary</p>
                <p className="text-sm text-slate-700 leading-relaxed">{selectedArticle.summary}</p>
              </div>

              {/* Content Body */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Content</p>
                <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedArticle.content_body}
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Read Time</p>
                  <p className="text-lg font-black text-slate-900">{selectedArticle.estimated_read_time_minutes || 0}m</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Difficulty</p>
                  <p className="text-lg font-semibold text-slate-900 capitalize">{selectedArticle.difficulty_level}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Status</p>
                  <p className="text-lg font-semibold text-slate-900 capitalize">{selectedArticle.article_status}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Updated</p>
                  <p className="text-sm text-slate-700">{selectedArticle.last_updated || '—'}</p>
                </div>
              </div>
            </div>

            {/* Status Actions */}
            <div className="space-y-2">
              {selectedArticle.article_status === 'draft' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedArticle.id, 'published')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ✓ Publish Article
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedArticle.id, 'review_needed')}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    👀 Send to Review
                  </button>
                </>
              )}
              {selectedArticle.article_status === 'review_needed' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedArticle.id, 'published')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ✓ Approve & Publish
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedArticle.id, 'draft')}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    📝 Back to Draft
                  </button>
                </>
              )}
              {selectedArticle.article_status === 'published' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedArticle.id, 'review_needed')}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    👀 Send to Review
                  </button>
                </>
              )}
              <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 text-sm font-bold py-2 rounded-lg transition-colors">
                📋 Duplicate Article
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}