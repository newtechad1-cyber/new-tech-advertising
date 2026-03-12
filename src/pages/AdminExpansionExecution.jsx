import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  AlertTriangle, CheckCircle2, Clock, ZapOff, Zap,
  Flag, ChevronDown, Circle, ArrowRight
} from 'lucide-react';

const CATEGORY_COLORS = {
  research: { bg: '#6366f122', text: '#818cf8', label: 'Research' },
  sales: { bg: '#f59e0b22', text: '#fbbf24', label: 'Sales' },
  marketing: { bg: '#ec489922', text: '#f472b6', label: 'Marketing' },
  content: { bg: '#14b8a622', text: '#2dd4bf', label: 'Content' },
  campaign: { bg: '#8b5cf622', text: '#a78bfa', label: 'Campaign' },
  partnership: { bg: '#10b98122', text: '#34d399', label: 'Partnership' },
  operations: { bg: '#64748b22', text: '#94a3b8', label: 'Operations' },
};

const PRIORITY_CONFIG = {
  high: { color: 'text-rose-400', bg: 'bg-rose-900/40', label: 'High' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-900/30', label: 'Med' },
  low: { color: 'text-slate-400', bg: 'bg-slate-800', label: 'Low' },
};

const COLUMNS = [
  { id: 'pending', label: 'Pending', icon: Circle, color: 'text-slate-400', border: 'border-slate-700' },
  { id: 'in_progress', label: 'In Progress', icon: Zap, color: 'text-blue-400', border: 'border-blue-800' },
  { id: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-400', border: 'border-emerald-800' },
  { id: 'blocked', label: 'Blocked', icon: ZapOff, color: 'text-rose-400', border: 'border-rose-800' },
];

function StepCard({ step, index }) {
  const cat = CATEGORY_COLORS[step.step_category] || CATEGORY_COLORS.operations;
  const pri = PRIORITY_CONFIG[step.priority_level] || PRIORITY_CONFIG.medium;
  return (
    <Draggable draggableId={step.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-[#0f1729] border border-slate-800 rounded-xl p-4 mb-2.5 cursor-grab active:cursor-grabbing transition-all
            ${snapshot.isDragging ? 'shadow-2xl border-slate-600 scale-[1.02] rotate-1' : 'hover:border-slate-600 hover:shadow-lg'}`}
        >
          <p className="text-sm font-semibold text-white leading-snug mb-3">{step.step_name}</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: cat.bg, color: cat.text }}>{cat.label}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pri.bg} ${pri.color}`}>{pri.label} Priority</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>{step.assigned_role || 'Unassigned'}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{step.estimated_duration_days || 1}d</span>
          </div>
          {step.notes && <p className="text-[10px] text-slate-600 mt-2 truncate">{step.notes}</p>}
        </div>
      )}
    </Draggable>
  );
}

export default function AdminExpansionExecution() {
  const [playbooks, setPlaybooks] = useState([]);
  const [steps, setSteps] = useState([]);
  const [selectedPlaybookId, setSelectedPlaybookId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.ExpansionPlaybook.list('-created_date', 50),
      base44.entities.ExpansionExecutionStep.list('-created_date', 200),
    ]).then(([pb, st]) => {
      setPlaybooks(pb);
      setSteps(st);
      if (pb.length) setSelectedPlaybookId(pb[0].id);
      setLoading(false);
    });
  }, []);

  const filtered = steps.filter(s => !selectedPlaybookId || s.playbook_id === selectedPlaybookId);
  const selectedPlaybook = playbooks.find(p => p.id === selectedPlaybookId);

  // KPIs
  const allActive = steps.filter(s => s.completion_status === 'in_progress');
  const completedCount = filtered.filter(s => s.completion_status === 'completed').length;
  const highPending = filtered.filter(s => s.priority_level === 'high' && s.completion_status === 'pending').length;
  const blocked = filtered.filter(s => s.completion_status === 'blocked');
  const velocity = filtered.length ? Math.round((completedCount / filtered.length) * 100) : 0;

  // Category progress
  const categories = Object.keys(CATEGORY_COLORS);
  const catProgress = categories.map(cat => {
    const catSteps = filtered.filter(s => s.step_category === cat);
    const done = catSteps.filter(s => s.completion_status === 'completed').length;
    return { cat, total: catSteps.length, done, pct: catSteps.length ? Math.round((done / catSteps.length) * 100) : 0 };
  }).filter(c => c.total > 0);

  // Bottleneck alerts
  const alerts = [];
  filtered.forEach(s => {
    if (s.priority_level === 'high' && s.completion_status === 'pending')
      alerts.push({ step: s, msg: `High priority "${s.step_name}" has not started — immediate action needed.` });
    if (s.completion_status === 'blocked')
      alerts.push({ step: s, msg: `"${s.step_name}" is blocked — unblock to maintain expansion velocity.` });
  });

  // Drag and drop
  async function onDragEnd(result) {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;
    setSteps(prev => prev.map(s => s.id === draggableId ? { ...s, completion_status: newStatus } : s));
    await base44.entities.ExpansionExecutionStep.update(draggableId, { completion_status: newStatus });
  }

  const KPI = ({ label, value, sub, icon: Icon, color }) => (
    <div className="bg-[#0f1729] border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{label}</span>
      </div>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-[#080f1e] flex items-center justify-center">
      <div className="text-slate-400 text-sm animate-pulse">Loading execution data…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080f1e] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-6 rounded-full bg-emerald-500" />
              <h1 className="text-2xl font-black text-white">Expansion Execution</h1>
            </div>
            <p className="text-slate-400 text-sm ml-5">Step-by-step execution tracking for active expansion initiatives</p>
          </div>
          <div className="relative">
            <select
              value={selectedPlaybookId}
              onChange={e => setSelectedPlaybookId(e.target.value)}
              className="appearance-none bg-[#0f1729] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {playbooks.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* SECTION 1 — KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPI label="Active Steps" value={allActive.length} sub="across all playbooks" icon={Zap} color="text-blue-400" />
          <KPI label="Completed" value={completedCount} sub="in this playbook" icon={CheckCircle2} color="text-emerald-400" />
          <KPI label="High Priority Pending" value={highPending} icon={Flag} color={highPending > 0 ? 'text-rose-400' : 'text-slate-400'} />
          <KPI label="Execution Velocity" value={`${velocity}%`} sub="of steps completed" icon={ArrowRight} color="text-violet-400" />
          <KPI label="Blocked Alerts" value={blocked.length} sub={blocked.length > 0 ? 'need attention' : 'all clear'} icon={AlertTriangle} color={blocked.length > 0 ? 'text-amber-400' : 'text-slate-400'} />
        </div>

        {/* SECTION 2+3 — Kanban Board */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-300">Execution Workflow Board</h2>
            {selectedPlaybook && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="px-2 py-1 bg-slate-800 rounded-lg font-medium text-slate-400">{selectedPlaybook.target_vertical}</span>
                <span>·</span>
                <span>{selectedPlaybook.timeline_weeks}w timeline</span>
              </div>
            )}
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {COLUMNS.map(col => {
                const colSteps = filtered.filter(s => s.completion_status === col.id);
                const ColIcon = col.icon;
                return (
                  <div key={col.id} className={`bg-[#0a1120] border ${col.border} rounded-2xl flex flex-col min-h-[320px]`}>
                    <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ColIcon className={`w-4 h-4 ${col.color}`} />
                        <span className="text-xs font-bold text-slate-300">{col.label}</span>
                      </div>
                      <span className="text-xs font-black text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{colSteps.length}</span>
                    </div>
                    <Droppable droppableId={col.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex-1 p-3 transition-colors ${snapshot.isDraggingOver ? 'bg-slate-800/30' : ''}`}
                        >
                          {colSteps.map((step, i) => <StepCard key={step.id} step={step} index={i} />)}
                          {provided.placeholder}
                          {colSteps.length === 0 && !snapshot.isDraggingOver && (
                            <div className="flex items-center justify-center h-24 border border-dashed border-slate-800 rounded-xl">
                              <p className="text-xs text-slate-700">Drop steps here</p>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        </div>

        {/* SECTION 4 — Category Progress */}
        {catProgress.length > 0 && (
          <div className="bg-[#0f1729] border border-slate-800 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-300 mb-5">Category Execution Progress</h2>
            <div className="space-y-4">
              {catProgress.map(({ cat, total, done, pct }) => {
                const cfg = CATEGORY_COLORS[cat];
                return (
                  <div key={cat} className="flex items-center gap-4">
                    <div className="w-24 flex-shrink-0">
                      <span className="text-xs font-semibold" style={{ color: cfg.text }}>{cfg.label}</span>
                    </div>
                    <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: cfg.text }} />
                    </div>
                    <div className="w-20 flex-shrink-0 flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold" style={{ color: cfg.text }}>{pct}%</span>
                      <span>{done}/{total}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 5 — Bottleneck Alerts */}
        {alerts.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-slate-300 mb-4">Execution Bottleneck Alerts</h2>
            <div className="space-y-3">
              {alerts.map((a, i) => {
                const isBlocked = a.step.completion_status === 'blocked';
                return (
                  <div key={i} className={`border rounded-2xl p-4 flex items-start gap-4 ${isBlocked ? 'border-rose-800 bg-rose-950/20' : 'border-amber-800 bg-amber-950/10'}`}>
                    <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isBlocked ? 'text-rose-400' : 'text-amber-400'}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-white">{a.step.step_name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${isBlocked ? 'bg-rose-900 text-rose-300' : 'bg-amber-900 text-amber-300'}`}>
                          {isBlocked ? 'Blocked' : 'High Priority'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{a.msg}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded-lg flex-shrink-0">{CATEGORY_COLORS[a.step.step_category]?.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 6 — Execution Timeline Strip */}
        <div className="bg-[#0f1729] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-300 mb-5">Execution Timeline</h2>
          {filtered.length === 0 ? (
            <p className="text-slate-600 text-sm text-center py-6">No steps for this playbook.</p>
          ) : (
            <div className="space-y-3">
              {[...filtered]
                .sort((a, b) => {
                  const order = { completed: 0, in_progress: 1, pending: 2, blocked: 3 };
                  return (order[a.completion_status] ?? 9) - (order[b.completion_status] ?? 9);
                })
                .map((step, i) => {
                  const cfg = CATEGORY_COLORS[step.step_category];
                  const statusColors = { completed: '#10b981', in_progress: '#3b82f6', pending: '#475569', blocked: '#f43f5e' };
                  const statusColor = statusColors[step.completion_status] || '#475569';
                  const pct = step.completion_status === 'completed' ? 100 : step.completion_status === 'in_progress' ? 55 : step.completion_status === 'blocked' ? 20 : 0;
                  return (
                    <div key={step.id} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: statusColor + '33', border: `1.5px solid ${statusColor}` }}>
                        <div className="w-2 h-2 rounded-full" style={{ background: statusColor }} />
                      </div>
                      <div className="w-40 flex-shrink-0">
                        <p className="text-xs text-white font-medium truncate">{step.step_name}</p>
                        <p className="text-[10px]" style={{ color: cfg?.text }}>{cfg?.label}</p>
                      </div>
                      <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: statusColor + 'bb' }} />
                      </div>
                      <span className="text-[10px] text-slate-500 w-10 text-right">{step.estimated_duration_days}d</span>
                    </div>
                  );
                })}
            </div>
          )}
          {/* Legend */}
          <div className="flex items-center gap-4 mt-5 pt-4 border-t border-slate-800">
            {[{ label: 'Completed', color: '#10b981' }, { label: 'In Progress', color: '#3b82f6' }, { label: 'Pending', color: '#475569' }, { label: 'Blocked', color: '#f43f5e' }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                <span className="text-[10px] text-slate-500">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}