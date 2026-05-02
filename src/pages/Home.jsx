import React, { useEffect } from 'react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import NTAGrowthGuideBot from '../components/nta-guide/NTAGrowthGuideBot';
import HomeHeroV2 from '../components/home-v2/HomeHeroV2';
import HomeLeadSystem from '../components/home-v2/HomeLeadSystem';
import HomeWhoWeServe from '../components/home-v2/HomeWhoWeServe';
import HomeClientExamples from '../components/home-v2/HomeClientExamples';
import HomeGapAuditCTA from '../components/home-v2/HomeGapAuditCTA';
import HomeFAQ from '../components/home-v2/HomeFAQ';
import HomeFinalCTAV2 from '../components/home-v2/HomeFinalCTAV2';

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

    // Schema markup
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
      <HomeHeroV2 />
      <HomeLeadSystem />
      <HomeWhoWeServe />
      <HomeClientExamples />
      <HomeGapAuditCTA />
      <HomeFAQ />
      <HomeFinalCTAV2 />
      <SiteFooter />
      <NTAGrowthGuideBot />
    </div>
  );
}