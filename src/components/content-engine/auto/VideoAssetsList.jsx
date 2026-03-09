import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Film, Plus, Play, Globe, Briefcase, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_STYLES = {
  rendering: 'bg-yellow-900/40 text-yellow-400 border-yellow-800',
  ready: 'bg-blue-900/40 text-blue-400 border-blue-800',
  published: 'bg-green-900/40 text-green-400 border-green-800',
  failed: 'bg-red-900/40 text-red-400 border-red-800',
};
const TYPE_COLORS = {
  explainer: 'bg-blue-900/30 text-blue-400', sales: 'bg-orange-900/30 text-orange-400',
  case_study: 'bg-purple-900/30 text-purple-400', social_short: 'bg-pink-900/30 text-pink-400',
};

const DISTRIBUTION_OPTIONS = [
  { key: 'website', label: 'Website', icon: Globe },
  { key: 'sales_room', label: 'Sales Room', icon: Briefcase },
  { key: 'deal_room', label: 'Deal Room', icon: Briefcase },
  { key: 'social', label: 'Social Media', icon: Share2 },
  { key: 'blog', label: 'Blog', icon: Film },
];

function Field({ label, children }) {
  return <div><label className="text-xs text-gray-400 font-medium block mb-1">{label}</label>{children}</div>;
}

export default function VideoAssetsList() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [updatingDist, setUpdatingDist] = useState(null);

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['content-video-assets'],
    queryFn: () => base44.entities.ContentVideoAssets.list('-created_date', 100),
  });

  const { data: scripts = [] } = useQuery({
    queryKey: ['video-scripts'],
    queryFn: () => base44.entities.VideoScripts.filter({ status: 'approved' }),
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const saveAsset = async () => {
    if (!form.title || !form.script_id) return toast.error('Fill in title and script');
    setSaving(true);
    await base44.entities.ContentVideoAssets.create({ ...form, status: form.video_url ? 'ready' : 'rendering', distribution: [] });
    qc.invalidateQueries({ queryKey: ['content-video-assets'] });
    toast.success('Video asset added');
    setSaving(false);
    setModal(false);
    setForm({});
  };

  const toggleDistribution = async (asset, channel) => {
    setUpdatingDist(asset.id);
    const current = asset.distribution || [];
    const updated = current.includes(channel) ? current.filter(c => c !== channel) : [...current, channel];
    await base44.entities.ContentVideoAssets.update(asset.id, { distribution: updated });
    qc.invalidateQueries({ queryKey: ['content-video-assets'] });
    setUpdatingDist(null);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" className="bg-violet-700 hover:bg-violet-600 text-white" onClick={() => setModal(true)}>
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Video Asset
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-600" /></div>
      ) : assets.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-700 rounded-xl text-gray-600">
          <Film className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p>No video assets yet. Approve video scripts first, then add assets here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assets.map(a => (
            <div key={a.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                {a.thumbnail ? (
                  <img src={a.thumbnail} alt={a.title} className="w-16 h-10 object-cover rounded-lg flex-shrink-0 border border-gray-700" />
                ) : (
                  <div className="w-16 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-700">
                    <Film className="w-5 h-5 text-gray-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLES[a.status] || ''}`}>{a.status}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[a.video_type] || 'bg-gray-800 text-gray-400'}`}>{a.video_type}</span>
                    {a.duration_sec && <span className="text-xs text-gray-600">{a.duration_sec}s</span>}
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{a.title}</p>
                  {a.video_url && (
                    <a href={a.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-1">
                      <Play className="w-3 h-3" /> View Video
                    </a>
                  )}
                </div>
              </div>
              {/* Distribution toggles */}
              <div className="mt-3 pt-3 border-t border-gray-800">
                <p className="text-xs text-gray-600 mb-2">Distribution channels</p>
                <div className="flex flex-wrap gap-1.5">
                  {DISTRIBUTION_OPTIONS.map(opt => {
                    const active = (a.distribution || []).includes(opt.key);
                    return (
                      <button key={opt.key} onClick={() => toggleDistribution(a, opt.key)} disabled={updatingDist === a.id}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${active ? 'bg-violet-700 border-violet-600 text-white' : 'border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-600'}`}>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader><DialogTitle>Add Video Asset</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <Field label="Title *"><Input className="bg-gray-800 border-gray-700 text-white" value={form.title || ''} onChange={e => set('title', e.target.value)} /></Field>
            <Field label="Script *">
              <Select onValueChange={v => set('script_id', v)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white"><SelectValue placeholder="Select approved script" /></SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {scripts.map(s => <SelectItem key={s.id} value={s.id} className="text-white">{s.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Video Type">
              <Select onValueChange={v => set('video_type', v)} defaultValue="explainer">
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {['explainer', 'sales', 'case_study', 'social_short'].map(t => <SelectItem key={t} value={t} className="text-white">{t.replace('_', ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Video URL"><Input className="bg-gray-800 border-gray-700 text-white" placeholder="https://..." value={form.video_url || ''} onChange={e => set('video_url', e.target.value)} /></Field>
            <Field label="Thumbnail URL"><Input className="bg-gray-800 border-gray-700 text-white" placeholder="https://..." value={form.thumbnail || ''} onChange={e => set('thumbnail', e.target.value)} /></Field>
            <Button className="w-full bg-violet-700 hover:bg-violet-600" onClick={saveAsset} disabled={saving}>{saving ? 'Saving...' : 'Add Asset'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}