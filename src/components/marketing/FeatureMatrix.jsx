import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CheckCircle, X, Minus, ArrowRight, BrainCircuit, Calendar, BarChart2, Video, Zap, Globe, Shield, Users, MessageSquare, Tv, ChevronDown } from 'lucide-react';

// ── Plans ──────────────────────────────────────────────────────────────────────
const PLANS = [
  { key: 'diy_social', name: 'DIY Social', price: '$97', period: '/mo', cta: 'Start DIY', link: '/nta/diy-growth-system?plan=diy_social', highlight: false, badge: 'Best Way to Start' },
  { key: 'diy_suite', name: 'DIY Suite', price: '$197', period: '/mo', cta: 'Start Suite', link: '/nta/diy-growth-system?plan=diy_suite', highlight: true, badge: 'Best for Solo Operators' },
  { key: 'growth_partner', name: 'Growth Partner', price: '$297', period: '/mo', cta: 'Book a Call', link: '/book-call', highlight: false, badge: 'Best for Accountability' },
  { key: 'growth_accelerator', name: 'Accelerator', price: '$497', period: '/mo', cta: 'Book a Call', link: '/book-call', highlight: false, badge: 'Best for Serious Growth' },
  { key: 'full_stack', name: 'Full-Stack', price: '$797', period: '/mo', cta: 'Book Strategy Call', link: '/book-call', highlight: false, badge: 'The Everything Plan' },
];

// ── Feature Categories ─────────────────────────────────────────────────────────
const FEATURE_GROUPS = [
  {
    label: 'AI Content',
    icon: BrainCircuit,
    color: 'text-violet-400',
    features: [
      { label: 'AI-generated posts/month', diy_social: '20 posts', diy_suite: '50 posts', growth_partner: '20 DFY', growth_accelerator: 'Unlimited DFY', full_stack: 'Unlimited DFY' },
      { label: 'Brand-aligned captions', diy_social: true, diy_suite: true, growth_partner: true, growth_accelerator: true, full_stack: true },
      { label: 'Content pillar strategy', diy_social: true, diy_suite: true, growth_partner: true, growth_accelerator: true, full_stack: true },
      { label: 'Content approval workflow', diy_social: false, diy_suite: true, growth_partner: true, growth_accelerator: true, full_stack: true },
    ],
  },
  {
    label: 'Scheduling',
    icon: Calendar,
    color: 'text-cyan-400',
    features: [
      { label: 'Social channels', diy_social: '3 channels', diy_suite: '7 channels', growth_partner: '7 channels', growth_accelerator: 'Unlimited', full_stack: 'Unlimited' },
      { label: 'Social Media Planner', diy_social: true, diy_suite: true, growth_partner: true, growth_accelerator: true, full_stack: true },
      { label: 'We post for you (DFY)', diy_social: false, diy_suite: false, growth_partner: true, growth_accelerator: true, full_stack: true },
    ],
  },
  {
    label: 'Video & Media',
    icon: Video,
    color: 'text-pink-400',
    features: [
      { label: 'AI Video Studio', diy_social: false, diy_suite: true, growth_partner: true, growth_accelerator: true, full_stack: true },
      { label: 'AI Video Production (DFY)', diy_social: false, diy_suite: false, growth_partner: false, growth_accelerator: true, full_stack: true },
      { label: 'Streaming TV Ad Scripts', diy_social: false, diy_suite: false, growth_partner: false, growth_accelerator: true, full_stack: true },
    ],
  },
  {
    label: 'Business Tools',
    icon: Globe,
    color: 'text-amber-400',
    features: [
      { label: 'Full CRM & Client Management', diy_social: false, diy_suite: true, growth_partner: true, growth_accelerator: true, full_stack: true },
      { label: 'Invoicing & Expense Tracking', diy_social: false, diy_suite: true, growth_partner: true, growth_accelerator: true, full_stack: true },
      { label: 'Financial Reports (P&L)', diy_social: false, diy_suite: true, growth_partner: true, growth_accelerator: true, full_stack: true },
      { label: 'Custom Back-Office App', diy_social: false, diy_suite: false, growth_partner: false, growth_accelerator: false, full_stack: true },
      { label: 'Custom Automation Workflows', diy_social: false, diy_suite: false, growth_partner: false, growth_accelerator: false, full_stack: true },
    ],
  },
  {
    label: 'Strategy & Support',
    icon: MessageSquare,
    color: 'text-sky-400',
    features: [
      { label: 'Growth Guide Chatbot', diy_social: true, diy_suite: true, growth_partner: true, growth_accelerator: true, full_stack: true },
      { label: 'Learning Center Access', diy_social: true, diy_suite: true, growth_partner: true, growth_accelerator: true, full_stack: true },
      { label: 'Email Support', diy_social: true, diy_suite: true, growth_partner: true, growth_accelerator: true, full_stack: true },
      { label: 'Monthly Live Q&A', diy_social: false, diy_suite: true, growth_partner: true, growth_accelerator: true, full_stack: true },
      { label: 'Priority Support', diy_social: false, diy_suite: true, growth_partner: true, growth_accelerator: true, full_stack: true },
      { label: 'Strategy Calls', diy_social: false, diy_suite: false, growth_partner: 'Monthly', growth_accelerator: 'Bi-weekly', full_stack: 'Weekly' },
      { label: 'Dedicated Growth Strategist', diy_social: false, diy_suite: false, growth_partner: true, growth_accelerator: true, full_stack: true },
      { label: 'Quarterly Business Reviews', diy_social: false, diy_suite: false, growth_partner: false, growth_accelerator: false, full_stack: true },
    ],
  },
  {
    label: 'Compliance',
    icon: Shield,
    color: 'text-green-400',
    features: [
      { label: 'SEO + Google Business Optimization', diy_social: false, diy_suite: false, growth_partner: true, growth_accelerator: true, full_stack: true },
      { label: 'Reputation & Review Management', diy_social: false, diy_suite: false, growth_partner: false, growth_accelerator: true, full_stack: true },
      { label: 'Competitor Analysis', diy_social: false, diy_suite: false, growth_partner: false, growth_accelerator: true, full_stack: true },
    ],
  },
];

