import React from 'react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import HomeHero from '../components/home/HomeHero';
import HomeProblem from '../components/home/HomeProblem';
import HomeGrowthSystem from '../components/home/HomeGrowthSystem';
import HomeStreamingTV from '../components/home/HomeStreamingTV';
import HomeTools from '../components/home/HomeTools';
import HomeIndustries from '../components/home/HomeIndustries';
import HomeHowItWorks from '../components/home/HomeHowItWorks';
import HomeDemoSection from '../components/home/HomeDemoSection';
import HomePricing from '../components/home/HomePricing';
import HomeFinalCta from '../components/home/HomeFinalCta';

export default function Home() {
  return (
    <div className="bg-slate-950">
      <MarketingNav />
      <main>
        <HomeHero />
        <HomeProblem />
        <HomeGrowthSystem />
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