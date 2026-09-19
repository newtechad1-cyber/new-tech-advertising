import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Compass, MessageCircle, Repeat2, Users } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const ideas = [
  { icon: Users, title: 'Start with people', text: 'Your team hears questions, solves problems and sees what customers care about every day. That is better source material than trying to invent posts from scratch.' },
  { icon: MessageCircle, title: 'Communicate something useful', text: 'Social media can answer questions, show how the business works, introduce people, explain decisions and stay connected between purchases.' },
  { icon: Repeat2, title: 'Reuse what the business learns', text: 'A useful conversation can become a website answer, short video, social post, email idea or future lesson without changing the core meaning.' },
  { icon: Compass, title: 'Put the channel in its place', text: 'Social media may matter a lot, a little, or not right now. The Growth Roadmap helps decide where it belongs alongside the website, search, reviews and follow-up.' },
];

export default function AiSocialMedia() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead title="What Should My Business Post on Social Media? | NTA" description="A practical approach to business social media built from customer questions, team knowledge and a connected Digital Growth Roadmap." />
      <MarketingNav />
      <main>
        <section className="relative overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.20),_transparent_42%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-semibold text-indigo-300"><MessageCircle className="h-4 w-4" /> Social media & business communication</div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">“What are we supposed to post?” <span className="text-indigo-400">Start with what your business already knows.</span></h1>
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">The goal is not to feed a content machine. Social media is one way a business can stay useful, visible and connected. The strongest material often comes from everyday questions, employee knowledge, customer conversations and the work already happening.</p>
            <Link to="/start" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-4 font-bold text-white transition hover:bg-indigo-500">Start a Free Growth Conversation <ArrowRight className="h-5 w-5" /></Link>
          </div>
        </section>
        <section className="bg-white py-20 text-slate-900">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-700">A better source for content</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black md:text-4xl">Stop starting over every time you need something to say.</h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">When useful business knowledge is captured in the Digital Growth Office™ and Knowledge Library, communication gets easier. You are not asking AI to invent the business. You are giving it approved knowledge to help organize and adapt.</p>
            <div className="mt-10 grid gap-5 md:grid-cols-2">{ideas.map(({icon:Icon,title,text}) => <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><Icon className="h-7 w-7 text-indigo-600" /><h3 className="mt-4 text-xl font-bold">{title}</h3><p className="mt-2 leading-relaxed text-slate-600">{text}</p></div>)}</div>
          </div>
        </section>
        <section className="border-y border-slate-800 bg-slate-900 py-20">
          <div className="mx-auto max-w-5xl px-6"><p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-400">NTA Point of View</p><h2 className="mt-3 text-3xl font-black text-white md:text-4xl">Social media is a channel. It is not the strategy.</h2><p className="mt-5 text-lg leading-relaxed text-slate-300">A business may need clearer positioning, a better website, customer follow-up, stronger reviews, a seasonal campaign, video, social communication—or something else entirely. Discovery and the Digital Growth Roadmap™ help decide what deserves attention.</p></div>
        </section>
        <section className="bg-white py-20 text-slate-900">
          <div className="mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-2">
            <div><Brain className="h-8 w-8 text-indigo-600" /><h2 className="mt-4 text-3xl font-black">Where AI helps</h2><p className="mt-4 leading-relaxed text-slate-600">AI can help transcribe a conversation, organize ideas, prepare drafts, adapt an approved idea for different channels, and help remember what has already been said.</p></div>
            <div><Users className="h-8 w-8 text-indigo-600" /><h2 className="mt-4 text-3xl font-black">Where people stay in control</h2><p className="mt-4 leading-relaxed text-slate-600">People provide the experience and context. People decide what is accurate, appropriate and worth publishing. AI supports the work; it does not become the voice or judgment of the business.</p></div>
          </div>
        </section>
        <section className="bg-indigo-950/30 py-20 text-center"><div className="mx-auto max-w-4xl px-6"><h2 className="text-3xl font-black text-white md:text-4xl">Bring us the communication problem—not a package choice.</h2><p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">We will start with the business, the people and the customers, then decide whether social media belongs in the next practical step.</p><Link to="/start" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white transition hover:bg-indigo-500">Start a Free Growth Conversation <ArrowRight className="h-5 w-5" /></Link></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
