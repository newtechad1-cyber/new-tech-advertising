import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import SalesGuidePanel from '@/components/sales/SalesGuidePanel';
import StickySalesCTA from '@/components/sales/StickySalesCTA';

const LOGO = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

const PLANS = [
  {
    name: 'Starter', price: '$297', period: '/month', badge: null, recommended: false,
    fit: 'Solo operators, side businesses, early-stage local businesses',
    color: 'border-slate-700', ctaStyle: 'bg-slate-800 hover:bg-slate-700 border border-slate-600',
    features: ['AI social content (weekly posts)', 'SEO blog articles (4/mo)', 'Google Business management', 'Review automation', 'Basic website updates', 'Monthly reporting'],
  },
  {
    name: 'Growth', price: '$597', period: '/month', badge: 'Most Popular', recommended: true,
    fit: 'Established local businesses ready to become the market leader',
    color: 'border-violet-600', ctaStyle: 'bg-violet-600 hover:bg-violet-500',
    features: ['Everything in Starter', 'Custom website included', '2 marketing videos/month', 'Full social media management', 'Advanced local SEO', 'Email marketing', 'Lead tracking'],
  },
  {
    name: 'Pro', price: '$997', period: '/month', badge: null, recommended: false,
    fit: 'Multi-location or rapidly scaling service businesses',
    color: 'border-yellow-700', ctaStyle: 'bg-yellow-700 hover:bg-yellow-600',
    features: ['Everything in Growth', 'Streaming TV advertising', 'ADA compliance & rebuild', 'Multi-location coverage', 'Dedicated manager', 'Priority support', 'Custom workflows'],
  },
];

export default function DealRoomPricing() {
  const sessionKey = localStorage.getItem('nta_session') || crypto.randomUUID();

  useEffect(() => {
    localStorage.setItem('nta_session', sessionKey);
    base44.functions.invoke('trackSalesEvent', {
      event_type: 'deal_room_pricing',
      page_path: '/deal-room/pricing',
      session_key: sessionKey,
    }).catch(() => {});
  }, []);

  const track = (e) => base44.functions.invoke('trackSalesEvent', { event_type: e, page_path: '/deal-room/pricing', session_key: sessionKey }).catch(() => {});

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 bg-slate-950/95 backdrop-blur">
        <Link to={createPageUrl('DealRoom')}><img src={LOGO} alt="NTA" className="h-8 w-auto" /></Link>
        <span className="text-slate-400 text-sm">← <Link to={createPageUrl('DealRoom')} className="hover:text-white transition-colors">Deal Room</Link></span>
        <Link to={createPageUrl('DealRoomRoi')}>
          <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 hover:text-white" onClick={() => track('deal_room_roi')}>Calculate ROI</Button>
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h1 className="text-4xl font-extrabold mb-3">Choose Your Plan</h1>
            <p className="text-slate-400 text-lg">All plans include done-for-you setup. No contracts. Cancel any time. We build it, you focus on your business.</p>
          </div>

          <div className="space-y-5">
            {PLANS.map(plan => (
              <div key={plan.name} className={`bg-slate-900 border-2 ${plan.color} rounded-2xl p-6 flex flex-col sm:flex-row gap-5`}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-bold text-xl">{plan.name}</h3>
                    {plan.badge && (
                      <span className="text-xs bg-violet-900/50 text-violet-400 border border-violet-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" /> {plan.badge}
                      </span>
                    )}
                    {plan.recommended && <span className="text-xs text-violet-400 font-medium">← Recommended for you</span>}
                  </div>
                  <p className="text-slate-500 text-sm mb-3">Best for: {plan.fit}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {plan.features.map(f => (
                      <div key={f} className="flex items-center gap-1.5 text-xs text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" /> {f}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 flex-shrink-0 min-w-[140px]">
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-white">{plan.price}</p>
                    <p className="text-slate-500 text-sm">{plan.period}</p>
                  </div>
                  <Link to={createPageUrl('StartTrial')} onClick={() => track('cta_start_trial')}>
                    <Button className={`w-full text-sm font-semibold ${plan.ctaStyle}`}>Choose {plan.name}</Button>
                  </Link>
                  <Link to={createPageUrl('Book-Call')} className="text-xs text-slate-500 hover:text-slate-300 transition-colors" onClick={() => track('cta_book_call')}>
                    Have questions?
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <SalesGuidePanel step="DealRoomPricing" />
        </div>
      </div>

      <StickySalesCTA currentStep="DealRoomPricing" onTrack={track} />
    </div>
  );
}