import { Link } from 'react-router-dom';
import { ArrowRight, Brain, CheckCircle2, Compass, Database, MessageSquareText, ShieldCheck, Users } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const uses = [
  'Capture and summarize conversations, notes and ideas',
  'Organize business knowledge so it can be found again',
  'Prepare useful follow-up after meetings and customer conversations',
  'Turn approved source material into drafts for different channels',
  'Find patterns across questions, feedback and recurring problems',
  'Help teams retrieve the information they need without starting over',
];

export default function AiMarketingPlatform() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead title="How Can AI Help My Small Business? | New Tech Advertising" description="Practical AI for small business: capture knowledge, organize information, prepare follow-up and support better decisions inside a Digital Growth Office." />
      <MarketingNav />
      <main>
        <section className="relative overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.20),_transparent_42%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-semibold text-blue-300"><Brain className="h-4 w-4" /> Practical AI for small business</div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">“How can AI actually help my business?” <span className="text-blue-400">Start with the work—not the tool.</span></h1>
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">NTA does not begin by selling an AI platform. We begin by understanding the business: the people, customers, knowledge, systems, goals and work that already exist. Then we look for practical places AI can help.</p>
            <Link to="/start" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white transition hover:bg-blue-500">Start a Free Growth Conversation <ArrowRight className="h-5 w-5" /></Link>
          </div>
        </section>
        <section className="bg-white py-20 text-slate-900">
          <div className="mx-auto max-w-6xl px-6"><p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">AI should solve a real problem</p><h2 className="mt-3 max-w-4xl text-3xl font-black md:text-4xl">The useful question is not “Which AI should I buy?” It is “Where are we losing knowledge, time or clarity?”</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2">{uses.map(item => <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" /><p className="font-semibold">{item}</p></div>)}</div>
          </div>
        </section>
        <section className="border-y border-slate-800 bg-slate-900 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">Digital Growth Office™</p><h2 className="mt-3 max-w-4xl text-3xl font-black text-white md:text-4xl">AI becomes more useful when it has approved business knowledge to work with.</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6"><MessageSquareText className="h-7 w-7 text-blue-400" /><h3 className="mt-4 text-xl font-bold text-white">Capture</h3><p className="mt-2 text-slate-400">Conversations, customer questions, employee experience, documents and ideas can be captured instead of disappearing.</p></div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6"><Database className="h-7 w-7 text-blue-400" /><h3 className="mt-4 text-xl font-bold text-white">Remember</h3><p className="mt-2 text-slate-400">The Knowledge Library gives the business a growing source of organized information it can retrieve and reuse.</p></div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6"><Compass className="h-7 w-7 text-blue-400" /><h3 className="mt-4 text-xl font-bold text-white">Use</h3><p className="mt-2 text-slate-400">AI can help bring relevant information back into follow-up, planning, communication and the Digital Growth Roadmap™.</p></div>
            </div>
          </div>
        </section>
        <section className="bg-white py-20 text-slate-900">
          <div className="mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-2">
            <div><Users className="h-8 w-8 text-blue-600" /><h2 className="mt-4 text-3xl font-black">People remain the source</h2><p className="mt-4 leading-relaxed text-slate-600">People provide the knowledge, experience, context and judgment. AI can help the business remember, organize and use that knowledge. People make the decisions.</p></div>
            <div><ShieldCheck className="h-8 w-8 text-blue-600" /><h2 className="mt-4 text-3xl font-black">Human approval matters</h2><p className="mt-4 leading-relaxed text-slate-600">AI can prepare work, but important customer communication, public content and business decisions should still be reviewed by the people responsible for them.</p></div>
          </div>
        </section>
        <section className="bg-blue-950/30 py-20 text-center"><div className="mx-auto max-w-4xl px-6"><h2 className="text-3xl font-black text-white md:text-4xl">You do not need an AI shopping list.</h2><p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">Start with what is happening in the business. We can help identify where AI is useful, where it is unnecessary, and how it fits the larger Roadmap.</p><Link to="/start" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white transition hover:bg-blue-500">Start a Free Growth Conversation <ArrowRight className="h-5 w-5" /></Link></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