function Cell({ value }) {
  if (value === true)  return <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />;
  if (value === false) return <X className="w-4 h-4 text-slate-700 mx-auto" />;
  if (value === null)  return <Minus className="w-3.5 h-3.5 text-slate-600 mx-auto" />;
  return <span className="text-xs text-slate-300 font-medium text-center block">{value}</span>;
}

export default function FeatureMatrix() {
  const [openGroups, setOpenGroups] = useState(FEATURE_GROUPS.map(() => true));

  const toggle = (i) => setOpenGroups(g => g.map((v, idx) => idx === i ? !v : v));

  return (
    <section className="bg-slate-950 py-20 px-4 border-t border-slate-800" id="features">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest">Feature Breakdown</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
            Everything included in each plan
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Compare features across all four tiers — from self-serve AI tools to fully managed marketing.
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full min-w-[640px]">

            {/* Plan header row */}
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-5 py-5 text-slate-500 text-xs uppercase tracking-wide font-semibold w-48 bg-slate-900">
                  Feature
                </th>
                {PLANS.map(plan => (
                  <th key={plan.key} className={`text-center px-3 py-5 ${plan.highlight ? 'bg-violet-900/30' : 'bg-slate-900'}`}>
                    <div className="flex flex-col items-center gap-1">
                      {plan.badge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${plan.highlight ? 'bg-violet-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                          {plan.badge}
                        </span>
                      )}
                      <span className="text-white font-bold text-sm">{plan.name}</span>
                      <div className="flex items-end gap-0.5">
                        <span className="text-white font-extrabold text-xl">{plan.price}</span>
                        <span className="text-slate-500 text-xs mb-0.5">{plan.period}</span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {FEATURE_GROUPS.map((group, gi) => {
                const GroupIcon = group.icon;
                const isOpen = openGroups[gi];
                return (
                  <>
                    {/* Group header */}
                    <tr
                      key={`group-${gi}`}
                      className="border-t border-slate-800 cursor-pointer hover:bg-slate-900/60 transition-colors"
                      onClick={() => toggle(gi)}
                    >
                      <td colSpan={6} className="px-5 py-3 bg-slate-900/60">
                        <div className="flex items-center gap-2">
                          <GroupIcon className={`w-4 h-4 ${group.color}`} />
                          <span className={`text-xs font-bold uppercase tracking-widest ${group.color}`}>{group.label}</span>
                          <ChevronDown className={`w-3.5 h-3.5 text-slate-500 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </div>
                      </td>
                    </tr>

                    {/* Feature rows */}
                    {isOpen && group.features.map((feat, fi) => (
                      <tr
                        key={`feat-${gi}-${fi}`}
                        className="border-t border-slate-800/50 hover:bg-slate-900/30 transition-colors"
                      >
                        <td className="px-5 py-3 text-slate-300 text-sm">{feat.label}</td>
                        {PLANS.map(plan => (
                          <td key={plan.key} className={`text-center px-3 py-3 ${plan.highlight ? 'bg-violet-900/10' : ''}`}>
                            <Cell value={feat[plan.key]} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                );
              })}

              {/* CTA row */}
              <tr className="border-t border-slate-700">
                <td className="px-5 py-5 bg-slate-900" />
                {PLANS.map(plan => (
                  <td key={plan.key} className={`text-center px-3 py-5 ${plan.highlight ? 'bg-violet-900/30' : 'bg-slate-900'}`}>
                    <Link
                      to={createPageUrl(plan.link)}
                      className={`inline-flex items-center gap-1.5 font-bold text-sm px-4 py-2.5 rounded-xl transition-all ${
                        plan.highlight
                          ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30'
                          : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white'
                      }`}
                    >
                      {plan.cta} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-center text-slate-600 text-sm mt-6">
          All plans include a 14-day free trial · No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  );
}