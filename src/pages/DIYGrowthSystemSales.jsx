import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DIYHero from '@/components/diy/DIYHero';
import DIYPainPoints from '@/components/diy/DIYPainPoints';
import DIYHowItWorks from '@/components/diy/DIYHowItWorks';
import DIY30DayOutcomes from '@/components/diy/DIY30DayOutcomes';
import DIYOutcomeStack from '@/components/diy/DIYOutcomeStack';
import DIYIncluded from '@/components/diy/DIYIncluded';
import DIYUpgradePath from '@/components/diy/DIYUpgradePath';
import DIYRiskRemoval from '@/components/diy/DIYRiskRemoval';
import DIYComparisonAdvanced from '@/components/diy/DIYComparisonAdvanced';
import DIYPricing from '@/components/diy/DIYPricing';
import DIYTestimonials from '@/components/diy/DIYTestimonials';
import DIYCTAFAQ from '@/components/diy/DIYCTAFAQ';
import DIYFinalClose from '@/components/diy/DIYFinalClose';
import DIYCheckoutModal from '@/components/diy/DIYCheckoutModal';
import SiteFooter from '@/components/marketing/SiteFooter';
import { base44 } from '@/api/base44Client';

export default function DIYGrowthSystemSales() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('plan') === 'diy_suite') return 'diy_suite';
    }
    return 'diy_social';
  });

  const handleStartDIYPlan = (plan = 'diy_social') => {
    setSelectedPlan(plan);
    setShowCheckoutModal(true);
  };

  const handleProceedToCheckout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await base44.functions.invoke('createDIYCheckout', { plan: selectedPlan });
      if (response.data?.stripe_url) {
        window.location.href = response.data.stripe_url;
      } else {
        setError('Failed to initiate checkout. Please try again.');
        setShowCheckoutModal(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Checkout error:', err);
      setShowCheckoutModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 py-4 px-6 sticky top-0 z-50 bg-slate-950/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-xl font-bold text-white">NTA DIY</div>
          <div className="flex items-center gap-3">
            <a href="/nta/pricing-ladder" className="text-slate-400 hover:text-white text-sm transition-colors">
              See All Plans
            </a>
            <a href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
              Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <DIYHero onCTA={handleStartDIYPlan} isLoading={isLoading} />

      {/* Pain Points */}
      <DIYPainPoints />

      {/* How It Works */}
      <DIYHowItWorks />

      {/* 30-Day Outcomes */}
      <DIY30DayOutcomes />

      {/* Outcome-Based Value Stack */}
      <DIYOutcomeStack />

      {/* What's Included */}
      <DIYIncluded />

      {/* Upgrade Path */}
      <DIYUpgradePath />

      {/* Risk Removal */}
      <DIYRiskRemoval />

      {/* Advanced Comparison */}
      <DIYComparisonAdvanced />

      {/* Pricing */}
      <DIYPricing onCTA={handleStartDIYPlan} isLoading={isLoading} />

      {/* Testimonials */}
      <DIYTestimonials />

      {/* FAQ Section */}
      <DIYCTAFAQ />

      {/* Final Close */}
      <DIYFinalClose onCTA={handleStartDIYPlan} isLoading={isLoading} />

      {/* Checkout Modal */}
      <DIYCheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onProceed={handleProceedToCheckout}
        isLoading={isLoading}
        selectedPlan={selectedPlan}
      />

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg">
          {error}
        </div>
      )}

      <SiteFooter />
    </div>
  );
}