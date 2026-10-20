import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

export default function CaseStudyApplianceOutlet() {
  return <div className="min-h-screen bg-slate-950 text-slate-300">
    <SEOHead title="Appliance Outlet Super Center | Case Study in Progress | NTA" description="How an approved video-first marketing relationship is developing into a role-based Digital Growth Office for Appliance Outlet Super Center." canonical="/case-studies/appliance-outlet" />
    <MarketingNav />
    <main className="mx-auto max-w-4xl px-6 pb-20 pt-28">
      <Link to="/case-studies" className="text-cyan-300 hover:text-white">← All NTA Case Studies</Link>
      <p className="mt-9 text-sm font-bold uppercase tracking-widest text-cyan-300">Active client · Case study in progress · Updated October 20, 2026</p>
      <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white md:text-5xl">Appliance Outlet Super Center — Building a Digital Growth Office Around the Business</h1>
      <p className="mt-6 text-xl leading-9">What began as a conversation about video marketing is becoming a connected way for the people inside one business to work with NTA.</p>
      <div className="mt-10 space-y-10 leading-8">
        <section><h2 className="text-2xl font-bold text-white">Start with the business, not the technology</h2><p className="mt-3">Appliance Outlet serves retail and wholesale customers, with products, inventory details, selling terms and different responsibilities across the team. Early conversations with Scott and Don revealed why marketing cannot be treated as an isolated activity. The goal became to understand the business first, then connect useful tools around its real needs.</p></section>
        <section><h2 className="text-2xl font-bold text-white">From proposal to active client</h2><p className="mt-3">On October 17, Appliance Outlet approved a $1,500-per-month video-first marketing relationship with New Tech Advertising. The initial work focuses on building a recognizable local brand through useful video and coordinated distribution, rather than promising a fixed number of posts. Facebook, Instagram, TikTok and YouTube are part of the planned channel mix, alongside website and business-profile work.</p></section>
        <section><h2 className="text-2xl font-bold text-white">Different people need different dashboards</h2><p className="mt-3">The client workspace is being organized around three distinct roles. Scott's view focuses on marketing. Don's includes marketing and financial visibility. John's provides a whole-company overview. Each role is being given a simple three-step welcome experience to explain what they can see and how to begin.</p></section>
        <section><h2 className="text-2xl font-bold text-white">Speak or Type: work naturally</h2><p className="mt-3">The workspace is designed to let people communicate requests by speaking or typing, rather than requiring them to master complicated software. Typed request capture and browser speech-recognition support have been added. Full AI interpretation, automatic execution and final microphone testing are still in progress. The system should adapt to the people using it—not the other way around.</p></section>
        <section><h2 className="text-2xl font-bold text-white">One connected marketing relationship</h2><p className="mt-3">The work is bringing together video production, social channels, business profiles, advertising coordination, website experience and measurement. Marketing account connections and workspace setup are underway. NTA can prepare and organize work, but client review and approval remain essential before public release. Broader inventory and financial-system integrations are possible future work, not completed capabilities.</p></section>
        <section className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-7"><h2 className="text-2xl font-bold text-white">Where things stand</h2><p className="mt-3">As of October 20, 2026, this is a sold client and an active implementation. The video-first relationship is approved; the role-based workspace and onboarding are taking shape; conversational request capture is being developed. We have not yet reported measured increases in leads, sales or return on investment. This case study will grow as actual work and results can be verified.</p><p className="mt-4 font-semibold text-cyan-300">Every step is a collaboration.</p></section>
      </div>
      <div className="mt-12 border-t border-slate-800 pt-7"><Link className="text-cyan-300 hover:text-white" to="/knowledge/truth-about-business-growth/show-me-before-you-sell-me">Read the earlier lesson: Show Me Before You Sell Me →</Link></div>
    </main><SiteFooter />
  </div>;
}