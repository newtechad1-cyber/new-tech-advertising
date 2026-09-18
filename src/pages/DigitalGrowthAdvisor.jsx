import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import AdvisorDiscoveryForm from '@/components/advisor/AdvisorDiscoveryForm';
import { ADVISOR_FAQS, ADVISOR_RESOURCES, ADVISOR_STEPS, PUBLIC_SITE } from '@/data/digitalGrowthAdvisor';

const support = [
  ['Research and preparation', 'Prospect research, a connected prospecting system, Gap Audits, and talking points help you begin with useful context.'],
  ['Learning while you work', 'AI, marketing knowledge, lessons, the Growth Show, and Your Digital Growth Guide™ help with the question in front of you. With the business owner’s permission, AI can organize the important points from a conversation and help prepare the next step.'],
  ['Follow-through and implementation', 'Email assistance, follow-up tools, printable leave-behind material, and NTA’s implementation capabilities support the relationship.'],
];

export default function DigitalGrowthAdvisor() {
  return <div className="min-h-screen bg-slate-950 text-white">
    <SEOHead
      title="Digital Growth Advisor Program | Learn. Earn. Build. | NTA"
      description="Learn AI. Learn Business. Help Businesses Grow. Start with your relationship skills, supported by New Tech Advertising’s Digital Growth Office."
      canonical="https://newtechadvertising.com/digital-growth-advisor"
      faqs={ADVISOR_FAQS.map(([question, answer]) => ({ question, answer }))}
    />
    <MarketingNav />
    <main id="main-content" className="pt-16">
      <section className="border-b border-slate-800 bg-[radial-gradient(ellipse_at_top_right,rgba(8,145,178,.22),transparent_60%)] px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-300">Learn. Earn. Build.</p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-6xl">Become a Digital Growth Advisor</h1>
            <p className="mt-6 text-2xl font-semibold leading-snug sm:text-3xl">Learn AI. Learn Business.<br />Help Businesses Grow.</p>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">Develop relationships with business owners. Listen to what they are trying to accomplish. NTA brings the Digital Growth Office, tools, knowledge, and support behind you.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#support" className="rounded-xl bg-cyan-300 px-6 py-4 font-bold text-slate-950 hover:bg-cyan-200">See how NTA supports you</a>
              <a href="#explore" className="rounded-xl border border-slate-500 px-6 py-4 font-semibold hover:bg-slate-800">Explore NTA first</a>
            </div>
          </div>
          <aside className="rounded-3xl border border-cyan-300/25 bg-slate-900/80 p-7 sm:p-9">
            <p className="text-sm uppercase tracking-widest text-cyan-300">A practical starting point</p>
            <h2 className="mt-5 text-3xl font-bold leading-snug">Start with what you already know how to do.</h2>
            <p className="mt-4 text-2xl font-semibold text-cyan-200">NTA supports you with the rest.</p>
            <p className="mt-6 leading-relaxed text-slate-300">You bring the human relationship. Learn the technology and business tools as they become useful in your work.</p>
            <p className="mt-5 border-t border-slate-700 pt-5 text-sm text-slate-400">Built with Rick Hesse’s 45+ years of business experience.</p>
          </aside>
        </div>
      </section>

      <section id="support" className="scroll-mt-24 px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-300">The Digital Growth Office behind you</p>
          <h2 className="mt-4 text-3xl font-bold">You develop the relationship. We work on the next step together.</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {support.map(([title, text]) => <article key={title} className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-4 leading-relaxed text-slate-300">{text}</p>
            </article>)}
          </div>
          <p className="mt-7 max-w-3xl text-lg leading-relaxed text-slate-300">Ask a good question. Listen. Bring back what you learn. NTA works with the way people want to work—whether that means listening and taking notes, bringing back their own summary, or recording a conversation with clear permission. If recording is not comfortable, you do not need to record.</p>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">With your approval, AI can help organize what was said, keep track of the important points, prepare useful follow-up, and begin shaping the Growth Roadmap. The goal is to help people work better and smarter—not force them to change how they work.</p>
          <div className="mt-7 max-w-4xl rounded-2xl border border-cyan-300/25 bg-cyan-950/20 p-6">
            <h3 className="text-xl font-bold text-white">The Digital Growth Office connects people as well as technology.</h3>
            <p className="mt-3 leading-relaxed text-slate-300">Owners and employees already know an enormous amount about customers, everyday problems, opportunities, and how the work really gets done. NTA can create simple ways to capture that knowledge through conversations, short recordings, questions, documents, and observations without turning participation into another complicated job.</p>
            <p className="mt-3 font-semibold text-cyan-200">People provide the knowledge. AI helps the business remember, organize, and use it. People continue making the decisions.</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">That is team building, shared business knowledge, and continuous improvement—not employee surveillance and not AI making management decisions.</p>
          </div>
          <div className="mt-7 max-w-4xl rounded-2xl border border-cyan-300/25 bg-cyan-950/20 p-6">
            <h3 className="text-xl font-bold text-white">The Digital Growth Office connects people as well as technology.</h3>
            <p className="mt-3 leading-relaxed text-slate-300">Owners and employees already know an enormous amount about customers, everyday problems, opportunities, and how the work really gets done. NTA can create simple ways to capture that knowledge through conversations, short recordings, questions, documents, and observations without turning participation into another complicated job.</p>
            <p className="mt-3 font-semibold text-cyan-200">People provide the knowledge. AI helps the business remember, organize, and use it. People continue making the decisions.</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">That is team building, shared business knowledge, and continuous improvement—not employee surveillance and not AI making management decisions.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/50 px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">Choose the ways you naturally connect.</h2>
          <p className="mt-5 max-w-3xl text-lg text-slate-300">Phone. Email. Face-to-face. Networking. Social. A combination. There is no one required NTA approach.</p>
          <p className="mt-4 max-w-3xl text-lg text-slate-300">In fact, you're not selling at all. You're helping business owners understand practical ways they can use AI to help their business grow.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {['Phone', 'Email', 'Face-to-face', 'Networking', 'Social', 'A combination'].map(method => <div key={method} className="rounded-xl border border-cyan-300/30 px-5 py-4 font-semibold text-cyan-100">{method}</div>)}
          </div>
          <p className="mt-7 text-slate-300">The work centers on relationship development and business discovery. Listening, useful questions, and an agreed next step guide the conversation.</p>
        </div>
      </section>

      <section id="explore" className="scroll-mt-24 px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-300">Follow your curiosity</p>
          <h2 className="mt-4 text-3xl font-bold">Explore NTA. See what catches your attention.</h2>
          <p className="mt-5 max-w-3xl text-lg text-slate-300">Read something. Watch a conversation. Ask a question. You do not need to master the whole system before we talk. Bring back one thing that interested you.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {ADVISOR_RESOURCES.map(([title, path, text]) => <a key={path} href={PUBLIC_SITE + path} className="rounded-2xl border border-slate-700 p-6 hover:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300">
              <h3 className="text-lg font-bold text-cyan-200">{title} <span aria-hidden="true">→</span></h3>
              <p className="mt-2 text-slate-300">{text}</p>
            </a>)}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">A guided start. Learning that continues.</h2>
          <p className="mt-5 max-w-3xl text-lg text-slate-300">Curiosity leads to understanding the opportunity, seeing the support, and exploring NTA. Then tell us about yourself, meet Rick, and begin guided onboarding toward your first supported prospects.</p>
          <p className="mt-4 text-slate-300">This is a practical progression we work through together. There is no large training course to complete before beginning.</p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2">
            {ADVISOR_STEPS.map(([id, title, text], index) => <li key={id} className="flex gap-4 rounded-2xl border border-slate-700 p-5">
              <span className="text-xl font-bold text-cyan-300">{String(index + 1).padStart(2, '0')}</span>
              <div><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-300">{text}</p></div>
            </li>)}
          </ol>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold">Curiosity and relationships can come from any stage of life.</h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-300">Whether you are beginning your working life, studying business, marketing or communications, building a business, serving customers, managing accounts, working in media or advertising, changing careers, or retired or semi-retired, your experience can give you a place to begin.</p>
          <div className="mt-8 space-y-3">
            {ADVISOR_FAQS.map(([question, answer]) => <details key={question} className="rounded-2xl border border-slate-700 p-5">
              <summary className="cursor-pointer font-semibold text-cyan-200">{question}</summary>
              <p className="mt-4 leading-relaxed text-slate-300">{answer}</p>
            </details>)}
          </div>
        </div>
      </section>

      <section id="start-conversation" className="scroll-mt-24 border-t border-slate-800 px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-300">Your next step</p>
          <h2 className="mt-4 text-3xl font-bold">Tell us about yourself.</h2>
          <p className="mb-8 mt-4 text-lg leading-relaxed text-slate-300">Rick would like to know what interested you, how you connect with people, and what you would like to learn.</p>
          <AdvisorDiscoveryForm />
          <p className="mt-6 text-sm text-slate-400">Have a question first? Call or text <a className="text-cyan-300 underline" href="tel:6414208816">641-420-8816</a>, or email <a className="text-cyan-300 underline" href="mailto:info@newtechadvertising.com">info@newtechadvertising.com</a>.</p>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>;
}
