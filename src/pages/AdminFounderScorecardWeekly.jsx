import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import {
  TrendingUp, DollarSign, AlertTriangle, CheckCircle2,
  Zap, Edit3, Save, X
} from 'lucide-react';

const AREA_CONFIG = {
  sales:        { label: 'Sales',        icon: '💰', color: '#10b981' },
  expansion:    { label: 'Expansion',    icon: '🚀', color: '#8b5cf6' },
  marketing:    { label: 'Marketing',    icon: '📣', color: '#f59e0b' },
  operations:   { label: 'Operations',   icon: '⚙️', color: '#3b82f6' },
  partnerships: { label: 'Partnerships', icon: '🤝', color: '#ec4899' },
  product:      { label: 'Product',      icon: '🧩', color: '#14b8a6' },
};

function fmt(n) {
  if (!n) return '$0';
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;
}

function completionColor(pct) {
  if (pct >= 70) return { text: 'text-emerald-400', bar: '#10b981', border: 'border-emerald-800' };
  if (pct >= 40) return { text: 'text-amber-400',   bar: '#f59e0b', border: 'border-amber-800'   };
  return          { text: 'text-rose-400',    bar: '#f43f5e', border: 'border-rose-800'    };
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

function ProgressBar({ pct, barColor }) {
  return (
    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700"
        style={{ width: `${Math.min(pct, 100)}%`, background: barColor }} />
    </div>
  );
}

function AreaCard({ metric, onSave }) {
  const area = AREA_CONFIG[metric.execution_area] || AREA_CONFIG.sales;
  const pct  = metric.completion_percentage || 0;
  const conf = metric.execution_confidence || 0;
  const cc   = completionColor(pct);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState({ ...metric });
  const [saving, setSaving]   = useState(false);

  async function save() {
    setSaving(true);
    const updated = await base44.entities.FounderExecutionMetric.update(metric.id, {
      completion_percentage: Number(draft.completion_percentage),
      execution_confidence:  Number(draft.execution_confidence),
      revenue_impact_estimate: Number(draft.revenue_impact_estimate),
      notes: draft.notes,
    });
    onSave(updated);
    setEditing(false);
    setSaving(false);
  }

  return (
    <div className={`bg-[#0d1526] border rounded-2xl p-5 ${cc.border}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{area.icon}</span>
          <div>
            <p className="text-xs font-black text-white uppercase tracking-wide">{area.label}</p>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug max-w-[160px] truncate">{metric.planned_focus}</p>
          </div>
        </div>
        {!editing ? (
          <button onClick={() => { setDraft({ ...metric }); setEditing(true); }}
            className="p-1.5 text-slate-600 hover:text-slate-300 transition-colors">
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="flex gap-1.5">
            <button onClick={() => setEditing(false)} className="p-1 text-slate-500 hover:text-slate-300"><X className="w-3.5 h-3.5" /></button>
            <button onClick={save} disabled={saving} className="p-1 text-violet-400 hover:text-violet-300 disabled:opacity-50"><Save className="w-3.5 h-3.5" /></button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Completion % ({draft.completion_percentage})</label>
            <input type="range" min={0} max={100} value={draft.completion_percentage || 0}
              onChange={e => setDraft(d => ({ ...d, completion_percentage: e.target.value }))}
              className="w-full accent-violet-500" />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Confidence % ({draft.execution_confidence})</label>
            <input type="range" min={0} max={100} value={draft.execution_confidence || 0}
              onChange={e => setDraft(d => ({ ...d, execution_confidence: e.target.value }))}
              className="w-full accent-amber-500" />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Revenue Impact ($)</label>
            <input type="number" value={draft.revenue_impact_estimate || ''}
              onChange={e => setDraft(d => ({ ...d, revenue_impact_estimate: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500" />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Note</label>
            <textarea value={draft.notes || ''} onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))}
              rows={2} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none resize-none" />
          </div>
        </div>
      ) : (
        <>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-semibold">Completion</span>
            <span className={`text-sm font-black ${cc.text}`}>{pct}%</span>
          </div>
          <ProgressBar pct={pct} barColor={cc.bar} />

          <div className="mt-3 mb-1 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-semibold">Confidence</span>
            <span className="text-sm font-bold text-amber-400">{conf}%</span>
          </div>
          <ProgressBar pct={conf} barColor="#f59e0b" />

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs font-black text-emerald-400">{fmt(metric.revenue_impact_estimate)}</span>
            <span className="text-[10px] text-slate-600">est. impact</span>
          </div>

          {metric.notes && (
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed border-t border-slate-800/60 pt-2">{metric.notes}</p>
          )}
        </>
      )}
    </div>
  );
}

export default function AdminFounderScorecardWeekly() {
  const [metrics, setMetrics]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [newNote, setNewNote]     = useState('');
  const [newNoteArea, setNewNoteArea] = useState('sales');
  const [notes, setNotes]         = useState([]);

  function getMonday(d = new Date()) {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(new Date(d).setDate(diff)).toISOString().split('T')[0];
  }
  const weekStart = getMonday();

  useEffect(() => {
    Promise.all([
      base44.entities.FounderExecutionMetric.filter({ week_start_date: weekStart }),
      base44.entities.FounderPlanNote.list('-created_date', 20),
    ]).then(([m, n]) => {
      setMetrics(m);
      setNotes(n.filter(note => note.vertical_reference === '' || note.vertical_reference));
      setLoading(false);
    });
  }, []);

  function handleSave(updated) {
    setMetrics(prev => prev.map(m => m.id === updated.id ? updated : m));
  }

  async function addNote() {
    if (!newNote.trim()) return;
    const created = await base44.entities.FounderPlanNote.create({
      note_date: new Date().toISOString().split('T')[0],
      content: newNote.trim(),
      vertical_reference: newNoteArea,
    });
    setNotes(prev => [created, ...prev]);
    setNewNote('');
  }

  // KPIs
  const avgCompletion = metrics.length
    ? Math.round(metrics.reduce((s, m) => s + (m.completion_percentage || 0), 0) / metrics.length)
    : 0;
  const totalRevImpact = metrics.reduce((s, m) => s + (m.revenue_impact_estimate || 0), 0);
  const highest = [...metrics].sort((a, b) => (b.completion_percentage || 0) - (a.completion_percentage || 0))[0];
  const lowest  = [...metrics].sort((a, b) => (a.completion_percentage || 0) - (b.completion_percentage || 0))[0];
  const avgConf = metrics.length
    ? Math.round(metrics.reduce((s, m) => s + (m.execution_confidence || 0), 0) / metrics.length)
    : 0;

  // Momentum score: weighted composite
  const momentumScore = Math.round((avgCompletion * 0.5) + (avgConf * 0.3) + (Math.min(totalRevImpact / 500, 20)));

  // Chart data
  const chartData = metrics.map(m => ({
    area: AREA_CONFIG[m.execution_area]?.label || m.execution_area,
    Planned: 100,
    Actual: m.completion_percentage || 0,
    color: AREA_CONFIG[m.execution_area]?.color || '#64748b',
  }));

  // Risk alerts
  const riskAlerts = metrics
    .filter(m => (m.revenue_impact_estimate || 0) >= 3000 && (m.completion_percentage || 0) < 50)
    .map(m => ({
      area: AREA_CONFIG[m.execution_area]?.label || m.execution_area,
      completion: m.completion_percentage || 0,
      impact: m.revenue_impact_estimate || 0,
      action: `Prioritize ${AREA_CONFIG[m.execution_area]?.label} execution immediately — high revenue impact area is under 50% complete.`,
    }));

  const momentumColor = momentumScore >= 70 ? '#10b981' : momentumScore >= 45 ? '#f59e0b' : '#f43f5e';
  const momentumLabel = momentumScore >= 70 ? 'Strong Momentum' : momentumScore >= 45 ? 'Building Momentum' : 'Execution Lagging';

  if (loading) return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
      <div className="text-slate-500 text-sm animate-pulse">Loading execution scorecard…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-7 rounded-full bg-teal-500" />
            <h1 className="text-3xl font-black text-white tracking-tight">Weekly Execution Scorecard</h1>
          </div>
          <p className="text-slate-500 text-sm ml-5">
            Week of {new Date(weekStart + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · did we execute what we planned?
          </p>
        </div>

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPICard label="Overall Completion" value={`${avgCompletion}%`} sub="avg across areas" icon={CheckCircle2} color={completionColor(avgCompletion).text} />
          <KPICard label="Revenue Impact"      value={fmt(totalRevImpact)} sub="estimated"     icon={DollarSign}   color="text-emerald-400" />
          <KPICard label="Highest Area"        value={highest ? AREA_CONFIG[highest.execution_area]?.label : '—'} sub={highest ? `${highest.completion_percentage}%` : ''} icon={TrendingUp} color="text-teal-400" />
          <KPICard label="Lowest Area"         value={lowest  ? AREA_CONFIG[lowest.execution_area]?.label  : '—'} sub={lowest  ? `${lowest.completion_percentage}%`  : ''} icon={AlertTriangle} color="text-rose-400" />
          <KPICard label="Exec Confidence"     value={`${avgConf}%`} sub="avg confidence"  icon={Zap}          color="text-amber-400" />
        </div>

        {/* SECTION 2 — Execution Area Progress Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-teal-500 inline-block" />
            Execution Area Progress
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map(m => (
              <AreaCard key={m.id} metric={m} onSave={handleSave} />
            ))}
            {metrics.length === 0 && (
              <div className="col-span-3 text-center py-12 text-slate-600 text-sm">No execution metrics found for this week.</div>
            )}
          </div>
        </div>

        {/* SECTION 3 — Execution vs Plan Chart */}
        <div className="bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-300 mb-1">Execution vs Plan Comparison</h2>
          <p className="text-[11px] text-slate-600 mb-5">Planned weight (100%) vs actual completion — gap = discipline opportunity</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} layout="vertical" barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="area" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={88} />
              <Tooltip
                cursor={{ fill: '#1e293b' }}
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
                formatter={(val, name) => [`${val}%`, name]}
              />
              <Bar dataKey="Planned" fill="#1e293b" radius={[0, 4, 4, 0]} />
              <Bar dataKey="Actual" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={completionColor(entry.Actual).bar} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SECTION 4 — Risk Alerts */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-rose-500 inline-block" />
            Execution Risk Alerts
          </h2>
          {riskAlerts.length === 0 ? (
            <div className="bg-[#0d1526] border border-emerald-800/40 rounded-2xl p-5 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <p className="text-sm text-emerald-400 font-semibold">No critical execution gaps detected — all high-impact areas are on track.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {riskAlerts.map((alert, i) => (
                <div key={i} className="bg-[#0d1526] border border-rose-800/60 rounded-2xl p-5 flex items-start gap-4">
                  <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-white mb-1">{alert.area} · only {alert.completion}% complete</p>
                    <p className="text-xs text-slate-400 mb-2">{fmt(alert.impact)} revenue impact at risk</p>
                    <p className="text-xs text-rose-300 italic">→ {alert.action}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 5 & 6 side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Notes Feed — 2/3 */}
          <div className="lg:col-span-2 bg-[#0d1526] border border-slate-800/60 rounded-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800/60">
              <h2 className="text-sm font-bold text-slate-200">Execution Notes</h2>
            </div>
            <div className="flex-1 divide-y divide-slate-800/40 max-h-64 overflow-y-auto">
              {notes.slice(0, 8).map((n, i) => {
                const areaCfg = AREA_CONFIG[n.vertical_reference];
                return (
                  <div key={n.id || i} className="px-5 py-3.5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-slate-500">
                        {n.note_date ? new Date(n.note_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                      </span>
                      {areaCfg && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ color: areaCfg.color, background: areaCfg.color + '22' }}>
                          {areaCfg.icon} {areaCfg.label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{n.content}</p>
                  </div>
                );
              })}
              {notes.length === 0 && <p className="text-center text-slate-600 text-sm py-8">No notes yet.</p>}
            </div>
            <div className="px-5 py-3.5 border-t border-slate-800/60 space-y-2">
              <textarea value={newNote} onChange={e => setNewNote(e.target.value)}
                placeholder="Add execution reflection or decision note…"
                rows={2}
                className="w-full bg-slate-800/40 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/40 resize-none" />
              <div className="flex items-center gap-2">
                <select value={newNoteArea} onChange={e => setNewNoteArea(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none">
                  {Object.entries(AREA_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <button onClick={addNote}
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 rounded-xl text-xs font-bold text-white transition-colors">
                  Add Note
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 6 — Momentum Gauge — 1/3 */}
          <div className="bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6 flex flex-col items-center justify-center">
            <h2 className="text-sm font-bold text-slate-200 mb-6 self-start">Execution Momentum</h2>
            <div className="relative flex items-center justify-center mb-4" style={{ width: 150, height: 150 }}>
              <svg viewBox="0 0 120 120" width="150" height="150">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none"
                  stroke={momentumColor} strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 50 * (Math.min(momentumScore, 100) / 100)} ${2 * Math.PI * 50}`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dasharray 0.8s ease' }}
                />
              </svg>
              <div className="absolute text-center">
                <p className="text-3xl font-black" style={{ color: momentumColor }}>{momentumScore}</p>
                <p className="text-[10px] text-slate-600 font-bold">/ 100</p>
              </div>
            </div>
            <p className="text-sm font-black text-center mb-2" style={{ color: momentumColor }}>{momentumLabel}</p>
            <div className="space-y-1 w-full text-[10px] text-slate-600 mt-2">
              <div className="flex justify-between"><span>Completion avg</span><span className="text-white font-bold">{avgCompletion}%</span></div>
              <div className="flex justify-between"><span>Confidence avg</span><span className="text-white font-bold">{avgConf}%</span></div>
              <div className="flex justify-between"><span>Revenue impact</span><span className="text-white font-bold">{fmt(totalRevImpact)}</span></div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}