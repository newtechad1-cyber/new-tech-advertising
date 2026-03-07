import React from 'react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import HomePricing from '@/components/home/HomePricing';
import FeatureMatrix from '@/components/marketing/FeatureMatrix';
import HomeFinalCta from '@/components/home/HomeFinalCta';

export default function Pricing() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <MarketingNav />
      <HomePricing />
      <FeatureMatrix />
      <HomeFinalCta />
      <SiteFooter />
    </div>
  );
}