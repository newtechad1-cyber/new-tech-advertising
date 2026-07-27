import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CalendarDays, ClipboardCheck, Compass, FolderKanban, Globe, GraduationCap, Hammer, MessageCircle, Users } from 'lucide-react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import SEOHead from '../components/shared/SEOHead';
import HeroSection from '../components/home-conversion/HeroSection';
import ProblemSection from '../components/home-conversion/ProblemSection';
import SolutionSection from '../components/home-conversion/SolutionSection';
import FounderSection from '../components/home-conversion/FounderSection';
import CombinedReviewsSection from '../components/home-v3/CombinedReviewsSection';
import PublicationsSection from '../components/home-v3/PublicationsSection';
import FAQSection from '../components/home-conversion/FAQSection';
import { trackJourneyEvent } from '@/lib/journeyAnalytics';

const HOMEPAGE_FAQS = [
  {
    question: 'What is the NTA Growth Conversation?',
    answer: 'The NTA Growth Conversation is a free guided starting point that helps identify your goals, present situation, and most useful next step. Your answers can be saved directly to NTA’s contact and opportunity system before you book a time to talk.',
  },
  {
    question: 'What is the free Business Gap Audit?',
    answer: 'The free Business Gap Audit is a first-pass assessment that identifies visible gaps, immediate priorities, and practical next steps. A deeper paid diagnostic is offered only when more evidence and a detailed Growth Roadmap would help.',
  },
  {
    question: 'How does New Tech Advertising help a local business grow?',
    answer: 'NTA helps local businesses strengthen their foundation, improve visibility and trust, organize customer follow-up, and connect practical AI and business systems into one useful growth approach.',
  },
  {
    question: 'Can NTA help me start a business or turn an idea into something real?',
    answer: 'Yes. NTA provides practical business education for aspiring entrepreneurs and first-time owners, including help clarifying the customer, problem, offer, growth foundation, and systems an idea needs before more money is spent on tools, marketing, or an app.',
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

const TRUST_STEPS = [
  {
    number: '1',
    title: 'Understand the Approach',
    text: 'See why NTA starts with the business system before recommending another tool or campaign.',
    label: 'Explore the NTA Point of View',
    to: '/point-of-view',
    step: 'point_of_view',
    icon: BookOpen,
  },
  {
    number: '2',
    title: 'Talk Through the Situation',
    text: 'Answer three practical questions and save the result so nothing is lost between steps.',
    label: 'Start the Growth Conversation',
    to: '/growth-conversation',
    step: 'growth_conversation',
    icon: MessageCircle,
  },
  {
    number: '3',
    title: 'Find the Visible Gaps',
    text: 'Use the free first-pass audit when you want a more direct review of priorities and weaknesses.',
    label: 'Take the Free Gap Audit',
    to: '/free-audit',
    step: 'gap_audit',
    icon: ClipboardCheck,
  },
  {
    number: '4',
    title: 'Choose the Next Step',
    text: 'Schedule a no-pressure conversation after you have enough context to make the time useful.',
    label: 'Book a Conversation',
    to: '/book-call',
    step: 'book_call',
    icon: CalendarDays,
  },
];

export default function Home() {
  useEffect(() => {
    trackJourneyEvent('page_view', { route: '/', step: 'homepage' });
  }, []);

  const trackStep = (step) => {
    trackJourneyEvent('trust_step_clicked', { route: '/', step, source: 'homepage_trust_ladder' });
  };

  return (
    <div className="bg-slate-950 min-h-screen">
      <SEOHead
        title="Practical Business Education, AI & Growth Systems | NTA"
        description="New Tech Advertising helps small-business owners and aspiring entrepreneurs understand how businesses grow, use AI practically, and build connected marketing, customer, and operating systems."
        faqs={HOMEPAGE_FAQS}
      />
      <MarketingNav />

      <main>
        <HeroSection />
        <ProblemSection />

        <section className="border-t border-slate-800/50 bg-slate-950 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-400">Education, guidance, and implementation</p>
              <h2 className="mb-5 text-3xl font-bold text-white md:text-5xl">Learn what works. Understand what comes next. Build the right system.</h2>
              <p className="text-lg leading-relaxed text-slate-300 md:text-xl">
                New Tech Advertising is a practical business education and growth company. We teach owners and aspiring entrepreneurs how business growth works, help them understand what their situation needs next, and build the right pieces in the right order.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <article className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400"><GraduationCap className="h-5 w-5" /></div>
                <h3 className="mb-3 text-xl font-bold text-white">Learn from real business experience</h3>
                <p className="mb-6 flex-1 leading-relaxed text-slate-400">Use the free books, Journal, and Knowledge Library to understand growth, trust, customer relationships, business systems, and practical AI before buying more tools.</p>
                <Link to="/knowledge" className="inline-flex items-center gap-2 font-semibold text-blue-400 hover:text-blue-300">Explore the Knowledge Library <ArrowRight className="h-4 w-4" /></Link>
              </article>

              <article className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400"><Compass className="h-5 w-5" /></div>
                <h3 className="mb-3 text-xl font-bold text-white">Find the right starting point</h3>
                <p className="mb-6 flex-1 leading-relaxed text-slate-400">Whether you are improving an existing company or trying to start a business, the Growth Guide helps turn scattered ideas into clearer priorities and a practical next step.</p>
                <Link to="/growth-guide" className="inline-flex items-center gap-2 font-semibold text-indigo-400 hover:text-indigo-300">Use the Growth Guide <ArrowRight className="h-4 w-4" /></Link>
              </article>

              <article className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400"><Hammer className="h-5 w-5" /></div>
                <h3 className="mb-3 text-xl font-bold text-white">Build what the business actually needs</h3>
                <p className="mb-6 flex-1 leading-relaxed text-slate-400">NTA can help plan and build the website, customer path, follow-up, knowledge, automation, or custom business system—without forcing every owner into the same package.</p>
                <Link to="/operating-system" className="inline-flex items-center gap-2 font-semibold text-purple-400 hover:text-purple-300">See how the system works <ArrowRight className="h-4 w-4" /></Link>
              </article>
            </div>

            <div className="mt-10 text-center">
              <Link to="/start-a-business" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-7 py-3 font-bold text-white transition-colors hover:bg-slate-800">
                Starting something new? Begin here <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-slate-950 border-t border-slate-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-blue-400 text-sm font-medium tracking-wide uppercase mb-5">
                The NTA Digital Growth Office™
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">Bring the important parts of your business into one practical system.</h2>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed">NTA connects the parts that influence growth so your website, customer relationships, business knowledge, everyday work, and practical AI support move in the same direction.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-7">
                <div className="w-11 h-11 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-5"><Globe className="w-5 h-5" /></div>
                <h3 className="text-xl font-bold text-white mb-3">Growth Foundation</h3>
                <p className="text-slate-400 leading-relaxed">Website, visibility, content, reviews, and the information customers need to choose your business confidently.</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-7">
                <div className="w-11 h-11 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-5"><Users className="w-5 h-5" /></div>
                <h3 className="text-xl font-bold text-white mb-3">Customer Relationships</h3>
                <p className="text-slate-400 leading-relaxed">Lead capture, customer information, communication, follow-up, referrals, and long-term relationship building.</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-7">
                <div className="w-11 h-11 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-5"><FolderKanban className="w-5 h-5" /></div>
                <h3 className="text-xl font-bold text-white mb-3">Connected Operations</h3>
                <p className="text-slate-400 leading-relaxed">Business knowledge, tasks, reporting, useful automation, and practical AI assistance built around how you work.</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg text-slate-300 font-medium mb-6">We build the right pieces in the right order—not another disconnected package.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link onClick={() => trackStep('growth_conversation_primary')} to="/growth-conversation" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                  Start a Growth Conversation <ArrowRight className="w-5 h-5" />
                </Link>
                <Link onClick={() => trackStep('gap_audit_primary')} to="/free-audit" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all border border-slate-700">
                  Take the Free Business Gap Audit <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <p className="text-sm text-slate-500 mt-4 max-w-2xl mx-auto">The free audit provides a useful first-pass assessment. A deeper paid diagnostic is available only when more evidence and a detailed roadmap would help.</p>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-slate-900/50 border-y border-slate-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">A Natural Path Forward</p>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">Build trust before making a big decision.</h2>
              <p className="text-lg text-slate-400 leading-relaxed">Start wherever you are comfortable. Each step gives you more clarity without forcing you into the next one.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {TRUST_STEPS.map(({ number, title, text, label, to, step, icon: Icon }) => (
                <div key={step} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center"><Icon className="w-5 h-5" /></div>
                    <span className="text-3xl font-black text-slate-800">{number}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-slate-400 leading-relaxed mb-6 flex-1">{text}</p>
                  <Link onClick={() => trackStep(step)} to={to} className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold">
                    {label} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SolutionSection />
        <FounderSection />
        <CombinedReviewsSection />
        
        <PublicationsSection />

        <section className="py-16 bg-slate-900/50 border-y border-slate-800/50">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">Want to understand the thinking behind NTA?</h2>
            <p className="text-lg text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">The NTA Point of View explains the business experience, principles, and practical approach behind the systems we build.</p>
            <Link onClick={() => trackStep('point_of_view_secondary')} to="/point-of-view" className="inline-flex items-center gap-2 px-7 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all border border-slate-700">
              Explore the NTA Point of View <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <FAQSection />
      </main>

      <SiteFooter />
    </div>
  );
}
