import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, FileText, DollarSign, Calculator, BookOpen, PenSquare, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import SalesGuidePanel from '@/components/sales/SalesGuidePanel';
import StickySalesCTA from '@/components/sales/StickySalesCTA';
import PlanRecommendationCard from '@/components/sales/PlanRecommendationCard';

const LOGO = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

const ROOMS = [
  { icon: FileText, label: 'Your Proposal', desc: 'Recommended plan, what\'s included, and expected outcomes for your business.', page: 'DealRoomProposal', color: 'border-violet-700 hover:border-violet-500', badge: 'Start Here' },
  { icon: DollarSign, label: 'Pricing Breakdown', desc: 'Full plan comparison with no hidden fees or agency markups.', page: 'DealRoomPricing', color: 'border-slate-700 hover:border-violet-600', badge: null },
  { icon: Calculator, label: 'ROI Calculator', desc: 'See your estimated savings and return compared to your current marketing spend.', page: 'DealRoomRoi', color: 'border-slate-700 hover:border-green-700', badge: null },
  { icon: BookOpen, label: 'Case Studies', desc: 'Results from real businesses in your industry using NTA.', page: 'DealRoomCaseStudies', color: 'border-slate-700 hover:border-blue-700', badge: null },
  { icon: PenSquare, label: 'Get Started', desc: 'Start your free trial, request setup, or book a strategy call.', page: 'DealRoomContract', color: 'border-green-800 hover:border-green-600', badge: 'Final Step' },
];

export default function DealRoom() {
  const sessionKey = localStorage.getItem('nta_session') || crypto.randomUUID();

  useEffect(() => {
    localStorage.setItem('nta_session', sessionKey);
    base44.functions.invoke('trackSalesEvent', {
      event_type: 'deal_room_visit',
      page_path: '/deal-room',
      session_key: sessionKey,
    }).catch(() => {});
  }, []);

  const track = (e) => base44.functions.invoke('trackSalesEvent', { event_type: e, page_path: '/deal-room', session_key: sessionKey }).catch(() => {});

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 bg-slate-950/95 backdrop-blur">
        <Link to={createPageUrl('SalesRoom')}><img src={LOGO} alt="NTA" className="h-8 w-auto" /></Link>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Zap className="w-4 h-4 text-violet-400" /> Your Deal Room
        </div>
        <Link to={createPageUrl('StartTrial')}>
          <Button size="sm" className="bg-violet-600 hover:bg-violet-500" onClick={() => track('cta_start_trial')}>Start Trial <ArrowRight className="w-4 h-4 ml-1" /></Button>
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h1 className="text-4xl font-extrabold mb-3">Your Deal Room</h1>
            <p className="text-slate-400 text-lg">Everything you need to make a confident decision. Review your proposal, compare pricing, run an ROI estimate, and see results from businesses like yours.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ROOMS.map(room => {
              const Icon = room.icon;
              return (
                <Link key={room.page} to={createPageUrl(room.page)} onClick={() => track(room.page === 'DealRoomPricing' ? 'deal_room_pricing' : room.page === 'DealRoomProposal' ? 'deal_room_proposal' : room.page === 'DealRoomRoi' ? 'deal_room_roi' : 'deal_room_visit')}>
                  <div className={`bg-slate-900 border-2 ${room.color} rounded-2xl p-5 transition-all h-full cursor-pointer group`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-violet-900/40 transition-colors">
                        <Icon className="w-5 h-5 text-violet-400" />
                      </div>
                      {room.badge && (
                        <span className="text-xs bg-violet-900/40 text-violet-400 border border-violet-700 px-2 py-0.5 rounded-full">{room.badge}</span>
                      )}
                    </div>
                    <h3 className="text-white font-bold mb-1">{room.label}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{room.desc}</p>
                    <div className="mt-3 flex items-center gap-1 text-violet-400 text-xs font-medium group-hover:gap-2 transition-all">
                      Open <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <PlanRecommendationCard recommendedPlan="growth" />
        </div>

        <div className="space-y-6">
          <SalesGuidePanel step="DealRoom" />
        </div>
      </div>

      <StickySalesCTA currentStep="DealRoom" onTrack={track} />
    </div>
  );
}