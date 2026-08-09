import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import SalesGuidePanel from '@/components/sales/SalesGuidePanel';
import StickySalesCTA from '@/components/sales/StickySalesCTA';
import ROIResultsCard from '@/components/sales/ROIResultsCard';

const LOGO = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

export default function DealRoomRoi() {
  const sessionKey = localStorage.getItem('nta_session') || crypto.randomUUID();

  useEffect(() => {
    localStorage.setItem('nta_session', sessionKey);
    base44.functions.invoke('trackSalesEvent', {
      event_type: 'deal_room_roi',
      page_path: '/deal-room/roi',
      session_key: sessionKey,
    }).catch(() => {});
  }, []);

  const track = (e) => base44.functions.invoke('trackSalesEvent', { event_type: e, page_path: '/deal-room/roi', session_key: sessionKey }).catch(() => {});

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 bg-slate-950/95 backdrop-blur">
        <Link to={createPageUrl('DealRoom')}><img src={LOGO} alt="NTA" className="h-8 w-auto" /></Link>
        <span className="text-slate-400 text-sm">← <Link to={createPageUrl('DealRoom')} className="hover:text-white transition-colors">Deal Room</Link></span>
        <Link to={createPageUrl('StartTrial')}>
          <Button size="sm" className="bg-violet-600 hover:bg-violet-500" onClick={() => track('cta_start_trial')}>Start Trial <ArrowRight className="w-4 h-4 ml-1" /></Button>
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold mb-3">Your ROI Calculator</h1>
            <p className="text-slate-400 text-lg">Enter your current marketing situation to see exactly what NTA would save you — and what it could generate.</p>
          </div>
          <ROIResultsCard onTrack={track} />
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-3">Why These Numbers Make Sense</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Most small businesses paying agency retainers are paying for individual services — a social media manager here, an SEO person there, a web designer for updates. NTA bundles all of that into one system, running automatically. You're not paying more people — you're replacing them with a smarter process.
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <SalesGuidePanel step="DealRoomRoi" />
        </div>
      </div>
      <StickySalesCTA currentStep="DealRoomRoi" onTrack={track} />
    </div>
  );
}