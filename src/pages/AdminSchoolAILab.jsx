import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { useSchoolPermissions } from '@/components/school-tv/useSchoolPermissions';
import { Button } from '@/components/ui/button';
import {
  Sparkles, Plus, Edit2, Trash2, ToggleLeft, ToggleRight,
  Loader2, RefreshCw, CheckCircle2, XCircle, ChevronDown, X, Save
} from 'lucide-react';

// ── constants ─────────────────────────────────────────────────────────────────

const TEMPLATE_TYPES = {
  story_generator:             'Story Generator',
  story_rewriter:              'Story Rewriter',
  caption_generator:           'Caption Generator',
  event_summary_generator:     'Event Summary',
  spotlight_summary:           'Spotlight Summary',
  yearbook_blurb_generator:    'Yearbook Blurb',
  video_script_generator:      'Video Script',
  headline_generator:          'Headline Generator',
  interview_question_generator:'Interview Questions',
  moderation_guidance:         'Moderation Guidance',
  tone_preset:                 'Tone / Style Preset',
};

const TONES = ['formal', 'warm', 'energetic', 'inspirational', 'professional'];
const FORMATS = ['text', 'array', 'json'];

const TYPE_GROUPS = [
  { label: 'Writing & Stories',  types: ['story_generator', 'story_rewriter', 'headline_generator'] },
  { label: 'Media & Social',     types: ['caption_generator', 'video_script_generator'] },
  { label: 'Events & Features',  types: ['event_summary_generator', 'spotlight_summary', 'interview_question_generator'] },
  { label: 'Yearbook',           types: ['yearbook_blurb_generator'] },
  { label: 'Governance',         types: ['moderation_guidance', 'tone_preset'] },
];

const BLANK_FORM = {
  name: '',
  template_type: 'story_generator',
  system_prompt: '',
  user_prompt_template: '',
  tone: 'warm',
  output_format: 'text',
  max_tokens: 500,
  temperature: 0.7,
  notes: '',
};

// ── TemplateModal ─────────────────────────────────────────────────────────────

