import React, { useState } from 'react';
import { Zap, AlertTriangle, CheckCircle2, X, ChevronRight, Play, Pause, RefreshCw, Download, ArrowUp, ArrowDown, Minus, BarChart2, Cpu, Shield, Sparkles } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const TP = { background: '#0a0f1a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 11, color: '#64748b' };

// ── Demo Data ─────────────────────────────────────────────────────────────────
const AGENTS = [
  { id: 'a1', name: 'ContentCraft-1', role: 'Content Writer', status: 'active', tasks_today: 34, queue: 12, success_rate: 97, avg_min: 4.2, quality: 91, desc: 'Generates long-form blog posts, social captions, and campaign copy across all client verticals. Trained on brand voice templates and seasonal content frameworks.' },
  { id: 'a2', name: 'VideoForge-1', role: 'Video Renderer', status: 'high_load', tasks_today: 18, queue: 22, success_rate: 89, avg_min: 14.7, quality: 85, desc: 'Compiles, renders, and exports branded video campaigns using HeyGen and Vibe templates. Primary bottleneck during campaign surges.' },
  { id: 'a3', name: 'PublishBot-1', role: 'Publishing Agent', status: 'active', tasks_today: 28, queue: 6, success_rate: 99, avg_min: 1.8, quality: 94, desc: 'Schedules and publishes approved content to Instagram, Facebook, Google Business, and YouTube. Monitors post-publish status.' },
  { id: 'a4', name: 'SEOScout-1', role: 'SEO Optimizer', status: 'active', tasks_today: 11, queue: 4, success_rate: 95, avg_min: 8.1, quality: 88, desc: 'Analyzes keyword opportunities, optimizes content metadata, and tracks ranking changes for all client websites.' },
  { id: 'a5', name: 'ReportGen-1', role: 'Reporting Agent', status: 'active', tasks_today: 9, queue: 2, success_rate: 98, avg_min: 3.4, quality: 96, desc: 'Compiles weekly and monthly performance reports from GA4, Meta, and platform data. Generates PDF and in-app report summaries.' },
  { id: 'a6', name: 'LifeCycle-1', role: 'Lifecycle Agent', status: 'active', tasks_today: 16, queue: 8, success_rate: 94, avg_min: 2.1, quality: 90, desc: 'Monitors client health scores, triggers onboarding nudges, escalates churn risk signals, and schedules check-in tasks for the team.' },
  { id: 'a7', name: 'ReferralEngine-1', role: 'Referral Agent', status: 'idle', tasks_today: 3, queue: 1, success_rate: 92, avg_min: 5.5, quality: 87, desc: 'Identifies referral opportunities, sends personalized invitation sequences, and tracks conversion pipeline progress.' },
  { id: 'a8', name: 'VideoForge-2', role: 'Video Renderer', status: 'error', tasks_today: 6, queue: 9, success_rate: 71, avg_min: 0, quality: 60, desc: 'Secondary video rendering agent. Currently experiencing HeyGen API timeout errors causing task failures.' },
];

const QUEUE_ITEMS = [
  { id: 't1', client: 'Arctic Air HVAC', type: 'Spring Campaign Video', context: 'Spring Tune-Up Push', stage: 'processing', priority: 'critical', eta: '8 min', agent: 'VideoForge-1' },
  { id: 't2', client: 'Midwest Plumbing', type: 'SEO Blog Post', context: 'Authority Series', stage: 'queued', priority: 'high', eta: '12 min', agent: 'ContentCraft-1' },
  { id: 't3', client: 'Summit Dental', type: 'Monthly Report', context: 'March Performance', stage: 'processing', priority: 'normal', eta: '3 min', agent: 'ReportGen-1' },
  { id: 't4', client: 'Clean Slate', type: 'Social Post Batch', context: 'Spring Promotion', stage: 'awaiting_dependency', priority: 'high', eta: 'Blocked', agent: 'PublishBot-1' },
  { id: 't5', client: 'FastTrack Auto', type: 'Video Render', context: 'Brand Intro', stage: 'failed', priority: 'high', eta: 'Error', agent: 'VideoForge-2' },
  { id: 't6', client: 'Green Valley', type: 'Caption Generation', context: 'April Calendar', stage: 'queued', priority: 'normal', eta: '5 min', agent: 'ContentCraft-1' },
  { id: 't7', client: 'ClearPath Legal', type: 'Lifecycle Nudge', context: 'Re-engagement', stage: 'queued', priority: 'critical', eta: '2 min', agent: 'LifeCycle-1' },
];

const CAT_METRICS = [
  { cat: 'Content Gen', emoji: '✍️', volume: 142, success: 97, delay: 3, capacity: 72 },
  { cat: 'Video Prod', emoji: '🎬', volume: 24, success: 82, delay: 28, capacity: 94 },
  { cat: 'Publishing', emoji: '📡', volume: 88, success: 99, delay: 1, capacity: 45 },
  { cat: 'Reporting', emoji: '📊', volume: 31, success: 98, delay: 2, capacity: 38 },
  { cat: 'Lifecycle', emoji: '🔄', volume: 56, success: 94, delay: 6, capacity: 61 },
  { cat: 'Referral', emoji: '🤝', volume: 11, success: 92, delay: 4, capacity: 22 },
];

const PEAK_DATA = [
  { hour: '6am', load: 18 }, { hour: '8am', load: 42 }, { hour: '10am', load: 78 },
  { hour: '12pm', load: 91 }, { hour: '2pm', load: 88 }, { hour: '4pm', load: 65 },
  { hour: '6pm', load: 44 }, { hour: '8pm', load: 22 },
];

const CAPACITY_ALERTS = [
  { sev: 'critical', emoji: '🔴', msg: 'VideoForge-2 experiencing API timeouts — 9 tasks stalled', action: 'Reroute Tasks' },
  { sev: 'warning', emoji: '🟡', msg: 'VideoForge-1 queue at 22 items — approaching capacity ceiling', action: 'Expand Capacity' },
  { sev: 'info', emoji: '🟢', msg: 'ReferralEngine-1 underutilized at 22% capacity — growth opportunity', action: 'Increase Load' },
];

const QUALITY_INSIGHTS = [
  { emoji: '📱', headline: 'Short-form video content achieving 2× higher approval rate', detail: '30-second branded clips approved in first pass 84% of the time vs. 51% for long-form blog posts.' },
  { emoji: '🌸', headline: 'Seasonal campaign scripts passing approval 40% faster', detail: 'Spring/summer scripts aligned with pre-approved brand templates require fewer revisions than custom copy.' },
  { emoji: '📉', headline: 'FastTrack Auto revision rate elevated at 38%', detail: 'Multiple revision cycles detected. Brand voice template may need recalibration for this client.' },
];

const RULES = [
  { name: 'Auto-Approve Low-Risk Posts', category: 'publishing', fires: 44, success: 99, loop: false, active: true },
  { name: 'Lifecycle Churn Alert Trigger', category: 'lifecycle', fires: 8, success: 96, loop: false, active: true },
  { name: 'Video Render Queue Assignment', category: 'video_production', fires: 18, success: 89, loop: false, active: true },
  { name: 'Referral Reminder Sequence', category: 'referral', fires: 3, success: 92, loop: false, active: true },
  { name: 'Duplicate Post Blocker', category: 'publishing', fires: 2, success: 100, loop: false, active: true },
  { name: 'Report Compile — Monthly Trigger', category: 'reporting', fires: 1, success: 98, loop: false, active: true },
];

const DEPLOY_SUGGESTIONS = [
  { role: 'Video QA Agent', headline: 'Add video quality reviewer to reduce render rejection rate', rationale: 'VideoForge errors cost ~2h rework per incident. An automated QA check before delivery would intercept ~85% of failures.', tasks_saved: 24, saving: '$340/wk in human review time' },
  { role: 'Content Personalizer', headline: 'Vertical-specific content tone optimizer', rationale: 'Content revision rates differ 4× between verticals. A tone-matching layer would reduce revision cycles and improve first-pass approvals.', tasks_saved: 18, saving: '$220/wk in revision cycles' },
  { role: 'Demand Signal Agent', headline: 'Real-time seasonal demand trigger for campaign activation', rationale: 'Manual campaign scheduling creates 3–5 day lag behind search demand spikes. Automated demand detection would accelerate campaign ROI.', tasks_saved: 12, saving: 'Estimated +$1,200 MRR per activated campaign' },
];

const INSIGHTS = [
  { type: 'capacity', sev: 'warning', emoji: '⚡', headline: 'Content agent cluster operating at 92% capacity', detail: 'ContentCraft-1 queue growing faster than clearance rate. Consider deploying ContentCraft-2 or redistributing non-urgent tasks.' },
  { type: 'opportunity', sev: 'positive', emoji: '📈', headline: 'Referral automation significantly underutilized vs. growth potential', detail: 'ReferralEngine-1 running at 22% capacity while referral MRR contribution is growing. Increasing task allocation could accelerate viral loop growth.' },
  { type: 'quality', sev: 'positive', emoji: '🛡️', headline: 'Lifecycle automation reducing churn risk signals by 34%', detail: 'LifeCycle-1 interventions correlating with improved client health scores in at-risk segment. Automation is working.' },
  { type: 'bottleneck', sev: 'critical', emoji: '🔴', headline: 'Video rendering bottleneck blocking 4 campaign launch timelines', detail: 'VideoForge-2 failures + VideoForge-1 overload causing downstream publishing delays for Arctic Air, FastTrack, and 2 others.' },
];

// ── Status Config ─────────────────────────────────────────────────────────────
const STATUS = {
  active:     { dot: 'bg-emerald-400', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Active' },
  high_load:  { dot: 'bg-amber-400 animate-pulse', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: 'High Load' },
  error:      { dot: 'bg-red-400 animate-pulse', badge: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Error' },
  paused:     { dot: 'bg-slate-500', badge: 'bg-slate-700/50 text-slate-500 border-slate-600', label: 'Paused' },
  idle:       { dot: 'bg-slate-600', badge: 'bg-slate-800 text-slate-500 border-slate-700', label: 'Idle' },
};

const STAGE = {
  queued:               { label: 'Queued', col: 'bg-slate-800 border-slate-700', badge: 'bg-slate-700 text-slate-400' },
  processing:           { label: 'Processing', col: 'bg-blue-500/10 border-blue-500/30', badge: 'bg-blue-500/20 text-blue-400' },
  awaiting_dependency:  { label: 'Awaiting Dep.', col: 'bg-amber-500/10 border-amber-500/30', badge: 'bg-amber-500/20 text-amber-400' },
  completed:            { label: 'Completed', col: 'bg-emerald-500/10 border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-400' },
  failed:               { label: 'Failed', col: 'bg-red-500/10 border-red-500/30', badge: 'bg-red-500/20 text-red-400' },
};

const PRIO = { critical: 'text-red-400', high: 'text-amber-400', normal: 'text-slate-400', low: 'text-slate-600' };

const SH = ({ children, sub, action }) => (
  <div className="flex items-end justify-between mb-4">
    <div>
      <h2 className="text-base font-black text-slate-200 uppercase tracking-wider">{children}</h2>
      {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
    </div>
    {action && <button className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">{action} <ChevronRight className="w-3 h-3" /></button>}
  </div>
);

// ── Agent Detail Modal ────────────────────────────────────────────────────────
const AgentModal = ({ agent, onClose }) => {
  const s = STATUS[agent.status];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0d1424] border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-200">{agent.name}</p>
              <p className="text-[10px] text-slate-500">{agent.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full border ${s.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{s.label}
            </span>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center"><X className="w-3.5 h-3.5 text-slate-500" /></button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">{agent.desc}</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { l: 'Tasks Today', v: agent.tasks_today, c: 'text-slate-200' },
              { l: 'Queue Load', v: agent.queue, c: agent.queue > 15 ? 'text-amber-400' : 'text-slate-200' },
              { l: 'Success Rate', v: `${agent.success_rate}%`, c: agent.success_rate > 90 ? 'text-emerald-400' : agent.success_rate > 80 ? 'text-amber-400' : 'text-red-400' },
              { l: 'Avg Speed', v: agent.avg_min > 0 ? `${agent.avg_min}m` : 'N/A', c: 'text-slate-200' },
              { l: 'Quality Score', v: `${agent.quality}/100`, c: agent.quality > 85 ? 'text-emerald-400' : 'text-amber-400' },
            ].map(m => (
              <div key={m.l} className="bg-slate-900 rounded-xl p-3">
                <p className="text-[9px] text-slate-600 font-bold uppercase mb-1">{m.l}</p>
                <p className={`text-xl font-black ${m.c}`}>{m.v}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap pt-1">
            {[
              { l: 'Increase Priority', c: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' },
              { l: 'Pause Agent', c: 'bg-amber-500/20 border-amber-500/30 text-amber-400' },
              { l: 'Reassign Tasks', c: 'bg-blue-500/20 border-blue-500/30 text-blue-400' },
              { l: 'Reduce Load', c: 'bg-slate-700 border-slate-600 text-slate-400' },
            ].map(a => (
              <button key={a.l} className={`px-3 py-1.5 border rounded-xl text-[10px] font-bold transition-all hover:scale-105 ${a.c}`}>{a.l}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AIWorkforce() {
  const [agents, setAgents] = useState(AGENTS);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [queue, setQueue] = useState(QUEUE_ITEMS);
  const [rules, setRules] = useState(RULES);
  const [suggestions, setSuggestions] = useState(DEPLOY_SUGGESTIONS);
  const [insights, setInsights] = useState(INSIGHTS);
  const [dismissed, setDismissed] = useState([]);
  const [activeTab, setActiveTab] = useState('queue');
  const [roleFilter, setRoleFilter] = useState('all');

  const totalTasks = agents.reduce((s, a) => s + a.tasks_today, 0);
  const totalQueue = agents.reduce((s, a) => s + a.queue, 0);
  const avgSuccess = Math.round(agents.reduce((s, a) => s + a.success_rate, 0) / agents.length);
  const activeCount = agents.filter(a => a.status === 'active').length;
  const efficiencyScore = Math.round((avgSuccess * 0.6) + (activeCount / agents.length * 40));

  const roles = ['all', ...Array.from(new Set(agents.map(a => a.role)))];
  const filteredAgents = roleFilter === 'all' ? agents : agents.filter(a => a.role === roleFilter);
  const TABS = ['queue', 'categories', 'quality', 'rules'];

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-300">
      {/* Sticky KPI Header */}
      <div className="sticky top-0 z-40 bg-[#060b14]/98 backdrop-blur border-b border-slate-800/80">
        <div className="flex items-stretch overflow-x-auto max-w-[1600px] mx-auto">
          <div className="flex items-center gap-2.5 px-5 py-3 border-r border-slate-800 shrink-0">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div>
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">AI</p>
              <p className="text-xs font-black text-slate-200">Workforce</p>
            </div>
          </div>
          {[
            { l: 'Active Agents', v: `${activeCount}/${agents.length}`, c: 'text-emerald-400' },
            { l: 'Tasks Today', v: totalTasks, c: 'text-slate-200' },
            { l: 'In Queue', v: totalQueue, c: totalQueue > 40 ? 'text-amber-400' : 'text-slate-200' },
            { l: 'Success Rate', v: `${avgSuccess}%`, c: avgSuccess > 90 ? 'text-emerald-400' : avgSuccess > 80 ? 'text-amber-400' : 'text-red-400' },
            { l: 'Avg Speed', v: '5.2 min', c: 'text-slate-300' },
            { l: 'Efficiency', v: `${efficiencyScore}%`, c: efficiencyScore > 80 ? 'text-emerald-400' : 'text-amber-400' },
          ].map(t => (
            <div key={t.l} className="flex flex-col px-4 py-2.5 border-r border-slate-800 min-w-[100px] cursor-pointer hover:bg-slate-900/50 transition-colors">
              <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">{t.l}</span>
              <span className={`text-lg font-black ${t.c} leading-tight mt-0.5`}>{t.v}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 px-4 ml-auto flex-shrink-0">
            {[
              { l: 'Deploy', icon: Zap, c: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400' },
              { l: 'Pause All', icon: Pause, c: 'bg-amber-500/20 border-amber-500/30 text-amber-400' },
              { l: 'Prioritize', icon: ArrowUp, c: 'bg-violet-500/20 border-violet-500/30 text-violet-400' },
              { l: 'Export', icon: Download, c: 'bg-slate-800 border-slate-700 text-slate-500' },
            ].map(a => (
              <button key={a.l} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-[10px] font-bold transition-all hover:scale-105 ${a.c}`}>
                <a.icon className="w-3 h-3" />{a.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-5 py-6 space-y-8">

        {/* Capacity Alerts Banner */}
        {CAPACITY_ALERTS.filter(a => a.sev === 'critical').map((a, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl">
            <span>{a.emoji}</span>
            <p className="text-xs text-red-300 font-semibold flex-1">{a.msg}</p>
            <button className="text-[10px] font-bold text-red-400 hover:text-red-300 flex items-center gap-1">{a.action} <ChevronRight className="w-3 h-3" /></button>
          </div>
        ))}

        {/* S1 — Agent Grid */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <SH sub="Real-time agent status across all functions">Agent Operations Grid</SH>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {roles.map(r => (
                <button key={r} onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors ${roleFilter === r ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400' : 'bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-300'}`}>
                  {r === 'all' ? 'All Agents' : r}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredAgents.map(agent => {
              const s = STATUS[agent.status];
              return (
                <div key={agent.id} onClick={() => setSelectedAgent(agent)}
                  className={`bg-[#0d1424] border rounded-2xl p-4 cursor-pointer hover:border-cyan-500/30 hover:bg-slate-900/80 transition-all group ${agent.status === 'error' ? 'border-red-500/30' : agent.status === 'high_load' ? 'border-amber-500/30' : 'border-slate-800'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${s.badge}`}>{s.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-cyan-500 transition-colors" />
                  </div>
                  <p className="text-sm font-black text-slate-200 mb-0.5">{agent.name}</p>
                  <p className="text-[10px] text-slate-600 mb-3">{agent.role}</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-base font-black text-slate-200">{agent.tasks_today}</p>
                      <p className="text-[8px] text-slate-700 font-bold uppercase">Done</p>
                    </div>
                    <div>
                      <p className={`text-base font-black ${agent.queue > 15 ? 'text-amber-400' : 'text-slate-400'}`}>{agent.queue}</p>
                      <p className="text-[8px] text-slate-700 font-bold uppercase">Queue</p>
                    </div>
                    <div>
                      <p className={`text-base font-black ${agent.success_rate > 90 ? 'text-emerald-400' : agent.success_rate > 80 ? 'text-amber-400' : 'text-red-400'}`}>{agent.success_rate}%</p>
                      <p className="text-[8px] text-slate-700 font-bold uppercase">Rate</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs for S2–S5 */}
        <div>
          <div className="flex gap-0 border-b border-slate-800 mb-5">
            {TABS.map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px ${activeTab === t ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-600 hover:text-slate-400'}`}>
                {t === 'queue' ? 'Task Queue' : t === 'categories' ? 'Category Performance' : t === 'quality' ? 'Quality Intelligence' : 'Automation Rules'}
              </button>
            ))}
          </div>

          {/* S2 — Task Queue */}
          {activeTab === 'queue' && (
            <div className="space-y-2">
              {queue.map(task => {
                const sg = STAGE[task.stage];
                return (
                  <div key={task.id} className={`flex items-center gap-4 p-3.5 bg-[#0d1424] border rounded-xl hover:border-slate-600 transition-all ${task.stage === 'failed' ? 'border-red-500/30' : 'border-slate-800'}`}>
                    <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${sg.badge}`}>{sg.label}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-300">{task.client} — {task.type}</p>
                      <p className="text-[10px] text-slate-600">{task.context} · {task.agent}</p>
                    </div>
                    <span className={`text-[10px] font-black ${PRIO[task.priority]}`}>{task.priority}</span>
                    <span className="text-[10px] text-slate-600 w-16 text-right">{task.eta}</span>
                    {task.stage === 'failed' && (
                      <button onClick={() => setQueue(prev => prev.map(t => t.id === task.id ? { ...t, stage: 'queued' } : t))}
                        className="px-2.5 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-[9px] font-bold hover:bg-red-500/30 transition-colors flex-shrink-0">
                        Retry
                      </button>
                    )}
                    {task.stage === 'queued' && (
                      <div className="flex gap-1 flex-shrink-0">
                        <button className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center hover:border-cyan-500/30"><ArrowUp className="w-3 h-3 text-slate-500" /></button>
                        <button className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center hover:border-slate-500"><ArrowDown className="w-3 h-3 text-slate-500" /></button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* S3 — Category Performance */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CAT_METRICS.map(c => (
                <div key={c.cat} className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{c.emoji}</span>
                    <p className="text-xs font-black text-slate-300">{c.cat}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      { l: 'Volume', v: c.volume, c: 'text-slate-200' },
                      { l: 'Success', v: `${c.success}%`, c: c.success > 90 ? 'text-emerald-400' : 'text-amber-400' },
                      { l: 'Delays', v: `${c.delay}%`, c: c.delay > 10 ? 'text-red-400' : c.delay > 5 ? 'text-amber-400' : 'text-slate-400' },
                      { l: 'Capacity', v: `${c.capacity}%`, c: c.capacity > 85 ? 'text-red-400' : c.capacity > 60 ? 'text-amber-400' : 'text-emerald-400' },
                    ].map(m => (
                      <div key={m.l}>
                        <p className="text-[8px] text-slate-700 font-bold uppercase">{m.l}</p>
                        <p className={`text-sm font-black ${m.c}`}>{m.v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full">
                    <div className={`h-full rounded-full transition-all ${c.capacity > 85 ? 'bg-red-500' : c.capacity > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${c.capacity}%` }} />
                  </div>
                  <p className="text-[8px] text-slate-700 mt-1">Capacity utilization</p>
                </div>
              ))}
            </div>
          )}

          {/* Quality */}
          {activeTab === 'quality' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {QUALITY_INSIGHTS.map((q, i) => (
                  <div key={i} className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4">
                    <span className="text-2xl block mb-2">{q.emoji}</span>
                    <p className="text-xs font-bold text-slate-300 mb-1">{q.headline}</p>
                    <p className="text-[10px] text-slate-600 leading-relaxed">{q.detail}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4">
                <p className="text-[10px] text-slate-600 font-bold uppercase mb-3">Agent Quality Scores</p>
                <div className="space-y-2">
                  {agents.filter(a => a.status !== 'error').map(a => (
                    <div key={a.id} className="flex items-center gap-3">
                      <p className="text-[10px] text-slate-500 w-28 shrink-0">{a.name}</p>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full">
                        <div className="h-full rounded-full" style={{ width: `${a.quality}%`, background: a.quality > 85 ? '#10b981' : '#f59e0b' }} />
                      </div>
                      <p className={`text-[10px] font-black w-8 text-right ${a.quality > 85 ? 'text-emerald-400' : 'text-amber-400'}`}>{a.quality}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Rules */}
          {activeTab === 'rules' && (
            <div className="space-y-2">
              {rules.map((r, i) => (
                <div key={i} className="flex items-center gap-4 p-3.5 bg-[#0d1424] border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${r.active ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-300">{r.name}</p>
                    <p className="text-[10px] text-slate-600">{r.category} · fired {r.fires}× today</p>
                  </div>
                  <span className={`text-xs font-black ${r.success > 95 ? 'text-emerald-400' : 'text-amber-400'}`}>{r.success}%</span>
                  {r.loop && <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">Loop Risk</span>}
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => setRules(prev => prev.map((rr, j) => j === i ? { ...rr, active: !rr.active } : rr))}
                      className={`text-[9px] font-bold px-2 py-1 border rounded-lg transition-colors ${r.active ? 'bg-amber-500/20 border-amber-500/30 text-amber-400 hover:bg-amber-500/30' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30'}`}>
                      {r.active ? 'Pause' : 'Resume'}
                    </button>
                    <button className="text-[9px] font-bold px-2 py-1 bg-slate-800 border border-slate-700 text-slate-500 rounded-lg hover:text-slate-300 transition-colors">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* S4 — Capacity & Bottleneck */}
        <div>
          <SH sub="Peak load analysis and capacity warnings">Workforce Capacity & Bottlenecks</SH>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-5">
              <p className="text-[10px] text-slate-600 font-bold uppercase mb-3">Peak Production Load (Today)</p>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={PEAK_DATA}>
                  <defs>
                    <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={TP} formatter={v => [`${v}%`, 'Load']} />
                  <Area type="monotone" dataKey="load" stroke="#06b6d4" fill="url(#lg)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {CAPACITY_ALERTS.map((a, i) => (
                <div key={i} className={`flex items-center gap-3 p-3.5 bg-[#0d1424] border rounded-xl ${a.sev === 'critical' ? 'border-red-500/30' : a.sev === 'warning' ? 'border-amber-500/30' : 'border-emerald-500/20'}`}>
                  <span>{a.emoji}</span>
                  <p className={`text-xs flex-1 ${a.sev === 'critical' ? 'text-red-300' : a.sev === 'warning' ? 'text-amber-300' : 'text-emerald-300'}`}>{a.msg}</p>
                  <button className={`text-[9px] font-bold px-2 py-1 border rounded-lg ${a.sev === 'critical' ? 'bg-red-500/20 border-red-500/30 text-red-400' : a.sev === 'warning' ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'}`}>{a.action}</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* S7 — Deployment Workspace */}
        <div>
          <SH sub="AI-detected opportunities to scale automation capacity">Agent Deployment & Evolution</SH>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {suggestions.filter(s => s.status === 'new').map((s, i) => (
              <div key={i} className="bg-[#0d1424] border border-cyan-500/20 rounded-2xl p-5 hover:border-cyan-500/40 transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-[9px] font-bold text-cyan-400 uppercase">New Agent Opportunity</span>
                </div>
                <p className="text-xs font-black text-slate-200 mb-1">{s.suggestion_headline}</p>
                <p className="text-[10px] text-slate-600 leading-relaxed mb-3">{s.rationale}</p>
                <div className="bg-slate-900 rounded-xl px-3 py-2 mb-3 space-y-1">
                  <p className="text-[9px] text-slate-600">Tasks offloaded: <span className="text-slate-400 font-bold">{s.tasks_saved}/wk</span></p>
                  <p className="text-[9px] text-slate-600">Saving: <span className="text-emerald-400 font-bold">{s.saving}</span></p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSuggestions(prev => prev.map((ss, j) => j === i ? { ...ss, status: 'deployed' } : ss))}
                    className="flex-1 py-2 bg-cyan-500/20 border border-cyan-500/30 hover:bg-cyan-500/30 text-cyan-400 rounded-xl text-[10px] font-black transition-colors">
                    Deploy Agent
                  </button>
                  <button onClick={() => setSuggestions(prev => prev.map((ss, j) => j === i ? { ...ss, status: 'dismissed' } : ss))}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 text-slate-600 rounded-xl text-[10px] transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* S8 — Intelligence Feed */}
        <div>
          <SH sub="AI-generated operational insights for this workforce">AI Workforce Intelligence</SH>
          <div className="space-y-3">
            {insights.filter((_, i) => !dismissed.includes(i)).map((ins, i) => {
              const colors = { positive: 'border-emerald-500/20 bg-emerald-500/5', warning: 'border-amber-500/20 bg-amber-500/5', critical: 'border-red-500/20 bg-red-500/5', info: 'border-slate-700 bg-[#0d1424]' };
              return (
                <div key={i} className={`flex items-start gap-4 p-5 border rounded-2xl ${colors[ins.sev]}`}>
                  <span className="text-2xl flex-shrink-0">{ins.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-200 mb-1">{ins.headline}</p>
                    <p className="text-[10px] text-slate-600 leading-relaxed mb-3">{ins.detail}</p>
                    <div className="flex gap-2 flex-wrap">
                      {['Acknowledge', 'Assign Ops Task', 'Adjust Strategy', 'Weekly Review'].map(a => (
                        <button key={a} onClick={a === 'Acknowledge' ? () => setDismissed(d => [...d, i]) : undefined}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-[9px] font-bold text-slate-500 hover:text-slate-300 transition-all">
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setDismissed(d => [...d, i])} className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 hover:bg-slate-800">
                    <X className="w-3 h-3 text-slate-600" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {selectedAgent && <AgentModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />}
    </div>
  );
}