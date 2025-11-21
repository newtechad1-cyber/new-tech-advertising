import React, { useState } from 'react';
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
  );
}