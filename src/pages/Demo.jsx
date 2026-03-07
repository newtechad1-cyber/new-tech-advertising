import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SiteFooter from '@/components/marketing/SiteFooter';
import DemoHero from '@/components/demo/DemoHero';
import DemoVideo from '@/components/demo/DemoVideo';
import DemoHowItWorks from '@/components/demo/DemoHowItWorks';
import DemoFeatures from '@/components/demo/DemoFeatures';
import DemoWeekInTheLife from '@/components/demo/DemoWeekInTheLife';
import DemoCta from '@/components/demo/DemoCta';

const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

export default function Demo() {
  const videoRef = useRef(null);

  const scrollToVideo = () => {
    videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Minimal header */}
      <header className="border-b border-slate-800 py-4 px-6 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('Home')}>
            <img src={LOGO_URL} alt="New Tech Advertising" className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <Link to={createPageUrl('Start')} className="hidden sm:inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1">
        <DemoHero onPlayVideo={scrollToVideo} />
        <DemoVideo videoRef={videoRef} />
        <DemoHowItWorks />
        <DemoFeatures />
        <DemoWeekInTheLife />
        <DemoCta />
      </div>

      <SiteFooter />
    </div>
  );
}