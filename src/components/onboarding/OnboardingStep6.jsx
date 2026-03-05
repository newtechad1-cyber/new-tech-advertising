import React from 'react';

const PLANS = [
  { value: '5',  label: '5 posts / month',  desc: 'Light presence — great for getting started', badge: 'Starter' },
  { value: '10', label: '10 posts / month', desc: 'Consistent presence — most popular', badge: 'Recommended', highlight: true },
  { value: '15', label: '15 posts / month', desc: 'High-volume — maximum visibility', badge: 'Pro' },
];

export default function OnboardingStep6({ data, onChange }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500 mb-4">How many posts per month would you like us to generate and schedule for you?</p>
      {PLANS.map(p => (
        <button
          key={p.value}
          type="button"
          onClick={() => onChange({ ...data, posting_frequency: p.value })}
          className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all relative ${data.posting_frequency === p.value ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800">{p.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{p.desc}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.highlight ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {p.badge}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}