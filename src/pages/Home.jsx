import React, { useState } from 'react';
import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import ProblemSection from '../components/landing/ProblemSection';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import PricingSection from '../components/landing/PricingSection';
import GuaranteeSection from '../components/landing/GuaranteeSection';
import FAQSection from '../components/landing/FAQSection';
import FinalCTA from '../components/landing/FinalCTA';
import SignupModal from '../components/landing/SignupModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCTAClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onCTAClick={handleCTAClick} />
      <HeroSection onCTAClick={handleCTAClick} />
      <ProblemSection />
      <FeaturesGrid />
      <PricingSection onCTAClick={handleCTAClick} />
      <GuaranteeSection />
      <FAQSection />
      <FinalCTA onCTAClick={handleCTAClick} />
      <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}