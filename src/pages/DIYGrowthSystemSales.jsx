import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, Users, Brain, Video, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DIYHero from '@/components/diy/DIYHero';
import DIYValueStack from '@/components/diy/DIYValueStack';
import DIYComparison from '@/components/diy/DIYComparison';
import DIYPricing from '@/components/diy/DIYPricing';
import DIYTestimonials from '@/components/diy/DIYTestimonials';
import SiteFooter from '@/components/marketing/SiteFooter';
import { base44 } from '@/api/base44Client';

export default function DIYGrowthSystemSales() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStartDIYPlan = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await base44.functions.invoke('createDIYCheckout', {});
      if (response.data?.stripe_url) {
        window.location.href = response.data.stripe_url;
      } else {
        setError('Failed to initiate checkout. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Checkout error:', err);
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
            <a href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
              Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <DIYHero onCTA={handleStartDIYPlan} isLoading={isLoading} />

      {/* Value Stack */}
      <DIYValueStack />

      {/* Comparison */}
      <DIYComparison />

      {/* Pricing */}
      <DIYPricing onCTA={handleStartDIYPlan} isLoading={isLoading} />

      {/* Testimonials Placeholder */}
      <DIYTestimonials />

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-violet-600 to-indigo-600 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Build Your AI Marketing System?
          </h2>
          <p className="text-lg text-violet-100 mb-8">
            Start with our DIY Growth System and scale when you're ready.
          </p>
          <Button
            onClick={handleStartDIYPlan}
            disabled={isLoading}
            className="bg-white text-violet-600 hover:bg-slate-100 text-lg px-8 py-6 rounded-lg font-semibold"
          >
            {isLoading ? 'Processing...' : 'Start DIY Plan - $99/month'}
            {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}