import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, CheckCircle, Calendar, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import SalesGuidePanel from '@/components/sales/SalesGuidePanel';
import StickySalesCTA from '@/components/sales/StickySalesCTA';
import PlanRecommendationCard from '@/components/sales/PlanRecommendationCard';

const LOGO = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

const TIMELINE = [
  { day: 'Day 1', label: 'Onboarding call & business intake' },
  { day: 'Day 2-3', label: 'Website & brand assets built' },
  { day: 'Day 4-5', label: 'First content batch created & scheduled' },
  { day: 'Day 7', label: 'SEO campaign launched' },
  { day: 'Week 2', label: 'Video content delivered' },
  { day: 'Week 3+', label: 'Monthly automation running on schedule' },
];

const OUTCOMES = [
  'Consistent brand presence across web & social',
  'Monthly content that ranks for your target keywords',
  'Automated review requests to build trust and ratings',
  'A website that works as a 24/7 sales tool',
  'Video marketing that builds your authority',
  'Visibility in local search results within 30-60 days',
];

export default function DealRoomProposal() {
  const sessionKey = localStorage.getItem('nta_session') || crypto.randomUUID();

  useEffect(() => {
    localStorage.setItem('nta_session', sessionKey);
    base44.functions.invoke('trackSalesEvent', {
      event_type: 'deal_room_proposal',
      page_path: '/deal-room/proposal',
      session_key: sessionKey,
    }).catch(() => {});
  }, []);

  const track = (e) => base44.functions.invoke('trackSalesEvent', { event_type: e, page_path: '/deal-room/proposal', session_key: sessionKey }).catch(() => {});

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 bg-slate-950/95 backdrop-blur">
        <Link to={createPageUrl('DealRoom')}><img src={LOGO} alt="NTA" className="h-8 w-auto" /></Link>
        <span className="text-slate-400 text-sm">← <Link to={createPageUrl('DealRoom')} className="hover:text-white transition-colors">Deal Room</Link></span>
        <Link to={createPageUrl('StartTrial')}>
          <Button size="sm" className="bg-violet-600 hover:bg-violet-500" onClick={() => track('cta_start_trial')}>Start Free Trial <ArrowRight className="w-4 h-4 ml-1" /></Button>
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-900/30 border border-violet-700 text-violet-300 text-xs px-3 py-1.5 rounded-full mb-5">
              <Zap className="w-3.5 h-3.5" /> Your Personalized Proposal
            </div>
            <h1 className="text-4xl font-extrabold mb-3">Recommended Plan: <span className="text-violet-400">Growth</span></h1>
            <p className="text-slate-400 text-lg">Based on your business type and the areas you explored in the demo, we recommend the Growth plan. Here's exactly what that means for your business.</p>
          </div>

          {/* What's included */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-white font-bold text-xl mb-4">What's Included in Your Growth Plan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Professional website — built for you, owned by you',
                '4 SEO blog articles per month',
                'Daily/weekly social media content creation',
                '2 marketing videos per month',
                'Google Business profile management',
                'Automated review request system',
                'Email marketing automation',
                'Local SEO campaigns targeting your city',
                'Monthly performance dashboard',
                'Lead tracking and reporting',
              ].map(item => (
                <div key={item} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" /> {item}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-400" /> What Happens After You Sign Up
            </h2>
            <div className="space-y-3">
              {TIMELINE.map((t, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-16 text-xs font-bold text-violet-400 flex-shrink-0">{t.day}</div>
                  <div className="flex-1 h-px bg-slate-700" />
                  <div className="text-sm text-slate-300">{t.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Expected outcomes */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-white font-bold text-xl mb-4">Expected Outcomes (30–90 Days)</h2>
            <ul className="space-y-2">
              {OUTCOMES.map(o => (
                <li key={o} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" /> {o}
                </li>
              ))}
            </ul>
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to={createPageUrl('StartTrial')} onClick={() => track('cta_start_trial')}>
              <Button className="w-full bg-violet-600 hover:bg-violet-500 font-bold h-auto py-3">Start Free Trial</Button>
            </Link>
            <Link to={createPageUrl('Book-Call')} onClick={() => track('cta_book_call')}>
              <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:text-white h-auto py-3">Book Strategy Call</Button>
            </Link>
            <Link to={createPageUrl('DealRoomRoi')} onClick={() => track('deal_room_roi')}>
              <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:text-white h-auto py-3">Calculate ROI</Button>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <SalesGuidePanel step="DealRoomProposal" />
          <PlanRecommendationCard recommendedPlan="growth" compact />
        </div>
      </div>

      <StickySalesCTA currentStep="DealRoomProposal" onTrack={track} />
    </div>
  );
}