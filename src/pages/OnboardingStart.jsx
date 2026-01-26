import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function OnboardingStart() {
  const navigate = useNavigate();

  useEffect(() => {
    // Preserve UTM parameters
    const currentParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    for (const [key, value] of currentParams.entries()) {
      if (key.startsWith('utm_') || key === 'source' || key === 'campaign') {
        utmParams[key] = value;
      }
    }
    if (Object.keys(utmParams).length > 0) {
      sessionStorage.setItem('onboarding_utm', JSON.stringify(utmParams));
    }
  }, []);

  const handleGetStarted = async () => {
    try {
      const isAuthenticated = await base44.auth.isAuthenticated();
      
      if (!isAuthenticated) {
        // Not logged in - redirect to login, then to dashboard
        base44.auth.redirectToLogin(createPageUrl('Dashboard'));
        return;
      }

      // Already logged in - go to dashboard
      navigate(createPageUrl('Dashboard'));
    } catch (error) {
      console.error('[OnboardingStart] Error:', error);
      // On error, still try to redirect to login
      base44.auth.redirectToLogin(createPageUrl('Dashboard'));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onCTAClick={() => {}} />

      <section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Let's Build Your Marketing Strategy
          </h1>
          <p className="text-xl text-slate-600 mb-12">
            Answer a few questions and we'll recommend the perfect solution for your business
          </p>

          <Card className="p-8 bg-white shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">What You'll Get:</h2>
            
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Personalized Recommendations</h3>
                  <p className="text-sm text-slate-600">Solutions tailored to your industry and goals</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Clear Next Steps</h3>
                  <p className="text-sm text-slate-600">Know exactly what to do to grow your business</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Expert Guidance</h3>
                  <p className="text-sm text-slate-600">Get matched with the right tools and services</p>
                </div>
              </div>
            </div>
          </Card>

          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6 h-auto"
          >
            Get Started - It's Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <p className="text-sm text-slate-500 mt-4">
            Takes less than 2 minutes • No credit card required
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}