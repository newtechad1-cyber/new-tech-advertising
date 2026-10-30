import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import HeroSection from '../components/home-conversion/HeroSection';
import RickMissionStatement from '../components/home-conversion/RickMissionStatement';
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

        <section className="border-y border-slate-800 bg-slate-900/45 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">Why NTA works this way</p>
              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">Start with the business. Teach before selling. Keep people in control.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">AI, websites, search, content, automation, and marketing are useful only when they help solve the right problem. NTA starts by understanding what is happening, then connects the right knowledge and tools in the order the business actually needs them.</p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6"><h3 className="text-xl font-bold text-white">Understand first</h3><p className="mt-3 leading-7 text-slate-400">Begin with the question, the people involved, and the result the business needs.</p></div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6"><h3 className="text-xl font-bold text-white">Connect what matters</h3><p className="mt-3 leading-7 text-slate-400">Use the Knowledge Library, AI Search Visibility, and the Digital Growth Office as connected parts of one system.</p></div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6"><h3 className="text-xl font-bold text-white">Keep judgment human</h3><p className="mt-3 leading-7 text-slate-400">AI can prepare, organize, and assist. Owners and responsible people still approve important decisions and promises.</p></div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl rounded-3xl border border-slate-800 bg-slate-900/60 p-8 md:flex md:items-center md:justify-between md:gap-10 md:p-10">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">See the work, not just the claims</p>
              <h2 className="mt-3 text-3xl font-black text-white">Real businesses. Real questions. Work you can examine.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">NTA case studies show how discovery, websites, content, connected systems, and ongoing client work develop in practice—including what is finished, what is still being built, and what has actually been learned.</p>
            </div>
            <div className="mt-6 flex shrink-0 flex-col gap-3 md:mt-0">
              <Link to="/case-studies" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white hover:bg-blue-500">Explore case studies</Link>
              <Link to="/work-with-nta" className="inline-flex items-center justify-center rounded-xl border border-slate-600 px-6 py-3.5 font-bold text-white hover:border-slate-400">See how NTA works</Link>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-800 bg-slate-900/30 px-6 py-14">
          <div className="mx-auto max-w-5xl">
            <RickMissionStatement />
          </div>
        </section>

        <section className="px-6 py-16 text-center">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">A simple place to begin</p>
            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">Start with the question you have. We’ll go from there.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">You can explore the site, ask Your Digital Growth Guide™ to help you think something through, or start a conversation with Rick when that feels useful.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/growth-guide" className="rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white hover:bg-blue-500">Your Digital Growth Guide™</Link>
              <Link to="/growth-conversation" className="rounded-xl border border-slate-600 px-6 py-3.5 font-bold text-white hover:border-slate-400">Talk with Rick</Link>
            </div>
          </div>
        </section>

        <FAQSection />
      </main>

      <SiteFooter />
    </div>
  );
}