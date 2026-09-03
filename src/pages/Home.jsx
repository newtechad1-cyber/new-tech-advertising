import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, ClipboardCheck, FolderKanban, Globe, MessageCircle, Users } from 'lucide-react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import SEOHead from '../components/shared/SEOHead';
import HeroSection from '../components/home-conversion/HeroSection';
import ProblemSection from '../components/home-conversion/ProblemSection';
import SolutionSection from '../components/home-conversion/SolutionSection';
import CombinedReviewsSection from '../components/home-v3/CombinedReviewsSection';
import PublicationsSection from '../components/home-v3/PublicationsSection';
import FAQSection from '../components/home-conversion/FAQSection';
import { trackJourneyEvent } from '@/lib/journeyAnalytics';

const HOMEPAGE_FAQS = [
  {
    question: 'What is New Tech Advertising now?',
    answer: 'New Tech Advertising is a practical AI education and business growth platform for small-business owners. Free AI Education is the public front door, the Free AI Guy is the friendly guide inside it, and Talk to My Office connects learning to practical business help when you want NTA involved.',
  },
  {
    question: 'What happens when I work with NTA?',
    answer: 'NTA starts by understanding your business, your goals, and what is getting in the way. With the owner’s permission, that includes learning from the employees who know the customers and everyday work. We help the owner teach the team to use AI, capture what people know, connect the right systems, and improve the work over time. Scope, price, and the next step are explained before paid work begins.',
  },
  {
    question: 'What is Free AI Education?',
    answer: 'Free AI Education is NTA’s public teaching experience for business owners who want to understand AI without hype or technical language. The lessons are free to access; tools, implementation, and ongoing services are explained separately when they become useful.',
  },
  {
    question: 'Who is the Free AI Guy?',
    answer: 'The Free AI Guy is the friendly teaching identity inside NTA’s free education experience. He helps you ask questions, talk through a business problem, and find a useful next step. NTA and Rick remain the real people and company behind the experience.',
  },
  {
    question: 'What is the NTA Growth Conversation?',
    answer: 'The NTA Growth Conversation is a free guided starting point that helps identify your goals, present situation, and most useful next step. Your answers can be saved directly to NTA’s contact and opportunity system before you book a time to talk.',
  },
  {
    question: 'What is Talk to My Office™?',
    answer: 'Talk to My Office is NTA’s voice-first approach to working with AI. Instead of learning complicated software, a business owner can speak naturally, type, or share a photo or file. The system helps understand the request, confirms what it heard, and organizes the next step before anything important happens.',
  },
  {
    question: 'What is the free Business Gap Audit?',
    answer: 'The free Business Gap Audit is a first-pass assessment that identifies visible gaps, immediate priorities, and practical next steps. A deeper paid diagnostic is offered only when more evidence and a detailed Growth Roadmap would help.',
  },
  {
    question: 'How does New Tech Advertising help a local business grow?',
    answer: 'NTA teaches owners how AI fits into the complete business, then helps them strengthen their foundation, improve visibility and trust, organize customer follow-up, and connect practical AI with useful business systems.',
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
    title: 'Start with Free AI Education',
    text: 'Learn what AI can actually do for a real business before deciding what you need.',
    label: 'Start a Free Lesson',
    to: '/knowledge/ai-foundations',
    step: 'free_ai_education',
    icon: BookOpen,
  },
  {
    number: '2',
    title: 'Meet the Free AI Guy',
    text: 'Ask a practical question or talk through a business problem in a natural conversation.',
    label: 'Ask the Free AI Guy',
    action: 'guide',
    step: 'free_ai_guy',
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
    title: 'Talk to My Office™',
    text: 'When you want NTA involved, move from learning into a useful human conversation about your business.',
    label: 'Talk to My Office™',
    action: 'guide',
    step: 'talk_to_my_office',
    icon: Users,
  },
];

