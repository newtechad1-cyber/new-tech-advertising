import React from 'react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import HomeHero from '../components/home/HomeHero';
import HomeProblem from '../components/home/HomeProblem';
import HomeSolution from '../components/home/HomeSolution';
import HomeDiyVsDfy from '../components/home/HomeDiyVsDfy';
import HomeAuthorityPlan from '../components/home/HomeAuthorityPlan';
import HomeServices from '../components/home/HomeServices';
import HomeIndustries from '../components/home/HomeIndustries';
import HomeHowItWorks from '../components/home/HomeHowItWorks';
import HomePricing from '../components/home/HomePricing';
import HomeFinalCta from '../components/home/HomeFinalCta';

export default function Home() {
  return (
    <div className="bg-slate-950">
      <MarketingNav />
      <main>
        <HomeHero />
        <HomeProblem />
        <HomeSolution />
        <HomeDiyVsDfy />
        <HomeAuthorityPlan />
        <HomeServices />
        <HomeIndustries />
        <HomeHowItWorks />
        <HomePricing />
        <HomeFinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}