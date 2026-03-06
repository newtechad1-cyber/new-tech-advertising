import React from 'react';
import SiteHeader from '@/components/marketing/SiteHeader';
import SiteFooter from '@/components/marketing/SiteFooter';
import PlatformHero from '@/components/platform/PlatformHero';
import PlatformProblem from '@/components/platform/PlatformProblem';
import PlatformOverview from '@/components/platform/PlatformOverview';
import PlatformFeatures from '@/components/platform/PlatformFeatures';
import PlatformPricing from '@/components/platform/PlatformPricing';
import PlatformHowItWorks from '@/components/platform/PlatformHowItWorks';
import PlatformScreenshots from '@/components/platform/PlatformScreenshots';
import PlatformFinalCta from '@/components/platform/PlatformFinalCta';

export default function AiMarketingPlatform() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <PlatformHero />
      <PlatformProblem />
      <PlatformOverview />
      <PlatformFeatures />
      <PlatformPricing />
      <PlatformHowItWorks />
      <PlatformScreenshots />
      <PlatformFinalCta />
      <SiteFooter />
    </div>
  );
}