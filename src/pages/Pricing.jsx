import React from 'react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import HomePricing from '@/components/home/HomePricing';
import FeatureMatrix from '@/components/marketing/FeatureMatrix';
import HomeFinalCta from '@/components/home/HomeFinalCta';
import SEOHead from '@/components/shared/SEOHead';

export default function Pricing() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <SEOHead 
        title="Marketing Pricing & Plans | New Tech Advertising"
        description="Affordable AI marketing plans for small businesses. Social media, AISO, Google Business Profile & website rebuilds. Transparent pricing. New Tech Advertising, Mason City IA."
      />
      <MarketingNav />
      <HomePricing />
      <FeatureMatrix />
      <HomeFinalCta />
      <SiteFooter />
    </div>
  );
}