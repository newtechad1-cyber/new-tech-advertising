import React, { useState } from 'react';
import { Sliders, Save, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';

const SLIDERS = [
  { key: 'content_velocity',        label: 'Content Velocity',         desc: 'Articles, blogs, and copy generation rate', color: '#3b82f6', icon: '📝' },
  { key: 'video_production_rate',   label: 'Video Production Rate',    desc: 'Script writing and video job submission pace', color: '#f59e0b', icon: '🎬' },
  { key: 'ranking_expansion_level', label: 'Ranking Expansion Level',  desc: 'SEO page generation and city targeting intensity', color: '#10b981', icon: '📈' },
  { key: 'social_posting_frequency',label: 'Social Posting Frequency', desc: 'How often posts are scheduled and queued', color: '#8b5cf6', icon: '📱' },
];

const TOGGLES = [
  { key: 'auto_retry_failed',          label: 'Auto-Retry Failed Jobs',          desc: 'Automatically retry failed tasks up to 3 times' },
  { key: 'auto_redistribute_on_spike', label: 'Auto-Redistribute on Spike',      desc: 'Rebalance agents when load exceeds 80%' },
  { key: 'auto_allocate_new_clients',  label: 'Auto-Allocate New Clients',       desc: 'Assign agents when new onboarding is created' },
];

export default function AWWorkloadControls({ policy, onSave }) {
  const [values, setValues] = useState({
    content_velocity: policy?.content_velocity ?? 70,
    video_production_rate: policy?.video_production_rate ?? 50,
    ranking_expansion_level: policy?.ranking_expansion_level ?? 60,
    social_posting_frequency: policy?.social_posting_frequency ?? 80,
    max_concurrent_jobs: policy?.max_concurrent_jobs ?? 20,
    auto_retry_failed: policy?.auto_retry_failed ?? true,
    auto_redistribute_on_spike: policy?.auto_redistribute_on_spike ?? true,
    auto_allocate_new_clients: policy?.auto_allocate_new_clients ?? true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(values);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const intensityLabel = (v) => v >= 80 ? 'High' : v >= 50 ? 'Medium' : 'Low';

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <div>
            <h3 className="text-white font-bold text-sm">Automation Intensity Controls</h3>
            <p className="text-slate-500 text-xs mt-0.5">Global workload parameters for all agents</p>
          </div>
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            saved ? 'bg-green-600/20 text-green-400 border border-green-700/40' : 'bg-cyan-600/20 text-cyan-400 border border-cyan-700/40 hover:bg-cyan-600/30'
          }`}>
          <Save className="w-3 h-3" /> {saved ? 'Saved ✓' : 'Save Policy'}
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Sliders */}
        <div className="space-y-4">
          {SLIDERS.map((s) => {
            const val = values[s.key];
            return (
              <div key={s.key}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{s.icon}</span>
                    <div>
                      <p className="text-white text-xs font-bold">{s.label}</p>
                      <p className="text-slate-600 text-xs">{s.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: s.color, background: `${s.color}18` }}>
                      {intensityLabel(val)}
                    </span>
                    <span className="text-white font-black text-sm w-8 text-right">{val}</span>
                  </div>
                </div>
                <input type="range" min={0} max={100} value={val}
                  onChange={e => setValues(v => ({ ...v, [s.key]: +e.target.value }))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, ${s.color} 0%, ${s.color} ${val}%, #1e293b ${val}%, #1e293b 100%)` }}
                />
              </div>
            );
          })}
        </div>

        {/* Max concurrent */}
        <div className="flex items-center gap-4 p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/30">
          <div className="flex-1">
            <p className="text-white text-xs font-bold">Max Concurrent Jobs</p>
            <p className="text-slate-500 text-xs">Simultaneous jobs across all agents</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setValues(v => ({ ...v, max_concurrent_jobs: Math.max(1, v.max_concurrent_jobs - 5) }))}
              className="w-7 h-7 rounded-lg bg-slate-700 text-white text-sm font-bold hover:bg-slate-600 transition-colors">−</button>
            <span className="text-white font-black text-lg w-8 text-center">{values.max_concurrent_jobs}</span>
            <button onClick={() => setValues(v => ({ ...v, max_concurrent_jobs: Math.min(100, v.max_concurrent_jobs + 5) }))}
              className="w-7 h-7 rounded-lg bg-slate-700 text-white text-sm font-bold hover:bg-slate-600 transition-colors">+</button>
          </div>
        </div>

        {/* Automation toggles */}
        <div className="space-y-2">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">Automation Rules</p>
          {TOGGLES.map((t) => {
            const on = values[t.key];
            return (
              <div key={t.key} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
                <button onClick={() => setValues(v => ({ ...v, [t.key]: !v[t.key] }))} className="flex-shrink-0">
                  {on
                    ? <ToggleRight className="w-6 h-6 text-cyan-400" />
                    : <ToggleLeft className="w-6 h-6 text-slate-600" />}
                </button>
                <div className="flex-1">
                  <p className={`text-xs font-semibold ${on ? 'text-white' : 'text-slate-500'}`}>{t.label}</p>
                  <p className="text-slate-600 text-xs">{t.desc}</p>
                </div>
                <span className="text-xs font-bold" style={{ color: on ? '#10b981' : '#475569' }}>{on ? 'On' : 'Off'}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}