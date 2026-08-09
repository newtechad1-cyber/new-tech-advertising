import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { CheckSquare, RefreshCw, Search, Plus, Loader2, CheckCircle2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const PRIORITY_COLORS = {
  low: 'bg-slate-700 text-slate-400',
  medium: 'bg-blue-900 text-blue-300',
  high: 'bg-orange-900 text-orange-300',
  urgent: 'bg-red-900 text-red-300',
};

export default function NTATasks() {
  const [tasks, setTasks] = useState([]);
  const [companies, setCompanies] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todo');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', task_type: 'follow_up', status: 'todo', priority: 'medium', assigned_to: '', due_date: '' });
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState({});
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await base44.functions.invoke('generateTaskMetricsPresentation', {});
      if (res.data.success) {
        toast.success('Presentation generated and saved to OneDrive');
        if (res.data.file && res.data.file.webUrl) {
          window.open(res.data.file.webUrl, '_blank');
        }
      } else {
        toast.error('Failed to generate presentation');
      }
    } catch (e) {
      toast.error(e.message || 'Error generating presentation');
    } finally {
      setExporting(false);
    }
  };

  const load = async () => {
    setLoading(true);
    const [data, cos] = await Promise.all([
      base44.entities.NTATask.list('-created_date', 300),
      base44.entities.NTACompany.list(),
    ]);
    setTasks(data);
    const map = {};
    cos.forEach(c => { map[c.id] = c; });
    setCompanies(map);
    setLoading(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('overdue') === 'true') setStatusFilter('todo');
    load();
  }, []);

  const save = async () => {
    if (!form.title) { toast.error('Title required'); return; }
    setSaving(true);
    await base44.entities.NTATask.create(form);
    toast.success('Task created');
    setSaving(false);
    setShowCreate(false);
    load();
  };

  const complete = async (task) => {
    setCompleting(c => ({ ...c, [task.id]: true }));
    await base44.entities.NTATask.update(task.id, { status: 'done' });
    toast.success('Task completed');
    setCompleting(c => ({ ...c, [task.id]: false }));
    load();
  };

  const today = new Date().toISOString().slice(0, 10);
  const filtered = tasks.filter(t => {
    const q = search.toLowerCase();
    const co = companies[t.company_id];
    const matchSearch = !q || t.title?.toLowerCase().includes(q) || co?.company_name?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchType = typeFilter === 'all' || t.task_type === typeFilter;
    return matchSearch && matchStatus && matchPriority && matchType;
  });

  const types = [...new Set(tasks.map(t => t.task_type).filter(Boolean))];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/nta/command-center" className="text-slate-400 hover:text-white text-sm">← Command Center</Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2"><CheckSquare className="w-5 h-5 text-amber-400" />Tasks</h1>
              <p className="text-slate-400 text-sm">
                {tasks.filter(t => t.status === 'todo' && t.due_date === today).length} due today ·{' '}
                {tasks.filter(t => t.status === 'todo' && t.due_date && t.due_date < today).length} overdue
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} disabled={exporting} variant="outline" size="sm" className="border-slate-700 text-slate-300">
              {exporting ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : <Download className="w-3 h-3 mr-1.5" />}
              Export PPTX
            </Button>
            <Button onClick={load} variant="outline" size="sm" className="border-slate-700 text-slate-300"><RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /></Button>
            <Button onClick={() => setShowCreate(true)} size="sm" className="bg-amber-700 hover:bg-amber-600"><Plus className="w-3 h-3 mr-1.5" />Add</Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." className="bg-slate-800 border-slate-700 text-white pl-8 h-8 text-xs" />
          </div>
          {[
            { label: 'Status', value: statusFilter, set: setStatusFilter, options: ['todo','in_progress','done','cancelled'] },
            { label: 'Priority', value: priorityFilter, set: setPriorityFilter, options: ['low','medium','high','urgent'] },
            { label: 'Type', value: typeFilter, set: setTypeFilter, options: types },
          ].map(({ label, value, set, options }) => (
            <Select key={label} value={value} onValueChange={set}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs w-32"><SelectValue placeholder={`All ${label}`} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {label}</SelectItem>
                {options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          ))}
          <span className="text-slate-500 text-xs">{filtered.length} tasks</span>
        </div>

        {loading ? <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-14 bg-slate-800 rounded-xl animate-pulse" />)}</div>
        : filtered.length === 0 ? <div className="text-center py-16 text-slate-500">No tasks match filters</div>
        : (
          <div className="space-y-1.5">
            {filtered.map(t => {
              const co = companies[t.company_id];
              const isOverdue = t.due_date && t.due_date < today && t.status === 'todo';
              return (
                <div key={t.id} className={`bg-slate-800 border rounded-xl px-4 py-3 flex items-center gap-3 transition-all ${isOverdue ? 'border-orange-700' : 'border-slate-700 hover:border-slate-600'}`}>
                  <button onClick={() => complete(t)} disabled={t.status === 'done' || completing[t.id]} className="flex-shrink-0">
                    {completing[t.id] ? <Loader2 className="w-4 h-4 text-slate-500 animate-spin" /> :
                      <CheckCircle2 className={`w-4 h-4 transition-colors ${t.status === 'done' ? 'text-green-500' : 'text-slate-600 hover:text-green-400'}`} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-medium ${t.status === 'done' ? 'text-slate-500 line-through' : 'text-white'}`}>{t.title}</p>
                      <Badge className={`${PRIORITY_COLORS[t.priority] || 'bg-slate-700 text-slate-400'} border-0 text-xs`}>{t.priority}</Badge>
                      {isOverdue && <Badge className="bg-orange-900 text-orange-300 border-0 text-xs">Overdue</Badge>}
                    </div>
                    <div className="flex gap-3 text-xs text-slate-500 mt-0.5 flex-wrap">
                      <span>{t.task_type}</span>
                      {co && <span>{co.company_name}</span>}
                      {t.due_date && <span>Due: {t.due_date}</span>}
                      {t.assigned_to && <span>→ {t.assigned_to}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader><DialogTitle>Add Task</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Title *</label>
              <Input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[['due_date','Due Date','date'],['assigned_to','Assigned To','text']].map(([field,label,type]) => (
                <div key={field}>
                  <label className="text-slate-400 text-xs mb-1 block">{label}</label>
                  <Input type={type} value={form[field]} onChange={e => setForm(f => ({...f, [field]: e.target.value}))} className="bg-slate-800 border-slate-700 text-white" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Type</label>
                <Select value={form.task_type} onValueChange={v => setForm(f => ({...f, task_type: v}))}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{['follow_up','call','email','demo','proposal','onboarding','content','approval','webhook_retry','other'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
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
              <Button onClick={save} disabled={saving} className="bg-amber-700 hover:bg-amber-600 flex-1">
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