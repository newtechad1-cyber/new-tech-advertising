import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import BCHero from '@/components/book-call/BCHero';
import BCTrustBar from '@/components/book-call/BCTrustBar';
import BCWhatWeCover from '@/components/book-call/BCWhatWeCover';
import BCWhyChooseNTA from '@/components/book-call/BCWhyChooseNTA';
import BCFAQ from '@/components/book-call/BCFAQ';
import BCBookingSection from '@/components/book-call/BCBookingSection';
import SEOHead from '@/components/shared/SEOHead';
import { CheckCircle2 } from 'lucide-react';
import { trackJourneyEvent } from '@/lib/journeyAnalytics';

export default function BookCall() {
  const [handoff, setHandoff] = useState(null);

  useEffect(() => {
    let savedHandoff = null;
    try {
      const saved = sessionStorage.getItem('nta_growth_conversation_handoff');
      if (saved) {
        savedHandoff = JSON.parse(saved);
        setHandoff(savedHandoff);
      }
    } catch (error) {
      console.warn('Growth Conversation handoff could not be loaded:', error);
    }

    trackJourneyEvent('booking_page_viewed', {
      route: '/book-call',
      step: savedHandoff ? 'after_growth_conversation' : 'direct_booking',
      source: new URLSearchParams(globalThis.location?.search || '').get('source') || 'unknown',
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Book a Free Growth Conversation | New Tech Advertising"
        description="Book a free Growth Conversation with Rick Hesse. Start with your business goals and agree on practical work, setup, ongoing support, and pricing together."
      />
      <MarketingNav />
      <main>
        {handoff && (
          <section className="bg-emerald-50 border-b border-emerald-100 px-6 py-5">
            <div className="max-w-5xl mx-auto flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-950">Your Growth Conversation has been saved.</p>
                <p className="text-emerald-800 text-sm mt-1">
                  NTA has the information you shared. We will review your goals together and agree on a useful next step. Choose a time below, or continue through Talk to My Office™ by call, text, email, or a conversation on the site.
                </p>
              </div>
            </div>
          </section>
        )}
        <BCHero />
        <BCTrustBar />
        <section className="border-b border-slate-200 bg-white px-6 py-16" aria-labelledby="booking-pricing-heading">
          <div className="mx-auto max-w-5xl">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-700">How we decide the work and price</p>
              <h2 id="booking-pricing-heading" className="mt-3 text-3xl font-bold text-slate-900">Start with your business. Shape the work together.</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">The first Growth Conversation is free. Tell Rick what you want to improve, what is already working, and what would make the work worthwhile for you.</p>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                ['Understand the business', 'Start with your goals, the people doing the work, and what is getting in the way.'],
                ['Choose the first priority', 'Identify a practical starting point that fits your needs, budget, and available time.'],
                ['Agree on the work and price', 'Review a written recommendation explaining the scope, any one-time setup, ongoing support, and cost before paid work begins.'],
              ].map(([title, text], index) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <span className="text-sm font-bold text-blue-700">0{index + 1}</span>
                  <h3 className="mt-3 text-xl font-bold text-slate-900">{title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{text}</p>
                </article>
              ))}
            </div>
            <p className="mt-7 leading-relaxed text-slate-600">For a sense of the investment, <Link to="/find-your-plan" className="rounded font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">see NTA’s current working price ranges</Link>. Your recommendation is shaped around the work your business needs.</p>
          </div>
        </section>
        <BCWhatWeCover />
        <BCWhyChooseNTA />
        <BCFAQ />
        <BCBookingSection />
      </main>
      <SiteFooter />
    </div>
  );
}
