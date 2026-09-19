import { Link } from 'react-router-dom';
import { ArrowRight, Brain, ClipboardList, Compass, FileText, MessageSquareText, Smartphone, Users, Workflow } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const friction=[
 {icon:ClipboardList,title:'The same information gets entered twice',text:'Paper, spreadsheets, accounting tools, inboxes and separate apps can create repeated work and conflicting records.'},
 {icon:MessageSquareText,title:'Customer communication gets separated from the job',text:'Calls, texts, estimates, approvals and follow-up may live in different places, making context hard to recover.'},
 {icon:Users,title:'Important knowledge lives with one person',text:'Dispatch habits, pricing explanations, customer history and exceptions often depend on whoever happens to remember them.'},
 {icon:Smartphone,title:'The office and the field see different pictures',text:'Owners, office staff and technicians may need the same information at different moments and on different devices.'},
];

const roadmap=[
 'Listen to the people doing the work and follow a real job through the business.',
 'Capture where information begins, where it gets copied, where it gets lost and who needs it next.',
 'Understand which existing tools are helping and which handoffs are creating friction.',
 'Decide whether the answer is a process change, a better connection between tools, a custom workflow, or no new software at all.',
 'Build and test the smallest useful improvement before replacing a working system.',
 'Keep learning from the people using it and improve the workflow over time.',
];

export default function BackOfficeSolutions(){return <div className="min-h-screen bg-slate-950 text-slate-200">
<SEOHead title="How Can I Simplify My Business Back Office? | New Tech Advertising" description="Understand disconnected back-office work, dispatch, customer communication and business knowledge before deciding whether software or workflow changes belong on your Digital Growth Roadmap."/>
<MarketingNav/><main>
<section className="relative overflow-hidden border-b border-slate-800"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_42%)]"/><div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-300"><Workflow className="h-4 w-4"/> Back office, workflow & operations</div>
<h1 className="max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">“Why does running the office take so much work?” <span className="text-emerald-400">Follow the work before replacing the tools.</span></h1>
<p className="mt-7 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">A back-office problem may look like a software problem when it is really a handoff, information, communication or workflow problem. NTA starts by understanding how work actually moves through the business before recommending what should change.</p>
<Link to="/start" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-4 font-bold text-white hover:bg-emerald-500">Start a Free Growth Conversation <ArrowRight className="h-5 w-5"/></Link>
</div></section>

<section className="bg-white py-20 text-slate-900"><div className="mx-auto max-w-6xl px-6"><p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Start with the friction</p><h2 className="mt-3 max-w-4xl text-3xl font-black md:text-4xl">What is making the work harder than it needs to be?</h2><p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">The useful clues are usually in the everyday work: what gets written down, retyped, forgotten, searched for, handed off or explained again.</p><div className="mt-10 grid gap-5 md:grid-cols-2">{friction.map(({icon:Icon,title,text})=><div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><Icon className="h-7 w-7 text-emerald-600"/><h3 className="mt-4 text-xl font-bold">{title}</h3><p className="mt-2 leading-relaxed text-slate-600">{text}</p></div>)}</div></div></section>

<section className="border-y border-slate-800 bg-slate-900 py-20"><div className="mx-auto max-w-6xl px-6"><p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">NTA Point of View</p><h2 className="mt-3 max-w-4xl text-3xl font-black text-white md:text-4xl">The goal is not one screen. The goal is a business that can work, remember and improve.</h2><div className="mt-10 grid gap-5 md:grid-cols-3">
<div className="rounded-2xl border border-slate-800 bg-slate-950 p-6"><FileText className="h-7 w-7 text-emerald-400"/><h3 className="mt-4 text-xl font-bold text-white">Keep useful context</h3><p className="mt-2 text-slate-400">Customer history, job notes, decisions and documents should be available to the people who need them without depending on memory alone.</p></div>
<div className="rounded-2xl border border-slate-800 bg-slate-950 p-6"><Workflow className="h-7 w-7 text-emerald-400"/><h3 className="mt-4 text-xl font-bold text-white">Make handoffs clearer</h3><p className="mt-2 text-slate-400">A good workflow helps the next person know what happened, what matters and what needs to happen next.</p></div>
<div className="rounded-2xl border border-slate-800 bg-slate-950 p-6"><Brain className="h-7 w-7 text-emerald-400"/><h3 className="mt-4 text-xl font-bold text-white">Let AI support the work</h3><p className="mt-2 text-slate-400">AI can help organize notes, summarize information, retrieve approved knowledge and prepare follow-up. People remain responsible for decisions and customer relationships.</p></div>
</div></div></section>

<section className="bg-white py-20 text-slate-900"><div className="mx-auto max-w-6xl px-6"><div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]"><div><Compass className="h-8 w-8 text-emerald-600"/><h2 className="mt-4 text-3xl font-black">A back-office Growth Roadmap starts with the current workflow.</h2><p className="mt-5 leading-relaxed text-slate-600">We do not assume you need to replace your accounting system, dispatch software, spreadsheets or other tools. Existing systems may remain exactly where they are. The question is what the business needs to work better.</p></div><div className="space-y-3">{roadmap.map((item,i)=><div key={item} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-black text-emerald-700">{i+1}</div><p className="leading-relaxed text-slate-700">{item}</p></div>)}</div></div></div></section>

<section className="bg-emerald-950/30 py-20"><div className="mx-auto max-w-5xl px-6"><div className="grid gap-10 md:grid-cols-2"><div><Users className="h-8 w-8 text-emerald-400"/><h2 className="mt-4 text-2xl font-black text-white">People know where the friction is.</h2><p className="mt-3 leading-relaxed text-slate-300">Owners, office staff, technicians and other employees experience the workflow differently. Listening across the business helps uncover problems a software demo cannot see.</p></div><div><Brain className="h-8 w-8 text-emerald-400"/><h2 className="mt-4 text-2xl font-black text-white">The Digital Growth Office™ connects what the business learns.</h2><p className="mt-3 leading-relaxed text-slate-300">Operational knowledge can become part of the Knowledge Library so useful decisions, procedures and explanations are easier to find and improve over time.</p></div></div></div></section>

<section className="bg-white py-20 text-slate-900"><div className="mx-auto max-w-5xl px-6 text-center"><h2 className="text-3xl font-black md:text-4xl">You do not have to know which software you need.</h2><p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">Bring us the part of the work that feels disconnected, repetitive or difficult. We can follow it with you, understand the real problem, and decide whether a process, connection, automation or custom tool belongs on the Digital Growth Roadmap™.</p><Link to="/start" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 font-bold text-white hover:bg-emerald-500">Start a Free Growth Conversation <ArrowRight className="h-5 w-5"/></Link></div></section>
</main><SiteFooter/></div>}
