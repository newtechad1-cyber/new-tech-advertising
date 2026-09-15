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
    title: 'Start with the question in front of you',
    text: 'Get the plain-English answer before deciding how much of the topic you need to explore.',
    label: 'Browse questions',
    to: '/knowledge/questions',
    step: 'question_library',
    icon: BookOpen,
  },
  {
    number: '2',
    title: 'Ask Your Digital Growth Guide™',
    text: 'Talk through the question that is actually on your mind, even if you are not sure how to name it yet.',
    label: 'Ask Your Digital Growth Guide™',
    action: 'guide',
    step: 'digital_growth_guide',
    icon: MessageCircle,
  },
  {
    number: '3',
    title: 'Use a free Gap Audit when it fits',
    text: 'Use the first-pass audit when a more direct review of visible priorities and gaps would be useful.',
    label: 'Take the Free Gap Audit',
    to: '/free-audit',
    step: 'gap_audit',
    icon: ClipboardCheck,
  },
  {
    number: '4',
    title: 'Talk to My Office™',
    text: 'Call, text, email, or start a conversation—whichever is easiest for you. NTA will help sort out the next useful step.',
    label: 'Talk to My Office™',
    action: 'office',
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
        title="Small-Business Questions About AI, Marketing, Websites & Growth | NTA"
        description="Plain-English answers for small-business owners who want to improve customers, time, websites, follow-up, AI understanding, or the next business decision."
        faqs={HOMEPAGE_FAQS}
      />
      <MarketingNav />

      <main>
        <HeroSection />
        <ProblemSection />

        <section className="border-y border-slate-800 bg-slate-950 px-6 py-14">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-9 max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Start with the question in front of you</p>
              <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">You do not have to learn the whole NTA system to get a useful answer.</h2>
              <p className="mt-3 leading-relaxed text-slate-300">Each question page gives you a plain-English answer, practical examples, clear limits for AI, and a way to continue only if it helps.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <BookOpen className="mb-4 h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Get the short answer first</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">Understand the practical point before you decide whether to spend more time on the topic.</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <MessageCircle className="mb-4 h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">See where AI fits—and where it does not</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">Use technology to support people and real work, not to replace judgment or a customer relationship.</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <Globe className="mb-4 h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Follow the connected teaching</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">Move from one answer into the related Knowledge Library lesson, video, case study, or next useful conversation.</p>
              </div>
            </div>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/knowledge/questions" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white transition-colors hover:bg-blue-500">
                Browse small-business questions <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/growth-show" className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-900/60 px-6 py-3.5 font-bold text-white transition-colors hover:border-slate-400 hover:bg-slate-800">
                Watch the NTA Growth Show <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-slate-950 border-t border-slate-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-blue-400 text-sm font-medium tracking-wide uppercase mb-5">
                When you are ready for a useful next step
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">A business usually needs clearer priorities before it needs more tools.</h2>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed">A useful answer can lead to clearer information, a stronger customer path, and less repeated work. Technology only belongs in the picture when it helps the people and the business do something real.</p>
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
              <p className="text-lg text-slate-300 font-medium mb-6">Keep learning if that is useful. If the question needs a closer look, start a conversation with the Guide or a person at NTA.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button type="button" onClick={openGrowthGuide} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                  Ask Your Digital Growth Guide™ <ArrowRight className="w-5 h-5" />
                </button>
                <button type="button" onClick={() => openGrowthGuide('talk_to_my_office_primary')} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all border border-slate-700">
                  Talk to My Office™ <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-400 mt-4 max-w-2xl mx-auto">Talk to My Office™ can be a call, text, email, or a conversation here—whichever is easiest for you.</p>
              <p className="text-sm text-slate-500 mt-2 max-w-2xl mx-auto">The Digital Growth Office™ becomes relevant only when connected human help and implementation would genuinely improve the next step.</p>
            </div>
          </div>
        </section>

        <section className="border-y border-blue-900/30 bg-blue-950/20 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">When you want NTA involved</p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-5xl">Here is what working with NTA looks like.</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-300">
                Before NTA recommends tools or services, we learn how the business works. Then we help the owner see what is getting in the way, choose one useful next step, and build the right growth system in the right order. The Digital Growth Office™ is the connected way NTA can help once the business has a clear priority—not a system you have to understand before you get help.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                You can study the approach before you contact us: <Link to="/better-business-book" className="text-blue-300 hover:text-blue-200">Better Business Building Book</Link>, <Link to="/practical-ai" className="text-blue-300 hover:text-blue-200">Practical AI Guide</Link>, <Link to="/knowledge" className="text-blue-300 hover:text-blue-200">Knowledge Library</Link>, and <Link to="/case-studies" className="text-blue-300 hover:text-blue-200">case studies</Link>.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-5">
              {[
                ['01', 'Understand', 'Learn from the owner and, with permission, the people doing the work.'],
                ['02', 'Involve', 'Bring in the knowledge and teach what matters.'],
                ['03', 'Growth Roadmap', 'Agree on the priorities and a practical path forward.'],
                ['04', 'First project', 'Choose the scope, cost, and responsibilities before work begins.'],
                ['05', 'Build and improve', 'Put the agreed work in place, review it together, and decide what comes next.'],
              ].map(([number, title, text]) => (
                <div key={number} className="rounded-2xl border border-blue-900/50 bg-slate-950/60 p-5">
                  <span className="text-xs font-black tracking-[0.2em] text-blue-300">{number}</span>
                  <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
                </div>
              ))}
            </div>

            <p className="mt-7 text-center">
              <Link to="/services#first-project" className="font-semibold text-blue-300 hover:text-blue-200">See what your first project with NTA looks like →</Link>
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button type="button" onClick={() => openGrowthGuide('homepage_human_help')} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white transition-colors hover:bg-blue-500">
                Ask Your Digital Growth Guide™ <ArrowRight className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => openGrowthGuide('talk_to_my_office_human_help')} className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-900/60 px-7 py-4 font-semibold text-white transition-colors hover:border-slate-400 hover:bg-slate-800">
                Talk to My Office™ <ArrowRight className="h-5 w-5" />
              </button>
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
                  {action === 'guide' || action === 'office' ? (
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

