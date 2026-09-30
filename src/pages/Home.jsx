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
    answer: 'New Tech Advertising helps small businesses advertise better by starting with the customer rather than an advertising product. NTA helps owners understand who they need to reach, what matters to those customers, where to reach them, and how websites, search, social, video, content, AI, follow-up, and other channels can work together as one connected growth system.',
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
    answer: 'NTA starts with how your business works and what your customers need. We connect advertising, the customer experience, team knowledge, and everyday operations; agree on a practical improvement; help put it to work; and review what is helping. That can mean easier shopping, a better dining experience, useful follow-up, or less repeated work. AI supports specific tasks while people make the decisions.',
  },
  {
    question: 'Does New Tech Advertising serve businesses outside Iowa?',
    answer: 'Yes. NTA is based in Mason City, Iowa and can work with local businesses and organizations elsewhere in the United States.',
  },
  {
    question: 'What types of businesses does NTA work with?',
    answer: 'NTA works with small retailers, including specialty and variety shops, ecommerce businesses, restaurants, contractors, and other service businesses. We adapt to how your customers shop, dine, order, ask for help, and return. A store visit, a meal, an online purchase, and a service inquiry are different paths—not one lead-generation formula.',
  },
];

export default function Home() {
  useEffect(() => {
    trackJourneyEvent('page_view', { route: '/', step: 'homepage' });
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen">
      <SEOHead
        title="Advertise Better | Small Business Advertising Strategy | NTA"
        description="Connect advertising, customer experience, and everyday work. Practical growth help for small shops, online stores, restaurants, and service businesses."
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