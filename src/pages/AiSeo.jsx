import { Link } from 'react-router-dom';
import { ArrowRight, Brain, CheckCircle2, Compass, FileQuestion, Search, Users } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const questions = [
  'What are customers actually searching or asking for?',
  'Can Google and AI systems clearly understand what your business does?',
  'Does your website answer useful questions with real business knowledge?',
  'Are your business name, services, locations and contact details consistent?',
  'Do reviews and customer experiences support the story your website tells?',
  'Are you measuring what people find and what they do next?',
];

export default function AiSeo() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead title="How Can Customers Find My Business Online? | New Tech Advertising" description="Understand SEO, Google visibility and AI search as part of a practical Digital Growth Roadmap for your business." />
      <MarketingNav />
      <main>
        <section className="relative overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_42%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-300"><Search className="h-4 w-4" /> Search, Google & AI visibility</div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">“Why can’t people find my business?” <span className="text-emerald-400">Start with what they need to find.</span></h1>
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">SEO is not simply a race for rankings. It is the work of making your business understandable and useful when people are looking for answers. Sometimes the gap is technical. Sometimes it is content, reviews, Google Business Profile information, website structure, or simply that the business has never captured what its people already know.</p>
            <Link to="/start" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-4 font-bold text-white transition hover:bg-emerald-500">Start a Free Growth Conversation <ArrowRight className="h-5 w-5" /></Link>
          </div>
        </section>

        <section className="bg-white py-20 text-slate-900">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Questions before tactics</p><h2 className="mt-3 text-3xl font-black md:text-4xl">Being found starts with being clear.</h2><p className="mt-5 text-lg leading-relaxed text-slate-600">Before adding pages or chasing keywords, understand the questions customers ask, the services that matter, the areas you actually serve, and the knowledge that makes your business useful.</p></div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {questions.map(q => <div key={q} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /><p className="font-semibold">{q}</p></div>)}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-800 bg-slate-900 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">NTA Point of View</p>
            <h2 className="mt-3 max-w-4xl text-3xl font-black text-white md:text-4xl">Search visibility is one part of the Digital Growth Roadmap™.</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6"><FileQuestion className="h-7 w-7 text-emerald-400" /><h3 className="mt-4 text-xl font-bold text-white">Answer real questions</h3><p className="mt-2 leading-relaxed text-slate-400">Useful pages begin with customer questions and the experience of the people inside the business—not filler written just to create another page.</p></div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6"><Users className="h-7 w-7 text-emerald-400" /><h3 className="mt-4 text-xl font-bold text-white">Capture what people know</h3><p className="mt-2 leading-relaxed text-slate-400">Owners, employees and customers continually reveal language, problems and answers that can strengthen the Knowledge Library and public website.</p></div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6"><Compass className="h-7 w-7 text-emerald-400" /><h3 className="mt-4 text-xl font-bold text-white">Connect the system</h3><p className="mt-2 leading-relaxed text-slate-400">Website structure, Google, reviews, content, follow-up and measurement work better when they are treated as connected parts of the business.</p></div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 text-slate-900">
          <div className="mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-2">
            <div><Brain className="h-8 w-8 text-emerald-600" /><h2 className="mt-4 text-3xl font-black">What about AI search?</h2><p className="mt-4 leading-relaxed text-slate-600">People increasingly ask AI tools questions as well as searching Google. The same foundation matters: clear facts, useful explanations, trustworthy source material and a business that can be understood. NTA does not promise a particular ranking or AI citation.</p></div>
            <div><Search className="h-8 w-8 text-emerald-600" /><h2 className="mt-4 text-3xl font-black">What AI can help with</h2><p className="mt-4 leading-relaxed text-slate-600">AI can help organize questions, summarize source material, identify patterns, prepare drafts and keep knowledge easier to retrieve. People provide the knowledge, review the work and make the decisions.</p></div>
          </div>
        </section>

        <section className="bg-emerald-950/30 py-20 text-center">
          <div className="mx-auto max-w-4xl px-6"><h2 className="text-3xl font-black text-white md:text-4xl">You do not need to diagnose the search problem before we talk.</h2><p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">Bring the question: “Why aren’t people finding us?” We can start there, understand the larger business, and decide what belongs on the Roadmap.</p><Link to="/start" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 font-bold text-white transition hover:bg-emerald-500">Start a Free Growth Conversation <ArrowRight className="h-5 w-5" /></Link></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
