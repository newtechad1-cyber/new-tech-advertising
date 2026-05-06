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
import GapAuditCenteredCTA from '../components/home-v3/GapAuditCenteredCTA';

export default function Home() {
  useEffect(() => {
    document.title = 'NTA AI Growth System | More Leads, Customers & Repeat Business for Local Businesses';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'NTA AI Growth System helps local service businesses and brands generate more leads, customers, and repeat business through better visibility, content, advertising, and follow-up. Serving North Iowa and Southern Minnesota.');

    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "New Tech Advertising",
      "description": "Local lead generation systems for service businesses in North Iowa and Southern Minnesota.",
      "url": "https://newtechadvertising.com",
      "telephone": "+16413579932",
      "areaServed": ["Mason City IA", "North Iowa", "Southern Minnesota"],
      "serviceType": ["Website Rebuilds", "SEO", "Social Media Marketing", "Video Marketing", "Lead Generation"],
    };
    let schemaTag = document.getElementById('nta-schema');
    if (!schemaTag) {
      schemaTag = document.createElement('script');
      schemaTag.id = 'nta-schema';
      schemaTag.type = 'application/ld+json';
      document.head.appendChild(schemaTag);
    }
    schemaTag.textContent = JSON.stringify(schema);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <MarketingNav />
      <HeroSplit />
      <WhatIMean />
      <NTAGrowthSystem />
      <IndustrySplit />
      <HowItWorks />
      <WhoThisWorksFor />
      <GapAuditCenteredCTA />
      <SiteFooter />
      <NTAGrowthGuideBot />
    </div>
  );
}