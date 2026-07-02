// K-001 Knowledge Assetization System — Knowledge Review Queue
// Route: /admin/knowledge-review
// Department: 90 Knowledge Library
// Version: v1.0 — Release 0.2
//
// Shows all knowledge captures organized by status with priority sorting.
// Quick-action buttons for approve, archive, and re-organize.

import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  Brain, CheckCircle, Archive, Eye, Clock, AlertCircle,
  ChevronRight, Sparkles, Tag, RefreshCw, Filter,
  ArrowUp, ArrowDown, Zap,
} from 'lucide-react';

const STATUS_CONFIG = {
  captured:     { label: 'Captured',     color: 'bg-slate-100 text-slate-700',    dot: 'bg-slate-400',   order: 0 },
  organized:    { label: 'Organized',    color: 'bg-blue-100 text-blue-700',      dot: 'bg-blue-500',    order: 1 },
  drafted:      { label: 'Drafted',      color: 'bg-purple-100 text-purple-700',  dot: 'bg-purple-500',  order: 2 },
  needs_review: { label: 'Needs Review', color: 'bg-yellow-100 text-yellow-700',  dot: 'bg-yellow-500',  order: 3 },
  approved:     { label: 'Approved',     color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', order: 4 },
  archived:     { label: 'Archived',     color: 'bg-gray-100 text-gray-500',      dot: 'bg-gray-400',    order: 5 },
};

const PRIORITY_ORDER = { urgent: 0, high: 1, medium: 2, low: 3 };
const PRIORITY_ICONS = {
  urgent: { color: 'text-red-600',    bg: 'bg-red-50' },
  high:   { color: 'text-orange-600', bg: 'bg-orange-50' },
  medium: { color: 'text-blue-600',   bg: 'bg-blue-50' },
  low:    { color: 'text-slate-500',  bg: 'bg-slate-50' },
};

const SERIES_COLORS = {
  'K-Series': 'bg-indigo-100 text-indigo-700',
  'E-Series': 'bg-green-100 text-green-700',
  'A-Series': 'bg-cyan-100 text-cyan-700',
  'M-Series': 'bg-amber-100 text-amber-700',
};

export default function KnowledgeReviewQueue() {
  const [captures, setCaptures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState('needs_review');

  useEffect(() => {
    loadCaptures();
  }, []);

  async function loadCaptures() {
    try {
      const data = await base44.entities.KnowledgeCapture.list('-created_date', 200);
      setCaptures(data);
    } catch (err) {
      console.error('Failed to load captures:', err);
    }
    setLoading(false);
  }

  async function updateStatus(id, newStatus) {
    const updateData = { status: newStatus };
    if (newStatus === 'approved') {
      updateData.approved_date = new Date().toISOString().split('T')[0];
      updateData.reviewed_by = 'Rick Hesse';
    }
    await base44.entities.KnowledgeCapture.update(id, updateData);
    setCaptures(prev => prev.map(c => c.id === id ? { ...c, ...updateData } : c));
  }

  // Group by status tab
  const tabCounts = {};
  Object.keys(STATUS_CONFIG).forEach(s => {
    tabCounts[s] = captures.filter(c => c.status === s).length;
  });

  // Filter and sort
  const filtered = captures
    .filter(c => c.status === activeTab)
    .sort((a, b) => (PRIORITY_ORDER[a.priority] || 2) - (PRIORITY_ORDER[b.priority] || 2));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-sm animate-pulse flex items-center gap-2">
          <Brain className="w-5 h-5" /> Loading Review Queue…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Knowledge Review Queue</h1>
              <p className="text-xs text-slate-500">K-001 · Review and approve knowledge assets</p>
            </div>
          </div>
          <button
            onClick={loadCaptures}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-sm text-slate-600 hover:bg-slate-200 transition"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-1 overflow-x-auto py-2">
          {Object.entries(STATUS_CONFIG).filter(([k]) => k !== 'archived').map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                activeTab === key
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeTab === key ? 'bg-white' : cfg.dot}`} />
              {cfg.label}
              {tabCounts[key] > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === key ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {tabCounts[key]}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={() => setActiveTab('archived')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ml-auto ${
              activeTab === 'archived'
                ? 'bg-slate-900 text-white'
                : 'text-slate-400 hover:bg-slate-100'
            }`}
          >
            <Archive className="w-3.5 h-3.5" /> Archived ({tabCounts.archived || 0})
          </button>
        </div>
      </div>

      {/* Queue Items */}
      <div className="p-6">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="text-slate-400 text-sm">
              No items with status "{STATUS_CONFIG[activeTab]?.label}"
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(capture => {
              const isExpanded = expandedId === capture.id;
              const priorityCfg = PRIORITY_ICONS[capture.priority] || PRIORITY_ICONS.medium;

              return (
                <div
                  key={capture.id}
                  className={`bg-white rounded-xl border transition ${
                    isExpanded ? 'border-indigo-200 shadow-md' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Row */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : capture.id)}
                    className="w-full text-left px-5 py-4 flex items-center gap-4"
                  >
                    {/* Priority indicator */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${priorityCfg.bg}`}>
                      {capture.priority === 'urgent' ? (
                        <AlertCircle className={`w-4 h-4 ${priorityCfg.color}`} />
                      ) : capture.priority === 'high' ? (
                        <ArrowUp className={`w-4 h-4 ${priorityCfg.color}`} />
                      ) : (
                        <ArrowDown className={`w-4 h-4 ${priorityCfg.color}`} />
                      )}
                    </div>

                    {/* Title + preview */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900 truncate">
                        {capture.title || capture.raw_capture?.substring(0, 60) || 'Untitled Capture'}
                      </div>
                      {capture.key_idea && (
                        <div className="text-xs text-slate-500 truncate mt-0.5">{capture.key_idea}</div>
                      )}
                    </div>

                    {/* Badges */}
                    {capture.suggested_series && (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${SERIES_COLORS[capture.suggested_series] || 'bg-slate-100'}`}>
                        {capture.suggested_series}
                      </span>
                    )}
                    {capture.capture_type && (
                      <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600">
                        {capture.capture_type.replace(/_/g, ' ')}
                      </span>
                    )}

                    {/* Date */}
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {capture.created_date ? new Date(capture.created_date).toLocaleDateString() : '—'}
                    </span>

                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-5 pb-4 border-t border-slate-100">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {/* Raw capture */}
                        <div>
                          <label className="text-xs font-medium text-slate-400">Raw Capture</label>
                          <div className="text-sm text-slate-700 mt-1 bg-slate-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                            {capture.raw_capture || '—'}
                          </div>
                        </div>

                        {/* AI Summary */}
                        <div>
                          <label className="text-xs font-medium text-slate-400">Summary</label>
                          <div className="text-sm text-slate-700 mt-1">{capture.summary || 'Not yet organized'}</div>
                          {capture.possible_uses && (
                            <>
                              <label className="text-xs font-medium text-slate-400 mt-3 block">Possible Uses</label>
                              <div className="text-sm text-slate-600 mt-1">{capture.possible_uses}</div>
                            </>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-slate-400">Actions</label>
                          {capture.ai_suggested_next_action && (
                            <div className="bg-emerald-50 rounded-lg p-2.5 text-xs text-emerald-700 border border-emerald-100">
                              <span className="font-medium">AI Suggestion:</span> {capture.ai_suggested_next_action}
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-1.5 mt-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); updateStatus(capture.id, 'approved'); }}
                              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); updateStatus(capture.id, 'needs_review'); }}
                              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-yellow-500 text-white rounded-lg text-xs font-medium hover:bg-yellow-600 transition"
                            >
                              <Eye className="w-3.5 h-3.5" /> To Review
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); updateStatus(capture.id, 'organized'); }}
                              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition"
                            >
                              <Sparkles className="w-3.5 h-3.5" /> Re-organize
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); updateStatus(capture.id, 'archived'); }}
                              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-500 text-white rounded-lg text-xs font-medium hover:bg-slate-600 transition"
                            >
                              <Archive className="w-3.5 h-3.5" /> Archive
                            </button>
                          </div>

                          {/* Tags */}
                          {capture.tags && (
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-1">
                                {capture.tags.split(',').map((tag, i) => (
                                  <span key={i} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">
                                    {tag.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
