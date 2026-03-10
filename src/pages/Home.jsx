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
      {/* School Platform Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Launch Your School's Own Streaming TV Network</h3>
            <p className="text-sm text-blue-100 mt-1">Students create the stories. Your school controls the platform.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link to={createPageUrl('SchoolTV')} className="bg-white text-blue-600 px-4 py-2 rounded font-semibold text-sm hover:bg-blue-50 transition">
              Watch Demo
            </Link>
            <a href="https://calendly.com/bulldog-tv-sales" target="_blank" rel="noopener noreferrer" className="border border-white text-white px-4 py-2 rounded font-semibold text-sm hover:bg-blue-500 transition">
              Book a Demo
            </a>
          </div>
        </div>
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