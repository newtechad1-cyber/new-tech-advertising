import React from 'react';
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
// Note: All components within /book-call use openSchedulingCalendar()
// to open Google Calendar directly

export default function BookCall() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Book a Discovery Call | New Tech Advertising"
        description="Schedule a free discovery call with New Tech Advertising. Learn how AI-powered marketing can grow your local business in Mason City, Iowa and beyond."
      />
      <SiteHeader onCTAClick={() => {}} />
      <main className="pt-20">
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