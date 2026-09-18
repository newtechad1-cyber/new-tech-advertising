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
import FAQSection from '../components/home-conversion/FAQSection';
import { trackJourneyEvent } from '@/lib/journeyAnalytics';

const HOMEPAGE_FAQS = [
  {
    question: 'What is New Tech Advertising now?',
    answer: 'New Tech Advertising is a practical business-growth guide for small-business owners. Begin with a question, use free teaching or Your Digital Growth Guide™ when it helps, and talk to NTA when a human conversation would be useful.',
  },
  {
    question: 'What happens when I work with NTA?',
    answer: 'NTA starts by understanding your business, your goals, and what is getting in the way. With the owner’s permission, that includes learning from the employees who know the customers and everyday work. We help the owner teach the team to use AI, capture what people know, connect the right systems, and improve the work over time. Scope, price, and the next step are explained before paid work begins.',
  },
  {
    question: 'What is Free AI Education?',
    answer: 'Free AI Education is NTA’s public teaching experience for business owners who want to understand AI without hype or technical language. Its free courses and lessons are available to explore; tools, implementation, and ongoing services are explained separately when they become useful.',
  },
  {
    question: 'Who is the Free AI Guy?',
    answer: 'The Free AI Guy remains part of NTA’s free education experience. The public experience now begins with your business question, so you do not have to understand the branded teaching system before you get a useful answer.',
  },
  {
    question: 'What is the NTA Growth Conversation?',
    answer: 'The NTA Growth Conversation is a free guided starting point that helps identify your goals, present situation, and most useful next step. Your answers can be saved directly to NTA’s contact and opportunity system before you book a time to talk.',
  },
  {
    question: 'What is Talk to My Office™?',
    answer: 'Talk to My Office™ is the flexible human conversation path when you want NTA’s help with a business question. Call, text, email, or start a conversation—whichever is easiest for you. We begin by understanding the business, clarify the next useful step, and explain any implementation, scope, or price before paid work begins.',
  },
  {
    question: 'What is the free Business Gap Audit?',
    answer: 'The free Business Gap Audit is a first-pass assessment that identifies visible gaps, immediate priorities, and practical next steps. A deeper paid diagnostic is offered only when more evidence and a detailed Growth Roadmap would help.',
  },
  {
    question: 'How does New Tech Advertising help a local business grow?',
    answer: 'NTA helps owners strengthen their foundation, improve visibility and trust, organize customer follow-up, and connect practical AI with useful business systems. A core part of that work is capturing the knowledge already living across the team—employees, customers, and everyday conversations—so the business can remember, organize, and use it. People continue making the decisions; AI helps with remembering, transcribing, identifying patterns, and preparing summaries.',
  },
  {
    question: 'Does New Tech Advertising serve businesses outside Iowa?',
    answer: 'Yes. NTA is based in Mason City, Iowa and can work with local businesses and organizations elsewhere in the United States.',
  },
  {
    question: 'What types of businesses does NTA work with?',
    answer: 'NTA primarily helps local service businesses, restaurants, retailers, contractors, and other small businesses that need clearer marketing, stronger customer relationships, better follow-up, and practical growth systems.',
  },
];

export default function Home() {
  useEffect(() => {
    trackJourneyEvent('page_view', { route: '/', step: 'homepage' });
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen">
      <SEOHead
        title="Small-Business Questions About AI, Marketing, Websites & Growth | NTA"
        description="Plain-English answers for small-business owners who want to improve customers, time, websites, follow-up, AI understanding, or the next business decision."
        faqs={HOMEPAGE_FAQS}
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