import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Target, RefreshCw, Search, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const STAGES = ['new','qualified','audit_ready','contacted','demo_scheduled','demo_completed','proposal_sent','followup','won','lost','stalled'];

const STAGE_COLORS = {
  new: 'bg-slate-700 text-slate-300',
  qualified: 'bg-blue-900 text-blue-300',
  audit_ready: 'bg-cyan-900 text-cyan-300',
  contacted: 'bg-yellow-900 text-yellow-300',
  demo_scheduled: 'bg-violet-900 text-violet-300',
  demo_completed: 'bg-purple-900 text-purple-300',
  proposal_sent: 'bg-orange-900 text-orange-300',
  followup: 'bg-amber-900 text-amber-300',
  won: 'bg-green-900 text-green-300',
  lost: 'bg-red-900 text-red-300',
  stalled: 'bg-slate-700 text-slate-500',
};

export default function NTAOpportunities() {
  const [opps, setOpps] = useState([]);
  const [companies, setCompanies] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('open');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ opportunity_name: '', offer_type: 'dfy_managed', stage: 'new', status: 'open', estimated_value: '', next_step: '', next_step_due: '', owner: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [data, cos] = await Promise.all([
      base44.entities.NTAOpportunity.list('-created_date', 200),
      base44.entities.NTACompany.list(),
    ]);
    setOpps(data);
    const map = {};
    cos.forEach(c => { map[c.id] = c; });
    setCompanies(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.opportunity_name) { toast.error('Name required'); return; }
    setSaving(true);
    const opp = await base44.entities.NTAOpportunity.create({
      ...form,
      estimated_value: form.estimated_value ? parseFloat(form.estimated_value) : null,
    });
    await base44.entities.NTAActivity.create({
      opportunity_id: opp.id,
      activity_type: 'opportunity_created',
      title: `Opportunity created: ${form.opportunity_name}`,
      source_system: 'nta_opportunities',
    });
    toast.success('Opportunity created');
    setSaving(false);
    setShowCreate(false);
    load();
  };

  const updateStage = async (opp, newStage) => {
    await base44.entities.NTAOpportunity.update(opp.id, { stage: newStage });
    await base44.entities.NTAActivity.create({
      opportunity_id: opp.id,
      company_id: opp.company_id,
      activity_type: 'stage_change',
      title: `Stage changed to ${newStage}`,
      source_system: 'nta_opportunities',
    });
    toast.success(`Stage → ${newStage}`);
    load();
  };

  const filtered = opps.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !q || o.opportunity_name?.toLowerCase().includes(q) || companies[o.company_id]?.company_name?.toLowerCase().includes(q);
    const matchStage = stageFilter === 'all' || o.stage === stageFilter;
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStage && matchStatus;
  });

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/nta/command-center" className="text-slate-400 hover:text-white text-sm">← Command Center</Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2"><Target className="w-5 h-5 text-violet-400" />Opportunities</h1>
              <p className="text-slate-400 text-sm">{opps.filter(o => o.status === 'open').length} open · {opps.filter(o => o.stage === 'won').length} won</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={load} variant="outline" size="sm" className="border-slate-700 text-slate-300"><RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /></Button>
            <Button onClick={() => setShowCreate(true)} size="sm" className="bg-violet-700 hover:bg-violet-600"><Plus className="w-3 h-3 mr-1.5" />Add</Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-4">
        {/* Stage Pipeline Summary */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-1.5">
          {STAGES.map(stage => {
            const count = opps.filter(o => o.stage === stage).length;
            return (
              <button key={stage} onClick={() => setStageFilter(stageFilter === stage ? 'all' : stage)}
                className={`rounded-lg p-2 text-center transition-all border ${stageFilter === stage ? 'border-violet-500 bg-violet-900/30' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`}>
                <p className="text-white font-bold text-lg">{count}</p>
                <p className="text-slate-400 text-xs leading-tight">{stage.replace('_', ' ')}</p>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="bg-slate-800 border-slate-700 text-white pl-8 h-8 text-xs" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {['open','won','lost','stalled'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-slate-500 text-xs">{filtered.length} results</span>
        </div>

        {loading ? (
          <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 bg-slate-800 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No opportunities</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(o => {
              const co = companies[o.company_id];
              const isOverdue = o.next_step_due && o.next_step_due < today && o.status === 'open';
              return (
                <div key={o.id} className={`bg-slate-800 border rounded-xl p-4 transition-all ${isOverdue ? 'border-orange-700' : 'border-slate-700 hover:border-slate-600'}`}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-white">{o.opportunity_name}</p>
                        <Badge className={`${STAGE_COLORS[o.stage] || 'bg-slate-700 text-slate-400'} border-0 text-xs`}>{o.stage}</Badge>
                        {isOverdue && <Badge className="bg-orange-900 text-orange-300 border-0 text-xs">Overdue</Badge>}
                      </div>
                      <div className="flex gap-3 text-xs text-slate-500 flex-wrap">
                        {co && <span className="text-slate-400">{co.company_name}</span>}
                        <span>{o.offer_type}</span>
                        {o.estimated_value && <span className="text-emerald-400">${o.estimated_value.toLocaleString()}</span>}
                        {o.next_step && <span>Next: {o.next_step}</span>}
                        {o.next_step_due && <span>Due: {o.next_step_due}</span>}
                      </div>
                    </div>
                    <Select value={o.stage} onValueChange={v => updateStage(o, v)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-7 text-xs w-40"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader><DialogTitle>Add Opportunity</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            {[['opportunity_name','Name *','text'],['next_step','Next Step','text'],['next_step_due','Next Step Due','date'],['estimated_value','Estimated Value ($)','number'],['owner','Owner','text']].map(([field,label,type]) => (
              <div key={field}>
                <label className="text-slate-400 text-xs mb-1 block">{label}</label>
                <Input type={type} value={form[field]} onChange={e => setForm(f => ({...f, [field]: e.target.value}))} className="bg-slate-800 border-slate-700 text-white" />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Stage</label>
                <Select value={form.stage} onValueChange={v => setForm(f => ({...f, stage: v}))}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Offer Type</label>
                <Select value={form.offer_type} onValueChange={v => setForm(f => ({...f, offer_type: v}))}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['dfy_managed','diy_saas','ada_rebuild','website_rebuild','streaming_tv','video_production','local_seo','other'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={save} disabled={saving} className="bg-violet-700 hover:bg-violet-600 flex-1">
                {saving && <Loader2 className="w-3 h-3 animate-spin mr-1.5" />}Save
              </Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)} className="text-slate-400">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}