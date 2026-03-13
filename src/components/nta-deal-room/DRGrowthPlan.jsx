import React, { useState } from 'react';
import { CheckCircle2, Calendar, DollarSign, Package } from 'lucide-react';

const PACKAGE_DATA = {
  starter: {
    name: 'Starter Visibility Package',
    color: '#3b82f6',
    deliverables: [
      { month: 'Week 1–2', item: 'Onboarding & brand audit' },
      { month: 'Week 2–3', item: 'Content strategy & calendar built' },
      { month: 'Month 1', item: '30 content pieces go live' },
      { month: 'Month 1', item: 'Google Business Profile optimized' },
      { month: 'Month 2', item: 'Review generation system activated' },
      { month: 'Month 3', item: 'First performance report delivered' },
    ],
    onboarding: ['Strategy call', 'Brand intake form', 'Content approval workflow', 'Monthly report setup'],
  },
  authority: {
    name: 'Market Authority Package',
    color: '#8b5cf6',
    deliverables: [
      { month: 'Week 1', item: 'Dedicated strategist assigned' },
      { month: 'Week 2', item: 'Authority website build begins' },
      { month: 'Week 2–3', item: 'Content calendar built (60 pieces/mo)' },
      { month: 'Month 1', item: 'First video production batch (4 videos)' },
      { month: 'Month 1', item: 'Streaming TV commercial scripted & produced' },
      { month: 'Month 2', item: 'Full SEO + local citation campaign live' },
      { month: 'Month 3', item: 'Bi-weekly strategy call cadence begins' },
    ],
    onboarding: ['VIP onboarding call', 'Competitor analysis delivered', 'Custom content strategy', 'Video production kickoff', 'CRM integration setup'],
  },
  domination: {
    name: 'Market Domination Package',
    color: '#f59e0b',
    deliverables: [
      { month: 'Day 1', item: 'Dedicated account strategist assigned' },
      { month: 'Week 1', item: 'Full market audit & competitor map' },
      { month: 'Week 2', item: 'Premium website build begins' },
      { month: 'Month 1', item: 'Unlimited content production live' },
      { month: 'Month 1', item: '8+ video production batch begins' },
      { month: 'Month 1', item: 'Full OTT/CTV campaign launched' },
      { month: 'Month 2', item: 'Referral activation system live' },
      { month: 'Month 3', item: 'Executive reporting & market domination review' },
    ],
    onboarding: ['Executive kickoff call', 'Full market domination roadmap', 'Dedicated video crew assigned', 'Reputation & referral systems', 'Weekly strategy sessions'],
  },
};

const fmt = (n) => n ? `$${n.toLocaleString()}` : '—';

export default function DRGrowthPlan({ packageTier, monthlyFee, setupFee, contractTerm, startDate, totalValue }) {
  const [activeTab, setActiveTab] = useState('deliverables');
  const pkg = PACKAGE_DATA[packageTier] || PACKAGE_DATA.authority;

  return (
    <section className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-800/60">
      <div className="text-center mb-10">
        <h2 className="text-white text-3xl font-black mb-3">Your Growth Plan</h2>
        <p className="text-slate-400 text-base">Everything included — no surprises, no hidden fees.</p>
      </div>

      {/* Package header */}
      <div className="rounded-2xl border p-6 mb-6" style={{ borderColor: `${pkg.color}40`, background: `${pkg.color}08` }}>
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-6 h-6" style={{ color: pkg.color }} />
          <h3 className="text-white text-xl font-black">{pkg.name}</h3>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          {[
            { label: 'Monthly Investment', value: fmt(monthlyFee), color: pkg.color },
            { label: 'Setup Investment', value: fmt(setupFee), color: '#94a3b8' },
            { label: 'Agreement Length', value: `${contractTerm || 12} months`, color: '#94a3b8' },
            { label: 'Total Contract Value', value: fmt(totalValue), color: '#10b981' },
          ].map((m, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-black" style={{ color: m.color }}>{m.value}</p>
              <p className="text-slate-500 text-xs mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        {startDate && (
          <div className="flex items-center gap-2 text-slate-400 text-sm border-t border-slate-700/40 pt-4">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Proposed start date: <strong className="text-white">{startDate}</strong></span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700/60 mb-5">
        {['deliverables', 'onboarding'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors capitalize ${
              activeTab === tab ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}>{tab === 'deliverables' ? 'Deliverables Timeline' : 'Onboarding Steps'}
          </button>
        ))}
      </div>

      {activeTab === 'deliverables' ? (
        <div className="space-y-2">
          {pkg.deliverables.map((d, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-slate-800/40 border border-slate-700/40 rounded-xl">
              <span className="text-xs font-bold text-slate-500 w-24 flex-shrink-0">{d.month}</span>
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: pkg.color }} />
              <span className="text-slate-200 text-sm">{d.item}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {pkg.onboarding.map((step, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-slate-800/40 border border-slate-700/40 rounded-xl">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: pkg.color }}>
                {i + 1}
              </div>
              <span className="text-white text-sm font-medium">{step}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}