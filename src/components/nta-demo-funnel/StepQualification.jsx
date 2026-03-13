import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const INDUSTRIES = [
  { val: 'hvac', label: 'HVAC', emoji: '❄️' },
  { val: 'plumbing', label: 'Plumbing', emoji: '🔧' },
  { val: 'roofing', label: 'Roofing', emoji: '🏠' },
  { val: 'electrical', label: 'Electrical', emoji: '⚡' },
  { val: 'landscaping', label: 'Landscaping', emoji: '🌿' },
  { val: 'painting', label: 'Painting', emoji: '🎨' },
  { val: 'restaurant', label: 'Restaurant', emoji: '🍽️' },
  { val: 'dental', label: 'Dental', emoji: '🦷' },
  { val: 'real_estate', label: 'Real Estate', emoji: '🏡' },
  { val: 'fitness', label: 'Fitness', emoji: '💪' },
  { val: 'med_spa', label: 'Med Spa', emoji: '✨' },
  { val: 'other', label: 'Other', emoji: '🏢' },
];

const INVESTMENT_RANGES = [
  { val: 'under_1k', label: 'Under $1,000/mo' },
  { val: '1k_3k',   label: '$1,000 – $3,000/mo' },
  { val: '3k_5k',   label: '$3,000 – $5,000/mo' },
  { val: '5k_10k',  label: '$5,000 – $10,000/mo' },
  { val: 'over_10k',label: '$10,000+/mo' },
];

const GOALS = [
  { val: 'more_leads',          label: 'Generate more leads' },
  { val: 'brand_authority',     label: 'Build brand authority' },
  { val: 'beat_competitors',    label: 'Outrank competitors' },
  { val: 'expand_locations',    label: 'Expand to new areas' },
  { val: 'reduce_marketing_cost', label: 'Reduce cost per lead' },
  { val: 'better_roi',          label: 'Improve marketing ROI' },
];

const URGENCY = [
  { val: 'immediate',      label: 'Ready now — want to move fast' },
  { val: 'next_30_days',   label: 'In the next 30 days' },
  { val: 'next_90_days',   label: 'Planning for next quarter' },
  { val: 'just_exploring', label: 'Just exploring options' },
];

export default function StepQualification({ data, onNext }) {
  const [form, setForm] = useState({
    business_name: data.business_name || '',
    contact_name: data.contact_name || '',
    contact_email: data.contact_email || '',
    contact_phone: data.contact_phone || '',
    city: data.city || '',
    industry: data.industry || '',
    current_marketing: data.current_marketing || '',
    monthly_investment_range: data.monthly_investment_range || '',
    urgency: data.urgency || '',
    primary_goal: data.primary_goal || '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const valid = form.business_name && form.contact_email && form.city && form.industry && form.primary_goal && form.urgency;

  const Field = ({ label, children, required }) => (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      {children}
    </div>
  );

  const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors placeholder-slate-400";

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Tell Us About Your Business</h2>
        <p className="text-slate-500 text-sm">We'll build a personalized market insight preview based on your answers.</p>
      </div>

      <div className="space-y-6">
        {/* Name + business */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Your Name" required>
            <input className={inputCls} placeholder="Full name" value={form.contact_name} onChange={e => set('contact_name', e.target.value)} />
          </Field>
          <Field label="Business Name" required>
            <input className={inputCls} placeholder="e.g. Peak HVAC" value={form.business_name} onChange={e => set('business_name', e.target.value)} />
          </Field>
        </div>

        {/* Email + phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email Address" required>
            <input type="email" className={inputCls} placeholder="you@business.com" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} />
          </Field>
          <Field label="Phone Number">
            <input type="tel" className={inputCls} placeholder="(555) 000-0000" value={form.contact_phone} onChange={e => set('contact_phone', e.target.value)} />
          </Field>
        </div>

        {/* City */}
        <Field label="City / Service Area" required>
          <input className={inputCls} placeholder="e.g. Denver, CO" value={form.city} onChange={e => set('city', e.target.value)} />
        </Field>

        {/* Industry */}
        <Field label="Industry" required>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {INDUSTRIES.map(ind => (
              <button key={ind.val} onClick={() => set('industry', ind.val)}
                className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl border text-xs font-bold transition-all ${
                  form.industry === ind.val
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}>
                <span className="text-lg">{ind.emoji}</span>
                {ind.label}
              </button>
            ))}
          </div>
        </Field>

        {/* Current marketing */}
        <Field label="Current Marketing Methods">
          <textarea className={`${inputCls} h-20 resize-none`} placeholder="e.g. Google Ads, Facebook, local agency, word of mouth..."
            value={form.current_marketing} onChange={e => set('current_marketing', e.target.value)} />
        </Field>

        {/* Investment range */}
        <Field label="Current Monthly Marketing Investment">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {INVESTMENT_RANGES.map(r => (
              <button key={r.val} onClick={() => set('monthly_investment_range', r.val)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all text-left ${
                  form.monthly_investment_range === r.val
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}>
                {r.label}
              </button>
            ))}
          </div>
        </Field>

        {/* Primary goal */}
        <Field label="Primary Growth Goal" required>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {GOALS.map(g => (
              <button key={g.val} onClick={() => set('primary_goal', g.val)}
                className={`px-4 py-3 rounded-xl border text-sm font-semibold text-left transition-all ${
                  form.primary_goal === g.val
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}>
                {g.label}
              </button>
            ))}
          </div>
        </Field>

        {/* Urgency */}
        <Field label="How Soon Are You Looking to Grow?" required>
          <div className="space-y-2">
            {URGENCY.map(u => (
              <button key={u.val} onClick={() => set('urgency', u.val)}
                className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-left transition-all flex items-center gap-3 ${
                  form.urgency === u.val
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}>
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  form.urgency === u.val ? 'border-blue-600' : 'border-slate-300'
                }`}>
                  {form.urgency === u.val && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>
                {u.label}
              </button>
            ))}
          </div>
        </Field>

        <button disabled={!valid} onClick={() => onNext(form)}
          className={`w-full py-4 rounded-2xl text-base font-black transition-all flex items-center justify-center gap-2 ${
            valid
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/30 hover:-translate-y-0.5'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}>
          See My Market Insights <ChevronRight className="w-5 h-5" />
        </button>

        <p className="text-center text-slate-400 text-xs">Your information is private and never sold to third parties.</p>
      </div>
    </div>
  );
}