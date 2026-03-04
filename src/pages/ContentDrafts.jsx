import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Copy, Check, Loader2, RefreshCw, FileText, Instagram, Facebook, Linkedin, ChevronLeft, ChevronRight, ArrowLeft, ImagePlus, Palette, Download, ExternalLink, AlertCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const PAGE_SIZE = 25;

const PLATFORM_CONFIG = {
  facebook:  { label: 'Facebook',  color: 'bg-blue-900 text-blue-300',    icon: Facebook },
  instagram: { label: 'Instagram', color: 'bg-pink-900 text-pink-300',    icon: Instagram },
  linkedin:  { label: 'LinkedIn',  color: 'bg-sky-900 text-sky-300',      icon: Linkedin },
};

const PILLAR_LABELS = {
  social_media: 'Social Media',
  website_development: 'Website Dev',
  ada_compliance: 'ADA Compliance',
  local_streaming_tv_ads: 'Streaming TV',
};

const STATUS_COLORS = {
  draft:     'bg-slate-700 text-slate-300',
  scheduled: 'bg-yellow-900 text-yellow-300',
  published: 'bg-green-900 text-green-300',
  archived:  'bg-zinc-800 text-zinc-400',
};

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button onClick={handle} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-slate-700 rounded-md px-2.5 py-1 transition-colors hover:bg-slate-700">
      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
      {label}
    </button>
  );
}

