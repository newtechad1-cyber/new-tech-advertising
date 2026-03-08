import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Plus, Edit2, Trash2, Zap, ExternalLink, FileText, Video,
  Share2, Star, CheckCircle, Loader2, Eye, EyeOff
} from 'lucide-react';

const SERVICE_OPTIONS = [
  { value: 'streaming-tv', label: 'Streaming TV Advertising' },
  { value: 'local-seo', label: 'Local SEO' },
  { value: 'ada-rebuild', label: 'ADA Website Rebuild' },
  { value: 'ai-social-media', label: 'AI Social Media Marketing' },
  { value: 'video-marketing', label: 'Video Marketing' },
  { value: 'website-rebuild', label: 'Website Rebuild' },
];

const EMPTY_FORM = {
  business_name: '', slug: '', industry: '', city: '', state: '',
  service_used: 'streaming-tv', problem: '', solution: '', results: '',
  metrics: '', featured: false, status: 'draft',
};

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function MetricsEditor({ value, onChange }) {
  let parsed = [];
  try { parsed = JSON.parse(value || '[]'); } catch {}

  const update = (i, field, val) => {
    const next = [...parsed];
    next[i] = { ...next[i], [field]: val };
    onChange(JSON.stringify(next));
  };
  const add = () => onChange(JSON.stringify([...parsed, { label: '', value: '' }]));
  const remove = (i) => onChange(JSON.stringify(parsed.filter((_, idx) => idx !== i)));

  return (
    <div className="space-y-2">
      {parsed.map((m, i) => (
        <div key={i} className="flex gap-2 items-center">
          <Input value={m.label} onChange={e => update(i, 'label', e.target.value)}
            placeholder="Label (e.g. Leads)" className="bg-slate-800 border-slate-700 text-white text-sm flex-1" />
          <Input value={m.value} onChange={e => update(i, 'value', e.target.value)}
            placeholder="Value (e.g. 52)" className="bg-slate-800 border-slate-700 text-white text-sm w-28" />
          <button type="button" onClick={() => remove(i)} className="text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
        </div>
      ))}
      <button type="button" onClick={add} className="text-violet-400 hover:text-violet-300 text-sm flex items-center gap-1">
        <Plus className="w-3.5 h-3.5" /> Add metric
      </button>
    </div>
  );
}

