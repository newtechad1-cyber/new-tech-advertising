import React from 'react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import HomeHero from '../components/home/HomeHero';
import HomeProblem from '../components/home/HomeProblem';
import HomeGrowthSystem from '../components/home/HomeGrowthSystem';
import HomeAdaCompliance from '../components/home/HomeAdaCompliance';
import HomeStreamingTV from '../components/home/HomeStreamingTV';
import HomeTools from '../components/home/HomeTools';
import HomeIndustries from '../components/home/HomeIndustries';
import HomeHowItWorks from '../components/home/HomeHowItWorks';
import HomeDemoSection from '../components/home/HomeDemoSection';
import HomePricing from '../components/home/HomePricing';
import HomeFinalCta from '../components/home/HomeFinalCta';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Home() {
  return (
    <div className="bg-slate-950">
      <MarketingNav />
      {/* School Story Lab Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-3 px-4 text-center">
        <span className="text-sm font-semibold">🏫 Hampton-Dumont School Story Lab is live! </span>
        <Link to={createPageUrl('SchoolHome')} className="text-sm font-bold underline underline-offset-2 hover:text-blue-200 ml-1">
          Visit the School Site →
        </Link>
      </div>
      <main>
        <HomeHero />
        <HomeProblem />
        <HomeGrowthSystem />
        <HomeAdaCompliance />
        <HomeStreamingTV />
        <HomeTools />
        <HomeIndustries />
        <HomeHowItWorks />
        <HomeDemoSection />
        <HomePricing />
        <HomeFinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}