function DraftDrawer({ draft, onClose, onSaved }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (draft) {
      setForm({
        caption: draft.caption || '',
        hashtags: (draft.hashtags || []).join(' '),
        cta: draft.cta || '',
        image_prompt: draft.image_prompt || '',
        video_script: draft.video_script || '',
        status: draft.status || 'draft',
      });
    }
  }, [draft]);

  if (!draft || !form) return null;

  const fullPost = [form.caption, form.hashtags].filter(Boolean).join('\n\n');
  const hashtagString = form.hashtags;

  const save = async () => {
    setSaving(true);
    await base44.entities.ContentDraft.update(draft.id, {
      caption: form.caption,
      hashtags: form.hashtags.split(/\s+/).filter(h => h.startsWith('#')),
      cta: form.cta,
      image_prompt: form.image_prompt,
      video_script: form.video_script,
      status: form.status,
    });
    setSaving(false);
    toast.success('Draft saved');
    onSaved();
  };

  const PlatIcon = PLATFORM_CONFIG[draft.platform]?.icon || FileText;

  return (
    <Dialog open={!!draft} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlatIcon className="w-4 h-4" />
            {PLATFORM_CONFIG[draft.platform]?.label} Draft
            <Badge className={`${STATUS_COLORS[draft.status]} border-0 text-xs ml-1`}>{draft.status}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Meta info */}
          <div className="flex flex-wrap gap-2">
            {draft.pillar && <Badge className="bg-violet-900 text-violet-300 border-0 text-xs">{PILLAR_LABELS[draft.pillar] || draft.pillar}</Badge>}
            {draft.goal && <Badge className="bg-emerald-900 text-emerald-300 border-0 text-xs">{draft.goal}</Badge>}
          </div>

          {/* Hook */}
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-slate-500 text-xs mb-1 uppercase tracking-wide">Hook</p>
            <p className="text-white text-sm">{draft.hook}</p>
          </div>

          {/* Caption */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 text-xs uppercase tracking-wide">Caption</label>
              <CopyButton text={form.caption} label="Copy Caption" />
            </div>
            <textarea
              value={form.caption}
              onChange={e => setForm(f => ({...f, caption: e.target.value}))}
              rows={6}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 resize-y"
            />
          </div>

          {/* Hashtags */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 text-xs uppercase tracking-wide">Hashtags</label>
              <CopyButton text={hashtagString} label="Copy Hashtags" />
            </div>
            <textarea
              value={form.hashtags}
              onChange={e => setForm(f => ({...f, hashtags: e.target.value}))}
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* CTA */}
          <div>
            <label className="text-slate-400 text-xs uppercase tracking-wide block mb-1">Call to Action</label>
            <input
              value={form.cta}
              onChange={e => setForm(f => ({...f, cta: e.target.value}))}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* Image Prompt */}
          <div>
            <label className="text-slate-400 text-xs uppercase tracking-wide block mb-1">Image Prompt</label>
            <textarea
              value={form.image_prompt}
              onChange={e => setForm(f => ({...f, image_prompt: e.target.value}))}
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 resize-y"
            />
            <p className="text-slate-600 text-xs mt-1">Image generation coming in Phase 1.5</p>
          </div>

          {/* Video Script */}
          {(form.video_script || draft.video_script) && (
            <div>
              <label className="text-slate-400 text-xs uppercase tracking-wide block mb-1">Video Script</label>
              <textarea
                value={form.video_script}
                onChange={e => setForm(f => ({...f, video_script: e.target.value}))}
                rows={4}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 resize-y"
              />
            </div>
          )}

          {/* Copy Full Post */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 flex items-center justify-between">
            <p className="text-slate-400 text-sm">Copy complete post (caption + hashtags)</p>
            <CopyButton text={fullPost} label="Copy Full Post" />
          </div>

          {/* Status + Schedule placeholder */}
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <label className="text-slate-400 text-xs uppercase tracking-wide block mb-1">Status</label>
              <Select value={form.status} onValueChange={v => setForm(f => ({...f, status: v}))}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-slate-400 text-xs uppercase tracking-wide block mb-1">Schedule</label>
              <div className="h-9 bg-slate-800/40 border border-slate-700 rounded-md flex items-center px-3 text-slate-600 text-sm">
                Coming Phase 1.75
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button onClick={save} disabled={saving} className="bg-violet-700 hover:bg-violet-600 flex-1">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
            <Button variant="ghost" onClick={onClose} className="text-slate-400">Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ContentDrafts() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [pillarFilter, setPillarFilter] = useState('all');
  const [goalFilter, setGoalFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [selectedDraft, setSelectedDraft] = useState(null);

  const accountId = new URLSearchParams(window.location.search).get('account_id');

  const load = async () => {
    setLoading(true);
    const query = accountId ? { account_id: accountId } : {};
    const data = await base44.entities.ContentDraft.filter(query, '-created_date', 500);
    setDrafts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = drafts.filter(d => {
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (platformFilter !== 'all' && d.platform !== platformFilter) return false;
    if (pillarFilter !== 'all' && d.pillar !== pillarFilter) return false;
    if (goalFilter !== 'all' && d.goal !== goalFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const onSaved = () => {
    load();
    setSelectedDraft(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link to={createPageUrl('AiOperations')}>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />AI Ops
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-400" />
              Content Drafts
            </h1>
            <p className="text-slate-400 text-sm">
              {drafts.length} total · {filtered.length} filtered
              {accountId && <span className="ml-2 text-violet-400">Account: {accountId.slice(0,12)}…</span>}
            </p>
          </div>
          <div className="ml-auto">
            <Button size="sm" onClick={load} variant="outline" className="border-slate-700 text-slate-300 h-8 text-xs">
              <RefreshCw className="w-3 h-3 mr-1.5" />Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-5">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(0); }}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs w-32"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={platformFilter} onValueChange={v => { setPlatformFilter(v); setPage(0); }}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs w-36"><SelectValue placeholder="Platform" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
            </SelectContent>
          </Select>
          <Select value={pillarFilter} onValueChange={v => { setPillarFilter(v); setPage(0); }}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs w-40"><SelectValue placeholder="Pillar" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pillars</SelectItem>
              <SelectItem value="social_media">Social Media</SelectItem>
              <SelectItem value="website_development">Website Dev</SelectItem>
              <SelectItem value="ada_compliance">ADA Compliance</SelectItem>
              <SelectItem value="local_streaming_tv_ads">Streaming TV</SelectItem>
            </SelectContent>
          </Select>
          <Select value={goalFilter} onValueChange={v => { setGoalFilter(v); setPage(0); }}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs w-32"><SelectValue placeholder="Goal" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Goals</SelectItem>
              <SelectItem value="awareness">Awareness</SelectItem>
              <SelectItem value="leads">Leads</SelectItem>
              <SelectItem value="promotion">Promotion</SelectItem>
              <SelectItem value="trust">Trust</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading && <div className="text-center py-16"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" /></div>}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-lg">No drafts found</p>
            <p className="text-sm mt-1">Run a content workflow and click "Create Draft Posts" on the artifact.</p>
          </div>
        )}

        {/* Draft cards */}
        <div className="space-y-3">
          {paginated.map(draft => {
            const pc = PLATFORM_CONFIG[draft.platform] || {};
            const PlatIcon = pc.icon || FileText;
            return (
              <div
                key={draft.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-4 cursor-pointer hover:border-violet-600 transition-colors"
                onClick={() => setSelectedDraft(draft)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Badge className={`${pc.color || 'bg-slate-700 text-slate-300'} border-0 text-xs flex items-center gap-1`}>
                        <PlatIcon className="w-3 h-3" />{pc.label || draft.platform}
                      </Badge>
                      {draft.pillar && (
                        <Badge className="bg-violet-900 text-violet-300 border-0 text-xs">
                          {PILLAR_LABELS[draft.pillar] || draft.pillar}
                        </Badge>
                      )}
                      {draft.goal && (
                        <Badge className="bg-emerald-900 text-emerald-300 border-0 text-xs">{draft.goal}</Badge>
                      )}
                      <Badge className={`${STATUS_COLORS[draft.status] || 'bg-slate-700 text-slate-300'} border-0 text-xs`}>{draft.status}</Badge>
                    </div>
                    <p className="text-white font-medium text-sm leading-snug">{draft.hook}</p>
                    <p className="text-slate-400 text-xs mt-1 line-clamp-2">{draft.caption}</p>
                    {draft.hashtags?.length > 0 && (
                      <p className="text-slate-600 text-xs mt-1 truncate">{draft.hashtags.slice(0,5).join(' ')}{draft.hashtags.length > 5 ? ` +${draft.hashtags.length - 5}` : ''}</p>
                    )}
                  </div>
                  <div className="text-slate-600 text-xs shrink-0">{new Date(draft.updated_date || draft.created_date).toLocaleDateString()}</div>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(p => p-1)} className="border-slate-700 text-slate-300 h-7 text-xs">
              <ChevronLeft className="w-3 h-3" />Prev
            </Button>
            <span className="text-slate-500 text-xs">{page+1} / {totalPages}</span>
            <Button size="sm" variant="outline" disabled={page >= totalPages-1} onClick={() => setPage(p => p+1)} className="border-slate-700 text-slate-300 h-7 text-xs">
              Next<ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      <DraftDrawer draft={selectedDraft} onClose={() => setSelectedDraft(null)} onSaved={onSaved} />
    </div>
  );
}