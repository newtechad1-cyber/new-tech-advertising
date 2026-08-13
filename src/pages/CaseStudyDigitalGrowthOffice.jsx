import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle, MapPin } from 'lucide-react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const lessons = [
  {
    title: 'Experience becomes more valuable when it is organized.',
    body: 'Knowledge that remains in the owner’s head can help only one conversation at a time. Organized knowledge can teach customers, guide employees, improve decisions, and give AI a reliable foundation.',
  },
  {
    title: 'A knowledge base should guide action, not merely store articles.',
    body: 'A library becomes more useful when it connects to questions, discovery, recommendations, related lessons, and a real human conversation.',
  },
  {
    title: 'Connected does not mean combined.',
    body: 'The public front office and private back office should support the same goals, but they have different jobs. One is built to be found and understood. The other is built to protect information and organize the work.',
  },
  {
    title: 'AI works best when people can use it naturally.',
    body: 'Business owners should be able to speak, type, upload, review, approve, text, or call in ways that already feel familiar. The system should organize the complexity behind the scenes.',
  },
  {
    title: 'The website is never really finished.',
    body: 'Customer questions create new lessons. Client work produces new evidence. Search behavior changes. AI discovery changes. The system has to keep learning without losing the principles that hold it together.',
  },
  {
    title: 'A case study should help an owner understand the work.',
    body: 'The purpose is not to overwhelm people with technical detail. A useful case study explains the real situation, what was done, what changed, what remains unfinished, and what another business owner can learn from the experience.',
  },
];

function Section({ title, children }) {
  return (
    <section className="space-y-5">
      <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
      <div className="space-y-5 text-slate-300 text-lg leading-relaxed">{children}</div>
    </section>
  );
}

