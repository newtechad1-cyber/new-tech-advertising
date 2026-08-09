import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Building2, RefreshCw, Search, Plus, Loader2, Eye, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const LIFECYCLE_COLORS = {
  lead: 'bg-blue-900 text-blue-300',
  qualified: 'bg-yellow-900 text-yellow-300',
  opportunity: 'bg-violet-900 text-violet-300',
  client: 'bg-green-900 text-green-300',
  churned: 'bg-slate-700 text-slate-400',
};

export default function NTACompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ company_name: '', website: '', email: '', phone: '', city: '', state: '', industry: '', lifecycle_stage: 'lead' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.NTACompany.filter({ archived: false }, '-created_date', 200);
    setCompanies(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.company_name) { toast.error('Company name required'); return; }
    setSaving(true);
    await base44.entities.NTACompany.create(form);
    toast.success('Company created');
    setSaving(false);
    setShowCreate(false);
    setForm({ company_name: '', website: '', email: '', phone: '', city: '', state: '', industry: '', lifecycle_stage: 'lead' });
    load();
  };

  const filtered = companies.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || [c.company_name, c.email, c.website, c.city].some(v => v?.toLowerCase().includes(q));
    const matchStage = stageFilter === 'all' || c.lifecycle_stage === stageFilter;
    return matchSearch && matchStage;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/nta/command-center" className="text-slate-400 hover:text-white text-sm">← Command Center</Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2"><Building2 className="w-5 h-5 text-emerald-400" />Companies</h1>
              <p className="text-slate-400 text-sm">{companies.length} total · {companies.filter(c => c.active_client).length} active clients</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={load} variant="outline" size="sm" className="border-slate-700 text-slate-300">
              <RefreshCw className={`w-3 h-3 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={() => setShowCreate(true)} size="sm" className="bg-emerald-700 hover:bg-emerald-600">
              <Plus className="w-3 h-3 mr-1.5" />Add Company
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies..." className="bg-slate-800 border-slate-700 text-white pl-8 h-8 text-xs" />
          </div>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs w-40">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {['lead','qualified','opportunity','client','churned'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-slate-500 text-xs">{filtered.length} results</span>
        </div>

        {loading ? (
          <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-16 bg-slate-800 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No companies found</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(c => (
              <Link key={c.id} to={`/nta/companies/${c.id}`}>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-500 transition-all cursor-pointer">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-white">{c.company_name}</p>
                        <Badge className={`${LIFECYCLE_COLORS[c.lifecycle_stage] || 'bg-slate-700 text-slate-400'} border-0 text-xs`}>{c.lifecycle_stage}</Badge>
                        {c.active_client && <Badge className="bg-green-900 text-green-300 border-0 text-xs">Active Client</Badge>}
                      </div>
                      <div className="flex gap-3 text-xs text-slate-500 flex-wrap">
                        {c.website && <span>{c.website}</span>}
                        {c.email && <span>{c.email}</span>}
                        {c.city && <span>{c.city}{c.state ? `, ${c.state}` : ''}</span>}
                        {c.industry && <span>{c.industry}</span>}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader><DialogTitle>Add Company</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            {[
              ['company_name', 'Company Name *', 'text'],
              ['website', 'Website', 'text'],
              ['email', 'Email', 'email'],
              ['phone', 'Phone', 'text'],
              ['city', 'City', 'text'],
              ['state', 'State', 'text'],
              ['industry', 'Industry', 'text'],
            ].map(([field, label, type]) => (
              <div key={field}>
                <label className="text-slate-400 text-xs mb-1 block">{label}</label>
                <Input type={type} value={form[field]} onChange={e => setForm(f => ({...f, [field]: e.target.value}))} className="bg-slate-800 border-slate-700 text-white" />
              </div>
            ))}
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Lifecycle Stage</label>
              <Select value={form.lifecycle_stage} onValueChange={v => setForm(f => ({...f, lifecycle_stage: v}))}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['lead','qualified','opportunity','client','churned'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={save} disabled={saving} className="bg-emerald-700 hover:bg-emerald-600 flex-1">
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