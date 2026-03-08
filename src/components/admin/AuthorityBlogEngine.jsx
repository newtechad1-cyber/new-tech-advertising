import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Zap, Loader2, Plus, RefreshCw, FileText, Video, ExternalLink, Trash2, CheckCircle } from 'lucide-react';

const SERVICES = [
  { value: 'streaming-tv', label: 'Streaming TV Advertising' },
  { value: 'local-seo', label: 'Local SEO' },
  { value: 'ada-rebuild', label: 'ADA Website Compliance' },
  { value: 'ai-social-media', label: 'AI Social Media' },
  { value: 'video-marketing', label: 'Video Marketing' },
  { value: 'website-rebuild', label: 'Website Rebuild' },
  { value: 'hvac-marketing', label: 'HVAC Marketing' },
  { value: 'plumbing-marketing', label: 'Plumbing Marketing' },
  { value: 'small-business-marketing', label: 'Small Business Marketing' },
];

const INDUSTRIES = ['HVAC', 'Plumbing', 'Roofing', 'Restaurant', 'Dental', 'Legal', 'Real Estate', 'Landscaping', 'Auto Repair', 'Fitness'];

// Preset topic combinations for bulk generation
const PRESET_BATCHES = [
  { label: 'Streaming TV Pack (5 articles)', topics: [
    { service: 'streaming-tv', industry: 'HVAC', city: '' },
    { service: 'streaming-tv', industry: 'Restaurant', city: '' },
    { service: 'streaming-tv', industry: 'Roofing', city: '' },
    { service: 'streaming-tv', industry: '', city: 'Dallas', topic_override: 'Streaming TV Advertising Dallas: Reach Local Customers on Roku and Hulu' },
    { service: 'streaming-tv', industry: '', city: 'Chicago', topic_override: 'Streaming TV Advertising Chicago: Guide for Small Business Owners' },
  ]},
  { label: 'Local SEO Pack (5 articles)', topics: [
    { service: 'local-seo', industry: 'Plumbing', city: '' },
    { service: 'local-seo', industry: 'Dental', city: '' },
    { service: 'local-seo', industry: 'HVAC', city: '' },
    { service: 'local-seo', industry: 'Legal', city: '' },
    { service: 'local-seo', industry: '', city: '', topic_override: 'Local SEO Tips for Small Businesses: Complete 2025 Guide' },
  ]},
  { label: 'ADA Compliance Pack (5 articles)', topics: [
    { service: 'ada-rebuild', industry: '', city: '', topic_override: 'ADA Website Compliance for Small Businesses: What You Need to Know' },
    { service: 'ada-rebuild', industry: '', city: '', topic_override: 'How Much Does an ADA Website Lawsuit Cost? Risk Guide for Business Owners' },
    { service: 'ada-rebuild', industry: 'Restaurant', city: '' },
    { service: 'ada-rebuild', industry: 'Legal', city: '' },
    { service: 'ada-rebuild', industry: '', city: '', topic_override: 'WCAG 2.1 Compliance Checklist for Small Business Websites' },
  ]},
];

