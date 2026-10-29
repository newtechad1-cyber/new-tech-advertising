import { useEffect } from 'react';
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