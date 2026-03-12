import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import {
  DollarSign, TrendingUp, AlertTriangle, Zap, Target,
  CheckCircle2, Circle, Plus, ChevronUp, ChevronDown,
  Edit3, Save, X, Flag, BookOpen, BarChart2
} from 'lucide-react';

const CATEGORY_CONFIG = {
  sales:       { label: 'Sales',       color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-800' },
  expansion:   { label: 'Expansion',   color: 'text-violet-400',  bg: 'bg-violet-950/40 border-violet-800'  },
  operations:  { label: 'Operations',  color: 'text-blue-400',    bg: 'bg-blue-950/40 border-blue-800'      },
  marketing:   { label: 'Marketing',   color: 'text-amber-400',   bg: 'bg-amber-950/40 border-amber-800'    },
  leadership:  { label: 'Leadership',  color: 'text-rose-400',    bg: 'bg-rose-950/40 border-rose-800'      },
  finance:     { label: 'Finance',     color: 'text-teal-400',    bg: 'bg-teal-950/40 border-teal-800'      },
};

const CONFIDENCE_LABELS = {
  90: { label: 'High Conviction', color: 'text-emerald-400', bar: '#10b981' },
  70: { label: 'On Track',        color: 'text-blue-400',    bar: '#3b82f6' },
  50: { label: 'Moderate',        color: 'text-amber-400',   bar: '#f59e0b' },
  0:  { label: 'Uncertain',       color: 'text-rose-400',    bar: '#f43f5e' },
};

function getConfidenceConfig(level) {
  const threshold = [90, 70, 50, 0].find(t => level >= t);
  return CONFIDENCE_LABELS[threshold] ?? CONFIDENCE_LABELS[0];
}

function fmt(n) {
  if (!n) return '$0';
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;
}

function getMonday(d = new Date()) {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const mon = new Date(d.setDate(diff));
  return mon.toISOString().split('T')[0];
}

function KPICard({ label, value, sub, icon: Icon, color }) {
  return (
    <div className="bg-[#0d1526] border border-slate-800/60 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{label}</span>
      </div>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminFounderPlanner() {
  const weekStart = getMonday();

  const [plan, setPlan]         = useState(null);
  const [tasks, setTasks]       = useState([]);
  const [notes, setNotes]       = useState([]);
  const [territories, setTerritories] = useState([]);
  const [loading, setLoading]   = useState(true);

  const [editingPlan, setEditingPlan]   = useState(false);
  const [planDraft, setPlanDraft]       = useState({});
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCat, setNewTaskCat]     = useState('sales');
  const [newNote, setNewNote]           = useState('');
  const [newNoteVertical, setNewNoteVertical] = useState('');
  const [saving, setSaving]             = useState(false);

  useEffect(() => {
    Promise.all([
      base44.entities.FounderWeeklyPlan.filter({ week_start_date: weekStart }),
      base44.entities.FounderPlanTask.filter({ week_start_date: weekStart }),
      base44.entities.FounderPlanNote.list('-created_date', 20),
      base44.entities.ExpansionTerritory.list('-opportunity_score', 50),
    ]).then(([plans, t, n, terr]) => {
      const p = plans[0] || null;
      setPlan(p);
      setPlanDraft(p || { week_start_date: weekStart, confidence_level: 75, status: 'planning' });
      setTasks(t.sort((a, b) => (a.priority_order || 0) - (b.priority_order || 0)));
      setNotes(n);
      setTerritories(terr);
      setLoading(false);
    });
  }, []);

  const activeTerrCount = territories.filter(t => ['active', 'gaining_traction', 'dominated'].includes(t.activation_status)).length;

  async function savePlan() {
    setSaving(true);
    if (plan?.id) {
      const updated = await base44.entities.FounderWeeklyPlan.update(plan.id, planDraft);
      setPlan(updated);
    } else {
      const created = await base44.entities.FounderWeeklyPlan.create(planDraft);
      setPlan(created);
    }
    setEditingPlan(false);
    setSaving(false);
  }

  async function setStatus(status) {
    if (!plan?.id) return;
    const updated = await base44.entities.FounderWeeklyPlan.update(plan.id, { status });
    setPlan(updated);
  }

  async function toggleTask(task) {
    const updated = await base44.entities.FounderPlanTask.update(task.id, { completed: !task.completed });
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: updated.completed } : t));
  }

  async function addTask() {
    if (!newTaskTitle.trim()) return;
    const created = await base44.entities.FounderPlanTask.create({
      plan_id: plan?.id || '',
      week_start_date: weekStart,
      title: newTaskTitle.trim(),
      category: newTaskCat,
      priority_order: tasks.length,
      completed: false,
    });
    setTasks(prev => [...prev, created]);
    setNewTaskTitle('');
  }

  async function deleteTask(id) {
    await base44.entities.FounderPlanTask.delete(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  async function moveTask(idx, dir) {
    const next = [...tasks];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setTasks(next);
    await Promise.all([
      base44.entities.FounderPlanTask.update(next[idx].id, { priority_order: idx }),
      base44.entities.FounderPlanTask.update(next[swap].id, { priority_order: swap }),
    ]);
  }

  async function addNote() {
    if (!newNote.trim()) return;
    const created = await base44.entities.FounderPlanNote.create({
      plan_id: plan?.id || '',
      note_date: new Date().toISOString().split('T')[0],
      content: newNote.trim(),
      vertical_reference: newNoteVertical,
    });
    setNotes(prev => [created, ...prev]);
    setNewNote('');
    setNewNoteVertical('');
  }

  const conf = getConfidenceConfig(plan?.confidence_level ?? planDraft.confidence_level ?? 75);
  const statusColors = { planning: 'text-slate-400', active: 'text-emerald-400', completed: 'text-blue-400' };

  if (loading) return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
      <div className="text-slate-500 text-sm animate-pulse">Loading Founder Planner…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-7 rounded-full bg-violet-500" />
              <h1 className="text-3xl font-black text-white tracking-tight">Founder Planner</h1>
            </div>
            <p className="text-slate-500 text-sm ml-5">
              Week of {new Date(weekStart + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          {plan && (
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${plan.status === 'active' ? 'border-emerald-700 bg-emerald-950/40 text-emerald-400' : plan.status === 'completed' ? 'border-blue-700 bg-blue-950/40 text-blue-400' : 'border-slate-700 bg-slate-900 text-slate-400'}`}>
                {plan.status}
              </span>
              {plan.status === 'planning' && (
                <button onClick={() => setStatus('active')}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white transition-colors">
                  Mark Active
                </button>
              )}
              {plan.status === 'active' && (
                <button onClick={() => setStatus('completed')}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition-colors">
                  Complete Week
                </button>
              )}
            </div>
          )}
        </div>

        {/* SECTION 1 — KPI Snapshot */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPICard label="Revenue Target"      value={fmt(plan?.revenue_target_week)} sub="this week" icon={DollarSign} color="text-violet-400" />
          <KPICard label="Tasks Complete"      value={`${tasks.filter(t => t.completed).length}/${tasks.length}`} sub="priority items" icon={CheckCircle2} color="text-emerald-400" />
          <KPICard label="Active Territories"  value={activeTerrCount} sub="in execution" icon={TrendingUp} color="text-amber-400" />
          <KPICard label="Confidence Level"    value={`${plan?.confidence_level ?? 75}%`} sub={conf.label} icon={BarChart2} color={conf.color} />
          <KPICard label="Focus Vertical"      value={plan?.top_vertical_priority || '—'} sub="top priority" icon={Target} color="text-teal-400" />
        </div>

        {/* SECTION 2 — Current Week Strategy Card */}
        <div className="bg-[#0d1526] border border-slate-800/60 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-violet-400" />
              <h2 className="text-sm font-bold text-slate-200">This Week's Strategy</h2>
            </div>
            {!editingPlan ? (
              <button onClick={() => { setEditingPlan(true); setPlanDraft(plan || { week_start_date: weekStart, confidence_level: 75, status: 'planning' }); }}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                <Edit3 className="w-3.5 h-3.5" /> {plan ? 'Update Strategy' : 'Create Plan'}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => setEditingPlan(false)} className="text-slate-500 hover:text-slate-300 transition-colors"><X className="w-4 h-4" /></button>
                <button onClick={savePlan} disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-xs font-bold text-white transition-colors disabled:opacity-50">
                  <Save className="w-3 h-3" /> {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            )}
          </div>

          {editingPlan ? (
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">Primary Growth Focus</label>
                <input value={planDraft.primary_growth_focus || ''} onChange={e => setPlanDraft(p => ({ ...p, primary_growth_focus: e.target.value }))}
                  placeholder="e.g. Close top 3 HVAC deals and activate Midwest territory"
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">Top Vertical Priority</label>
                  <input value={planDraft.top_vertical_priority || ''} onChange={e => setPlanDraft(p => ({ ...p, top_vertical_priority: e.target.value }))}
                    placeholder="e.g. HVAC"
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">Key Expansion Initiative</label>
                  <input value={planDraft.key_expansion_playbook || ''} onChange={e => setPlanDraft(p => ({ ...p, key_expansion_playbook: e.target.value }))}
                    placeholder="e.g. HVAC Midwest Domination"
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">Revenue Target ($)</label>
                  <input type="number" value={planDraft.revenue_target_week || ''} onChange={e => setPlanDraft(p => ({ ...p, revenue_target_week: Number(e.target.value) }))}
                    placeholder="e.g. 12000"
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">Confidence Level ({planDraft.confidence_level ?? 75}%)</label>
                  <input type="range" min={0} max={100} value={planDraft.confidence_level ?? 75}
                    onChange={e => setPlanDraft(p => ({ ...p, confidence_level: Number(e.target.value) }))}
                    className="w-full accent-violet-500" />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">Strategic Notes</label>
                <textarea value={planDraft.strategic_notes || ''} onChange={e => setPlanDraft(p => ({ ...p, strategic_notes: e.target.value }))}
                  rows={3} placeholder="Key decisions, context, strategic reasoning for this week…"
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
              </div>
            </div>
          ) : plan ? (
            <div className="p-6 space-y-5">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1.5">Primary Focus</p>
                <p className="text-lg font-bold text-white leading-snug">{plan.primary_growth_focus || <span className="text-slate-600 italic font-normal">Not set</span>}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Top Vertical</p>
                  <p className="text-sm font-bold text-violet-400">{plan.top_vertical_priority || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Key Initiative</p>
                  <p className="text-sm font-bold text-amber-400">{plan.key_expansion_playbook || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Revenue Target</p>
                  <p className="text-sm font-black text-emerald-400">{fmt(plan.revenue_target_week)}</p>
                </div>
              </div>
              {plan.strategic_notes && (
                <div className="bg-slate-900/50 rounded-xl px-4 py-3 border border-slate-800">
                  <p className="text-xs text-slate-400 leading-relaxed">{plan.strategic_notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 text-center">
              <p className="text-slate-500 text-sm mb-4">No strategy set for this week.</p>
              <button onClick={() => setEditingPlan(true)}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-bold text-white transition-colors">
                Create This Week's Plan
              </button>
            </div>
          )}
        </div>

        {/* SECTION 3 — Priority Focus List */}
        <div className="bg-[#0d1526] border border-slate-800/60 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800/60">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Weekly Priority Tasks
            </h2>
          </div>
          <div className="divide-y divide-slate-800/40">
            {tasks.map((task, idx) => {
              const cat = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG.sales;
              return (
                <div key={task.id} className={`flex items-center gap-3 px-5 py-3.5 hover:bg-slate-800/20 transition-colors ${task.completed ? 'opacity-50' : ''}`}>
                  <button onClick={() => toggleTask(task)} className="flex-shrink-0">
                    {task.completed
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      : <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400 transition-colors" />}
                  </button>
                  <span className={`flex-1 text-sm font-medium ${task.completed ? 'line-through text-slate-600' : 'text-white'}`}>{task.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold flex-shrink-0 ${cat.bg} ${cat.color}`}>{cat.label}</span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => moveTask(idx, -1)} disabled={idx === 0} className="p-1 text-slate-600 hover:text-slate-300 disabled:opacity-20 transition-colors"><ChevronUp className="w-3.5 h-3.5" /></button>
                    <button onClick={() => moveTask(idx, 1)} disabled={idx === tasks.length - 1} className="p-1 text-slate-600 hover:text-slate-300 disabled:opacity-20 transition-colors"><ChevronDown className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteTask(task.id)} className="p-1 text-slate-700 hover:text-rose-400 transition-colors"><X className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-5 py-4 border-t border-slate-800/60 flex items-center gap-3">
            <Circle className="w-5 h-5 text-slate-700 flex-shrink-0" />
            <input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
              placeholder="Add priority task… (press Enter)"
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none" />
            <select value={newTaskCat} onChange={e => setNewTaskCat(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none">
              {Object.entries(CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <button onClick={addTask} className="p-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors">
              <Plus className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

        {/* SECTION 4 & 5 — Notes + Confidence (side by side on large) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Notes Panel — 2/3 */}
          <div className="lg:col-span-2 bg-[#0d1526] border border-slate-800/60 rounded-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800/60 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-slate-200">Decision Journal</h2>
            </div>
            <div className="flex-1 divide-y divide-slate-800/40 max-h-72 overflow-y-auto">
              {notes.length === 0 && (
                <p className="text-slate-600 text-sm text-center py-8">No notes yet. Add your first leadership note below.</p>
              )}
              {notes.map((n, i) => (
                <div key={n.id || i} className="px-5 py-3.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-slate-500">
                      {n.note_date ? new Date(n.note_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                    </span>
                    {n.vertical_reference && (
                      <span className="text-[10px] font-bold text-violet-400 px-1.5 py-0.5 bg-violet-950/40 border border-violet-800/50 rounded-full">{n.vertical_reference}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{n.content}</p>
                </div>
              ))}
            </div>
            <div className="px-5 py-3.5 border-t border-slate-800/60 space-y-2">
              <textarea value={newNote} onChange={e => setNewNote(e.target.value)}
                placeholder="Add a leadership note or strategic decision…"
                rows={2}
                className="w-full bg-slate-800/40 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none" />
              <div className="flex items-center gap-2">
                <input value={newNoteVertical} onChange={e => setNewNoteVertical(e.target.value)}
                  placeholder="Vertical (optional)"
                  className="flex-1 bg-slate-800/40 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none" />
                <button onClick={addNote}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 rounded-xl text-xs font-bold text-white transition-colors">
                  Add Note
                </button>
              </div>
            </div>
          </div>

          {/* Confidence Meter — 1/3 */}
          <div className="bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-6 self-start">
              <Zap className="w-4 h-4 text-violet-400" />
              <h2 className="text-sm font-bold text-slate-200">Confidence Meter</h2>
            </div>
            <div className="relative flex items-center justify-center mb-6" style={{ width: 140, height: 140 }}>
              <svg viewBox="0 0 120 120" width="140" height="140">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none"
                  stroke={conf.bar} strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 50 * ((plan?.confidence_level ?? 75) / 100)} ${2 * Math.PI * 50}`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dasharray 0.8s ease' }}
                />
              </svg>
              <div className="absolute text-center">
                <p className={`text-3xl font-black ${conf.color}`}>{plan?.confidence_level ?? 75}</p>
                <p className="text-[10px] text-slate-600 font-bold">/ 100</p>
              </div>
            </div>
            <p className={`text-sm font-black ${conf.color} text-center mb-1`}>{conf.label}</p>
            <p className="text-xs text-slate-600 text-center">Founder confidence in this week's execution plan</p>
          </div>

        </div>

      </div>
    </div>
  );
}