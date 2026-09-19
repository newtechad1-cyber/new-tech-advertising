import { ArrowRight, Building2, Wrench, Briefcase, Heart } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const industries=[
 {icon:Building2,title:'Small Local Businesses',description:'Connect customer questions, team knowledge, visibility, follow-up and everyday operations.',href:'/industries/small-local'},
 {icon:Wrench,title:'Service Trades',description:'Capture field knowledge and connect seasonal demand, customer communication and operations.',href:'/industries/service-trades'},
 {icon:Briefcase,title:'Professional Offices',description:'Turn expertise, client questions and internal knowledge into clearer communication and systems.',href:'/industries/professionals'},
 {icon:Heart,title:'Nonprofits & Community',description:'Help teams preserve knowledge, communicate their mission and make practical growth decisions.',href:'/industries/nonprofits'}
];

export default function IndustriesHub(){return <div className="min-h-screen bg-white text-slate-900">
<SEOHead title="Digital Growth Roadmaps by Industry | New Tech Advertising" description="See how NTA starts with the people, customers, knowledge, systems and goals inside different kinds of businesses before recommending growth tactics."/><MarketingNav/>
<main>
<section className="bg-slate-950 px-6 py-20 text-white md:py-28"><div className="mx-auto max-w-6xl"><p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">Industry doorways</p><h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">Every industry is different. <span className="text-blue-400">The starting point is the business.</span></h1><p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">Choose an industry to see the kinds of questions worth asking. NTA does not begin with a preset package. We begin with the people, customers, knowledge, systems and goals already inside the business, then build a practical Digital Growth Roadmap™.</p></div></section>
<section className="px-6 py-20"><div className="mx-auto max-w-6xl"><div className="grid gap-6 md:grid-cols-2">{industries.map(({icon:Icon,title,description,href})=><a href={href} key={title} className="group rounded-2xl border border-slate-200 bg-slate-50 p-7 transition hover:border-blue-300 hover:shadow-lg"><Icon className="h-8 w-8 text-blue-600"/><h2 className="mt-5 text-2xl font-black">{title}</h2><p className="mt-3 leading-relaxed text-slate-600">{description}</p><div className="mt-5 flex items-center gap-2 font-bold text-blue-600">Explore the questions <ArrowRight className="h-4 w-4"/></div></a>)}</div></div></section>
<section className="bg-slate-100 px-6 py-20"><div className="mx-auto max-w-5xl"><p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">NTA Point of View</p><h2 className="mt-3 text-3xl font-black md:text-4xl">Industry experience matters. So does listening to the individual business.</h2><p className="mt-5 text-lg leading-relaxed text-slate-600">Two businesses in the same industry can have completely different needs. The Digital Growth Office™ helps capture what owners, employees and customers know. The Knowledge Library helps the business remember it. The Digital Growth Roadmap™ helps decide what to do next.</p></div></section>
<section className="bg-slate-950 px-6 py-16 text-center"><div className="mx-auto max-w-3xl"><h2 className="text-3xl font-black text-white">Your industry gives us context. Your business gives us the Roadmap.</h2><p className="mt-4 text-slate-300">Start with the question or problem you have now. We will help connect it to the larger business.</p><a href="/start" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white hover:bg-blue-500">Start a Free Growth Conversation <ArrowRight className="h-5 w-5"/></a></div></section>
</main><SiteFooter/></div>}