export default function AuthorityBlogEngine() {
  const qc = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState(null); // { current, total, results }
  const [single, setSingle] = useState({ service: 'streaming-tv', industry: '', city: '', topic_override: '' });
  const [viewScript, setViewScript] = useState(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-engine-posts'],
    queryFn: () => base44.entities.BlogPost.filter({ source: 'ai-generated' }, '-published_date', 100),
  });

  const generateSingle = async () => {
    setGenerating(true);
    try {
      const { data } = await base44.functions.invoke('generateBlogArticle', single);
      if (data.error) throw new Error(data.error);
      qc.invalidateQueries({ queryKey: ['blog-engine-posts'] });
      qc.invalidateQueries({ queryKey: ['admin-posts'] });
      toast.success(`Article created: "${data.title}"`);
    } catch (err) {
      toast.error(err.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const generateBatch = async (batch) => {
    setBatchProgress({ current: 0, total: batch.topics.length, results: [] });
    for (let i = 0; i < batch.topics.length; i++) {
      const topic = batch.topics[i];
      try {
        const { data } = await base44.functions.invoke('generateBlogArticle', topic);
        setBatchProgress(p => ({ ...p, current: i + 1, results: [...p.results, { ok: !data.error, title: data.title || data.error }] }));
      } catch (err) {
        setBatchProgress(p => ({ ...p, current: i + 1, results: [...p.results, { ok: false, title: err.message }] }));
      }
      // Small delay between requests
      if (i < batch.topics.length - 1) await new Promise(r => setTimeout(r, 1500));
    }
    qc.invalidateQueries({ queryKey: ['blog-engine-posts'] });
    qc.invalidateQueries({ queryKey: ['admin-posts'] });
    toast.success(`Batch complete! ${batch.topics.length} articles processed.`);
  };

  const deletePost = async (id) => {
    await base44.entities.BlogPost.delete(id);
    qc.invalidateQueries({ queryKey: ['blog-engine-posts'] });
    toast.success('Deleted');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Authority Blog Engine</h2>
        <p className="text-slate-400 text-sm">Generate SEO articles + video scripts automatically from service × industry × city combinations</p>
      </div>

      {/* Single Generator */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" /> Generate Single Article</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <Label className="text-slate-400 text-xs mb-1 block">Service</Label>
            <select value={single.service} onChange={e => setSingle(p => ({ ...p, service: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none">
              {SERVICES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-slate-400 text-xs mb-1 block">Industry (optional)</Label>
            <Input value={single.industry} onChange={e => setSingle(p => ({ ...p, industry: e.target.value }))}
              placeholder="e.g. HVAC" list="industries-list"
              className="bg-slate-800 border-slate-700 text-white" />
            <datalist id="industries-list">{INDUSTRIES.map(i => <option key={i} value={i} />)}</datalist>
          </div>
          <div>
            <Label className="text-slate-400 text-xs mb-1 block">City (optional)</Label>
            <Input value={single.city} onChange={e => setSingle(p => ({ ...p, city: e.target.value }))}
              placeholder="e.g. Dallas" className="bg-slate-800 border-slate-700 text-white" />
          </div>
          <div>
            <Label className="text-slate-400 text-xs mb-1 block">Custom Topic (optional)</Label>
            <Input value={single.topic_override} onChange={e => setSingle(p => ({ ...p, topic_override: e.target.value }))}
              placeholder="Override auto topic" className="bg-slate-800 border-slate-700 text-white" />
          </div>
        </div>
        <Button onClick={generateSingle} disabled={generating} className="bg-violet-600 hover:bg-violet-500 text-white">
          {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating (60–90 sec)…</> : <><Zap className="w-4 h-4 mr-2" />Generate Article + Video Script</>}
        </Button>
      </div>

      {/* Batch Packs */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><RefreshCw className="w-5 h-5 text-emerald-400" /> Batch Generate (Content Packs)</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {PRESET_BATCHES.map((batch) => (
            <div key={batch.label} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <h4 className="font-semibold text-white text-sm mb-2">{batch.label}</h4>
              <ul className="text-slate-400 text-xs space-y-1 mb-4">
                {batch.topics.map((t, i) => (
                  <li key={i} className="truncate">· {t.topic_override || `${t.service} × ${t.industry || t.city || 'General'}`}</li>
                ))}
              </ul>
              <Button size="sm" onClick={() => generateBatch(batch)}
                disabled={!!batchProgress && batchProgress.current < batchProgress.total}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs">
                Generate Pack
              </Button>
            </div>
          ))}
        </div>

        {batchProgress && (
          <div className="mt-4 bg-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm font-medium">Generating batch…</span>
              <span className="text-slate-400 text-sm">{batchProgress.current} / {batchProgress.total}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
              <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }} />
            </div>
            <div className="space-y-1">
              {batchProgress.results.map((r, i) => (
                <div key={i} className={`text-xs flex items-center gap-2 ${r.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                  {r.ok ? <CheckCircle className="w-3 h-3 flex-shrink-0" /> : <span className="w-3 h-3 text-center flex-shrink-0">✗</span>}
                  {r.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Generated Articles List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white">AI-Generated Articles ({posts.length})</h3>
        </div>
        {isLoading ? (
          <div className="text-center py-12 text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No AI-generated articles yet. Use the generators above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white text-sm truncate">{post.title}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-slate-500 text-xs">{post.published_date}</span>
                    {post.service && <Badge className="text-xs bg-violet-500/20 text-violet-300 border-violet-500/30">{post.service}</Badge>}
                    {post.industry && <Badge className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">{post.industry}</Badge>}
                    {post.city && <Badge className="text-xs bg-emerald-500/20 text-emerald-300 border-emerald-500/30">{post.city}</Badge>}
                    {post.video_script && <Badge className="text-xs bg-red-500/20 text-red-300 border-red-500/30">Video Script ✓</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {post.video_script && (
                    <Button variant="outline" size="sm" onClick={() => setViewScript(post)}
                      className="border-slate-700 text-slate-300 text-xs">
                      <Video className="w-3.5 h-3.5 mr-1" /> Script
                    </Button>
                  )}
                  <a href={`/blog-post?id=${post.id}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 text-xs">
                      <ExternalLink className="w-3.5 h-3.5 mr-1" /> View
                    </Button>
                  </a>
                  <Button variant="ghost" size="sm" onClick={() => deletePost(post.id)} className="text-slate-500 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Script Modal */}
      {viewScript && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setViewScript(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white flex items-center gap-2"><Video className="w-5 h-5 text-red-400" /> Video Script</h3>
              <button onClick={() => setViewScript(null)} className="text-slate-500 hover:text-white text-sm">✕</button>
            </div>
            <p className="text-slate-400 text-xs mb-3 font-medium">{viewScript.title}</p>
            <pre className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">{viewScript.video_script}</pre>
          </div>
        </div>
      )}
    </div>
  );
}