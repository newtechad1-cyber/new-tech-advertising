import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import DemoProgressBar from '@/components/demo-machine/DemoProgressBar';
import StickyCTA from '@/components/demo-machine/StickyCTA';
import DemoAIPanel from '@/components/demo-machine/DemoAIPanel';
import DemoConversionBlock from '@/components/demo-machine/DemoConversionBlock';
import { useDemoPageView, useDemoTrack } from '@/components/demo-machine/useDemoSession';
import { CheckCircle, ArrowRight, Zap } from 'lucide-react';

const PLANS = [
  {
    name: 'Starter', price: '$497', period: '/mo', color: 'border-slate-700', popular: false,
    desc: 'For solo operators and new businesses building their online presence.',
    features: ['AI-built website', '4 blog posts/month', 'Local SEO pages (25)', 'Review automation', 'Basic lead capture', 'Monthly analytics report'],
  },
  {
    name: 'Growth', price: '$897', period: '/mo', color: 'border-blue-600', popular: true,
    desc: 'For established businesses ready to dominate their local market.',
    features: ['Everything in Starter', '8 blog posts/month', 'Local SEO pages (100)', 'Social media management', 'CRM + lead pipeline', 'Google Ads integration', 'Weekly performance reports'],
  },
  {
    name: 'Pro', price: '$1,497', period: '/mo', color: 'border-purple-600', popular: false,
    desc: 'For multi-location businesses and aggressive growth targets.',
    features: ['Everything in Growth', 'Unlimited content', 'Unlimited SEO pages', 'Video content creation', 'Advanced CRM + automation', 'Dedicated success manager', 'Custom integrations'],
  },
];

export default function DemoPricing() {
  useDemoPageView('DemoPricing');
  const { track } = useDemoTrack();

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-32">
      <DemoProgressBar currentPage="DemoPricing" />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-900/40 border border-blue-700 rounded-full text-blue-300 text-xs font-semibold mb-4">
            Step 5 of 7 — Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Simple, Transparent<br /><span className="text-blue-400">Pricing That Makes Sense</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Compare what you're spending now vs. what NTA costs — and what it delivers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {PLANS.map(plan => (
            <div key={plan.name} className={`bg-slate-900 border-2 rounded-2xl p-6 relative ${plan.color}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-4">
                <div className="font-bold text-xl text-white">{plan.name}</div>
                <div className="flex items-end gap-1 mt-1">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-slate-400 text-sm mb-1">{plan.period}</span>
                </div>
                <p className="text-slate-400 text-sm mt-2">{plan.desc}</p>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <Link to={createPageUrl('StartTrial')} onClick={() => track('cta_click', { value: `start_trial_${plan.name}` })}>
                <button className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${plan.popular ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'border border-slate-600 hover:border-slate-400 text-slate-300'}`}>
                  Start Free Trial
                </button>
              </Link>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" /> vs. Hiring an Agency</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-slate-400 text-xs font-semibold uppercase mb-2">Traditional Agency</div>
              <div className="space-y-1 text-sm text-slate-400">
                <div>Web design: <span className="text-red-400">$3,000–$8,000 upfront</span></div>
                <div>SEO agency: <span className="text-red-400">$1,500–$3,000/mo</span></div>
                <div>Content writer: <span className="text-red-400">$500–$1,500/mo</span></div>
                <div>Social mgmt: <span className="text-red-400">$800–$2,000/mo</span></div>
                <div className="font-bold text-red-400 pt-2 border-t border-slate-700">Total: $4,300–$8,500/mo</div>
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-xs font-semibold uppercase mb-2">NTA Platform</div>
              <div className="space-y-1 text-sm text-slate-400">
                <div>Website: <span className="text-green-400">Included</span></div>
                <div>SEO: <span className="text-green-400">Included</span></div>
                <div>Content: <span className="text-green-400">Included</span></div>
                <div>Social: <span className="text-green-400">Included</span></div>
                <div className="font-bold text-green-400 pt-2 border-t border-slate-700">Total: from $497/mo</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to={createPageUrl('DemoRoi')} onClick={() => track('cta_click', { value: 'view_roi' })}>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-colors">
              Calculate Your ROI <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>

        <DemoConversionBlock title="Ready to Start?" nextPage="DemoRoi" nextLabel="See ROI Calculator →" />
      </div>

      <DemoAIPanel context="Prospect is reviewing pricing plans, comparing NTA to agency costs" />
      <StickyCTA currentStep="DemoPricing" />
    </div>
  );
}