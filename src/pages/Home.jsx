import React from 'react';
import SiteHeader from '../components/marketing/SiteHeader';
import SiteFooter from '../components/marketing/SiteFooter';
import HomeHero from '../components/marketing/HomeHero';
import HomeProblem from '../components/marketing/HomeProblem';
import HomePlatform from '../components/marketing/HomePlatform';
import HomeVideoAdvantage from '../components/marketing/HomeVideoAdvantage';
import HomeIndustries from '../components/marketing/HomeIndustries';
import HomeHowItWorks from '../components/marketing/HomeHowItWorks';
import HomePricing from '../components/marketing/HomePricing';
import HomeAdaServices from '../components/marketing/HomeAdaServices';
import HomeFinalCta from '../components/marketing/HomeFinalCta';

export default function Home() {
  return (
    <div className="bg-white">
      <SiteHeader />
      <main>
        <HomeHero />
        <HomeProblem />
        <HomePlatform />
        <HomeVideoAdvantage />
        <HomeIndustries />
        <HomeHowItWorks />
        <HomePricing />
        <HomeAdaServices />
        <HomeFinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}