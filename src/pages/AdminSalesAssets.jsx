import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminNav from '@/components/nav/AdminNav';
import AdminGuard from '@/components/auth/AdminGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Film, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ASSET_TYPES = ['demo_video', 'case_study', 'pricing_video', 'roi_video', 'sales_video', 'pdf', 'page', 'image', 'other'];

function Field({ label, children }) {
  return <div><label className="text-xs text-slate-400 font-medium block mb-1">{label}</label>{children}</div>;
}

export default function AdminSalesAssets() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['sales-assets'],
    queryFn: () => base44.entities.SalesAssets.list('step_order', 100),
  });

  const save = async () => {
    if (!form.title) return toast.error('Title required');
    setSaving(true);
    await base44.entities.SalesAssets.create({ ...form, active: true });
    qc.invalidateQueries({ queryKey: ['sales-assets'] });
    toast.success('Asset saved');
    setSaving(false);
    setModal(false);
    setForm({});
  };

  const remove = async (id) => {
    if (!confirm('Delete this asset?')) return;
    await base44.entities.SalesAssets.delete(id);
    qc.invalidateQueries({ queryKey: ['sales-assets'] });
    toast.success('Deleted');
  };

  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-slate-950 text-white">
          <div className="border-b border-slate-800 bg-slate-900 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Film className="w-5 h-5 text-violet-400" />
              <h1 className="text-base font-bold">Sales Assets</h1>
            </div>
            <Button size="sm" className="bg-violet-700 hover:bg-violet-600" onClick={() => setModal(true)}>
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Asset
            </Button>
          </div>

          <div className="max-w-5xl mx-auto px-6 py-6">
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-slate-500" /></div>
            ) : (
              <div className="space-y-2">
                {assets.map(a => (
                  <div key={a.id} className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 flex items-center gap-3">
                    {a.thumbnail_url ? <img src={a.thumbnail_url} alt={a.title} className="w-14 h-9 object-cover rounded border border-slate-700 flex-shrink-0" /> : <div className="w-14 h-9 bg-slate-800 rounded border border-slate-700 flex items-center justify-center flex-shrink-0"><Film className="w-4 h-4 text-slate-600" /></div>}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{a.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">{a.asset_type?.replace('_', ' ')}</span>
                        {a.industry && <span className="text-xs text-slate-600">· {a.industry}</span>}
                        {a.duration_seconds && <span className="text-xs text-slate-600">· {a.duration_seconds}s</span>}
                      </div>
                    </div>
                    <button onClick={() => remove(a.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {assets.length === 0 && <div className="text-center py-12 text-slate-600">No assets yet. Add your first sales asset.</div>}
              </div>
            )}
          </div>
        </div>

        <Dialog open={modal} onOpenChange={setModal}>
          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
            <DialogHeader><DialogTitle>Add Sales Asset</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <Field label="Title *"><Input className="bg-slate-800 border-slate-700 text-white" value={form.title || ''} onChange={e => set('title', e.target.value)} /></Field>
              <Field label="Asset Type *">
                <Select onValueChange={v => set('asset_type', v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {ASSET_TYPES.map(t => <SelectItem key={t} value={t} className="text-white">{t.replace('_', ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Industry"><Input className="bg-slate-800 border-slate-700 text-white" value={form.industry || ''} onChange={e => set('industry', e.target.value)} placeholder="HVAC" /></Field>
                <Field label="Step Order"><Input className="bg-slate-800 border-slate-700 text-white" type="number" value={form.step_order || ''} onChange={e => set('step_order', parseInt(e.target.value))} /></Field>
              </div>
              <Field label="Asset URL"><Input className="bg-slate-800 border-slate-700 text-white" value={form.asset_url || ''} onChange={e => set('asset_url', e.target.value)} placeholder="https://..." /></Field>
              <Field label="Embed URL"><Input className="bg-slate-800 border-slate-700 text-white" value={form.embed_url || ''} onChange={e => set('embed_url', e.target.value)} placeholder="https://..." /></Field>
              <Field label="Thumbnail URL"><Input className="bg-slate-800 border-slate-700 text-white" value={form.thumbnail_url || ''} onChange={e => set('thumbnail_url', e.target.value)} placeholder="https://..." /></Field>
              <Field label="Description"><textarea className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm" rows={2} value={form.description || ''} onChange={e => set('description', e.target.value)} /></Field>
              <Button className="w-full bg-violet-700 hover:bg-violet-600" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Add Asset'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </AdminNav>
    </AdminGuard>
  );
}