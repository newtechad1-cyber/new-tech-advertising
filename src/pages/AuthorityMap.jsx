import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, X, ChevronDown, ChevronRight, Archive, ArrowLeft, AlertCircle, Wand2 } from 'lucide-react';
import AutomationLogs from '../components/authoritymap/AutomationLogs';

export default function AuthorityMap() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'create' | 'detail'
  const [selected, setSelected] = useState(null);
  const [expandedPillars, setExpandedPillars] = useState({});
  const DEFAULT_LINK_STRATEGY = {
    pillar_linking_rule: "Create 1–2 pillar hub pages per month. Each pillar hub lists and links to all cluster articles in a Resources section, grouped by intent (Learn / Implement / Buy).",
    cluster_to_pillar_rule: "In every cluster post, link back to the pillar once near the top (within the first 2 sections) using a descriptive anchor. Add another link back in the conclusion if it fits naturally.",
    service_page_linking_rule: "If the post includes implementation steps, tools, templates, or 'done for you' considerations, link to the most relevant offer page (DIY system or DFY management). Prefer 1 service link max per post.",
    cta_linking_rule: "Include the primary CTA twice: once after the first actionable section (mid-article) and once in a closing 'Next Steps' section. CTA should be one sentence + button/link.",
    horizontal_linking_rule: "Add 1–2 cross-links to related posts from the same pillar cluster: one for a prerequisite topic and one for a next-step topic. Avoid linking to unrelated pillars.",
    anchor_style_guidelines: "Anchors must be specific and intent-based (e.g., 'AI social media content calendar template' or 'DFY social media management for small businesses'). Avoid generic anchors like 'click here'. Keep anchors 3–8 words when possible.",
    max_links_per_post: 5
  };

  const [form, setForm] = useState({
    niche: 'NTA AI marketing for small businesses',
    location: 'Midwest',
    pillars: [],
    internal_link_strategy: DEFAULT_LINK_STRATEGY,
    authority_positioning_summary: ''
  });
  const [newPillarTitle, setNewPillarTitle] = useState('');
  const [newTopics, setNewTopics] = useState({});
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadPlans(); }, []);

  const loadPlans = async () => {
    try {
      const data = await base44.entities.AuthorityMap.list('-created_date');
      setPlans(data);
    } catch { toast.error('Failed to load authority maps'); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaveError('');
    setSaved(false);

    if (!form.niche || !form.location) {
      toast.error('Niche and location are required');
      return;
    }
    if (form.pillars.length !== 5) {
      const msg = `You must have exactly 5 pillars (currently ${form.pillars.length}).`;
      setSaveError(msg);
      toast.error(msg);
      return;
    }
    for (const p of form.pillars) {
      const count = p.cluster_topics.length;
      if (count < 8 || count > 10) {
        const msg = `Pillar "${p.pillar_title}" has ${count} topics. Each pillar must have 8–10 cluster topics.`;
        setSaveError(msg);
        toast.error(msg);
        return;
      }
    }

    // Serialize pillars safely
    const pillars = form.pillars.map(p => ({
      pillar_title: String(p.pillar_title),
      cluster_topics: p.cluster_topics.map(t => String(t))
    }));

    try {
      await base44.entities.AuthorityMap.create({ ...form, pillars });
      setSaved(true);
      toast.success('Authority map saved successfully!');
      setTimeout(() => {
        setView('list');
        setForm({ niche: 'NTA AI marketing for small businesses', location: 'Midwest', pillars: [], internal_link_strategy: '', authority_positioning_summary: '' });
        setSaved(false);
        setForm({ niche: 'NTA AI marketing for small businesses', location: 'Midwest', pillars: [], internal_link_strategy: DEFAULT_LINK_STRATEGY, authority_positioning_summary: '' });
        loadPlans();
      }, 1200);
    } catch (err) {
      const msg = err?.message || 'Unknown error saving authority map';
      console.error('[AuthorityMap] Save failed:', err);
      setSaveError(msg);
      toast.error('Save failed: ' + msg);
    }
  };

  const updateLinkStrategy = (field, value) => {
    setForm(prev => ({
      ...prev,
      internal_link_strategy: { ...prev.internal_link_strategy, [field]: field === 'max_links_per_post' ? Number(value) : value }
    }));
  };

  const handleArchive = async (id) => {
    try {
      await base44.entities.AuthorityMap.update(id, { is_archived: true });
      toast.success('Archived');
      loadPlans();
    } catch { toast.error('Failed to archive'); }
  };

  const addPillar = () => {
    if (!newPillarTitle.trim()) return;
    setForm(prev => ({ ...prev, pillars: [...prev.pillars, { pillar_title: newPillarTitle.trim(), cluster_topics: [] }] }));
    setNewPillarTitle('');
  };

  const removePillar = (i) => setForm(prev => ({ ...prev, pillars: prev.pillars.filter((_, idx) => idx !== i) }));

  const addTopic = (pillarIdx) => {
    const topic = (newTopics[pillarIdx] || '').trim();
    if (!topic) return;
    setForm(prev => {
      const pillars = [...prev.pillars];
      pillars[pillarIdx] = { ...pillars[pillarIdx], cluster_topics: [...pillars[pillarIdx].cluster_topics, topic] };
      return { ...prev, pillars };
    });
    setNewTopics(prev => ({ ...prev, [pillarIdx]: '' }));
  };

  const removeTopic = (pillarIdx, topicIdx) => {
    setForm(prev => {
      const pillars = [...prev.pillars];
      pillars[pillarIdx] = { ...pillars[pillarIdx], cluster_topics: pillars[pillarIdx].cluster_topics.filter((_, i) => i !== topicIdx) };
      return { ...prev, pillars };
    });
  };

  const active = plans.filter(p => !p.is_archived);
  const archived = plans.filter(p => p.is_archived);

  if (loading) return <div className="p-8 pt-20 lg:pt-8 text-center text-slate-500">Loading...</div>;

  if (view === 'create') return (
    <div className="max-w-2xl mx-auto p-8 pt-20 lg:pt-8 space-y-6" key="create-view">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setView('list')}><ArrowLeft className="w-4 h-4" /></Button>
        <h1 className="text-2xl font-bold text-slate-900">New Authority Map</h1>
      </div>
      <Card><CardContent className="pt-6 space-y-4">
        <div className="space-y-1">
          <Label>Niche *</Label>
          <Input value={form.niche} onChange={e => setForm({ ...form, niche: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>Location *</Label>
          <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
        </div>
      </CardContent></Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Internal Link Strategy</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setForm(prev => ({ ...prev, internal_link_strategy: DEFAULT_LINK_STRATEGY }))}>
              <Wand2 className="w-3.5 h-3.5 mr-1.5" />
              Fill Recommended Linking Strategy
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { field: 'pillar_linking_rule', label: 'Pillar Linking Rule' },
            { field: 'cluster_to_pillar_rule', label: 'Cluster → Pillar Rule' },
            { field: 'service_page_linking_rule', label: 'Service Page Linking Rule' },
            { field: 'cta_linking_rule', label: 'CTA Linking Rule' },
            { field: 'horizontal_linking_rule', label: 'Horizontal Linking Rule' },
            { field: 'anchor_style_guidelines', label: 'Anchor Style Guidelines' },
          ].map(({ field, label }) => (
            <div key={field} className="space-y-1">
              <Label className="text-sm">{label}</Label>
              <Textarea
                rows={2}
                className="resize-none text-sm"
                value={form.internal_link_strategy?.[field] || ''}
                onChange={e => updateLinkStrategy(field, e.target.value)}
              />
            </div>
          ))}
          <div className="space-y-1">
            <Label className="text-sm">Max Links Per Post</Label>
            <Input
              type="number"
              min={1}
              max={20}
              className="w-24"
              value={form.internal_link_strategy?.max_links_per_post ?? 5}
              onChange={e => updateLinkStrategy('max_links_per_post', e.target.value)}
            />
          </div>
          <p className="text-xs text-slate-400 italic">This strategy guides the Daily Generator's internal_link_suggestions.</p>
        </CardContent>
      </Card>

      <Card><CardContent className="pt-6 space-y-4">
        <div className="space-y-1">
          <Label>Authority Positioning Summary</Label>
          <Textarea rows={3} value={form.authority_positioning_summary} onChange={e => setForm({ ...form, authority_positioning_summary: e.target.value })} className="resize-none" />
        </div>
      </CardContent></Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Pillars & Cluster Topics</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="New pillar title" value={newPillarTitle} onChange={e => setNewPillarTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && addPillar()} />
            <Button variant="outline" onClick={addPillar}><Plus className="w-4 h-4" /></Button>
          </div>
          {form.pillars.map((pillar, pi) => (
            <div key={pi} className="border rounded-lg p-4 space-y-3 bg-slate-50">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{pillar.pillar_title}</span>
                <Button variant="ghost" size="icon" onClick={() => removePillar(pi)}><X className="w-4 h-4 text-slate-400" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {pillar.cluster_topics.map((t, ti) => (
                  <span key={ti} className="flex items-center gap-1 bg-white border rounded-full px-2 py-0.5 text-xs">
                    {t}<button onClick={() => removeTopic(pi, ti)}><X className="w-3 h-3 text-slate-300 hover:text-red-500" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input className="h-7 text-xs" placeholder="Add cluster topic" value={newTopics[pi] || ''} onChange={e => setNewTopics(prev => ({ ...prev, [pi]: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addTopic(pi)} />
                <Button size="sm" variant="outline" onClick={() => addTopic(pi)}><Plus className="w-3 h-3" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {saveError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm font-medium">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Authority map saved! Redirecting...
        </div>
      )}

      <Button onClick={handleSave} className="w-full bg-slate-900 hover:bg-slate-700">Save Authority Map</Button>
    </div>
  );

  if (view === 'detail' && selected) return (
    <div className="max-w-2xl mx-auto p-8 pt-20 lg:pt-8 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setView('list')}><ArrowLeft className="w-4 h-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{selected.niche}</h1>
          <p className="text-slate-500 text-sm">{selected.location} · {new Date(selected.created_date).toLocaleDateString()}</p>
        </div>
      </div>
      {selected.authority_positioning_summary && (
        <Card><CardHeader><CardTitle className="text-base">Positioning Summary</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-slate-700 whitespace-pre-wrap">{selected.authority_positioning_summary}</p></CardContent>
        </Card>
      )}
      {selected.internal_link_strategy && typeof selected.internal_link_strategy === 'object' && (
        <Card>
          <CardHeader><CardTitle className="text-base">Internal Link Strategy</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(selected.internal_link_strategy).map(([key, val]) => (
              <div key={key}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{key.replace(/_/g, ' ')}</p>
                <p className="text-sm text-slate-700">{String(val)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader><CardTitle className="text-base">Pillars & Cluster Topics</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {(selected.pillars || []).map((pillar, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 text-left"
                onClick={() => setExpandedPillars(prev => ({ ...prev, [i]: !prev[i] }))}>
                <span className="font-semibold text-sm">{pillar.pillar_title}</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">{pillar.cluster_topics?.length} topics {expandedPillars[i] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}</span>
              </button>
              {expandedPillars[i] && (
                <div className="px-4 py-3 flex flex-wrap gap-2">
                  {pillar.cluster_topics?.map((t, ti) => <Badge key={ti} variant="outline" className="text-xs">{t}</Badge>)}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-8 pt-20 lg:pt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Authority Maps</h1>
        <Button onClick={() => setView('create')} className="bg-slate-900 hover:bg-slate-700"><Plus className="w-4 h-4 mr-2" />New Plan</Button>
      </div>

      <AutomationLogs />

      {active.length === 0 && <div className="text-center py-12 bg-slate-50 rounded-lg text-slate-500">No authority maps yet. Create your first plan.</div>}

      <div className="space-y-3">
        {active.map((plan, idx) => (
          <Card key={plan.id} className={idx === 0 ? 'border-slate-900' : ''}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  {idx === 0 && <Badge className="mb-2 bg-slate-900 text-white text-xs">Latest</Badge>}
                  <h3 className="font-semibold">{plan.niche}</h3>
                  <p className="text-sm text-slate-500">{plan.location} · {(plan.pillars || []).length} pillars · {new Date(plan.created_date).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setSelected(plan); setView('detail'); }}>View</Button>
                  <Button size="sm" variant="ghost" onClick={() => handleArchive(plan.id)}><Archive className="w-4 h-4 text-slate-400" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {archived.length > 0 && (
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Archived</p>
          <div className="space-y-2">
            {archived.map(plan => (
              <div key={plan.id} className="flex items-center justify-between px-4 py-3 bg-slate-50 border border-dashed rounded-lg">
                <div>
                  <span className="text-sm text-slate-500">{plan.niche} · {plan.location}</span>
                  <span className="text-xs text-slate-400 ml-2">{new Date(plan.created_date).toLocaleDateString()}</span>
                </div>
                <Button size="sm" variant="ghost" onClick={() => { setSelected(plan); setView('detail'); }}>View</Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}