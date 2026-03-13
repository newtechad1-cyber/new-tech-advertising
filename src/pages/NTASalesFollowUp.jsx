import React, { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, Filter, Zap, Flame, TrendingUp, Users, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import SFUKPIBar from '@/components/sales-followup/SFUKPIBar';
import SFUSequenceCard from '@/components/sales-followup/SFUSequenceCard';
import SFUStartModal from '@/components/sales-followup/SFUStartModal';

const FILTER_OPTIONS = [
  { key: 'all',         label: 'All Active',   icon: Users },
  { key: 'burning',     label: 'Burning',      icon: Flame },
  { key: 'hot',        label: 'Hot',          icon: TrendingUp },
  { key: 'due',        label: 'Due Today',    icon: Zap },
  { key: 'critical',   label: 'Critical',     icon: Zap },
];

export default function NTASalesFollowUp() {
  const [sequences, setSequences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showStartModal, setShowStartModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await base44.entities.SalesFollowUpSequence.list('-engagement_score', 100);
    setSequences(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load, refreshKey]);

  const handleRefresh = () => setRefreshKey(k => k + 1);

  const filtered = sequences.filter(s => {
    if (filter === 'burning') return s.engagement_tier === 'burning';
    if (filter === 'hot') return s.engagement_tier === 'hot';
    if (filter === 'critical') return s.priority_flag === 'critical' || s.priority_flag === 'urgent';
    if (filter === 'due') {
      if (!s.next_follow_up_date) return false;
      const d = new Date(s.next_follow_up_date);
      const today = new Date();
      return d <= today;
    }
    return s.status === 'active';
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-slate-900">Sales Follow-Up Engine</h1>
              <p className="text-sm text-slate-500 mt-0.5">Authority-based post-demo nurturing & closing</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleRefresh}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={() => setShowStartModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20">
                <Plus className="w-4 h-4" /> Start Sequence
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* KPI Bar */}
        <SFUKPIBar sequences={sequences} />

        {/* Automation Logic Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-black text-sm">Automation Engine Active</p>
            <p className="text-blue-200 text-xs mt-0.5">
              Sequences auto-start on demo completion · Cadence accelerates on engagement signals · Priority escalates when deal room visited 2×+
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-blue-200 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            Live
          </div>
        </div>

        {/* Engagement Scoring Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { tier: 'Burning', range: '80–100', desc: 'Immediate owner action', color: '#dc2626', bg: '#fef2f2' },
            { tier: 'Hot', range: '50–79', desc: 'Accelerated cadence', color: '#ea580c', bg: '#fff7ed' },
            { tier: 'Warm', range: '25–49', desc: 'Standard sequence', color: '#d97706', bg: '#fffbeb' },
            { tier: 'Cold', range: '0–24', desc: 'Downgraded urgency', color: '#0284c7', bg: '#f0f9ff' },
          ].map(t => (
            <div key={t.tier} className="rounded-xl p-3 border border-slate-200 bg-white flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: t.color }} />
              <div>
                <p className="text-xs font-black" style={{ color: t.color }}>{t.tier} <span className="font-normal text-slate-400">({t.range})</span></p>
                <p className="text-xs text-slate-400">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {FILTER_OPTIONS.map(f => {
            const Icon = f.icon;
            const count = f.key === 'all' ? sequences.filter(s => s.status === 'active').length
              : f.key === 'burning' ? sequences.filter(s => s.engagement_tier === 'burning').length
              : f.key === 'hot' ? sequences.filter(s => s.engagement_tier === 'hot').length
              : f.key === 'critical' ? sequences.filter(s => s.priority_flag === 'critical' || s.priority_flag === 'urgent').length
              : sequences.filter(s => s.next_follow_up_date && new Date(s.next_follow_up_date) <= new Date()).length;

            return (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  filter === f.key ? 'bg-slate-800 text-white border-slate-800 shadow' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}>
                <Icon className="w-3.5 h-3.5" />
                {f.label}
                <span className={`px-1.5 py-0.5 rounded text-xs font-black ${filter === f.key ? 'bg-white/20' : 'bg-slate-100'}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Sequence grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 h-48 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-bold text-slate-600">No sequences match this filter</p>
            <p className="text-sm mt-1">Start a sequence from a demo-completed opportunity</p>
            <button onClick={() => setShowStartModal(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors">
              Start First Sequence
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(seq => (
              <SFUSequenceCard key={seq.id} seq={seq} onRefresh={handleRefresh} />
            ))}
          </div>
        )}

        {/* Phase Logic Reference */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-sm">6-Phase Sequence Logic</h3>
            <span className="text-xs text-slate-400">Auto-triggers & cadence rules</span>
          </div>
          <div className="divide-y divide-slate-50">
            {[
              { ph: 1, name: 'Same-Day Recap',       hours: 2,   trigger: 'Demo marked completed',           escalate: 'Deal room link auto-attached' },
              { ph: 2, name: 'Authority Proof',       hours: 48,  trigger: 'Phase 1 sent',                    escalate: 'AI-generated case study by vertical' },
              { ph: 3, name: 'ROI Perspective',       hours: 120, trigger: 'Phase 2 sent',                    escalate: 'Proposal view → skip to phase 4' },
              { ph: 4, name: 'Market Urgency',        hours: 192, trigger: 'No engagement detected',          escalate: 'CTA click → escalate to critical priority' },
              { ph: 5, name: 'Strategic Check-In',    hours: 288, trigger: 'Phase 4 sent',                    escalate: '15-min call offer, no pressure' },
              { ph: 6, name: 'Long-Cycle Nurture',    hours: 720, trigger: 'No response 30+ days',            escalate: 'Monthly market insight cadence' },
            ].map(row => (
              <div key={row.ph} className="px-5 py-3 flex items-center gap-4 text-xs hover:bg-slate-50 transition-colors">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center font-black flex-shrink-0 text-xs">{row.ph}</div>
                <div className="w-32 font-bold text-slate-800 flex-shrink-0">{row.name}</div>
                <div className="w-20 text-slate-400 flex-shrink-0">+{row.hours < 48 ? `${row.hours}h` : `${row.hours / 24}d`}</div>
                <div className="text-slate-500 flex-1">{row.trigger}</div>
                <div className="text-slate-400 hidden lg:block flex-1 text-right italic">{row.escalate}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showStartModal && (
        <SFUStartModal onClose={() => setShowStartModal(false)} onStarted={handleRefresh} />
      )}
    </div>
  );
}