export default function CaseStudyDigitalGrowthOffice() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SEOHead
        title="How NTA Became a Digital Growth Office | Case Study"
        description="How Rick Hesse organized more than 45 years of business, advertising, sales, and client-service experience into NTA's connected Digital Growth Office."
      />
      <MarketingNav />

      <main>
        <header className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <Link to="/case-studies" className="mb-7 inline-block text-sm text-slate-400 hover:text-white">
              ← All Case Studies
            </Link>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-violet-500/30 bg-violet-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-300">
                NTA's Own Case Study
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-400">
                <MapPin className="h-4 w-4" /> Mason City, Iowa
              </span>
            </div>
            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              How NTA Became a Digital Growth Office
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-relaxed text-slate-300">
              Turning more than 45 years of business ownership, advertising, sales, client service, success, failure, and hands-on learning into a guided online system.
            </p>
            <p className="mt-6 text-sm text-slate-500">By Rick Hesse, New Tech Advertising</p>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 lg:grid-cols-[minmax(0,1fr)_300px] lg:py-20">
          <article className="space-y-14">
            <div className="rounded-2xl border border-violet-500/25 bg-violet-500/10 p-6 sm:p-8">
              <p className="text-xl leading-relaxed text-slate-200">
                I did not set out to build something nobody else had built. I was trying to solve a practical problem: How could a business owner begin working with me online in the same natural way we would talk across a table?
              </p>
              <p className="mt-4 text-xl font-semibold text-white">That question changed New Tech Advertising.</p>
            </div>

            <Section title="The Problem With the Typical Agency Website">
              <p>Most agency websites follow a familiar pattern. They list services, show examples, make a few promises, and ask the visitor to schedule a call.</p>
              <p>There is nothing inherently wrong with that structure. It simply did not represent the way I actually help people.</p>
              <p>My real work begins before I recommend a website, advertising campaign, AI tool, or marketing tactic. I listen. I ask questions. I try to understand how the business operates, what the owner wants, what is already working, what keeps falling through the cracks, and what the owner is ready to change.</p>
              <p>A list of services could not carry that experience. A conventional website could describe what NTA sells, but it could not show how I think or help an owner begin discovering what the business really needs.</p>
            </Section>

            <Section title="The Real Product Was Experience">
              <p>For years, much of the value I brought to a business lived in my head. It came from decades of watching how people buy, how owners make decisions, why some advertising works, why some systems fail, and what happens when a business has tools but no connected way of using them.</p>
              <p>That knowledge was real, but it was scattered across conversations, proposals, client work, notes, stories, and lessons I had learned the hard way.</p>
              <p>The turning point was realizing that my experience was not merely background information for an About page. It was a business asset. If it could be captured, organized, tested, and expressed clearly, it could teach people before they ever called me and guide the work after they became clients.</p>
            </Section>

            <Section title="From a Website to a Connected System">
              <p>The Knowledge Library became the organized body of lessons and principles behind the business. The NTA Journal created a way to publish timely teaching and observations. The Growth Show added a conversational video format. Case studies could show what happened, what was learned, and how the lesson might help another owner—without turning real client work into a long, technical document few owners have time to read.</p>
              <p>Your Digital Growth Guide™ created a different kind of entry point. Instead of forcing a visitor to understand NTA’s services first, it could begin with the visitor’s questions, help clarify the situation, and guide the person toward useful information or a practical next step.</p>
              <p>The Growth Roadmap gave discovery an outcome: not a generic sales pitch, but a clear summary of what the owner wants, what may be getting in the way, and which realistic path deserves attention first.</p>
              <p>Behind the public experience, the private Digital Growth Office could organize conversations, files, approvals, tasks, content, and follow-up. The public side would help people find, understand, and trust the business. The private side would help NTA and the client deliver the work.</p>
              <p className="font-semibold text-white">These are not separate ideas added to fill a website. They are parts of one system.</p>
            </Section>

            <Section title="AI Did Not Create the Point of View">
              <p>Artificial intelligence made this structure possible, but it did not create the experience behind it.</p>
              <p>AI did not spend decades selling advertising, owning businesses, sitting with clients, making mistakes, watching campaigns succeed or fail, or learning why trust matters more than pressure. I did.</p>
              <p>What AI changed was my ability to work with that experience. It helped me capture spoken thoughts, find connections, organize lessons, compare ideas, and turn one approved source into useful material for several channels.</p>
              <p>A generic AI tool can produce words. A useful Digital Growth Guide needs a trustworthy source of truth. The quality of the guidance depends on the quality of the knowledge, principles, experience, and human judgment behind it.</p>
              <p className="font-semibold text-white">AI did not replace my point of view. It finally gave that point of view somewhere to go.</p>
            </Section>

            <Section title="The Work Behind What Looks Simple">
              <p>Someone may eventually see a website, one dashboard, a form, a text message, Your Digital Growth Guide™, a client workspace, or a simple way to begin. That simplicity is intentional. The simpler the result, the more complicated the setup probably was.</p>
              <p>This did not come together in a few prompts or a few late nights. Most days for months, I have been putting in ten-hour days—thinking, building, testing, rearranging, learning, and going back through what did not quite work. I am not saying that for sympathy. I love this work. I am building the kind of office and the kind of help I spent decades wishing a business owner could have.</p>
              <p>I wanted NTA to be proven from the inside before I asked a client to trust it. That means the discovery questions, knowledge, content, workflows, client spaces, analytics, follow-up, and AI guidance have to fit together in a way that makes sense to a real person—not just look impressive in a demo.</p>
              <p>The job is not to hand an owner more technology or expect them to become a website developer, AI expert, or database specialist. The job is to absorb the complexity, connect the pieces, and give the person something understandable and usable. That is why the free way to begin matters: a business owner should be able to start with a conversation, not a technical learning curve.</p>
              <p>That is also the lesson behind <Link to="/canon/the-work-you-dont-see-why-setup-matters" className="font-semibold text-cyan-300 hover:text-white">The Work You Don’t See: Why Setup Matters</Link>.</p>
            </Section>

            <Section title="What the Comparison Revealed">
              <p>As part of this work, I compared NTA with agency, consulting, business-education, assessment, and founder-led websites in Iowa, the Midwest, and beyond.</p>
              <p>I found many of the individual pieces elsewhere: resource libraries, podcasts, assessments, advisory services, founder frameworks, dashboards, and AI assistants. I found organizations doing valuable work in each of those areas.</p>
              <p>What I did not find in North Iowa or southern Minnesota was a close equivalent that connected a founder’s accumulated experience, a public Knowledge Library, a guided discovery experience, a Growth Roadmap, educational media, case studies, services, and a private client workspace in the same way.</p>
              <p>That does not prove no similar system exists. No practical search can establish that. It does show that the combination is uncommon—and that NTA should explain the structure clearly instead of assuming visitors will immediately understand it.</p>
            </Section>

            <section className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Lessons Learned While Building It</h2>
              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <div key={lesson.title} className="rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 font-bold">{index + 1}</span>
                      <div>
                        <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
                        <p className="mt-2 leading-relaxed text-slate-300">{lesson.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Section title="Why I Proved It Before I Sold It">
              <p className="font-semibold text-white">I have learned not to sell a system and hope it works later. I wanted to build this one, use it, and prove the setup to myself before asking another business owner to trust it.</p>
              <p>That is what I have done. The Digital Growth Office is working. I know how to operate it, and I am already using parts of the system to fulfill real client services—from websites and visibility work to content, reporting, organization, and connected back-office support.</p>
              <p>I am no longer asking whether the setup works. I have proven that it does, and I know enough about working with AI to use it responsibly alongside my own experience and judgment for clients. NTA is ready for business.</p>
              <p>That does not mean every client will need the same tools or receive the same result. Discovery still comes first, and each relationship has to fit the owner, the business, and the work. It means the foundation is no longer theoretical: it has been built, tested, refined, and put to use.</p>
              <p className="font-semibold text-white">My principle is simple: prove it first, then sell it. I do not want another owner paying to become the test case for something I have not learned how to deliver.</p>
            </Section>

            <Section title="Why This Matters for Other Business Owners">
              <p>Most experienced owners know far more than their websites reveal.</p>
              <p>Their best knowledge may be scattered across conversations, notebooks, emails, employees’ memories, customer questions, old files, and years of decisions. Their website may list what they sell without expressing why they do it, how they think, or what their experience has taught them.</p>
              <p>AI creates a new opportunity—not to manufacture expertise, but to uncover, organize, and responsibly use the expertise the business already possesses.</p>
              <p>The principle is simple: software should come after understanding.</p>
            </Section>

            <section className="rounded-2xl border border-cyan-500/25 bg-cyan-500/10 p-7 sm:p-9">
              <div className="mb-4 flex items-center gap-2 text-cyan-300">
                <BookOpen className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-wider">NTA Point of View</span>
              </div>
              <p className="text-xl leading-relaxed text-slate-100">A business does not need more disconnected tools. It needs a clearer understanding of what it knows, whom it serves, how it creates trust, and what it is trying to become.</p>
              <p className="mt-5 text-xl leading-relaxed text-slate-100">The website should make that understanding visible. Your Digital Growth Guide™ should help people explore it. The private office should help the business act on it. AI should support the owner’s experience and judgment, not erase them.</p>
              <p className="mt-5 text-xl font-semibold leading-relaxed text-white">That is what New Tech Advertising has built: a working Digital Growth Office where experience becomes knowledge, knowledge becomes guidance, and guidance becomes practical growth.</p>
            </section>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-bold">New Tech Advertising</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Based in North Iowa, NTA works with businesses throughout North Iowa and southern Minnesota—including the growing Rochester market—while serving clients nationally.
              </p>
              <div className="mt-5 space-y-3 text-sm text-slate-300">
                {['Knowledge Library', 'Your Digital Growth Guide™', 'Growth Roadmap', 'NTA Journal and Growth Show'].map(item => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-violet-500/25 bg-violet-500/10 p-6">
              <h2 className="text-xl font-bold">Start with a conversation</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">Explore your questions with Your Digital Growth Guide™, or talk directly with Rick about your business.</p>
              <Link to="/growth-guide" className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-bold text-white transition hover:bg-violet-500">
                Open Your Growth Guide <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="tel:6414208816" className="mt-3 block text-center text-sm font-semibold text-violet-300 hover:text-white">
                Call 641-420-8816
              </a>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
