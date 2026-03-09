import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminNav from '@/components/nav/AdminNav';
import AdminGuard from '@/components/auth/AdminGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Bot, Pencil, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AGENT_TYPES = ['sales_guide', 'sales_closer', 'objection_handler', 'plan_recommender', 'followup_agent'];
const TYPE_COLORS = { sales_guide: 'text-violet-400', sales_closer: 'text-orange-400', objection_handler: 'text-red-400', plan_recommender: 'text-green-400', followup_agent: 'text-cyan-400' };

function Field({ label, children }) {
  return <div><label className="text-xs text-slate-400 font-medium block mb-1">{label}</label>{children}</div>;
}

export default function AdminSalesPrompts() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const { data: prompts = [], isLoading } = useQuery({
    queryKey: ['sales-agent-prompts'],
    queryFn: () => base44.entities.SalesAgentPrompts.list('agent_type', 50),
  });

  const openEdit = (p) => { setEditing(p.id); setForm(p); setModal(true); };
  const openNew = () => { setEditing(null); setForm({ active: true }); setModal(true); };

  const save = async () => {
    if (!form.prompt_name || !form.agent_type || !form.prompt_text) return toast.error('Fill required fields');
    setSaving(true);
    if (editing) {
      await base44.entities.SalesAgentPrompts.update(editing, form);
    } else {
      await base44.entities.SalesAgentPrompts.create(form);
    }
    qc.invalidateQueries({ queryKey: ['sales-agent-prompts'] });
    toast.success('Prompt saved');
    setSaving(false);
    setModal(false);
    setForm({});
  };

  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-slate-950 text-white">
          <div className="border-b border-slate-800 bg-slate-900 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3"><Bot className="w-5 h-5 text-violet-400" /><h1 className="text-base font-bold">Sales Agent Prompts</h1></div>
            <Button size="sm" className="bg-violet-700 hover:bg-violet-600" onClick={openNew}><Plus className="w-3.5 h-3.5 mr-1.5" /> Add Prompt</Button>
          </div>

          <div className="max-w-4xl mx-auto px-6 py-6 space-y-3">
            {isLoading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-slate-500" /></div> : prompts.map(p => (
              <div key={p.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${TYPE_COLORS[p.agent_type] || 'text-slate-400'}`}>{p.agent_type?.replace('_', ' ')}</span>
                    {!p.active && <span className="text-xs text-red-400">inactive</span>}
                    {p.version_label && <span className="text-xs text-slate-600">{p.version_label}</span>}
                  </div>
                  <p className="text-sm font-semibold text-white">{p.prompt_name}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{p.prompt_text}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white" onClick={() => openEdit(p)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
            {!isLoading && prompts.length === 0 && <div className="text-center py-12 text-slate-600">No prompts yet. Seed data will appear here.</div>}
          </div>
        </div>

        <Dialog open={modal} onOpenChange={setModal}>
          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? 'Edit Prompt' : 'Add Prompt'}</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Agent Type *">
                  <Select value={form.agent_type || ''} onValueChange={v => set('agent_type', v)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {AGENT_TYPES.map(t => <SelectItem key={t} value={t} className="text-white">{t.replace('_', ' ')}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Prompt Name *"><Input className="bg-slate-800 border-slate-700 text-white" value={form.prompt_name || ''} onChange={e => set('prompt_name', e.target.value)} /></Field>
              </div>
              <Field label="Industry Context"><Input className="bg-slate-800 border-slate-700 text-white" value={form.industry_context || ''} onChange={e => set('industry_context', e.target.value)} placeholder="e.g. HVAC, general, small business" /></Field>
              <Field label="Prompt Text *">
                <textarea className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm" rows={10} value={form.prompt_text || ''} onChange={e => set('prompt_text', e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Version Label"><Input className="bg-slate-800 border-slate-700 text-white" value={form.version_label || ''} onChange={e => set('version_label', e.target.value)} placeholder="v1.0" /></Field>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.active !== false} onChange={e => set('active', e.target.checked)} className="w-4 h-4 accent-violet-600" />
                    <span className="text-sm text-slate-300">Active</span>
                  </label>
                </div>
              </div>
              <Button className="w-full bg-violet-700 hover:bg-violet-600" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Prompt'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </AdminNav>
    </AdminGuard>
  );
}