import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { FolderKanban, RefreshCw, Search, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_COLORS = {
  not_started: 'bg-slate-700 text-slate-400',
  in_progress: 'bg-blue-900 text-blue-300',
  review: 'bg-yellow-900 text-yellow-300',
  blocked: 'bg-red-900 text-red-300',
  completed: 'bg-green-900 text-green-300',
  cancelled: 'bg-slate-700 text-slate-500',
};

export default function NTAProjects() {
  const [projects, setProjects] = useState([]);
  const [companies, setCompanies] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ project_name: '', project_type: 'onboarding', status: 'not_started', priority: 'medium', start_date: '', due_date: '', owner: '', scope: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [data, cos] = await Promise.all([
      base44.entities.NTAClientProject.list('-created_date', 200),
      base44.entities.NTACompany.list(),
    ]);
    setProjects(data);
    const map = {};
    cos.forEach(c => { map[c.id] = c; });
    setCompanies(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.project_name) { toast.error('Name required'); return; }
    setSaving(true);
    await base44.entities.NTAClientProject.create(form);
    toast.success('Project created');
    setSaving(false);
    setShowCreate(false);
    load();
  };

  const updateStatus = async (proj, newStatus) => {
    await base44.entities.NTAClientProject.update(proj.id, { status: newStatus });
    toast.success(`Status → ${newStatus}`);
    load();
  };

  const today = new Date().toISOString().slice(0, 10);
  const filtered = projects.filter(p => {
    const q = search.toLowerCase();
    const co = companies[p.company_id];
    const matchSearch = !q || p.project_name?.toLowerCase().includes(q) || co?.company_name?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/nta/command-center" className="text-slate-400 hover:text-white text-sm">← Command Center</Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2"><FolderKanban className="w-5 h-5 text-cyan-400" />Projects</h1>
              <p className="text-slate-400 text-sm">{projects.filter(p => p.status === 'in_progress').length} active · {projects.length} total</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={load} variant="outline" size="sm" className="border-slate-700 text-slate-300"><RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /></Button>
            <Button onClick={() => setShowCreate(true)} size="sm" className="bg-cyan-700 hover:bg-cyan-600"><Plus className="w-3 h-3 mr-1.5" />Add</Button>
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
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {['not_started','in_progress','review','blocked','completed','cancelled'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-slate-500 text-xs">{filtered.length} results</span>
        </div>

        {loading ? <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 bg-slate-800 rounded-xl animate-pulse" />)}</div>
        : filtered.length === 0 ? <div className="text-center py-16 text-slate-500">No projects</div>
        : (
          <div className="space-y-2">
            {filtered.map(p => {
              const co = companies[p.company_id];
              const isOverdue = p.due_date && p.due_date < today && p.status !== 'completed' && p.status !== 'cancelled';
              return (
                <div key={p.id} className={`bg-slate-800 border rounded-xl p-4 transition-all ${isOverdue ? 'border-orange-700' : 'border-slate-700 hover:border-slate-600'}`}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-white">{p.project_name}</p>
                        <Badge className={`${STATUS_COLORS[p.status] || 'bg-slate-700 text-slate-400'} border-0 text-xs`}>{p.status}</Badge>
                        {isOverdue && <Badge className="bg-orange-900 text-orange-300 border-0 text-xs">Overdue</Badge>}
                      </div>
                      <div className="flex gap-3 text-xs text-slate-500 flex-wrap">
                        {co && <span className="text-slate-400">{co.company_name}</span>}
                        <span>{p.project_type}</span>
                        {p.due_date && <span>Due: {p.due_date}</span>}
                        {p.owner && <span>{p.owner}</span>}
                      </div>
                    </div>
                    <Select value={p.status} onValueChange={v => updateStatus(p, v)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-7 text-xs w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>{['not_started','in_progress','review','blocked','completed','cancelled'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
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
          <DialogHeader><DialogTitle>Add Project</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            {[['project_name','Project Name *','text'],['start_date','Start Date','date'],['due_date','Due Date','date'],['owner','Owner','text']].map(([field,label,type]) => (
              <div key={field}>
                <label className="text-slate-400 text-xs mb-1 block">{label}</label>
                <Input type={type} value={form[field]} onChange={e => setForm(f => ({...f, [field]: e.target.value}))} className="bg-slate-800 border-slate-700 text-white" />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Type</label>
                <Select value={form.project_type} onValueChange={v => setForm(f => ({...f, project_type: v}))}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{['onboarding','website_rebuild','ada_rebuild','streaming_tv','video_production','social_setup','seo','content','other'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Priority</label>
                <Select value={form.priority} onValueChange={v => setForm(f => ({...f, priority: v}))}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{['low','medium','high','urgent'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={save} disabled={saving} className="bg-cyan-700 hover:bg-cyan-600 flex-1">
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