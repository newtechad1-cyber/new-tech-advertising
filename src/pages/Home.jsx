import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import HeroSection from '../components/home-conversion/HeroSection';
import BuildTeamSection from '../components/home-v3/BuildTeamSection';
import ConnectBusinessSection from '../components/home-v3/ConnectBusinessSection';
import CustomerExperienceSection from '../components/home-v3/CustomerExperienceSection';
import SeeWhatToWorkOnSection from '../components/home-v3/SeeWhatToWorkOnSection';
import PublicationsSection from '../components/home-v3/PublicationsSection';
import CombinedReviewsSection from '../components/home-v3/CombinedReviewsSection';
import FAQSection, { HOMEPAGE_FAQS } from '../components/home-conversion/FAQSection';
import { trackJourneyEvent } from '@/lib/journeyAnalytics';

export default function Home() {
  useEffect(() => {
    trackJourneyEvent('page_view', { route: '/', step: 'homepage' });
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen">
      <SEOHead
        title="Practical AI for Small Business | Digital Growth Office | NTA"
        description="New Tech Advertising helps small-business owners understand practical AI, preserve business knowledge, improve visibility and follow-up, and connect useful work through a Digital Growth Office."
        faqs={HOMEPAGE_FAQS}
        learningData={{
          name: 'Practical AI and Digital Growth for Small Business',
          description: 'A public starting point for small-business owners who want to understand AI, identify what their business needs, and connect useful digital growth work without unnecessary complexity.',
          educationalLevel: 'Beginner',
          learningResourceType: 'Business education hub'
        }}
      />
      <MarketingNav />

      <main>
        <HeroSection />
        <BuildTeamSection />
        <ConnectBusinessSection />
        <section className="border-y border-slate-800 bg-slate-900/70 py-16">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[1.4fr_0.6fr] md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">AI Search Visibility</p>
              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">Can people find your business when they ask AI?</h2>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">Search is changing. NTA helps businesses become easier for Google and AI answer systems to understand by connecting clear business facts, useful answers, trustworthy evidence, crawler-ready pages, and ongoing measurement.</p>
            </div>
            <div className="md:text-right">
              <Link to="/ai-seo" className="inline-flex rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-500">Learn about AI Search Visibility</Link>
            </div>
          </div>
        </section>
        <CustomerExperienceSection />
        <SeeWhatToWorkOnSection />
        <PublicationsSection />
        <CombinedReviewsSection />
        <FAQSection />
      </main>

      <SiteFooter />
    </div>
  );
}