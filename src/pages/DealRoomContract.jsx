import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, CheckCircle, Calendar, Zap, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import SalesGuidePanel from '@/components/sales/SalesGuidePanel';

const LOGO = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

export default function DealRoomContract() {
  const sessionKey = localStorage.getItem('nta_session') || crypto.randomUUID();

  useEffect(() => {
    localStorage.setItem('nta_session', sessionKey);
    base44.functions.invoke('trackSalesEvent', {
      event_type: 'deal_room_visit',
      page_path: '/deal-room/contract',
      session_key: sessionKey,
    }).catch(() => {});
  }, []);

  const track = (e) => base44.functions.invoke('trackSalesEvent', { event_type: e, page_path: '/deal-room/contract', session_key: sessionKey }).catch(() => {});

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 bg-slate-950/95 backdrop-blur">
        <Link to={createPageUrl('DealRoom')}><img src={LOGO} alt="NTA" className="h-8 w-auto" /></Link>
        <span className="text-slate-400 text-sm">← <Link to={createPageUrl('DealRoom')} className="hover:text-white transition-colors">Deal Room</Link></span>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold mb-3">Ready to Move Forward?</h1>
            <p className="text-slate-400 text-lg">Choose the path that works best for you. No pressure, no long-term lock-in on the trial.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-slate-900 border-2 border-violet-600 rounded-2xl p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-violet-900/40 border border-violet-700 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-white font-bold mb-2">Start Free Trial</h3>
              <p className="text-slate-500 text-sm mb-5">Get set up in 48 hours. We build everything for you. Cancel any time.</p>
              <Link to={createPageUrl('StartTrial')} onClick={() => track('cta_start_trial')} className="w-full">
                <Button className="w-full bg-violet-600 hover:bg-violet-500 font-bold">Start Trial <ArrowRight className="w-4 h-4 ml-1" /></Button>
              </Link>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-bold mb-2">Request Setup</h3>
              <p className="text-slate-500 text-sm mb-5">Submit your info and our team will contact you to walk through onboarding.</p>
              <Link to={createPageUrl('StartTrial')} onClick={() => track('cta_request_setup')} className="w-full">
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:text-white font-semibold">Request Setup</Button>
              </Link>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-white font-bold mb-2">Book a Call</h3>
              <p className="text-slate-500 text-sm mb-5">30-minute strategy call with our team. Free. We'll answer every question.</p>
              <Link to={createPageUrl('Book-Call')} onClick={() => track('cta_book_call')} className="w-full">
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:text-white font-semibold">Book Call</Button>
              </Link>
            </div>
          </div>

          {/* Reassurance */}
          <div className="bg-green-900/10 border border-green-800 rounded-2xl p-6">
            <h3 className="text-green-400 font-bold mb-3">Our Commitment to You</h3>
            <div className="space-y-2">
              {[
                'No long-term contracts required on trial',
                'We build your website and first content before you pay month 2',
                'Cancel any time — no penalty',
                'If you\'re not satisfied after setup, we\'ll refund your first month',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" /> {item}
                </div>
              ))}
            </div>
          </div>

          <p className="text-slate-600 text-sm text-center">
            Questions? Call us: <a href="tel:6414208816" className="text-violet-400 hover:text-violet-300">641-420-8816</a>
            {' '}· <a href="mailto:rick@newtechadvertising.com" className="text-violet-400 hover:text-violet-300">rick@newtechadvertising.com</a>
          </p>
        </div>

        <div className="space-y-6">
          <SalesGuidePanel step="DealRoomProposal" />
        </div>
      </div>
    </div>
  );
}