import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Megaphone, RefreshCw, Search, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_COLORS = {
  draft: 'bg-slate-700 text-slate-400',
  active: 'bg-green-900 text-green-300',
  paused: 'bg-yellow-900 text-yellow-300',
  completed: 'bg-blue-900 text-blue-300',
  cancelled: 'bg-slate-700 text-slate-500',
};

export default function NTACampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [companies, setCompanies] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ campaign_name: '', campaign_type: 'social', channel: 'facebook', status: 'draft', goal: '', start_date: '', end_date: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [data, cos] = await Promise.all([
      base44.entities.NTACampaign.list('-created_date', 200),
      base44.entities.NTACompany.list(),
    ]);
    setCampaigns(data);
    const map = {};
    cos.forEach(c => { map[c.id] = c; });
    setCompanies(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.campaign_name) { toast.error('Name required'); return; }
    setSaving(true);
    await base44.entities.NTACampaign.create(form);
    toast.success('Campaign created');
    setSaving(false);
    setShowCreate(false);
    load();
  };

  const updateStatus = async (c, newStatus) => {
    await base44.entities.NTACampaign.update(c.id, { status: newStatus });
    toast.success(`Status → ${newStatus}`);
    load();
  };

  const filtered = campaigns.filter(c => {
    const q = search.toLowerCase();
    const co = companies[c.company_id];
    const matchSearch = !q || c.campaign_name?.toLowerCase().includes(q) || co?.company_name?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchType = typeFilter === 'all' || c.campaign_type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/nta/command-center" className="text-slate-400 hover:text-white text-sm">← Command Center</Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2"><Megaphone className="w-5 h-5 text-orange-400" />Campaigns</h1>
              <p className="text-slate-400 text-sm">{campaigns.filter(c => c.status === 'active').length} active · {campaigns.length} total</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={load} variant="outline" size="sm" className="border-slate-700 text-slate-300"><RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /></Button>
            <Button onClick={() => setShowCreate(true)} size="sm" className="bg-orange-700 hover:bg-orange-600"><Plus className="w-3 h-3 mr-1.5" />Add</Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="bg-slate-800 border-slate-700 text-white pl-8 h-8 text-xs" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {['draft','active','paused','completed','cancelled'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {['social','email','video','seo','ads','outreach','other'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-slate-500 text-xs">{filtered.length} results</span>
        </div>

        {loading ? <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 bg-slate-800 rounded-xl animate-pulse" />)}</div>
        : filtered.length === 0 ? <div className="text-center py-16 text-slate-500">No campaigns</div>
        : (
          <div className="space-y-2">
            {filtered.map(c => {
              const co = companies[c.company_id];
              return (
                <div key={c.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-all">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-white">{c.campaign_name}</p>
                        <Badge className={`${STATUS_COLORS[c.status] || 'bg-slate-700 text-slate-400'} border-0 text-xs`}>{c.status}</Badge>
                        <Badge className="bg-slate-700 text-slate-400 border-0 text-xs">{c.campaign_type}</Badge>
                        <Badge className="bg-slate-700 text-slate-400 border-0 text-xs">{c.channel}</Badge>
                      </div>
                      <div className="flex gap-3 text-xs text-slate-500 flex-wrap">
                        {co && <span className="text-slate-400">{co.company_name}</span>}
                        {c.start_date && <span>Start: {c.start_date}</span>}
                        {c.end_date && <span>End: {c.end_date}</span>}
                        {c.goal && <span>{c.goal}</span>}
                      </div>
                    </div>
                    <Select value={c.status} onValueChange={v => updateStatus(c, v)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-7 text-xs w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>{['draft','active','paused','completed','cancelled'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
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
          <DialogHeader><DialogTitle>Add Campaign</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            {[['campaign_name','Campaign Name *','text'],['goal','Goal','text'],['start_date','Start Date','date'],['end_date','End Date','date']].map(([field,label,type]) => (
              <div key={field}>
                <label className="text-slate-400 text-xs mb-1 block">{label}</label>
                <Input type={type} value={form[field]} onChange={e => setForm(f => ({...f, [field]: e.target.value}))} className="bg-slate-800 border-slate-700 text-white" />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Type</label>
                <Select value={form.campaign_type} onValueChange={v => setForm(f => ({...f, campaign_type: v}))}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{['social','email','video','seo','ads','outreach','other'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Channel</label>
                <Select value={form.channel} onValueChange={v => setForm(f => ({...f, channel: v}))}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{['facebook','linkedin','instagram','youtube','gbp','email','website','other'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={save} disabled={saving} className="bg-orange-700 hover:bg-orange-600 flex-1">
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