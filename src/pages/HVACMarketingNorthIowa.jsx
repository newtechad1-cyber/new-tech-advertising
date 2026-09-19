import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Compass, MessageSquareText, Users, Wrench } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const questions=[
  'What do customers ask before they schedule service?',
  'What problems do technicians explain over and over?',
  'Which seasons, services and service areas matter most?',
  'How quickly are calls, forms and after-hours inquiries followed up?',
  'Can customers find clear answers before an emergency happens?',
  'What knowledge is walking around with the team but never getting captured?'
];

export default function HVACMarketingNorthIowa(){
 return <div className="min-h-screen bg-slate-950 text-slate-200">
  <SEOHead title="Growth Ideas for HVAC Businesses | New Tech Advertising" description="A practical HVAC growth roadmap connecting technician knowledge, customer questions, seasonal visibility, websites, follow-up and business systems." />
  <MarketingNav />
  <main>
   <section className="relative overflow-hidden border-b border-slate-800"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_42%)]"/><div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-sm font-semibold text-sky-300"><Wrench className="h-4 w-4"/> HVAC business growth</div>
    <h1 className="max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">“How do we keep growing between the busy seasons?” <span className="text-sky-400">Start with the whole HVAC business.</span></h1>
    <p className="mt-7 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">HVAC growth is more than running an ad when the weather changes. Your technicians, customers, website, Google presence, dispatch, follow-up and seasonal experience are all producing information that can help the business improve.</p>
    <Link to="/start" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-7 py-4 font-bold text-white hover:bg-sky-500">Start a Free Growth Conversation <ArrowRight className="h-5 w-5"/></Link>
   </div></section>
   <section className="bg-white py-20 text-slate-900"><div className="mx-auto max-w-6xl px-6"><p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-700">Listen before prescribing</p><h2 className="mt-3 max-w-3xl text-3xl font-black md:text-4xl">The people doing the work already know a lot about where growth gets stuck.</h2><div className="mt-10 grid gap-4 md:grid-cols-2">{questions.map(q=><div key={q} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 font-semibold">{q}</div>)}</div></div></section>
   <section className="border-y border-slate-800 bg-slate-900 py-20"><div className="mx-auto max-w-6xl px-6"><p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-400">NTA Point of View</p><h2 className="mt-3 text-3xl font-black text-white md:text-4xl">Build from the knowledge inside the business.</h2><div className="mt-10 grid gap-5 md:grid-cols-3">
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6"><Users className="h-7 w-7 text-sky-400"/><h3 className="mt-4 text-xl font-bold text-white">Technicians teach</h3><p className="mt-2 text-slate-400">Common repairs, homeowner misunderstandings and recurring questions can become useful knowledge instead of disappearing after each call.</p></div>
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6"><MessageSquareText className="h-7 w-7 text-sky-400"/><h3 className="mt-4 text-xl font-bold text-white">Customers teach</h3><p className="mt-2 text-slate-400">Calls, estimates, reviews and questions reveal what customers need explained and where communication can improve.</p></div>
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6"><CalendarDays className="h-7 w-7 text-sky-400"/><h3 className="mt-4 text-xl font-bold text-white">Seasons teach</h3><p className="mt-2 text-slate-400">Spring, summer, fall and winter create different needs. Capturing what happened this season helps prepare for the next one.</p></div>
   </div></div></section>
   <section className="bg-white py-20 text-slate-900"><div className="mx-auto max-w-5xl px-6"><Compass className="h-8 w-8 text-sky-600"/><h2 className="mt-4 text-3xl font-black">The Digital Growth Roadmap™ decides what comes next.</h2><p className="mt-5 text-lg leading-relaxed text-slate-600">That could include improving the website, seasonal pages, Google visibility, customer follow-up, reviews, video, social communication, dispatch or internal knowledge systems. NTA does not assume every HVAC company needs the same package.</p></div></section>
   <section className="bg-sky-950/30 py-20 text-center"><div className="mx-auto max-w-4xl px-6"><h2 className="text-3xl font-black text-white md:text-4xl">Bring us the HVAC business you have now.</h2><p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">We will start with what is working, what is getting lost, what your people know and what your customers are telling you—then build the next practical steps.</p><Link to="/start" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-8 py-4 font-bold text-white hover:bg-sky-500">Start a Free Growth Conversation <ArrowRight className="h-5 w-5"/></Link></div></section>
  </main><SiteFooter />
 </div>;
}