function TemplateModal({ template, schoolSlug, onClose, onSaved }) {
  const [form, setForm] = useState(template
    ? { ...BLANK_FORM, ...template }
    : { ...BLANK_FORM }
  );
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim() || !form.system_prompt.trim() || !form.user_prompt_template.trim()) {
      alert('Name, system prompt, and user prompt template are required.');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      school_slug: schoolSlug,
      version: template ? (template.version || 1) + 1 : 1,
    };
    if (template?.id) {
      await base44.entities.AIPromptTemplates.update(template.id, payload);
    } else {
      await base44.entities.AIPromptTemplates.create(payload);
    }
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            {template ? 'Edit Template' : 'New Template'}
            {template?.version && <span className="ml-2 text-xs text-gray-400 font-normal">v{template.version}</span>}
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {/* Name + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Name *</label>
              <input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. Sports Recap Prompt"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Template Type *</label>
              <div className="relative">
                <select
                  value={form.template_type}
                  onChange={e => set('template_type', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {Object.entries(TEMPLATE_TYPES).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">System Prompt *</label>
            <textarea
              rows={4}
              value={form.system_prompt}
              onChange={e => set('system_prompt', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="You are a school content assistant…"
            />
          </div>

          {/* User Prompt Template */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              User Prompt Template *
              <span className="ml-2 text-gray-400 font-normal">Use {'{'+'variable'+'}'} placeholders</span>
            </label>
            <textarea
              rows={4}
              value={form.user_prompt_template}
              onChange={e => set('user_prompt_template', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Write a {tone} recap of {title}: {description}"
            />
          </div>

          {/* Tone / Format / Tokens / Temp */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tone</label>
              <div className="relative">
                <select value={form.tone} onChange={e => set('tone', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500">
                  {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Output Format</label>
              <div className="relative">
                <select value={form.output_format} onChange={e => set('output_format', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500">
                  {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Max Tokens</label>
              <input type="number" min={50} max={4000} value={form.max_tokens}
                onChange={e => set('max_tokens', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Temperature</label>
              <input type="number" min={0} max={1} step={0.1} value={form.temperature}
                onChange={e => set('temperature', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Admin Notes</label>
            <input value={form.notes} onChange={e => set('notes', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Optional internal notes" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {template ? 'Save Changes' : 'Create Template'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── TemplateCard ──────────────────────────────────────────────────────────────

function TemplateCard({ template, canEdit, onEdit, onToggle, onDelete }) {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    await onToggle(template);
    setToggling(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${template.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    await onDelete(template);
  };

  return (
    <div className={`bg-white rounded-xl border p-5 flex flex-col gap-3 ${template.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-gray-900 text-sm">{template.name}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold">
              {TEMPLATE_TYPES[template.template_type] || template.template_type}
            </span>
            {template.version > 1 && (
              <span className="text-xs text-gray-400">v{template.version}</span>
            )}
          </div>
          {template.tone && (
            <span className="text-xs text-gray-500 mt-0.5 block capitalize">{template.tone} tone · {template.output_format} output · {template.max_tokens} tokens</span>
          )}
          {template.notes && (
            <p className="text-xs text-gray-400 mt-1 italic">{template.notes}</p>
          )}
        </div>
        {template.is_active
          ? <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Active</span>
          : <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 flex items-center gap-1"><XCircle className="h-3 w-3" />Inactive</span>
        }
      </div>

      {/* Prompt preview */}
      <p className="text-xs text-gray-600 line-clamp-2 font-mono bg-gray-50 rounded px-2 py-1.5">
        {template.user_prompt_template || <em className="text-gray-400">No prompt set</em>}
      </p>

      <div className="flex items-center gap-2 pt-1">
        <span className="text-xs text-gray-400 mr-auto">{template.usage_count || 0} uses</span>
        {canEdit && (
          <>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-blue-600" onClick={() => onEdit(template)}>
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-orange-500" onClick={handleToggle} disabled={toggling}>
              {toggling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : template.is_active ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-red-500" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminSchoolAILab() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('schoolSlug') || 'hampton-dumont';
  const { can } = useSchoolPermissions(schoolSlug);

  const [templates, setTemplates]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [showActive, setShowActive] = useState('all'); // 'all' | 'active' | 'inactive'
  const [modal, setModal]           = useState(null); // null | 'new' | template object

  const canEdit = can('manage_ai_templates') || can('trigger_ai_jobs');

  const load = useCallback(async () => {
    setLoading(true);
    const data = await base44.entities.AIPromptTemplates.filter(
      { school_slug: schoolSlug },
      '-updated_date',
      200
    );
    setTemplates(data || []);
    setLoading(false);
  }, [schoolSlug]);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (t) => {
    await base44.entities.AIPromptTemplates.update(t.id, { is_active: !t.is_active });
    setTemplates(prev => prev.map(x => x.id === t.id ? { ...x, is_active: !t.is_active } : x));
  };

  const handleDelete = async (t) => {
    await base44.entities.AIPromptTemplates.delete(t.id);
    setTemplates(prev => prev.filter(x => x.id !== t.id));
  };

  // Filtered list
  const displayed = templates.filter(t => {
    if (typeFilter !== 'all' && t.template_type !== typeFilter) return false;
    if (showActive === 'active' && !t.is_active) return false;
    if (showActive === 'inactive' && t.is_active) return false;
    return true;
  });

  // Group displayed by category
  const grouped = TYPE_GROUPS.map(g => ({
    ...g,
    items: displayed.filter(t => g.types.includes(t.template_type)),
  })).filter(g => g.items.length > 0);

  // If type filter is active, skip grouping — just flat list
  const showGrouped = typeFilter === 'all';

  return (
    <AdminShell schoolSlug={schoolSlug}>
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-purple-600" />
                AI Lab — Templates
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage school-scoped prompt templates used by AI content jobs
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={load} className="gap-2">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {canEdit && (
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white gap-2" onClick={() => setModal('new')}>
                  <Plus className="h-4 w-4" /> New Template
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-6">

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total',    value: templates.length,                      color: 'bg-gray-50' },
              { label: 'Active',   value: templates.filter(t => t.is_active).length,  color: 'bg-green-50' },
              { label: 'Inactive', value: templates.filter(t => !t.is_active).length, color: 'bg-gray-50' },
              { label: 'Types',    value: new Set(templates.map(t => t.template_type)).size, color: 'bg-purple-50' },
            ].map(({ label, value, color }, i) => (
              <div key={i} className={`rounded-xl border border-gray-200 p-4 ${color}`}>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{label}</p>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
            <div className="relative">
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                className="pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="all">All Types</option>
                {Object.entries(TEMPLATE_TYPES).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={showActive} onChange={e => setShowActive(e.target.value)}
                className="pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <span className="text-xs text-gray-400 ml-auto">{displayed.length} template{displayed.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          )}

          {/* Empty */}
          {!loading && displayed.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <Sparkles className="h-12 w-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-600 font-semibold">No templates found</p>
              <p className="text-gray-400 text-sm mt-1">
                {canEdit ? 'Create your first template to get started.' : 'No templates have been created for this school yet.'}
              </p>
              {canEdit && (
                <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white gap-2" onClick={() => setModal('new')}>
                  <Plus className="h-4 w-4" /> New Template
                </Button>
              )}
            </div>
          )}

          {/* Grouped cards */}
          {!loading && displayed.length > 0 && showGrouped && (
            <div className="space-y-8">
              {grouped.map(group => (
                <div key={group.label}>
                  <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">{group.label}</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.items.map(t => (
                      <TemplateCard
                        key={t.id}
                        template={t}
                        canEdit={canEdit}
                        onEdit={t => setModal(t)}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Flat cards when filtered by type */}
          {!loading && displayed.length > 0 && !showGrouped && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayed.map(t => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  canEdit={canEdit}
                  onEdit={t => setModal(t)}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <TemplateModal
          template={modal === 'new' ? null : modal}
          schoolSlug={schoolSlug}
          onClose={() => setModal(null)}
          onSaved={load}
        />
      )}
    </AdminShell>
  );
}