export default function CaseStudyManager() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [generating, setGenerating] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [viewContent, setViewContent] = useState(null);

  const set = (f, v) => {
    setForm(p => {
      const next = { ...p, [f]: v };
      if (f === 'business_name' && !editing) {
        next.slug = slugify(v);
      }
      return next;
    });
  };

  const { data: studies = [], isLoading } = useQuery({
    queryKey: ['case-studies-admin'],
    queryFn: () => base44.entities.CaseStudy.list('-created_date', 50),
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editing) return base44.entities.CaseStudy.update(editing.id, data);
      return base44.entities.CaseStudy.create(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['case-studies-admin'] });
      setShowForm(false);
      setEditing(null);
      setForm(EMPTY_FORM);
      toast.success(editing ? 'Case study updated!' : 'Case study created!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CaseStudy.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['case-studies-admin'] }),
  });

  const handleEdit = (cs) => {
    setEditing(cs);
    setForm({ ...EMPTY_FORM, ...cs });
    setShowForm(true);
    setActiveTab('list');
  };

  const handleGenerate = async (cs) => {
    setGenerating(cs.id);
    try {
      await base44.functions.invoke('generateCaseStudyContent', { case_study_id: cs.id });
      qc.invalidateQueries({ queryKey: ['case-studies-admin'] });
      toast.success('Content generated! Blog, video script & social posts ready.');
    } catch (err) {
      toast.error('Generation failed: ' + err.message);
    } finally {
      setGenerating(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  if (viewContent) {
    const cs = studies.find(s => s.id === viewContent.id) || viewContent;
    let socialPosts = [];
    try { socialPosts = JSON.parse(cs.social_posts || '[]'); } catch {}

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setViewContent(null)} className="text-slate-400 hover:text-white">← Back</Button>
          <h2 className="text-xl font-bold text-white">{cs.business_name} — Generated Content</h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {cs.blog_article && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4"><FileText className="w-5 h-5 text-blue-400" /><h3 className="font-bold text-white">Blog Article</h3></div>
              <pre className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">{cs.blog_article}</pre>
            </div>
          )}
          {cs.video_script && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4"><Video className="w-5 h-5 text-red-400" /><h3 className="font-bold text-white">Video Script</h3></div>
              <pre className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">{cs.video_script}</pre>
            </div>
          )}
          {socialPosts.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4"><Share2 className="w-5 h-5 text-pink-400" /><h3 className="font-bold text-white">Social Media Posts ({socialPosts.length})</h3></div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {socialPosts.map((p, i) => (
                  <div key={i} className="bg-slate-800 rounded-lg p-4 space-y-3">
                    <p className="text-white text-sm leading-relaxed">{p.caption}</p>
                    {p.image_prompt && <p className="text-slate-500 text-xs border-t border-slate-700 pt-2">🖼 {p.image_prompt}</p>}
                    {p.video_prompt && <p className="text-slate-500 text-xs">🎬 {p.video_prompt}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Case Study Manager</h2>
          <p className="text-slate-400 text-sm">Create case studies and auto-generate blog, video scripts & social posts</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(EMPTY_FORM); }}
          className="bg-violet-600 hover:bg-violet-500 text-white">
          <Plus className="w-4 h-4 mr-2" /> New Case Study
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
          <h3 className="text-lg font-bold text-white mb-6">{editing ? 'Edit Case Study' : 'Create Case Study'}</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-slate-300 text-sm mb-1.5 block">Business Name *</Label>
                <Input required value={form.business_name} onChange={e => set('business_name', e.target.value)}
                  placeholder="Johnson Heating & AC" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-slate-300 text-sm mb-1.5 block">URL Slug *</Label>
                <Input required value={form.slug} onChange={e => set('slug', e.target.value)}
                  placeholder="dallas-hvac-streaming-tv-ads" className="bg-slate-800 border-slate-700 text-white font-mono text-sm" />
              </div>
              <div>
                <Label className="text-slate-300 text-sm mb-1.5 block">Industry *</Label>
                <Input required value={form.industry} onChange={e => set('industry', e.target.value)}
                  placeholder="HVAC" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-slate-300 text-sm mb-1.5 block">City *</Label>
                <Input required value={form.city} onChange={e => set('city', e.target.value)}
                  placeholder="Dallas" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-slate-300 text-sm mb-1.5 block">State *</Label>
                <Input required value={form.state} onChange={e => set('state', e.target.value)}
                  placeholder="TX" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-slate-300 text-sm mb-1.5 block">Service Used *</Label>
                <select required value={form.service_used} onChange={e => set('service_used', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                  {SERVICE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <Label className="text-slate-300 text-sm mb-1.5 block">The Challenge / Problem *</Label>
              <textarea required value={form.problem} onChange={e => set('problem', e.target.value)} rows={3}
                placeholder="What marketing challenges was the business facing?"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
            </div>

            <div>
              <Label className="text-slate-300 text-sm mb-1.5 block">The Solution *</Label>
              <textarea required value={form.solution} onChange={e => set('solution', e.target.value)} rows={3}
                placeholder="What did NTA implement for this business?"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
            </div>

            <div>
              <Label className="text-slate-300 text-sm mb-1.5 block">The Results *</Label>
              <textarea required value={form.results} onChange={e => set('results', e.target.value)} rows={3}
                placeholder="What were the outcomes and impact?"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
            </div>

            <div>
              <Label className="text-slate-300 text-sm mb-1.5 block">Metrics</Label>
              <MetricsEditor value={form.metrics} onChange={v => set('metrics', v)} />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)}
                  className="w-4 h-4 accent-violet-600" />
                <span className="text-slate-300 text-sm">Featured case study</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.status === 'published'}
                  onChange={e => set('status', e.target.checked ? 'published' : 'draft')}
                  className="w-4 h-4 accent-green-600" />
                <span className="text-slate-300 text-sm">Publish publicly</span>
              </label>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={saveMutation.isPending} className="bg-violet-600 hover:bg-violet-500 text-white">
                {saveMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : editing ? 'Update Case Study' : 'Create Case Study'}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditing(null); }}
                className="border-slate-700 text-slate-300">Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-500"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>
      ) : studies.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No case studies yet. Create your first one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {studies.map(cs => {
            let metrics = [];
            try { metrics = JSON.parse(cs.metrics || '[]'); } catch {}
            return (
              <div key={cs.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-white">{cs.business_name}</h3>
                    {cs.featured && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                    <Badge className={cs.status === 'published' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-slate-700 text-slate-400 border-slate-600'}>
                      {cs.status}
                    </Badge>
                    {cs.content_generated && <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 text-xs">AI Content ✓</Badge>}
                  </div>
                  <p className="text-slate-400 text-sm">{cs.industry} · {cs.city}, {cs.state} · {SERVICE_OPTIONS.find(s => s.value === cs.service_used)?.label}</p>
                  {metrics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {metrics.map((m, i) => (
                        <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">{m.value} {m.label}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {cs.status === 'published' && (
                    <a href={`/case-study/${cs.slug}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 text-xs">
                        <ExternalLink className="w-3.5 h-3.5 mr-1" /> View
                      </Button>
                    </a>
                  )}
                  {cs.content_generated && (
                    <Button variant="outline" size="sm" onClick={() => setViewContent(cs)}
                      className="border-slate-700 text-slate-300 text-xs">
                      <FileText className="w-3.5 h-3.5 mr-1" /> Content
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => handleGenerate(cs)}
                    disabled={generating === cs.id}
                    className="bg-violet-600 hover:bg-violet-500 text-white text-xs"
                  >
                    {generating === cs.id
                      ? <><Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />Generating…</>
                      : <><Zap className="w-3.5 h-3.5 mr-1" />{cs.content_generated ? 'Regenerate' : 'Generate AI Content'}</>
                    }
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(cs)} className="text-slate-400 hover:text-white">
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(cs.id)} className="text-slate-400 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}