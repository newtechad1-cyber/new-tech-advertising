import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, AlertTriangle, TrendingDown, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import SalesProgressSteps from '@/components/sales/SalesProgressSteps';
import SalesGuidePanel from '@/components/sales/SalesGuidePanel';
import StickySalesCTA from '@/components/sales/StickySalesCTA';

const LOGO = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

const PAIN_POINTS = [
  { icon: Clock, title: "You're too busy running the business", desc: "Marketing keeps falling to the back burner. Weeks go by with nothing posted, no new content, no follow-up." },
  { icon: DollarSign, title: "Agencies charge too much for too little", desc: "You're paying $2,500-$4,000/month for someone who posts 3 times a week and sends a monthly report you barely read." },
  { icon: TrendingDown, title: "Your website is outdated and invisible", desc: "Competitors rank above you on Google. Your site hasn't been touched in years. New visitors leave within seconds." },
  { icon: AlertTriangle, title: "Marketing doesn't feel like a system", desc: "It's scattered. A post here, a paid ad there. Nothing connects. Nothing builds on itself. Nothing compounds." },
];

export default function DemoOverview() {
  const sessionKey = localStorage.getItem('nta_session') || crypto.randomUUID();

  useEffect(() => {
    localStorage.setItem('nta_session', sessionKey);
    base44.functions.invoke('trackSalesEvent', {
      event_type: 'demo_overview',
      page_path: '/demo/overview',
      session_key: sessionKey,
    }).catch(() => {});
  }, []);

  const track = (e) => base44.functions.invoke('trackSalesEvent', { event_type: e, page_path: '/demo/overview', session_key: sessionKey }).catch(() => {});

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 bg-slate-950/95 backdrop-blur">
        <Link to={createPageUrl('SalesRoom')}><img src={LOGO} alt="NTA" className="h-8 w-auto" /></Link>
        <SalesProgressSteps currentStep="DemoOverview" />
        <Link to={createPageUrl('DemoPlatform')}>
          <Button size="sm" className="bg-violet-600 hover:bg-violet-500">Next <ArrowRight className="w-4 h-4 ml-1" /></Button>
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-900/30 border border-red-800 text-red-300 text-xs px-3 py-1.5 rounded-full mb-6">
              Step 1 of 5 · The Problem
            </div>
            <h1 className="text-4xl font-extrabold leading-tight mb-4">
              Why Most Small Business Marketing<br />
              <span className="text-red-400">Doesn't Actually Work</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              You know you need to market your business. But between running operations, managing staff, and serving customers — marketing never gets the attention it needs. And the options available to most small businesses are either too expensive, too time-consuming, or too disconnected to make a real difference.
            </p>
          </div>

          {/* Pain points grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PAIN_POINTS.map(p => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="bg-slate-900 border border-slate-700 rounded-xl p-5">
                  <div className="w-9 h-9 bg-red-900/30 border border-red-800 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="w-4.5 h-4.5 text-red-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-1.5">{p.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Transition */}
          <div className="bg-gradient-to-r from-violet-900/30 to-slate-900 border border-violet-700 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">There's a better way.</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              What if your marketing ran like a system — producing content, ranking on Google, generating leads, and following up with prospects — without you having to manage it every day?
            </p>
            <p className="text-slate-300 text-base font-medium mb-6">That's what New Tech Advertising built.</p>
            <Link to={createPageUrl('DemoPlatform')} onClick={() => track('demo_platform')}>
              <Button className="bg-violet-600 hover:bg-violet-500 font-bold text-base px-8 py-3 h-auto rounded-xl">
                See the Platform <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          <SalesGuidePanel step="DemoOverview" />
        </div>
      </div>

      <StickySalesCTA currentStep="DemoOverview" onTrack={track} />
    </div>
  );
}