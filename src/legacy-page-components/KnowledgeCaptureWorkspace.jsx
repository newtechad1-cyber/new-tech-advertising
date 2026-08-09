// K-001 Knowledge Assetization System — Knowledge Capture Workspace
// Route: /admin/knowledge-capture
// Department: 90 Knowledge Library
// Version: v1.0 — Release 0.2
//
// 3-panel cockpit layout:
// LEFT:   Capture input (raw text, type, source, flags)
// CENTER: AI-organized draft (title, summary, key idea, tags, uses)
// RIGHT:  Related assets and recommendations

import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  Brain, Lightbulb, BookOpen, Send, Archive, CheckCircle,
  FileText, Sparkles, Tag, Link, ArrowRight, Clock, AlertCircle,
  Mic, MessageSquare, Upload, Users, ChevronDown, ChevronUp,
  RefreshCw, Eye, Plus, Search, Filter, Zap,
} from 'lucide-react';

// ── Config ──

const CAPTURE_TYPES = {
  idea:                 { label: 'Idea',                emoji: '💡', color: 'bg-yellow-100 text-yellow-700' },
  lesson:              { label: 'Lesson',              emoji: '📚', color: 'bg-blue-100 text-blue-700' },
  sales_insight:       { label: 'Sales Insight',       emoji: '🎯', color: 'bg-green-100 text-green-700' },
  client_pattern:      { label: 'Client Pattern',      emoji: '🔄', color: 'bg-purple-100 text-purple-700' },
  operating_principle: { label: 'Operating Principle',  emoji: '⚙️', color: 'bg-slate-100 text-slate-700' },
  sop_improvement:     { label: 'SOP Improvement',     emoji: '📋', color: 'bg-orange-100 text-orange-700' },
  story:               { label: 'Story',               emoji: '📖', color: 'bg-pink-100 text-pink-700' },
  framework:           { label: 'Framework',            emoji: '🏗️', color: 'bg-indigo-100 text-indigo-700' },
  faq:                 { label: 'FAQ',                 emoji: '❓', color: 'bg-teal-100 text-teal-700' },
  training_note:       { label: 'Training Note',       emoji: '🎓', color: 'bg-cyan-100 text-cyan-700' },
  content_seed:        { label: 'Content Seed',        emoji: '🌱', color: 'bg-emerald-100 text-emerald-700' },
};

