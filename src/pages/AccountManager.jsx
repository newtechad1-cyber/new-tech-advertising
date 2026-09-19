import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, Building2, CheckCircle2, Handshake, MessagesSquare, UsersRound } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const responsibilities = [
  ['Know the accounts', 'Stay close enough to understand what each client is working on, what has changed, and what the next useful step may be.'],
  ['Keep the Roadmap moving', 'Help connect conversations, priorities, follow-up, and the Digital Growth Office so useful work does not disappear between meetings.'],
  ['Coordinate the relationship', 'Help clients, NTA, Digital Growth Advisors, and specialists understand what is happening and who needs to do what next.'],
  ['Support Community Partners', 'As partner relationships grow, an Account Manager can help organizations stay connected to NTA learning, resources, introductions, and follow-through.'],
];

export default function AccountManager() {
  return <div className="min-h-screen bg-slate-950 text-white">
    <SEOHead
      title="Account Manager Opportunity | New Tech Advertising"
      description="Explore the NTA Account Manager role: ongoing client and partner relationships, connected follow-through, and Digital Growth Office support."
      canonical="https://newtechadvertising.com/account-manager"
    />
    <MarketingNav />
    <main id="main-content" className="pt-16">
      <section className="border-b border-slate-800 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,.22),transparent_60%)] px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-300">A different role from Digital Growth Advisor</p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-6xl">Account Manager</h1>
            <p className="mt-6 max-w-3xl text-2xl font-semibold leading-snug text-slate-100">Help manage the relationships after there is something to manage.</p>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">A Digital Growth Advisor helps NTA develop new business relationships. An Account Manager stays connected as client and partner relationships grow—helping people communicate, keeping priorities visible, and helping the work move forward.</p>
          </div>
          <aside className="rounded-3xl border border-blue-300/25 bg-slate-900/80 p-7 sm:p-9">
            <BriefcaseBusiness className="h-9 w-9 text-blue-300" />
            <h2 className="mt-5 text-2xl font-bold">A role that grows with the company.</h2>
            <p className="mt-4 leading-relaxed text-slate-300">As NTA has enough active accounts and partner relationships to support dedicated management, this becomes a natural place for people who are good at listening, organizing, communicating, and maintaining relationships.</p>
          </aside>
        </div>
      </section>

      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-300">What the role is for</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-bold sm:text-4xl">Keep clients, partners, people, and the Growth Roadmap connected.</h2>
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {responsibilities.map(([title,text], i) => {
              const Icon = [MessagesSquare, CheckCircle2, UsersRound, Building2][i];
              return <article key={title} className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                <Icon className="h-7 w-7 text-blue-300" />
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-relaxed text-slate-300">{text}</p>
              </article>;
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/50 px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-300">How the roles connect</p>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-700 bg-slate-950 p-6"><Handshake className="h-7 w-7 text-cyan-300" /><h3 className="mt-4 text-xl font-bold">Digital Growth Advisor</h3><p className="mt-3 text-slate-300">Develops relationships, listens to business owners, and helps open useful conversations with NTA.</p><Link to="/digital-growth-advisor" className="mt-5 inline-flex items-center gap-2 font-semibold text-cyan-300">Explore Advisor <ArrowRight className="h-4 w-4" /></Link></article>
            <article className="rounded-2xl border border-blue-400/40 bg-blue-950/20 p-6"><BriefcaseBusiness className="h-7 w-7 text-blue-300" /><h3 className="mt-4 text-xl font-bold">Account Manager</h3><p className="mt-3 text-slate-300">Manages a growing group of client and partner relationships and helps keep ongoing work connected.</p></article>
            <article className="rounded-2xl border border-slate-700 bg-slate-950 p-6"><Building2 className="h-7 w-7 text-indigo-300" /><h3 className="mt-4 text-xl font-bold">Community Partner</h3><p className="mt-3 text-slate-300">Connects NTA learning and resources with a community, organization, or trusted network.</p><Link to="/community-partner" className="mt-5 inline-flex items-center gap-2 font-semibold text-indigo-300">Explore Partner <ArrowRight className="h-4 w-4" /></Link></article>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-700 bg-slate-900 p-8 sm:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-300">Where this stands today</p>
          <h2 className="mt-4 text-3xl font-bold">This is a developing NTA role, not the Digital Growth Advisor opportunity under another name.</h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-300">The role becomes more important as the number of active NTA clients, Advisors, and Community Partners grows. Responsibilities, compensation, workload, and hiring terms should be defined for the actual position when NTA is ready to fill it.</p>
          <p className="mt-4 leading-relaxed text-slate-400">For now, this page explains the role clearly without asking someone to submit a résumé for a position that has not yet been defined as an open job.</p>
          <Link to="/contact" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white hover:bg-blue-500">Ask about the Account Manager role <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>;
}
