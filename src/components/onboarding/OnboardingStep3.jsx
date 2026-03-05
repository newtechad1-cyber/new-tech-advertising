import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const GOALS = [
  { value: 'leads',     label: '🎯 Generate Leads',        desc: 'Drive inquiries and new customers' },
  { value: 'awareness', label: '📣 Build Awareness',       desc: 'Get your brand in front of more people' },
  { value: 'promotion', label: '🛍️ Promote Offers',        desc: 'Highlight deals, discounts, and events' },
  { value: 'trust',     label: '⭐ Build Trust',            desc: 'Showcase expertise and testimonials' },
];

export default function OnboardingStep3({ data, onChange }) {
  return (
    <div className="space-y-5">
      <div>
        <Label className="block mb-2">Primary Marketing Goal *</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GOALS.map(g => (
            <button
              key={g.value}
              type="button"
              onClick={() => onChange({ ...data, primary_goal: g.value })}
              className={`text-left px-4 py-3 rounded-xl border-2 transition-all ${data.primary_goal === g.value ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
            >
              <p className="font-medium text-slate-800">{g.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{g.desc}</p>
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label>Target Audience *</Label>
        <Textarea
          placeholder="Describe your ideal customer: age, location, needs, pain points…"
          value={data.target_audience || ''}
          onChange={(e) => onChange({ ...data, target_audience: e.target.value })}
          className="mt-1 h-24"
        />
      </div>
    </div>
  );
}