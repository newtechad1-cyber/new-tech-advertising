import React, { useState, useEffect } from 'react';
import AdminGuard from '../components/auth/AdminGuard';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  ArrowLeft, BrainCircuit, Zap, Loader2, Play, RefreshCw,
  DollarSign, BarChart2, Lock, CheckCircle2, XCircle, Clock,
  AlertTriangle, Pencil, Database, Cpu, Eye, ChevronDown, Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const STEP_STATUS_CONFIG = {
  idle:          { label: 'Idle',          color: 'bg-slate-700 text-slate-300', icon: Clock },
  running:       { label: 'Running',       color: 'bg-blue-900 text-blue-300',   icon: Loader2 },
  succeeded:     { label: 'Succeeded',     color: 'bg-green-900 text-green-300', icon: CheckCircle2 },
  failed:        { label: 'Failed',        color: 'bg-red-900 text-red-300',     icon: XCircle },
  waiting_input: { label: 'Waiting Input', color: 'bg-yellow-900 text-yellow-300', icon: AlertTriangle },
};

const PAGE_SIZE = 25;

function TasksTab() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState({});
  const [viewTask, setViewTask] = useState(null);
  const [taskLedger, setTaskLedger] = useState([]);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [page, setPage] = useState(0);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.AiTask.list('-created_date', 200);
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openTask = async (task) => {
    setViewTask(task);
    setTaskLedger([]);
    setLedgerLoading(true);
    const entries = await base44.entities.AiCostLedger.filter({ task_id: task.id }, '-created_date', 10);
    setTaskLedger(entries);
    setLedgerLoading(false);
  };

  const runStep = async (task) => {
    setRunning(r => ({ ...r, [task.id]: true }));
    const res = await base44.functions.invoke('runAiStep', { task_id: task.id });
    setRunning(r => ({ ...r, [task.id]: false }));
    if (res.data?.success) {
      if (res.data.softLimitWarning) {
        toast.warning(`Step completed — ⚠️ ${res.data.softLimitMessage}`);
      } else {
        toast.success('Step completed!');
      }
    } else if (res.data?.error === 'TaskLocked') {
      toast.error(`Task is locked by ${res.data.locked_by}. Try again in 10 min.`);
    } else {
      toast.error(res.data?.error || 'Step failed');
    }
    load();
  };

  const allAgents = [...new Set(tasks.map(t => t.agent_key).filter(Boolean))];
  const filtered = tasks.filter(t => {
    const matchStatus = statusFilter === 'all' || (t.step_status || 'idle') === statusFilter;
    const matchAgent  = agentFilter === 'all' || t.agent_key === agentFilter;
    return matchStatus && matchAgent;
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (loading) return <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(0); }}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(STEP_STATUS_CONFIG).map(([k,v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={agentFilter} onValueChange={v => { setAgentFilter(v); setPage(0); }}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs w-44"><SelectValue placeholder="All Agents" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              {allAgents.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-xs">{filtered.length} tasks</span>
          <Button size="sm" onClick={load} variant="outline" className="border-slate-700 text-slate-300 h-8 text-xs">
            <RefreshCw className="w-3 h-3 mr-1.5" />Refresh
          </Button>
        </div>
      </div>
      {filtered.length === 0 && <div className="text-center py-16 text-slate-500">No tasks match filters.</div>}
      <div className="space-y-2">
        {paginated.map(task => {
          const sc = STEP_STATUS_CONFIG[task.step_status || 'idle'];
          const Icon = sc.icon;
          const isLocked = !!task.locked_by && task.step_status === 'running';
          return (
            <div key={task.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-white">{task.label || task.agent_key}</p>
                    <Badge className={`${sc.color} border-0 text-xs`}>
                      <Icon className={`w-3 h-3 mr-1 ${task.step_status === 'running' ? 'animate-spin' : ''}`} />
                      {sc.label}
                    </Badge>
                    {isLocked && <Badge className="bg-orange-900 text-orange-300 border-0 text-xs"><Lock className="w-3 h-3 mr-1" />Locked</Badge>}
                    {task.retry_count > 0 && <Badge className="bg-yellow-900 text-yellow-300 border-0 text-xs">Retry #{task.retry_count}</Badge>}
                  </div>
                  <div className="flex gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                    <span>Agent: <span className="text-slate-400">{task.agent_key}</span></span>
                    {task.workflow_key && <span>Workflow: <span className="text-slate-400">{task.workflow_key}</span></span>}
                    {task.account_id && <span>Account: <span className="text-slate-400">{task.account_id.slice(0,8)}…</span></span>}
                    {task.step_started_at && <span>Started: <span className="text-slate-400">{new Date(task.step_started_at).toLocaleTimeString()}</span></span>}
                  </div>
                  {task.error && <p className="text-red-400 text-xs mt-1 truncate max-w-md">{task.error}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => openTask(task)} className="h-8 text-xs text-slate-400 hover:text-white">
                    <Eye className="w-3 h-3 mr-1" />View
                  </Button>
                  <Button size="sm" onClick={() => runStep(task)} disabled={running[task.id] || isLocked}
                    className="bg-violet-700 hover:bg-violet-600 h-8 text-xs">
                    {running[task.id] ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                    Run Step
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(p => p-1)} className="border-slate-700 text-slate-300 h-7 text-xs">Prev</Button>
          <span className="text-slate-500 text-xs">{page+1} / {totalPages}</span>
          <Button size="sm" variant="outline" disabled={page >= totalPages-1} onClick={() => setPage(p => p+1)} className="border-slate-700 text-slate-300 h-7 text-xs">Next</Button>
        </div>
      )}

      <Dialog open={!!viewTask} onOpenChange={() => setViewTask(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{viewTask?.label || viewTask?.agent_key}</DialogTitle></DialogHeader>
          {viewTask && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Step Status', viewTask.step_status],
                  ['Retry Count', viewTask.retry_count || 0],
                  ['Agent', viewTask.agent_key],
                  ['Workflow', viewTask.workflow_key || '—'],
                  ['Started', viewTask.step_started_at ? new Date(viewTask.step_started_at).toLocaleString() : '—'],
                  ['Finished', viewTask.step_finished_at ? new Date(viewTask.step_finished_at).toLocaleString() : '—'],
                ].map(([k, v]) => (
                  <div key={k} className="bg-slate-800 rounded-lg p-3">
                    <p className="text-slate-500 text-xs">{k}</p>
                    <p className="text-white mt-0.5">{String(v)}</p>
                  </div>
                ))}
              </div>
              {viewTask.outputs && (
                <div>
                  <p className="text-slate-400 text-xs font-medium mb-2">OUTPUTS</p>
                  <pre className="bg-slate-800 rounded-lg p-3 text-xs text-slate-300 whitespace-pre-wrap overflow-auto max-h-64">
                    {JSON.stringify(viewTask.outputs, null, 2)}
                  </pre>
                </div>
              )}
              {viewTask.last_soft_limit_warning && (
                <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-300 text-xs font-medium">Soft Budget Limit Warning</p>
                    <p className="text-yellow-400/80 text-xs mt-0.5">{viewTask.last_soft_limit_message}</p>
                    {viewTask.last_soft_limit_at && <p className="text-slate-500 text-xs mt-1">Triggered: {new Date(viewTask.last_soft_limit_at).toLocaleString()}</p>}
                  </div>
                </div>
              )}
              {viewTask.error && (
                <div className="bg-red-900/30 border border-red-800 rounded-lg p-3">
                  <p className="text-red-400 text-xs font-medium mb-1">ERROR</p>
                  <p className="text-red-300 text-xs">{viewTask.error}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BudgetsTab() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ account_id: '', month: '', monthly_budget_cents: 1000, soft_limit_cents: 800, hard_limit_cents: 1000 });

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.AiBudget.list('-created_date', 100);
    setBudgets(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editing) {
      await base44.entities.AiBudget.update(editing.id, form);
      toast.success('Budget updated');
    } else {
      await base44.entities.AiBudget.create({ ...form, spent_cents: 0 });
      toast.success('Budget created');
    }
    setEditing(null);
    setShowCreate(false);
    load();
  };

  const openEdit = (b) => {
    setEditing(b);
    setForm({ account_id: b.account_id, month: b.month, monthly_budget_cents: b.monthly_budget_cents, soft_limit_cents: b.soft_limit_cents, hard_limit_cents: b.hard_limit_cents });
    setShowCreate(true);
  };

  if (loading) return <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-slate-400 text-sm">{budgets.length} budget records</p>
        <Button size="sm" onClick={() => { setEditing(null); setForm({ account_id: '', month: new Date().toISOString().slice(0,7), monthly_budget_cents: 1000, soft_limit_cents: 800, hard_limit_cents: 1000 }); setShowCreate(true); }}
          className="bg-violet-700 hover:bg-violet-600 h-8 text-xs">
          <Plus className="w-3 h-3 mr-1.5" />Add Budget
        </Button>
      </div>
      {budgets.some(b => b.spent_cents >= b.soft_limit_cents && b.spent_cents < b.hard_limit_cents) && (
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
          <p className="text-yellow-300 text-sm">One or more accounts have reached their soft budget limit this month.</p>
        </div>
      )}
      {budgets.length === 0 && <div className="text-center py-16 text-slate-500">No budgets yet.</div>}
      <div className="space-y-3">
        {budgets.map(b => {
          const pct = b.monthly_budget_cents ? Math.min(100, Math.round((b.spent_cents / b.monthly_budget_cents) * 100)) : 0;
          const isOver = b.spent_cents >= b.hard_limit_cents;
          const isWarn = !isOver && b.spent_cents >= b.soft_limit_cents;
          return (
            <div key={b.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-white text-sm">{b.account_id.slice(0,12)}…</p>
                  <p className="text-slate-500 text-xs mt-0.5">{b.month}</p>
                </div>
                <div className="flex items-center gap-2">
                  {isOver && <Badge className="bg-red-900 text-red-300 border-0 text-xs">Over Limit</Badge>}
                  {isWarn && <Badge className="bg-yellow-900 text-yellow-300 border-0 text-xs">Warning</Badge>}
                  <Button size="sm" variant="ghost" onClick={() => openEdit(b)} className="h-7 text-xs text-slate-400"><Pencil className="w-3 h-3" /></Button>
                </div>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>${(b.spent_cents / 100).toFixed(2)} spent</span>
                  <span>${(b.monthly_budget_cents / 100).toFixed(2)} budget</span>
                </div>
                <div className="bg-slate-700 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${isOver ? 'bg-red-500' : isWarn ? 'bg-yellow-500' : 'bg-violet-500'}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="flex gap-4 text-xs text-slate-500">
                <span>Soft: <span className="text-yellow-400">${(b.soft_limit_cents/100).toFixed(2)}</span></span>
                <span>Hard: <span className="text-red-400">${(b.hard_limit_cents/100).toFixed(2)}</span></span>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader><DialogTitle>{editing ? 'Edit Budget' : 'Add Budget'}</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Account ID</label>
              <Input value={form.account_id} onChange={e => setForm(f => ({...f, account_id: e.target.value}))} className="bg-slate-800 border-slate-700 text-white" disabled={!!editing} />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Month (YYYY-MM)</label>
              <Input value={form.month} onChange={e => setForm(f => ({...f, month: e.target.value}))} className="bg-slate-800 border-slate-700 text-white" disabled={!!editing} />
            </div>
            {[
              { field: 'monthly_budget_cents', label: 'Monthly Budget (cents)' },
              { field: 'soft_limit_cents', label: 'Soft Limit (cents)' },
              { field: 'hard_limit_cents', label: 'Hard Limit (cents)' },
            ].map(f => (
              <div key={f.field}>
                <label className="text-slate-400 text-xs mb-1 block">{f.label}</label>
                <Input type="number" value={form[f.field]} onChange={e => setForm(prev => ({...prev, [f.field]: parseInt(e.target.value)||0}))} className="bg-slate-800 border-slate-700 text-white" />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <Button onClick={save} className="bg-violet-700 hover:bg-violet-600 flex-1">Save</Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)} className="text-slate-400">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CostLedgerTab() {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agentFilter, setAgentFilter] = useState('all');
  const [page, setPage] = useState(0);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.AiCostLedger.list('-created_date', 500);
    setLedger(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  // Normalize agent key for filter (strip :attempt1/:repair suffix)
  const baseAgentKey = (key) => key?.split(':')[0] || key;
  const agents = [...new Set(ledger.map(l => baseAgentKey(l.agent_key)))];
  const filtered = agentFilter === 'all' ? ledger : ledger.filter(l => baseAgentKey(l.agent_key) === agentFilter);
  const totalCents = filtered.reduce((s, l) => s + (l.cost_cents || 0), 0);
  const totalInputTokens = filtered.reduce((s, l) => s + (l.input_tokens || 0), 0);
  const totalOutputTokens = filtered.reduce((s, l) => s + (l.output_tokens || 0), 0);
  const ledgerPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedLedger = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (loading) return <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3">
          <Select value={agentFilter} onValueChange={v => { setAgentFilter(v); setPage(0); }}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white w-44 h-8 text-xs"><SelectValue placeholder="All Agents" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              {agents.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" onClick={load} variant="outline" className="border-slate-700 text-slate-300 h-8 text-xs"><RefreshCw className="w-3 h-3 mr-1.5" />Refresh</Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <p className="text-xl font-bold text-emerald-400">${(totalCents / 100).toFixed(4)}</p>
          <p className="text-slate-500 text-xs mt-0.5">Total Cost</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <p className="text-xl font-bold text-blue-400">{totalInputTokens.toLocaleString()}</p>
          <p className="text-slate-500 text-xs mt-0.5">Input Tokens</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <p className="text-xl font-bold text-purple-400">{totalOutputTokens.toLocaleString()}</p>
          <p className="text-slate-500 text-xs mt-0.5">Output Tokens</p>
        </div>
      </div>

      {filtered.length === 0 && <div className="text-center py-16 text-slate-500">No cost records yet.</div>}
      <div className="space-y-2">
        {paginatedLedger.map(l => (
          <div key={l.id} className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-white text-sm font-medium">{baseAgentKey(l.agent_key)}</p>
                {l.agent_key?.includes(':') && <Badge className="bg-yellow-900 text-yellow-300 border-0 text-xs">{l.agent_key.split(':')[1]}</Badge>}
                <span className="text-slate-500 text-xs">{l.model}</span>
              </div>
              <div className="flex gap-3 text-xs text-slate-500 mt-0.5">
                <span>In: {(l.input_tokens||0).toLocaleString()} tkns</span>
                <span>Out: {(l.output_tokens||0).toLocaleString()} tkns</span>
                <span>{new Date(l.created_date).toLocaleDateString()}</span>
              </div>
            </div>
            <p className="text-emerald-400 font-bold text-sm">${(l.cost_cents / 100).toFixed(4)}</p>
          </div>
        ))}
      </div>
      {ledgerPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(p => p-1)} className="border-slate-700 text-slate-300 h-7 text-xs">Prev</Button>
          <span className="text-slate-500 text-xs">{page+1} / {ledgerPages}</span>
          <Button size="sm" variant="outline" disabled={page >= ledgerPages-1} onClick={() => setPage(p => p+1)} className="border-slate-700 text-slate-300 h-7 text-xs">Next</Button>
        </div>
      )}
    </div>
  );
}

function MemoryTab() {
  const [memory, setMemory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ account_id: '', scope: 'global', key: '', label: '', value_text: '' });
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.AiMemory.list('-updated_date', 200);
    setMemory(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    let parsedValue;
    try { parsedValue = JSON.parse(form.value_text); } catch { parsedValue = { text: form.value_text }; }
    const payload = { account_id: form.account_id, scope: form.scope, key: form.key, label: form.label, value: parsedValue };
    if (editing) {
      await base44.entities.AiMemory.update(editing.id, payload);
      toast.success('Memory updated');
    } else {
      await base44.entities.AiMemory.create(payload);
      toast.success('Memory stored');
    }
    setShowCreate(false);
    setEditing(null);
    load();
  };

  const openEdit = (m) => {
    setEditing(m);
    setForm({ account_id: m.account_id, scope: m.scope, key: m.key, label: m.label || '', value_text: JSON.stringify(m.value, null, 2) });
    setShowCreate(true);
  };

  const del = async (id) => {
    await base44.entities.AiMemory.delete(id);
    load();
    toast.success('Deleted');
  };

  if (loading) return <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-slate-400 text-sm">{memory.length} memory records</p>
        <Button size="sm" onClick={() => { setEditing(null); setForm({ account_id: '', scope: 'global', key: '', label: '', value_text: '{}' }); setShowCreate(true); }} className="bg-violet-700 hover:bg-violet-600 h-8 text-xs">
          <Plus className="w-3 h-3 mr-1.5" />Add Memory
        </Button>
      </div>
      {memory.length === 0 && <div className="text-center py-16 text-slate-500">No memory records yet.</div>}
      <div className="space-y-2">
        {memory.map(m => (
          <div key={m.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-violet-400 text-xs font-medium px-2 py-0.5 bg-violet-900/40 rounded">{m.scope}</span>
                  <p className="text-white font-medium text-sm">{m.key}</p>
                  {m.label && <span className="text-slate-500 text-xs">— {m.label}</span>}
                </div>
                <p className="text-slate-500 text-xs mt-1">Account: {m.account_id?.slice(0,12)}…</p>
                <p className="text-slate-400 text-xs mt-1 font-mono truncate max-w-lg">{JSON.stringify(m.value).slice(0, 120)}</p>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => openEdit(m)} className="h-7 text-xs text-slate-400"><Pencil className="w-3 h-3" /></Button>
                <Button size="sm" variant="ghost" onClick={() => del(m.id)} className="h-7 text-xs text-red-500 hover:text-red-400">✕</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader><DialogTitle>{editing ? 'Edit Memory' : 'Add Memory'}</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Account ID</label>
              <Input value={form.account_id} onChange={e => setForm(f => ({...f, account_id: e.target.value}))} className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Scope</label>
                <Input value={form.scope} onChange={e => setForm(f => ({...f, scope: e.target.value}))} placeholder="global" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Key</label>
                <Input value={form.key} onChange={e => setForm(f => ({...f, key: e.target.value}))} placeholder="brand_voice" className="bg-slate-800 border-slate-700 text-white" />
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Label (optional)</label>
              <Input value={form.label} onChange={e => setForm(f => ({...f, label: e.target.value}))} placeholder="Brand Voice Profile" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Value (JSON or plain text)</label>
              <textarea value={form.value_text} onChange={e => setForm(f => ({...f, value_text: e.target.value}))} rows={5} className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-violet-500" />
            </div>
            <div className="flex gap-3 pt-1">
              <Button onClick={save} className="bg-violet-700 hover:bg-violet-600 flex-1">Save</Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)} className="text-slate-400">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const TABS = [
  { id: 'tasks',   label: 'AI Tasks',    icon: Cpu },
  { id: 'budgets', label: 'Budgets',     icon: DollarSign },
  { id: 'ledger',  label: 'Cost Ledger', icon: BarChart2 },
  { id: 'memory',  label: 'Memory',      icon: Database },
];

export default function AiOperations() {
  const [activeTab, setActiveTab] = useState('tasks');

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center gap-4">
            <Link to={createPageUrl('AdminDashboard')}>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />Admin Hub
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-violet-400" />
                <h1 className="text-xl font-bold">AI Operations</h1>
              </div>
              <p className="text-slate-400 text-sm">Tasks · Budgets · Cost Ledger · Memory</p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex gap-1 mb-6 bg-slate-900 rounded-xl p-1 border border-slate-800 w-fit">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Icon className="w-4 h-4" />{tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === 'tasks'   && <TasksTab />}
          {activeTab === 'budgets' && <BudgetsTab />}
          {activeTab === 'ledger'  && <CostLedgerTab />}
          {activeTab === 'memory'  && <MemoryTab />}
        </div>
      </div>
    </AdminGuard>
  );
}