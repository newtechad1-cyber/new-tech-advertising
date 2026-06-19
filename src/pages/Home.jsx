import React, { useEffect } from 'react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import SEOHead from '../components/shared/SEOHead';
import HeroSection from '../components/home-conversion/HeroSection';
import ProblemSection from '../components/home-conversion/ProblemSection';
import SolutionSection from '../components/home-conversion/SolutionSection';
import PathSection from '../components/home-conversion/PathSection';
import FounderSection from '../components/home-conversion/FounderSection';
import CombinedReviewsSection from '../components/home-v3/CombinedReviewsSection';
import FAQSection from '../components/home-conversion/FAQSection';

export default function Home() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <SEOHead 
        title="AI Marketing Agency Mason City Iowa | New Tech Advertising"
        description="AI-powered marketing agency in Mason City, Iowa. AI search optimization, Google Business Profile management, social media & local SEO for small businesses. Call for a free audit."
      />
      <MarketingNav />
      
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <PathSection />
        <FounderSection />
        <CombinedReviewsSection />
        <FAQSection />
      </main>

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