const STATUS_CONFIG = {
  captured:     { label: 'Captured',     color: 'bg-slate-100 text-slate-700',   dot: 'bg-slate-400' },
  organized:    { label: 'Organized',    color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500' },
  drafted:      { label: 'Drafted',      color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  needs_review: { label: 'Needs Review', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  approved:     { label: 'Approved',     color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  archived:     { label: 'Archived',     color: 'bg-gray-100 text-gray-500',     dot: 'bg-gray-400' },
};

const PRIORITY_CONFIG = {
  low:    { label: 'Low',    color: 'text-slate-500' },
  medium: { label: 'Medium', color: 'text-blue-600' },
  high:   { label: 'High',   color: 'text-orange-600' },
  urgent: { label: 'Urgent', color: 'text-red-600' },
};

const SERIES_CONFIG = {
  'K-Series': { label: 'K-Series (Knowledge)',   color: 'bg-indigo-100 text-indigo-700' },
  'E-Series': { label: 'E-Series (Execution)',    color: 'bg-green-100 text-green-700' },
  'A-Series': { label: 'A-Series (Automation)',    color: 'bg-cyan-100 text-cyan-700' },
  'M-Series': { label: 'M-Series (Measurement)',  color: 'bg-amber-100 text-amber-700' },
};

const DEPARTMENTS = {
  '00_executive_office': '00 Executive Office',
  '01_sales':            '01 Sales',
  '02_client_success':   '02 Client Success',
  '03_content_production': '03 Content Production',
  '04_operations':       '04 Operations',
  '05_ai_automation':    '05 AI & Automation',
  '90_knowledge_library': '90 Knowledge Library',
};

// ── Main Component ──

export default function KnowledgeCaptureWorkspace() {
  const [captures, setCaptures] = useState([]);
  const [selectedCapture, setSelectedCapture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [organizing, setOrganizing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCaptureList, setShowCaptureList] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // New capture form state
  const [newCapture, setNewCapture] = useState({
    raw_capture: '',
    capture_type: '',
    source: '',
    created_from_voice: false,
    created_from_file: false,
    created_from_chat: false,
    created_from_client_conversation: false,
  });

  // Load captures
  useEffect(() => {
    loadCaptures();
  }, []);

  async function loadCaptures() {
    try {
      const data = await base44.entities.KnowledgeCapture.list('-created_date', 100);
      setCaptures(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load captures:', err);
      setLoading(false);
    }
  }

  // Save a new capture
  async function handleSaveCapture() {
    if (!newCapture.raw_capture.trim()) return;
    setSaving(true);
    try {
      const created = await base44.entities.KnowledgeCapture.create({
        ...newCapture,
        status: 'captured',
        priority: 'medium',
      });
      setCaptures(prev => [created, ...prev]);
      setSelectedCapture(created);
      setNewCapture({
        raw_capture: '',
        capture_type: '',
        source: '',
        created_from_voice: false,
        created_from_file: false,
        created_from_chat: false,
        created_from_client_conversation: false,
      });
    } catch (err) {
      console.error('Save failed:', err);
    }
    setSaving(false);
  }

  // Organize with AI
  async function handleOrganize() {
    if (!selectedCapture) return;
    setOrganizing(true);
    try {
      await base44.functions.organizeKnowledgeCapture({ captureId: selectedCapture.id });
      // Refresh the capture
      const updated = await base44.entities.KnowledgeCapture.get(selectedCapture.id);
      setSelectedCapture(updated);
      setCaptures(prev => prev.map(c => c.id === updated.id ? updated : c));
    } catch (err) {
      console.error('Organize failed:', err);
    }
    setOrganizing(false);
  }

  // Update capture status
  async function handleStatusChange(newStatus) {
    if (!selectedCapture) return;
    const updateData = { status: newStatus };
    if (newStatus === 'approved') {
      updateData.approved_date = new Date().toISOString().split('T')[0];
      updateData.reviewed_by = 'Rick Hesse';
    }
    const updated = await base44.entities.KnowledgeCapture.update(selectedCapture.id, updateData);
    setSelectedCapture(updated);
    setCaptures(prev => prev.map(c => c.id === updated.id ? updated : c));
  }

  // Filter captures
  const filteredCaptures = captures.filter(c => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (searchTerm && !(c.title || c.raw_capture || '').toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-sm animate-pulse flex items-center gap-2">
          <Brain className="w-5 h-5" /> Loading Knowledge Engine…
        </div>
      </div>
    );
  }

  // KPIs
  const totalCaptures = captures.length;
  const capturedCount = captures.filter(c => c.status === 'captured').length;
  const organizedCount = captures.filter(c => c.status === 'organized').length;
  const needsReviewCount = captures.filter(c => c.status === 'needs_review').length;
  const approvedCount = captures.filter(c => c.status === 'approved').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Knowledge Engine</h1>
              <p className="text-xs text-slate-500">K-001 · Department 90 · Release 0.2</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-slate-900">{totalCaptures}</div>
              <div className="text-xs text-slate-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{organizedCount}</div>
              <div className="text-xs text-slate-500">Organized</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">{needsReviewCount}</div>
              <div className="text-xs text-slate-500">Review</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-600">{approvedCount}</div>
              <div className="text-xs text-slate-500">Approved</div>
            </div>
            <button
              onClick={() => setShowCaptureList(!showCaptureList)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-slate-100 rounded-lg hover:bg-slate-200 transition"
            >
              <FileText className="w-4 h-4" />
              {showCaptureList ? 'Hide List' : 'Show All'}
              {showCaptureList ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Capture List (collapsible) */}
      {showCaptureList && (
        <div className="bg-white border-b border-slate-200 px-6 py-4 max-h-64 overflow-y-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search captures…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            {filteredCaptures.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCapture(c)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-3 transition ${
                  selectedCapture?.id === c.id ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[c.status]?.dot || 'bg-slate-300'}`} />
                <span className="flex-1 truncate font-medium text-slate-700">
                  {c.title || c.raw_capture?.substring(0, 60) || 'Untitled'}
                </span>
                {c.capture_type && (
                  <span className={`px-2 py-0.5 rounded text-xs ${CAPTURE_TYPES[c.capture_type]?.color || 'bg-slate-100'}`}>
                    {CAPTURE_TYPES[c.capture_type]?.emoji} {CAPTURE_TYPES[c.capture_type]?.label}
                  </span>
                )}
                {c.suggested_series && (
                  <span className={`px-2 py-0.5 rounded text-xs ${SERIES_CONFIG[c.suggested_series]?.color || 'bg-slate-100'}`}>
                    {c.suggested_series}
                  </span>
                )}
              </button>
            ))}
            {filteredCaptures.length === 0 && (
              <div className="text-center text-sm text-slate-400 py-4">No captures found</div>
            )}
          </div>
        </div>
      )}

      {/* 3-Panel Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6">

        {/* ── LEFT: Capture Input ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h2 className="font-semibold text-slate-900">Capture</h2>
            <span className="text-xs text-slate-400 ml-auto">Quick capture → AI organizes</span>
          </div>

          {/* Raw capture textarea */}
          <textarea
            value={selectedCapture ? (selectedCapture.raw_capture || '') : newCapture.raw_capture}
            onChange={e => {
              if (selectedCapture) {
                setSelectedCapture(prev => ({ ...prev, raw_capture: e.target.value }));
              } else {
                setNewCapture(prev => ({ ...prev, raw_capture: e.target.value }));
              }
            }}
            placeholder="Capture your idea, lesson, insight, framework, story…&#10;&#10;Just dump it here. AI will organize it."
            className="flex-1 min-h-[200px] p-4 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-slate-50"
          />

          {/* Capture type selector */}
          <div className="mt-4">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Capture Type</label>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(CAPTURE_TYPES).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => {
                    if (selectedCapture) {
                      setSelectedCapture(prev => ({ ...prev, capture_type: key }));
                    } else {
                      setNewCapture(prev => ({ ...prev, capture_type: key }));
                    }
                  }}
                  className={`px-2 py-1 rounded text-xs transition ${
                    (selectedCapture?.capture_type || newCapture.capture_type) === key
                      ? cfg.color + ' ring-2 ring-offset-1 ring-indigo-400'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {cfg.emoji} {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Source */}
          <div className="mt-3">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Source</label>
            <input
              type="text"
              value={selectedCapture ? (selectedCapture.source || '') : newCapture.source}
              onChange={e => {
                if (selectedCapture) {
                  setSelectedCapture(prev => ({ ...prev, source: e.target.value }));
                } else {
                  setNewCapture(prev => ({ ...prev, source: e.target.value }));
                }
              }}
              placeholder="Slack, phone call, meeting, shower thought…"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Source flags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { key: 'created_from_voice', icon: Mic, label: 'Voice' },
              { key: 'created_from_chat', icon: MessageSquare, label: 'Chat' },
              { key: 'created_from_file', icon: Upload, label: 'File' },
              { key: 'created_from_client_conversation', icon: Users, label: 'Client' },
            ].map(({ key, icon: Icon, label }) => {
              const active = selectedCapture ? selectedCapture[key] : newCapture[key];
              return (
                <button
                  key={key}
                  onClick={() => {
                    if (selectedCapture) {
                      setSelectedCapture(prev => ({ ...prev, [key]: !prev[key] }));
                    } else {
                      setNewCapture(prev => ({ ...prev, [key]: !prev[key] }));
                    }
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition ${
                    active ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3 h-3" /> {label}
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex gap-2">
            {!selectedCapture ? (
              <button
                onClick={handleSaveCapture}
                disabled={saving || !newCapture.raw_capture.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {saving ? 'Saving…' : 'Save Capture'}
              </button>
            ) : (
              <>
                <button
                  onClick={() => setSelectedCapture(null)}
                  className="px-3 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm hover:bg-slate-200 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={async () => {
                    await base44.entities.KnowledgeCapture.update(selectedCapture.id, {
                      raw_capture: selectedCapture.raw_capture,
                      capture_type: selectedCapture.capture_type,
                      source: selectedCapture.source,
                      created_from_voice: selectedCapture.created_from_voice,
                      created_from_file: selectedCapture.created_from_file,
                      created_from_chat: selectedCapture.created_from_chat,
                      created_from_client_conversation: selectedCapture.created_from_client_conversation,
                    });
                    loadCaptures();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-600 text-white rounded-xl font-medium text-sm hover:bg-slate-700 transition"
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── CENTER: AI-Organized Draft ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h2 className="font-semibold text-slate-900">AI-Organized Draft</h2>
          </div>

          {selectedCapture ? (
            <div className="flex-1 space-y-4 overflow-y-auto">
              {/* Status + Priority */}
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[selectedCapture.status]?.color || 'bg-slate-100'}`}>
                  {STATUS_CONFIG[selectedCapture.status]?.label || selectedCapture.status}
                </span>
                {selectedCapture.priority && (
                  <span className={`text-xs font-medium ${PRIORITY_CONFIG[selectedCapture.priority]?.color || ''}`}>
                    {PRIORITY_CONFIG[selectedCapture.priority]?.label} Priority
                  </span>
                )}
                {selectedCapture.suggested_series && (
                  <span className={`px-2 py-0.5 rounded text-xs ${SERIES_CONFIG[selectedCapture.suggested_series]?.color || 'bg-slate-100'}`}>
                    {selectedCapture.suggested_series}
                  </span>
                )}
              </div>

              {/* Title */}
              {selectedCapture.title && (
                <div>
                  <label className="text-xs font-medium text-slate-400">Title</label>
                  <div className="text-lg font-bold text-slate-900">{selectedCapture.title}</div>
                </div>
              )}

              {/* Key Idea */}
              {selectedCapture.key_idea && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 border border-indigo-100">
                  <label className="text-xs font-medium text-indigo-500 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Key Idea
                  </label>
                  <div className="text-sm font-medium text-slate-800 mt-1">{selectedCapture.key_idea}</div>
                </div>
              )}

              {/* Summary */}
              {selectedCapture.summary && (
                <div>
                  <label className="text-xs font-medium text-slate-400">Summary</label>
                  <div className="text-sm text-slate-700 mt-1">{selectedCapture.summary}</div>
                </div>
              )}

              {/* Classification */}
              {(selectedCapture.department || selectedCapture.ai_suggested_document_type) && (
                <div className="grid grid-cols-2 gap-3">
                  {selectedCapture.department && (
                    <div>
                      <label className="text-xs font-medium text-slate-400">Department</label>
                      <div className="text-sm text-slate-700 mt-0.5">{DEPARTMENTS[selectedCapture.department] || selectedCapture.department}</div>
                    </div>
                  )}
                  {selectedCapture.ai_suggested_document_type && (
                    <div>
                      <label className="text-xs font-medium text-slate-400">Document Type</label>
                      <div className="text-sm text-slate-700 mt-0.5">{selectedCapture.ai_suggested_document_type}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {selectedCapture.tags && (
                <div>
                  <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Tags
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedCapture.tags.split(',').map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Possible Uses */}
              {selectedCapture.possible_uses && (
                <div>
                  <label className="text-xs font-medium text-slate-400">Possible Uses</label>
                  <div className="text-sm text-slate-700 mt-1">{selectedCapture.possible_uses}</div>
                </div>
              )}

              {/* Suggested Next Action */}
              {selectedCapture.ai_suggested_next_action && (
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                  <label className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" /> Suggested Next Action
                  </label>
                  <div className="text-sm text-slate-800 mt-1">{selectedCapture.ai_suggested_next_action}</div>
                </div>
              )}

              {/* Not yet organized */}
              {selectedCapture.status === 'captured' && !selectedCapture.title && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-8">
                  <Sparkles className="w-8 h-8 mb-2 opacity-40" />
                  <div className="text-sm">Click "Organize with AI" to process this capture</div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-12">
              <Brain className="w-10 h-10 mb-3 opacity-30" />
              <div className="text-sm font-medium">No capture selected</div>
              <div className="text-xs mt-1">Write something on the left, or select from the list</div>
            </div>
          )}

          {/* Center action buttons */}
          {selectedCapture && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={handleOrganize}
                disabled={organizing}
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-purple-600 text-white rounded-xl font-medium text-sm hover:bg-purple-700 disabled:opacity-40 transition"
              >
                {organizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {organizing ? 'Organizing…' : 'Organize with AI'}
              </button>
              <button
                onClick={() => handleStatusChange('needs_review')}
                disabled={selectedCapture.status === 'needs_review'}
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-yellow-500 text-white rounded-xl font-medium text-sm hover:bg-yellow-600 disabled:opacity-40 transition"
              >
                <Eye className="w-4 h-4" /> Send to Review
              </button>
              <button
                onClick={() => handleStatusChange('approved')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-600 text-white rounded-xl font-medium text-sm hover:bg-emerald-700 transition"
              >
                <CheckCircle className="w-4 h-4" /> Approve Asset
              </button>
              <button
                onClick={() => handleStatusChange('archived')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-500 text-white rounded-xl font-medium text-sm hover:bg-slate-600 transition"
              >
                <Archive className="w-4 h-4" /> Archive
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT: Related Assets & Recommendations ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Link className="w-5 h-5 text-blue-500" />
            <h2 className="font-semibold text-slate-900">Related & Recommendations</h2>
          </div>

          {selectedCapture ? (
            <div className="flex-1 space-y-5 overflow-y-auto">
              {/* Related Assets */}
              {selectedCapture.related_assets && (
                <div>
                  <label className="text-xs font-medium text-slate-400 flex items-center gap-1 mb-2">
                    <Link className="w-3 h-3" /> Related Assets
                  </label>
                  <div className="space-y-1.5">
                    {selectedCapture.related_assets.split(',').map((asset, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg text-sm text-blue-700">
                        <BookOpen className="w-4 h-4 flex-shrink-0" />
                        <span>{asset.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Asset Number */}
              {selectedCapture.suggested_k_number && (
                <div>
                  <label className="text-xs font-medium text-slate-400">Suggested Asset Number</label>
                  <div className="text-sm font-mono font-bold text-indigo-700 mt-1">{selectedCapture.suggested_k_number}</div>
                </div>
              )}

              {/* Quick Actions */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-2 block">Quick Actions</label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => handleStatusChange('drafted')}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm hover:bg-purple-100 transition text-left"
                  >
                    <FileText className="w-4 h-4" /> Create K-Series Draft
                  </button>
                  <button
                    onClick={() => handleStatusChange('drafted')}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 transition text-left"
                  >
                    <FileText className="w-4 h-4" /> Create SOP Draft
                  </button>
                  <button
                    onClick={() => handleStatusChange('drafted')}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-cyan-50 text-cyan-700 rounded-lg text-sm hover:bg-cyan-100 transition text-left"
                  >
                    <FileText className="w-4 h-4" /> Create Content Draft
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm hover:bg-amber-100 transition text-left">
                    <Send className="w-4 h-4" /> Send to Gemini Review
                  </button>
                </div>
              </div>

              {/* Recent captures in same series */}
              {selectedCapture.suggested_series && (
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-2 block">
                    Other {selectedCapture.suggested_series} Captures
                  </label>
                  <div className="space-y-1">
                    {captures
                      .filter(c => c.id !== selectedCapture.id && c.suggested_series === selectedCapture.suggested_series)
                      .slice(0, 5)
                      .map(c => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedCapture(c)}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-50 transition flex items-center gap-2"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[c.status]?.dot || 'bg-slate-300'}`} />
                          <span className="truncate text-slate-600">{c.title || c.raw_capture?.substring(0, 40) || 'Untitled'}</span>
                        </button>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-12">
              <Link className="w-10 h-10 mb-3 opacity-30" />
              <div className="text-sm">Select a capture to see related assets</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