export default function Home() {
  useEffect(() => {
    trackJourneyEvent('page_view', { route: '/', step: 'homepage' });
  }, []);

  const trackStep = (step) => {
    trackJourneyEvent('trust_step_clicked', { route: '/', step, source: 'homepage_trust_ladder' });
  };

  const openGrowthGuide = (step = 'talk_to_my_office_primary') => {
    trackStep(step);
    window.dispatchEvent(new CustomEvent('nta:open-growth-guide'));
  };

  return (
    <div className="bg-slate-950 min-h-screen">
      <SEOHead
        title="Practical AI Education and Digital Growth Systems | New Tech Advertising"
        description="Practical AI education and connected digital growth systems for small-business owners. Learn how NTA helps improve visibility, trust, customer relationships, follow-up, and everyday work."
        faqs={HOMEPAGE_FAQS}
      />
      <MarketingNav />

      <main>
        <HeroSection />
        <ProblemSection />

        <section className="border-y border-slate-800 bg-slate-950 px-6 py-14">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-7 rounded-3xl border border-slate-800 bg-slate-900/60 p-7 md:flex-row md:items-center md:p-9">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Free AI learning • United States</p>
              <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">Curious about AI? Learn it by helping business owners understand it.</h2>
              <p className="mt-3 leading-relaxed text-slate-300">NTA is building a network of curious people, trusted community connectors, and organizations. Start with free learning—not a course to buy or a sales script to memorize—and build useful relationships in the community or market you know.</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">Those relationships can create ongoing residual income under a clear written agreement while the clients involved remain active.</p>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto">
              <Link onClick={() => trackJourneyEvent('regional_account_manager_home_click', { route: '/', source: 'homepage_upper_third' })} to="/account-manager" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white transition-colors hover:bg-blue-500">
                Explore Account Manager <ArrowRight className="h-5 w-5" />
              </Link>
              <Link onClick={() => trackJourneyEvent('community_partner_home_click', { route: '/', source: 'homepage_upper_third' })} to="/community-partner" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-6 py-3.5 font-bold text-slate-100 transition-colors hover:border-cyan-300 hover:bg-slate-800">
                Explore Community Partners <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-slate-950 border-t border-slate-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-blue-400 text-sm font-medium tracking-wide uppercase mb-5">
                From education to action
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">When you are ready to apply what you learn, NTA can help.</h2>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed">Free AI Education helps you understand the possibilities. The NTA Digital Growth Office™ helps the owner involve the team, capture what employees know, and connect the website, customer relationships, everyday work, and practical AI support in one direction.</p>
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
                <button type="button" onClick={openGrowthGuide} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                  Talk to My Office™ <ArrowRight className="w-5 h-5" />
                </button>
                <Link onClick={() => trackStep('gap_audit_primary')} to="/free-audit" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all border border-slate-700">
                  Take the Free Business Gap Audit <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <p className="text-sm text-slate-500 mt-4 max-w-2xl mx-auto">The free audit provides a useful first-pass assessment. A deeper paid diagnostic is available only when more evidence and a detailed roadmap would help.</p>
            </div>
          </div>
        </section>

        <section className="border-y border-blue-900/30 bg-blue-950/20 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">When you want NTA involved</p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-5xl">Here is what working with NTA looks like.</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-300">
                Before NTA recommends tools or services, we learn how the business works. Then we help the owner see what is getting in the way and build the right growth system in the right order.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                You can study the approach before you contact us: <Link to="/better-business-book" className="text-blue-300 hover:text-blue-200">Better Business Book</Link>, <Link to="/practical-ai" className="text-blue-300 hover:text-blue-200">Practical AI Guide</Link>, <Link to="/knowledge" className="text-blue-300 hover:text-blue-200">Knowledge Library</Link>, and <Link to="/case-studies" className="text-blue-300 hover:text-blue-200">case studies</Link>.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-5">
              {[
                ['01', 'Understand', 'Learn from the owner and, with permission, the people doing the work.'],
                ['02', 'Involve', 'Help the owner bring the team into practical AI learning.'],
                ['03', 'Plan', 'Create the next useful order of work.'],
                ['04', 'Build', 'Connect the foundation and practical systems.'],
                ['05', 'Improve', 'Review what is happening and keep moving forward.'],
              ].map(([number, title, text]) => (
                <div key={number} className="rounded-2xl border border-blue-900/50 bg-slate-950/60 p-5">
                  <span className="text-xs font-black tracking-[0.2em] text-blue-300">{number}</span>
                  <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/work-with-nta" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white transition-colors hover:bg-blue-500">
                See What Working With NTA Looks Like <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="https://calendar.app.google/p6ieYanvwhixXxZ67" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-900/60 px-7 py-4 font-semibold text-white transition-colors hover:border-slate-400 hover:bg-slate-800">
                Schedule a Discovery Meeting <ArrowRight className="h-5 w-5" />
              </a>
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
              {TRUST_STEPS.map(({ number, title, text, label, to, action, step, icon: Icon }) => (
                <div key={step} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center"><Icon className="w-5 h-5" /></div>
                    <span className="text-3xl font-black text-slate-800">{number}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-slate-400 leading-relaxed mb-6 flex-1">{text}</p>
                  {action === 'guide' ? (
                    <button type="button" onClick={() => openGrowthGuide(step)} className="inline-flex items-center gap-2 text-left text-blue-400 hover:text-blue-300 font-semibold">
                      {label} <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link onClick={() => trackStep(step)} to={to} className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold">
                      {label} <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>



        <SolutionSection />
        <PublicationsSection />
        <CombinedReviewsSection />

        <FAQSection />
      </main>

      <SiteFooter />
    </div>
  );
}

