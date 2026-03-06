import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CATEGORIES = [
  { value: 'lead_pipeline', label: 'Lead Pipeline' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'content_strategy', label: 'Content Strategy' },
  { value: 'content_production', label: 'Content Production' },
  { value: 'scheduling_publishing', label: 'Scheduling & Publishing' },
  { value: 'reporting_insights', label: 'Reporting & Insights' },
  { value: 'billing_retention', label: 'Billing & Retention' },
];

const JOB_TYPES = [
  'lead_scoring', 'email_sequence', 'onboarding_setup',
  'content_generation', 'image_generation', 'video_generation',
  'report_generation', 'other'
];

export default function AgentEditModal({ agent, onClose, onSaved }) {
  const [form, setForm] = useState({ ...agent });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleArrayField = (k, v) => {
    set(k, v.split(',').map(s => s.trim()).filter(Boolean));
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form };
    if (agent.id) {
      await base44.entities.AiAgent.update(agent.id, data);
    } else {
      await base44.entities.AiAgent.create(data);
    }
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-white font-bold text-lg">{agent.id ? 'Edit Agent' : 'New Agent'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Agent Name *</label>
              <input className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" value={form.name || ''} onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Key (slug) *</label>
              <input className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm font-mono" value={form.key || ''} onChange={e => set('key', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-xs mb-1 block">Description</label>
            <textarea className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" rows={2} value={form.description || ''} onChange={e => set('description', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Category</label>
              <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" value={form.category || ''} onChange={e => set('category', e.target.value)}>
                <option value="">Select...</option>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Phase</label>
              <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" value={form.phase || 1} onChange={e => set('phase', parseInt(e.target.value))}>
                <option value={1}>Phase 1 — Core</option>
                <option value={2}>Phase 2 — Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-xs mb-1 block">Trigger Event</label>
            <input className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm font-mono" placeholder="e.g. Lead.created or OnboardingProfile.status=completed" value={form.trigger_event || ''} onChange={e => set('trigger_event', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Input Entities (comma-separated)</label>
              <input className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" placeholder="Lead, Company" value={(form.input_entities || []).join(', ')} onChange={e => handleArrayField('input_entities', e.target.value)} />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Output Entities (comma-separated)</label>
              <input className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" placeholder="Opportunity, AgentJob" value={(form.output_entities || []).join(', ')} onChange={e => handleArrayField('output_entities', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Job Type</label>
              <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" value={form.job_type || ''} onChange={e => set('job_type', e.target.value)}>
                <option value="">Select...</option>
                {JOB_TYPES.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Default Model</label>
              <input className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" value={form.default_model || 'gpt-4o-mini'} onChange={e => set('default_model', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-xs mb-1 block">System Prompt</label>
            <textarea className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm font-mono" rows={4} value={form.system_prompt || ''} onChange={e => set('system_prompt', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Est. Cost / Run (USD)</label>
              <input type="number" step="0.001" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" value={form.estimated_cost_usd || ''} onChange={e => set('estimated_cost_usd', parseFloat(e.target.value))} />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Notes</label>
              <input className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" value={form.notes || ''} onChange={e => set('notes', e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <Switch checked={!!form.is_enabled} onCheckedChange={v => set('is_enabled', v)} />
              <span className="text-white text-sm">Enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={!!form.requires_human_review} onCheckedChange={v => set('requires_human_review', v)} />
              <span className="text-white text-sm">Requires Human Review</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-slate-700">
          <Button className="flex-1 bg-violet-600 hover:bg-violet-500 text-white" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Agent'}
          </Button>
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}