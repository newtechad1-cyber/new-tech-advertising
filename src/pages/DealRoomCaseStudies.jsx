import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import SalesGuidePanel from '@/components/sales/SalesGuidePanel';
import StickySalesCTA from '@/components/sales/StickySalesCTA';
import CaseStudyGrid from '@/components/sales/CaseStudyGrid';

const LOGO = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

export default function DealRoomCaseStudies() {
  const sessionKey = localStorage.getItem('nta_session') || crypto.randomUUID();

  useEffect(() => {
    localStorage.setItem('nta_session', sessionKey);
    base44.functions.invoke('trackSalesEvent', {
      event_type: 'deal_room_visit',
      page_path: '/deal-room/case-studies',
      session_key: sessionKey,
    }).catch(() => {});
  }, []);

  const track = (e) => base44.functions.invoke('trackSalesEvent', { event_type: e, page_path: '/deal-room/case-studies', session_key: sessionKey }).catch(() => {});

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 bg-slate-950/95 backdrop-blur">
        <Link to={createPageUrl('DealRoom')}><img src={LOGO} alt="NTA" className="h-8 w-auto" /></Link>
        <span className="text-slate-400 text-sm">← <Link to={createPageUrl('DealRoom')} className="hover:text-white transition-colors">Deal Room</Link></span>
        <Link to={createPageUrl('StartTrial')}>
          <Button size="sm" className="bg-violet-600 hover:bg-violet-500" onClick={() => track('cta_start_trial')}>Start Trial</Button>
        </Link>
      </header>
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold mb-3">Real Businesses. Real Results.</h1>
            <p className="text-slate-400 text-lg">Filter by industry to see what happened for businesses just like yours.</p>
          </div>
          <CaseStudyGrid />
          <div className="pt-4">
            <Link to={createPageUrl('DealRoomContract')} onClick={() => track('cta_start_trial')}>
              <Button className="bg-violet-600 hover:bg-violet-500 font-bold px-8 py-3 h-auto rounded-xl">
                Ready to Start? <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="space-y-6">
          <SalesGuidePanel step="DealRoom" />
        </div>
      </div>
      <StickySalesCTA currentStep="DealRoomCaseStudies" onTrack={track} />
    </div>
  );
}