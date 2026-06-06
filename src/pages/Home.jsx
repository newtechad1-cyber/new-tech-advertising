import React, { useEffect } from 'react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import HeroSplit from '../components/home-v3/HeroSplit';
import NewToAISection from '../components/home-v3/NewToAISection';
import ThreeWaysWeHelp from '../components/home-v3/ThreeWaysWeHelp';
import TwoWaysWeGrow from '../components/home-v3/TwoWaysWeGrow';
import WhatIMean from '../components/home-v3/WhatIMean';
import NTAGrowthSystem from '../components/home-v3/NTAGrowthSystem';
import IndustrySplit from '../components/home-v3/IndustrySplit';
import HowItWorks from '../components/home-v3/HowItWorks';
import WhoThisWorksFor from '../components/home-v3/WhoThisWorksFor';
import CombinedReviewsSection from '../components/home-v3/CombinedReviewsSection';
import GapAuditCenteredCTA from '../components/home-v3/GapAuditCenteredCTA';
import InternetChangedSection from '../components/home-v3/InternetChangedSection';
import WhatWeFoundSection from '../components/home-v3/WhatWeFoundSection';
import GrowthSystemSection from '../components/home-v3/GrowthSystemSection';
import EducationCardsSection from '../components/home-v3/EducationCardsSection';
import HomeYoutubeSection from '../components/home-v3/HomeYoutubeSection';
import NTAVideoMessage from '../components/home-v3/NTAVideoMessage';
import SEOHead from '../components/shared/SEOHead';
import VoiceSearchQA from '../components/home-v3/VoiceSearchQA';

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <SEOHead 
        title="AI Marketing Agency Mason City Iowa | New Tech Advertising"
        description="AI-powered marketing agency in Mason City, Iowa. AI search optimization, Google Business Profile management, social media & local SEO for small businesses. Call for a free audit."
      />
      <MarketingNav />
      <HeroSplit />
      <NewToAISection />
      <ThreeWaysWeHelp />
      <TwoWaysWeGrow />
      <InternetChangedSection />
      <WhatWeFoundSection />
      <GrowthSystemSection />
      <HomeYoutubeSection />
      <EducationCardsSection />
      <WhatIMean />
      <NTAVideoMessage />
      <NTAGrowthSystem />
      <IndustrySplit />
      <HowItWorks />
      <WhoThisWorksFor />
      <CombinedReviewsSection />
      <VoiceSearchQA />
      <GapAuditCenteredCTA />
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is AI Search Optimization (AISO)?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "AI Search Optimization is the process of making your business visible and recommended by AI search engines like ChatGPT, Google AI Overviews, and Perplexity. Unlike traditional SEO which focuses on Google rankings, AISO focuses on the signals AI uses to recommend businesses — including reviews, structured data, certifications, and consistent business information across the web."
              }
            },
            {
              "@type": "Question",
              "name": "How much does AI marketing cost for a small business?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "New Tech Advertising offers AI marketing packages starting at affordable rates for small businesses. We believe every main street business deserves access to modern marketing technology. Contact us at 641-420-8816 for a free consultation and custom quote based on your needs."
              }
            },
            {
              "@type": "Question",
              "name": "What is an AI Gap Audit?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our free AI Gap Audit analyzes how AI search engines currently see your business. We check your visibility on ChatGPT, Google AI, and Perplexity, review your website structure, schema markup, business listings, and online reviews, then provide a prioritized action plan showing exactly what to fix first for maximum AI visibility."
              }
            },
            {
              "@type": "Question",
              "name": "Does New Tech Advertising serve businesses outside Iowa?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! While we're based in Mason City, Iowa and primarily serve businesses across Iowa and southern Minnesota, our AI marketing services can help any local business in the United States get found by AI search engines."
              }
            },
            {
              "@type": "Question",
              "name": "What types of businesses does NTA work with?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We specialize in helping local service businesses including HVAC contractors, plumbers, restaurants, retail stores, and other small businesses. Our founder Rick Hesse has decades of experience in advertising and understands the unique challenges main street businesses face with marketing"
              }
            }
          ]
        })
      }} />
    </div>
  );
}