import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import ProblemSection from '../components/landing/ProblemSection';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import PricingSection from '../components/landing/PricingSection';
import GuaranteeSection from '../components/landing/GuaranteeSection';
import FAQSection from '../components/landing/FAQSection';
import FinalCTA from '../components/landing/FinalCTA';
import SignupModal from '../components/landing/SignupModal';
import Footer from '../components/landing/Footer';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCTAClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>AI Marketing for Local Businesses | New Tech Advertising</title>
        <meta name="description" content="Smart local business owners are using AI to finally get results from their ads. Complete marketing solution with website design, local SEO, content creation, and video production for $297/month. No contracts, cancel anytime." />
        <meta name="keywords" content="AI marketing, local business marketing, small business advertising, local SEO, website design, AI content creation, video marketing, digital marketing for small business" />
        
        {/* Open Graph */}
        <meta property="og:title" content="AI Marketing for Local Businesses | New Tech Advertising" />
        <meta property="og:description" content="How Smart Local Business Owners Are Using AI to Finally Get Results From Their Ads Without Wasting Another Dollar" />
        <meta property="og:type" content="website" />
        
        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "New Tech Advertising",
            "description": "AI-powered marketing solutions for local businesses",
            "telephone": "641-420-8816",
            "email": "rick@newtechadvertising.com",
            "priceRange": "$297",
            "areaServed": "United States",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Marketing Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "AI-Powered Marketing Solution",
                    "description": "Complete marketing setup including website design, local SEO, content creation, and video production"
                  },
                  "price": "297",
                  "priceCurrency": "USD"
                }
              ]
            }
          })}
        </script>
      </Helmet>
      
      <div className="bg-white">
        <Header onCTAClick={handleCTAClick} />
        <main>
          <HeroSection onCTAClick={handleCTAClick} />
          <ProblemSection />
          <FeaturesGrid />
          <TestimonialsSection />
          <PricingSection onCTAClick={handleCTAClick} />
          <GuaranteeSection />
          <FAQSection />
          <FinalCTA onCTAClick={handleCTAClick} />
        </main>
        <Footer />
        <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </>
  );
}