import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, TrendingUp, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import SalesProgressSteps from '@/components/sales/SalesProgressSteps';
import SalesGuidePanel from '@/components/sales/SalesGuidePanel';
import StickySalesCTA from '@/components/sales/StickySalesCTA';
import CaseStudyGrid from '@/components/sales/CaseStudyGrid';

const LOGO = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

const INDUSTRIES = [
  { name: 'HVAC', color: 'bg-orange-900/30 border-orange-700 text-orange-400', desc: 'Seasonal promotions, local rankings, review generation, and before/after content.' },
  { name: 'Restaurant', color: 'bg-red-900/30 border-red-700 text-red-400', desc: 'Daily social posts, specials content, Google optimization, and video menus.' },
  { name: 'Plumbing', color: 'bg-blue-900/30 border-blue-700 text-blue-400', desc: 'Emergency keyword ranking, reputation management, and local authority content.' },
  { name: 'Contractors', color: 'bg-yellow-900/30 border-yellow-700 text-yellow-400', desc: 'Project showcase content, quote lead pages, video case studies, and seasonal ranking.' },
  { name: 'Med Spa', color: 'bg-pink-900/30 border-pink-700 text-pink-400', desc: 'Before/after content, service videos, appointment-driving SEO, and luxury brand positioning.' },
  { name: 'Landscaping', color: 'bg-green-900/30 border-green-700 text-green-400', desc: 'Seasonal SEO, portfolio videos, neighborhood targeting, and recurring service content.' },
];

export default function DemoExamples() {
  const sessionKey = localStorage.getItem('nta_session') || crypto.randomUUID();

  useEffect(() => {
    localStorage.setItem('nta_session', sessionKey);
    base44.functions.invoke('trackSalesEvent', {
      event_type: 'demo_examples',
      page_path: '/demo/examples',
      session_key: sessionKey,
    }).catch(() => {});
  }, []);

  const track = (e) => base44.functions.invoke('trackSalesEvent', { event_type: e, page_path: '/demo/examples', session_key: sessionKey }).catch(() => {});

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 bg-slate-950/95 backdrop-blur">
        <Link to={createPageUrl('SalesRoom')}><img src={LOGO} alt="NTA" className="h-8 w-auto" /></Link>
        <SalesProgressSteps currentStep="DemoExamples" />
        <Link to={createPageUrl('DemoPricing')}>
          <Button size="sm" className="bg-violet-600 hover:bg-violet-500">Next <ArrowRight className="w-4 h-4 ml-1" /></Button>
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-800 text-blue-300 text-xs px-3 py-1.5 rounded-full mb-6">
              Step 3 of 5 · Real Examples
            </div>
            <h1 className="text-4xl font-extrabold leading-tight mb-4">
              Businesses Like Yours<br />
              <span className="text-green-400">Are Already Growing With NTA</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              These are real results from small and mid-sized businesses that replaced scattered marketing with a single NTA system. No agencies. No big ad budgets. Just a consistent marketing machine.
            </p>
          </div>

          {/* Case study grid */}
          <CaseStudyGrid compact />

          {/* Industry verticals */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Industries We Serve</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {INDUSTRIES.map(ind => (
                <div key={ind.name} className={`border rounded-xl p-4 ${ind.color}`}>
                  <p className="font-semibold text-sm mb-1">{ind.name}</p>
                  <p className="text-xs opacity-70 leading-relaxed">{ind.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <Link to={createPageUrl('DemoPricing')} onClick={() => track('demo_pricing')}>
            <Button className="bg-violet-600 hover:bg-violet-500 font-bold text-base px-8 py-3 h-auto rounded-xl w-full sm:w-auto">
              See Pricing <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <SalesGuidePanel step="DemoExamples" />
        </div>
      </div>

      <StickySalesCTA currentStep="DemoExamples" onTrack={track} />
    </div>
  );
}