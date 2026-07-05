/**
 * P-001 Publishing Engine — Article List
 * Filterable list of all publishing articles with channel status indicators.
 */
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import {
  Search, Filter, Plus, ChevronRight, SlidersHorizontal, X, ExternalLink
} from 'lucide-react';
import {
  WORKFLOW_STATES, CHANNELS, CHANNEL_LIST, TARGET_STATES,
  STATUS_COLORS, CONTENT_TYPES, formatDate
} from './publishingData';

function ChannelDots({ targets }) {
  return (
    <div className="flex items-center gap-1">
      {CHANNEL_LIST.map(ch => {
        const target = targets.find(t => t.channel === ch);
        const cfg = CHANNELS[ch];
        const Icon = LucideIcons[cfg.icon] || LucideIcons.Circle;
        if (!target) {
          return (
            <div key={ch} className="w-5 h-5 rounded bg-slate-800/50 flex items-center justify-center" title={`${cfg.label}: Not configured`}>
              <Icon className="w-3 h-3 text-slate-700" />
            </div>
          );
        }
        const ts = TARGET_STATES[target.status] || TARGET_STATES.Pending;
        const c = STATUS_COLORS[ts.color] || STATUS_COLORS.slate;
        return (
          <div key={ch} className={`w-5 h-5 rounded ${c.bg} border ${c.border} flex items-center justify-center`} title={`${cfg.label}: ${ts.label}`}>
            <Icon className={`w-3 h-3 ${c.text}`} />
          </div>
        );
      })}
    </div>
  );
}

function ArticleRow({ article, targets, onSelect }) {
  const ws = WORKFLOW_STATES[article.status] || WORKFLOW_STATES.Draft;
  const c = STATUS_COLORS[ws.color];
  const publishedCount = targets.filter(t => t.status === 'Published').length;
  const totalTargets = targets.length;

  return (
    <button
      onClick={() => onSelect(article)}
      className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-900/30 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 transition-all text-left group"
    >
      {/* Status dot */}
      <div className={`w-2.5 h-2.5 rounded-full ${c.dot} flex-shrink-0`} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.bg} ${c.text} border ${c.border} flex-shrink-0`}>
            {ws.label}
          </span>
          {article.content_type && (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700 flex-shrink-0">
              {article.content_type}
            </span>
          )}
        </div>
        {article.summary && (
          <p className="text-xs text-slate-500 truncate">{article.summary}</p>
        )}
      </div>

      {/* Channel dots */}
      <div className="hidden lg:block flex-shrink-0">
        <ChannelDots targets={targets} />
      </div>

      {/* Stats */}
      <div className="text-right flex-shrink-0 hidden sm:block">
        <p className="text-xs text-slate-500">
          {publishedCount}/{totalTargets > 0 ? totalTargets : CHANNEL_LIST.length} channels
        </p>
        <p className="text-xs text-slate-600">{formatDate(article.created_date)}</p>
      </div>

      <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-slate-400 transition-colors flex-shrink-0" />
    </button>
  );
}

export default function ArticleList({ articles, targets, onSelectArticle, onNewArticle }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const hasFilters = statusFilter || typeFilter || searchQuery;

  const filtered = useMemo(() => {
    let result = [...articles];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.title?.toLowerCase().includes(q) ||
        a.summary?.toLowerCase().includes(q) ||
        a.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    if (statusFilter) result = result.filter(a => a.status === statusFilter);
    if (typeFilter) result = result.filter(a => a.content_type === typeFilter);
    return result;
  }, [articles, searchQuery, statusFilter, typeFilter]);

  function clearFilters() {
    setSearchQuery('');
    setStatusFilter(null);
    setTypeFilter(null);
  }

  function getArticleTargets(articleId) {
    return targets.filter(t => t.article_id === articleId);
  }

  return (
    <div className="space-y-4">
      {/* Search + Actions */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 text-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-3 h-3 text-slate-500 hover:text-white" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2.5 rounded-xl border transition-all ${
            showFilters || hasFilters
              ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        <button
          onClick={onNewArticle}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filters</h3>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-blue-400 hover:text-blue-300 font-semibold">
                Clear all
              </button>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">Status</label>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(WORKFLOW_STATES).map(([key, ws]) => {
                const c = STATUS_COLORS[ws.color];
                return (
                  <button
                    key={key}
                    onClick={() => setStatusFilter(statusFilter === key ? null : key)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      statusFilter === key
                        ? `${c.bg} ${c.border} ${c.text}`
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {ws.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Type */}
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">Type</label>
            <div className="flex flex-wrap gap-1.5">
              {CONTENT_TYPES.map(ct => (
                <button
                  key={ct}
                  onClick={() => setTypeFilter(typeFilter === ct ? null : ct)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    typeFilter === ct
                      ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {ct}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{filtered.length} article{filtered.length !== 1 ? 's' : ''}</span>
        {hasFilters && <span className="text-blue-400">Filtered</span>}
      </div>

      {/* Article list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <LucideIcons.FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 text-sm mb-2">
            {hasFilters ? 'No articles match your filters' : 'No articles yet'}
          </p>
          {hasFilters ? (
            <button onClick={clearFilters} className="text-blue-400 hover:text-blue-300 text-xs font-semibold">Clear filters</button>
          ) : (
            <button onClick={onNewArticle} className="text-blue-400 hover:text-blue-300 text-xs font-semibold">Create your first article</button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(article => (
            <ArticleRow
              key={article.id}
              article={article}
              targets={getArticleTargets(article.id)}
              onSelect={onSelectArticle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
