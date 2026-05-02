import React, { useEffect } from 'react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import NTAGrowthGuideBot from '../components/nta-guide/NTAGrowthGuideBot';
import HeroSplit from '../components/home-v3/HeroSplit';
import WhatIHelpWith from '../components/home-v3/WhatIHelpWith';
import HowItWorks from '../components/home-v3/HowItWorks';
import GapAuditCenteredCTA from '../components/home-v3/GapAuditCenteredCTA';

export default function Home() {
  useEffect(() => {
    document.title = 'NTA | Local Lead Systems for Service Businesses in North Iowa';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'NTA builds complete lead systems for local service businesses in North Iowa — HVAC, plumbing, excavating, lawn care, and more. Website rebuilds, SEO pages, seasonal campaigns, AI video, and follow-up systems.');

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
      <WhatIHelpWith />
      <HowItWorks />
      <GapAuditCenteredCTA />
      <SiteFooter />
      <NTAGrowthGuideBot />
    </div>
  );
}