import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import SalesProgressSteps from '@/components/sales/SalesProgressSteps';
import SalesGuidePanel from '@/components/sales/SalesGuidePanel';
import StickySalesCTA from '@/components/sales/StickySalesCTA';

const LOGO = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

const PLANS = [
  {
    name: 'Starter', price: '$297', period: '/month', badge: null,
    tagline: 'For solo operators and local businesses getting started',
    color: 'border-slate-700', highlight: false,
    features: ['AI-generated social content (weekly)', 'Monthly SEO blog articles (4)', 'Google Business profile management', 'Review request automation', 'Basic website updates', 'Monthly performance report'],
    cta: 'Start Starter Plan',
  },
  {
    name: 'Growth', price: '$597', period: '/month', badge: 'Most Popular',
    tagline: 'For businesses ready to dominate their local market',
    color: 'border-violet-600', highlight: true,
    features: ['Everything in Starter', 'Custom website build included', 'Monthly video content (2 videos)', 'Advanced local SEO campaigns', 'Full social media management', 'Email marketing automation', 'Lead tracking dashboard'],
    cta: 'Start Growth Plan',
  },
  {
    name: 'Pro', price: '$997', period: '/month', badge: null,
    tagline: 'For multi-service or multi-location businesses scaling aggressively',
    color: 'border-yellow-700', highlight: false,
    features: ['Everything in Growth', 'Streaming TV advertising', 'ADA compliance & remediation', 'Multi-location management', 'Dedicated account manager', 'Priority support & strategy calls', 'Custom integrations'],
    cta: 'Start Pro Plan',
  },
];

export default function DemoPricing() {
  const sessionKey = localStorage.getItem('nta_session') || crypto.randomUUID();

  useEffect(() => {
    localStorage.setItem('nta_session', sessionKey);
    base44.functions.invoke('trackSalesEvent', {
      event_type: 'demo_pricing',
      page_path: '/demo/pricing',
      session_key: sessionKey,
    }).catch(() => {});
  }, []);

  const track = (e) => base44.functions.invoke('trackSalesEvent', { event_type: e, page_path: '/demo/pricing', session_key: sessionKey }).catch(() => {});

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 bg-slate-950/95 backdrop-blur">
        <Link to={createPageUrl('SalesRoom')}><img src={LOGO} alt="NTA" className="h-8 w-auto" /></Link>
        <SalesProgressSteps currentStep="DemoPricing" />
        <Link to={createPageUrl('DealRoom')}>
          <Button size="sm" className="bg-violet-600 hover:bg-violet-500">Open Deal Room <ArrowRight className="w-4 h-4 ml-1" /></Button>
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-yellow-900/30 border border-yellow-800 text-yellow-300 text-xs px-3 py-1.5 rounded-full mb-6">
              Step 4 of 5 · Pricing
            </div>
            <h1 className="text-4xl font-extrabold leading-tight mb-4">
              Real Marketing Costs.<br />
              <span className="text-yellow-400">No Agency Markup.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              The average small business agency retainer is $2,500–$4,500/month — for disconnected work across multiple vendors. NTA is one system, one price, complete coverage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map(plan => (
              <div key={plan.name} className={`bg-slate-900 border-2 ${plan.color} rounded-2xl overflow-hidden flex flex-col ${plan.highlight ? 'shadow-xl shadow-violet-600/10' : ''}`}>
                {plan.badge && (
                  <div className="bg-violet-600 text-white text-xs font-bold text-center py-1.5 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3" /> {plan.badge}
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-white font-bold text-lg">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-slate-500 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-slate-500 text-xs mb-4">{plan.tagline}</p>
                  <ul className="space-y-1.5 flex-1 mb-5">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to={createPageUrl('StartTrial')} onClick={() => track('cta_start_trial')}>
                    <Button className={`w-full text-sm font-semibold ${plan.highlight ? 'bg-violet-600 hover:bg-violet-500' : 'bg-slate-800 hover:bg-slate-700 border border-slate-700'}`}>
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-center">
            <p className="text-slate-400 mb-4">Not sure which plan fits? Open the Deal Room to get a personalized proposal and ROI estimate.</p>
            <Link to={createPageUrl('DealRoom')} onClick={() => track('deal_room_visit')}>
              <Button className="bg-violet-600 hover:bg-violet-500 font-bold px-8 py-3 h-auto rounded-xl">
                Open My Deal Room <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <SalesGuidePanel step="DemoPricing" />
        </div>
      </div>

      <StickySalesCTA currentStep="DemoPricing" onTrack={track} />
    </div>
  );
}