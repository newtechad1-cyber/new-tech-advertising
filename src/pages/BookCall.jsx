import React, { useEffect, useState } from 'react';
import SiteHeader from '@/components/landing/Header';
import SiteFooter from '@/components/marketing/SiteFooter';
import BCHero from '@/components/book-call/BCHero';
import BCTrustBar from '@/components/book-call/BCTrustBar';
import BCWhatWeCover from '@/components/book-call/BCWhatWeCover';
import BCWhyChooseNTA from '@/components/book-call/BCWhyChooseNTA';
import BCFounderVideo from '@/components/book-call/BCFounderVideo';
import BCFAQ from '@/components/book-call/BCFAQ';
import BCBookingSection from '@/components/book-call/BCBookingSection';
import SEOHead from '@/components/shared/SEOHead';
import { CheckCircle2 } from 'lucide-react';

export default function BookCall() {
  const [handoff, setHandoff] = useState(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('nta_growth_conversation_handoff');
      if (saved) setHandoff(JSON.parse(saved));
    } catch (error) {
      console.warn('Growth Conversation handoff could not be loaded:', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Book a Free Growth Conversation | New Tech Advertising"
        description="Choose a time to talk with NTA about your business goals, growth foundation, customer journey, practical AI, and the right next step. No pressure and no predetermined package."
      />
      <SiteHeader onCTAClick={() => {}} />
      <main className="pt-20">
        {handoff && (
          <section className="bg-emerald-50 border-b border-emerald-100 px-6 py-5">
            <div className="max-w-5xl mx-auto flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-950">Your Growth Conversation has been saved.</p>
                <p className="text-emerald-800 text-sm mt-1">
                  NTA has your contact information, answers, and recommended starting stage: <strong>{handoff.recommendation}</strong>. Choose a time below and you will not need to start over.
                </p>
              </div>
            </div>
          </section>
        )}
        <BCHero />
        <BCTrustBar />
        <BCWhatWeCover />
        <BCWhyChooseNTA />
        <BCFounderVideo />
        <BCFAQ />
        <BCBookingSection />
      </main>
      <SiteFooter />
    </div>
  );
}
