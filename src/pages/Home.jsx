import React, { useEffect } from 'react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import NTAGrowthGuideBot from '../components/nta-guide/NTAGrowthGuideBot';
import HeroSplit from '../components/home-v3/HeroSplit';
import WhatIMean from '../components/home-v3/WhatIMean';
import NTAGrowthSystem from '../components/home-v3/NTAGrowthSystem';
import IndustrySplit from '../components/home-v3/IndustrySplit';
import HowItWorks from '../components/home-v3/HowItWorks';
import WhoThisWorksFor from '../components/home-v3/WhoThisWorksFor';
import TestimonialsSection from '../components/home-v3/TestimonialsSection.jsx';
import GapAuditCenteredCTA from '../components/home-v3/GapAuditCenteredCTA';
import InternetChangedSection from '../components/home-v3/InternetChangedSection';
import WhatWeFoundSection from '../components/home-v3/WhatWeFoundSection';
import GrowthSystemSection from '../components/home-v3/GrowthSystemSection';
import EducationCardsSection from '../components/home-v3/EducationCardsSection';
import NTAVideoMessage from '../components/home-v3/NTAVideoMessage';
import SEOHead from '../components/shared/SEOHead';

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <SEOHead />
      <MarketingNav />
      <HeroSplit />
      <InternetChangedSection />
      <WhatWeFoundSection />
      <GrowthSystemSection />
      <EducationCardsSection />
      <WhatIMean />
      <NTAVideoMessage />
      <NTAGrowthSystem />
      <IndustrySplit />
      <HowItWorks />
      <WhoThisWorksFor />
      <TestimonialsSection />
      <GapAuditCenteredCTA />
      <SiteFooter />
      <NTAGrowthGuideBot />
    </div>
  );
}