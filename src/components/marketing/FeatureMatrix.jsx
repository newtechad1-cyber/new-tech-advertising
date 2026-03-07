import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CheckCircle, X, Minus, ArrowRight, BrainCircuit, Calendar, BarChart2, Video, Zap, Globe, Shield, Users, MessageSquare, Tv, ChevronDown } from 'lucide-react';

// ── Plans ──────────────────────────────────────────────────────────────────────
const PLANS = [
  { key: 'starter',  name: 'DIY Starter', price: '$99',  period: '/mo', cta: 'Start Free Trial', link: 'Get-Started', highlight: false, badge: null },
  { key: 'pro',      name: 'DIY Pro',     price: '$199', period: '/mo', cta: 'Start Free Trial', link: 'Get-Started', highlight: false, badge: null },
  { key: 'dfy',      name: 'DFY Social',  price: '$399', period: '/mo', cta: 'Book a Call',       link: 'Book-Call',   highlight: true,  badge: 'Most Popular' },
  { key: 'reach',    name: 'Total Reach', price: '$899', period: '/mo', cta: 'Book a Call',       link: 'Book-Call',   highlight: false, badge: 'Full Service' },
];

// ── Feature Categories ─────────────────────────────────────────────────────────
const FEATURE_GROUPS = [
  {
    label: 'AI Content',
    icon: BrainCircuit,
    color: 'text-violet-400',
    features: [
      { label: 'AI-generated posts/month',        starter: '20 posts',     pro: '50 posts',     dfy: 'Unlimited',    reach: 'Unlimited' },
      { label: 'Brand-aligned captions',          starter: true,           pro: true,           dfy: true,           reach: true },
      { label: 'Content pillar strategy',         starter: true,           pro: true,           dfy: true,           reach: true },
      { label: 'Hashtag & SEO optimization',      starter: true,           pro: true,           dfy: true,           reach: true },
      { label: 'AI image generation',             starter: false,          pro: true,           dfy: true,           reach: true },
      { label: 'Content approval workflow',       starter: false,          pro: true,           dfy: true,           reach: true },
    ],
  },
  {
    label: 'Scheduling & Publishing',
    icon: Calendar,
    color: 'text-cyan-400',
    features: [
      { label: 'Social channels',                 starter: '3 channels',   pro: '7 channels',   dfy: 'Unlimited',    reach: 'Unlimited' },
      { label: 'Auto-scheduling',                 starter: true,           pro: true,           dfy: true,           reach: true },
      { label: 'Peak-time optimization',          starter: false,          pro: true,           dfy: true,           reach: true },
      { label: 'Content calendar view',           starter: true,           pro: true,           dfy: true,           reach: true },
      { label: 'We post for you (DFY)',            starter: false,          pro: false,          dfy: true,           reach: true },
    ],
  },
  {
    label: 'Video & Media',
    icon: Video,
    color: 'text-pink-400',
    features: [
      { label: 'AI Video Studio',                 starter: false,          pro: true,           dfy: true,           reach: true },
      { label: 'AI avatar videos',                starter: false,          pro: true,           dfy: true,           reach: true },
      { label: 'Short-form video scripts',        starter: false,          pro: true,           dfy: true,           reach: true },
      { label: 'Professional video production',   starter: false,          pro: false,          dfy: false,          reach: true },
      { label: 'Streaming TV ads (Hulu/Roku)',    starter: false,          pro: false,          dfy: false,          reach: true },
    ],
  },
  {
    label: 'Strategy & Planning',
    icon: Globe,
    color: 'text-sky-400',
    features: [
      { label: '90-Day Authority Plan',           starter: true,           pro: true,           dfy: true,           reach: true },
      { label: 'Monthly strategy call',           starter: false,          pro: false,          dfy: true,           reach: true },
      { label: 'Competitor analysis',             starter: false,          pro: true,           dfy: true,           reach: true },
      { label: 'Campaign themes & calendars',     starter: true,           pro: true,           dfy: true,           reach: true },
      { label: 'Dedicated account manager',       starter: false,          pro: false,          dfy: false,          reach: true },
    ],
  },
  {
    label: 'Analytics & Reporting',
    icon: BarChart2,
    color: 'text-amber-400',
    features: [
      { label: 'Basic analytics dashboard',       starter: true,           pro: true,           dfy: true,           reach: true },
      { label: 'AI-generated monthly reports',    starter: false,          pro: true,           dfy: true,           reach: true },
      { label: 'Per-platform breakdowns',         starter: false,          pro: true,           dfy: true,           reach: true },
      { label: 'Custom reporting',                starter: false,          pro: false,          dfy: false,          reach: true },
      { label: 'Google Business management',      starter: false,          pro: false,          dfy: false,          reach: true },
    ],
  },
  {
    label: 'Compliance & Reputation',
    icon: Shield,
    color: 'text-green-400',
    features: [
      { label: 'ADA compliance monitoring',       starter: false,          pro: false,          dfy: false,          reach: true },
      { label: 'ADA auto-remediation',            starter: false,          pro: false,          dfy: false,          reach: true },
      { label: 'Local SEO signals',               starter: false,          pro: true,           dfy: true,           reach: true },
    ],
  },
  {
    label: 'Support',
    icon: MessageSquare,
    color: 'text-slate-400',
    features: [
      { label: 'Email support',                   starter: true,           pro: true,           dfy: true,           reach: true },
      { label: 'Priority support',                starter: false,          pro: true,           dfy: true,           reach: true },
      { label: 'Dedicated content team',          starter: false,          pro: false,          dfy: true,           reach: true },
      { label: 'Onboarding setup call',           starter: false,          pro: true,           dfy: true,           reach: true },
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
                      <td colSpan={5} className="px-5 py-3 bg-slate-900/60">
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