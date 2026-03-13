import React from 'react';

const MARKET_SIZE_OPTIONS = [
  { key: 0.9,  label: 'Small Market',  sub: 'Under 100k pop' },
  { key: 1.0,  label: 'Mid-Size',      sub: '100k–500k pop' },
  { key: 1.15, label: 'Large Market',  sub: '500k–1M pop' },
  { key: 1.25, label: 'Metro',         sub: '1M+ population' },
];
const COMPETITION_OPTIONS = [
  { key: 0.95, label: 'Low',      sub: 'Few active competitors' },
  { key: 1.0,  label: 'Moderate', sub: 'Standard competition' },
  { key: 1.1,  label: 'High',     sub: 'Many active advertisers' },
  { key: 1.2,  label: 'Intense',  sub: 'Saturated market' },
];
const VELOCITY_OPTIONS = [
  { key: 1.0,  label: 'Standard',    sub: 'Base content cadence' },
  { key: 1.1,  label: 'Elevated',    sub: '+10% output boost' },
  { key: 1.2,  label: 'Aggressive',  sub: 'Maximum velocity' },
];
const VIDEO_OPTIONS = [
  { key: 1.0,  label: 'Standard',   sub: 'Base video included' },
  { key: 1.1,  label: 'Premium',    sub: 'Enhanced production' },
  { key: 1.2,  label: 'Intensive',  sub: 'Max video output' },
];

function OptionGroup({ label, options, value, onChange }) {
  return (
    <div>
      <p className="text-xs font-black text-slate-700 mb-2">{label}</p>
      <div className="flex gap-2 flex-wrap">
        {options.map(opt => (
          <button key={opt.key} onClick={() => onChange(opt.key)}
            className={`flex-1 min-w-[80px] px-2.5 py-2 rounded-xl border text-left transition-all ${
              value === opt.key ? 'bg-slate-800 text-white border-slate-800 shadow' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}>
            <p className="text-xs font-bold leading-tight">{opt.label}</p>
            <p className={`text-xs mt-0.5 ${value === opt.key ? 'text-slate-300' : 'text-slate-400'}`}>{opt.sub}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PSAdjustmentControls({ modifiers, onChange }) {
  const set = (key, val) => onChange({ ...modifiers, [key]: val });
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
      <div>
        <h3 className="font-black text-slate-900 text-sm mb-0.5">Market Adjustment Factors</h3>
        <p className="text-xs text-slate-400">Calibrate investment to actual market conditions</p>
      </div>
      <OptionGroup label="Market Size" options={MARKET_SIZE_OPTIONS} value={modifiers.market_size} onChange={v => set('market_size', v)} />
      <OptionGroup label="Competition Intensity" options={COMPETITION_OPTIONS} value={modifiers.competition} onChange={v => set('competition', v)} />
      <OptionGroup label="Content Velocity" options={VELOCITY_OPTIONS} value={modifiers.content_velocity} onChange={v => set('content_velocity', v)} />
      <OptionGroup label="Video Campaign Intensity" options={VIDEO_OPTIONS} value={modifiers.video_intensity} onChange={v => set('video_intensity', v)} />
    </div>
  );
}