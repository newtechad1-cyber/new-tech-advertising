import React, { useState, useEffect } from 'react';
import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import ProblemSection from '../components/landing/ProblemSection';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import AdaComplianceSection from '../components/landing/AdaComplianceSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import PricingSection from '../components/landing/PricingSection';
import GuaranteeSection from '../components/landing/GuaranteeSection';
import FAQSection from '../components/landing/FAQSection';
import FinalCTA from '../components/landing/FinalCTA';
import SignupModal from '../components/landing/SignupModal';
import Footer from '../components/landing/Footer';
import Chatbot from '../components/Chatbot';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'New Tech Advertising | AI-Powered Marketing for Mason City, Iowa & Minnesota Businesses';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'AI-powered marketing solutions for local businesses in Mason City, IA and Minnesota. Website design, SEO, video marketing, and social media management. $297/month, no contracts.');
    }
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'AI marketing Mason City, Iowa marketing agency, Minnesota digital marketing, AI website design, local SEO Iowa, social media management Minnesota');
    }
  }, []);

  const handleCTAClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white">
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "New Tech Advertising",
            "description": "AI-Powered Marketing Solutions for Iowa and Minnesota Businesses",
            "url": "https://newtechadvertising.com",
            "telephone": "641-420-8816",
            "email": "rick@newtechadvertising.com",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Mason City",
              "addressRegion": "IA",
              "addressCountry": "US"
            },
            "areaServed": ["Iowa", "Minnesota", "Mason City", "Clear Lake", "Rochester", "Des Moines", "Minneapolis"],
            "priceRange": "$$",
            "paymentAccepted": "Credit Card, Cash",
            "openingHours": "Mo-Fr 09:00-17:00"
          })}
        </script>
        <Header onCTAClick={handleCTAClick} />
        <main>
          <HeroSection onCTAClick={handleCTAClick} />
          <ProblemSection />
          <FeaturesGrid />
          <AdaComplianceSection />
          <TestimonialsSection />
          <PricingSection onCTAClick={handleCTAClick} />
          <GuaranteeSection />
          <FAQSection />
          <FinalCTA onCTAClick={handleCTAClick} />
        </main>
        <Footer />
        <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <Chatbot />
      </div>
  );
}