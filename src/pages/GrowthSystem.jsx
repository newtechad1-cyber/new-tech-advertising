import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import PillarSection from '@/components/templates/PillarSection';
import {
  Users,
  Brain,
  Library,
  Network,
  UserCheck,
  Compass,
  Cpu,
  MessagesSquare,
  ArrowRight,
  Phone,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const TEAM_FRAMES = [
  { icon: Users, label: 'Team building' },
  { icon: MessagesSquare, label: 'Better communication' },
  { icon: Library, label: 'Shared business knowledge' },
  { icon: Sparkles, label: 'Continuous improvement' },
];

const KNOWLEDGE_SOURCES = [
  'Owner knowledge',
  'Employee questions and observations',
  'Customer questions',
  'Customer feedback',
  'Procedures',
  'Training',
  'Documents',
  'Conversations',
  'Recordings',
  'Products and services',
  'Policies',
  'Vendor information',
  'Lessons learned',
  'Existing business systems',
];

const CONNECTED_PIECES = [
  'Customers ask questions',
  'Employees hear them',
  'Owners make decisions',
  'Vendors provide information',
  'Marketing communicates with the marketplace',
  'Websites and Google help people find the business',
  'Customer records and existing systems contain additional information',
];

const CUSTOMER_TOUCHPOINTS = [
  'Website answers',
  'Employee answers',
  'Customer service',
  'Marketing',
  'Follow-up',
  'Reviews',
  'Referrals',
  'Sales conversations',
  'Customer feedback',
];

const PATTERN_QUESTIONS = [
  'What is working?',
  'Where are customers getting confused?',
  'What keeps frustrating employees?',
  'What questions keep coming up?',
  'Where is information getting lost?',
  'What part of the business needs growth?',
  'What can wait?',
  'What deserves attention now?',
];

const CYCLE = ['Listen', 'Capture', 'Understand', 'Decide', 'Act', 'Measure', 'Learn', 'Improve'];

const AI_HELPS = [
  'Capture information',
  'Transcribe conversations',
  'Organize knowledge',
  'Summarize information',
  'Identify patterns',
  'Prepare useful follow-up',
  'Retrieve business knowledge',
  'Reduce repeated work',
];

const AI_DOES_NOT = [
  "Replace the owner's judgment",
  'Replace employees',
  'Replace customer relationships',
  'Make management decisions',
];

const LEARNING_RESOURCES = [
  { label: 'Knowledge Library', desc: 'Accumulated business knowledge and lessons', href: '/knowledge' },
  { label: 'Better Business Building Book', desc: 'A practical book for owners', href: '/better-business-book' },
  { label: 'Practical AI for Small Business', desc: 'Plainspoken AI guidance', href: '/practical-ai-for-small-business' },
  { label: 'NTA Journal', desc: 'Weekly practical lessons', href: '/journal' },
  { label: 'NTA Growth Show', desc: 'Watch and learn with Rick', href: '/growth-show' },
  { label: 'Your Digital Growth Guide™', desc: 'Ask a question and get direction', href: '/growth-guide' },
];

export default function GrowthSystem() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <MarketingNav />

      {/* Hero */}
      <section className="bg-slate-950 pt-24 pb-16 px-4 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-blue-400 text-xs font-bold uppercase tracking-widest mb-4 bg-blue-500/10 px-3 py-1 rounded-full">
            A Better Way to Build a Business
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6">
            Your business works better when the people and information inside it work together.
          </h1>
          <div className="max-w-2xl mx-auto space-y-5 text-slate-400 text-lg leading-relaxed">
            <p>A business already contains enormous knowledge.</p>
            <p>
              Owners know things. Employees know things. Customers ask questions and provide
              feedback. Vendors provide information. Your website, reviews, marketing, customer
              records, and existing systems contain more pieces of the story.
            </p>
            <p>
              NTA helps bring those pieces together so you can understand what is happening, decide
              what deserves attention, and keep improving the business over time.
            </p>
          </div>
          <p className="mt-8 text-blue-300 font-semibold text-lg">
            People provide the knowledge. People make the decisions.
          </p>
        </div>
      </section>

      {/* Section 1 — Build the Team */}
      <PillarSection
        badge="Section 1"
        heading="Build the Team. Build the Business."
        subheading="Employees hear customer questions, solve problems, notice recurring issues, develop better ways of doing things, and learn things about the business every day. Most businesses lose much of that knowledge because it stays in people's heads or gets scattered across conversations, texts, emails, and meetings."
        dark
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-slate-300 text-base leading-relaxed text-center">
            The Digital Growth Office™ gives the owner and team a practical place to capture
            questions, ideas, observations, and useful business knowledge. AI can help organize
            what people share, remember it, identify patterns, and bring important information back
            to the owner. People remain responsible for judgment and decisions.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TEAM_FRAMES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3"
              >
                <Icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-slate-200 text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-sm text-center italic">
            This is team building and continuous improvement — not employee surveillance, and not AI
            evaluating employees.
          </p>
        </div>
      </PillarSection>

      {/* Section 2 — Knowledge as an Asset */}
      <PillarSection
        badge="Section 2"
        heading="Turn What Your Business Knows Into an Asset."
        subheading="The Knowledge Library is the accumulated memory and knowledge of the business. The goal is not simply storing documents — it is creating a reliable source of business knowledge that people can actually use."
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-wrap justify-center gap-2">
            {KNOWLEDGE_SOURCES.map(source => (
              <span
                key={source}
                className="text-slate-300 text-sm bg-slate-900 border border-slate-800 rounded-full px-3 py-1.5"
              >
                {source}
              </span>
            ))}
          </div>
          <div className="bg-blue-950/30 border border-blue-800/40 rounded-2xl p-6 text-center">
            <p className="text-blue-200 font-semibold text-base">
              People provide the knowledge. AI helps the business remember, organize and use it.
              People make the decisions.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <UserCheck className="w-6 h-6 text-blue-400 mb-3" />
              <h3 className="text-white font-bold text-base mb-2">Consistent answers</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Employees increasingly find consistent answers instead of depending on whoever
                happens to be available.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <Users className="w-6 h-6 text-blue-400 mb-3" />
              <h3 className="text-white font-bold text-base mb-2">New employees learn faster</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                New employees can learn from what the business has already learned.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <Brain className="w-6 h-6 text-blue-400 mb-3" />
              <h3 className="text-white font-bold text-base mb-2">Owners stop repeating</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Owners do not have to answer the same questions repeatedly.
              </p>
            </div>
          </div>
        </div>
      </PillarSection>

      {/* Section 3 — Connect the Business */}
      <PillarSection
        badge="Section 3"
        heading="Connect the Business."
        subheading="Once the business begins capturing what it knows, useful connections become easier to see. The Digital Growth Office™ gives these pieces a practical place to come together."
        dark
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <ul className="space-y-3">
            {CONNECTED_PIECES.map(piece => (
              <li key={piece} className="flex items-start gap-3">
                <Network className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-base">{piece}</span>
              </li>
            ))}
          </ul>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
            <p className="text-slate-300 text-sm leading-relaxed">
              NTA should first understand the systems the business already owns before recommending
              additional technology.
            </p>
            <p className="text-blue-300 font-semibold text-base">
              The goal is not more software. The goal is helping the business work better together.
            </p>
          </div>
        </div>
      </PillarSection>

      {/* Section 4 — Consistent Customer Experience */}
      <PillarSection
        badge="Section 4"
        heading="Give the Customer a Consistent Experience."
        subheading="Customers should not receive one answer from the website, another from one employee, and something different from another employee. Shared business knowledge can improve communication throughout the customer experience."
      >
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex flex-wrap justify-center gap-2">
            {CUSTOMER_TOUCHPOINTS.map(touch => (
              <span
                key={touch}
                className="text-slate-300 text-sm bg-slate-900 border border-slate-800 rounded-full px-3 py-1.5"
              >
                {touch}
              </span>
            ))}
          </div>
          <p className="text-slate-300 text-base leading-relaxed text-center">
            Customer questions and feedback also return useful knowledge to the business.
          </p>
          <div className="bg-blue-950/30 border border-blue-800/40 rounded-2xl p-6 text-center">
            <p className="text-blue-200 font-semibold text-base">
              The customer becomes part of the learning process — not just the person at the end of
              it.
            </p>
          </div>
        </div>
      </PillarSection>

      {/* Section 5 — Growth Roadmap */}
      <PillarSection
        badge="Section 5"
        heading="Now You Can See What to Work on Next."
        subheading="As the business captures more useful knowledge, patterns become easier to see. NTA helps turn what the business is learning into a practical Digital Growth Roadmap™."
        dark
      >
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PATTERN_QUESTIONS.map(q => (
              <div
                key={q}
                className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3"
              >
                <Compass className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">{q}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-slate-400 text-sm text-center mb-4">
              The Roadmap is not a package. It changes as the business learns.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {CYCLE.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="bg-slate-900 border border-blue-800/50 text-blue-300 text-sm font-semibold rounded-full px-3 py-1.5">
                    {step}
                  </span>
                  {i < CYCLE.length - 1 && <ArrowRight className="w-3 h-3 text-slate-600" />}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <Link
              to="/growth-roadmap-generator"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors"
            >
              See the full Digital Growth Roadmap <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </PillarSection>

      {/* Section 6 — Technology Supports */}
      <PillarSection
        badge="Section 6"
        heading="Technology Supports the Business. It Doesn't Lead It."
        subheading="Technology belongs where it helps real people do real work. NTA should understand the business first and then determine where technology is genuinely useful."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-bold text-base">AI can help</h3>
            </div>
            <ul className="space-y-2">
              {AI_HELPS.map(item => (
                <li key={item} className="flex items-start gap-2 text-slate-400 text-sm">
                  <span className="text-blue-400 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-slate-400" />
              <h3 className="text-white font-bold text-base">But AI does not</h3>
            </div>
            <ul className="space-y-2">
              {AI_DOES_NOT.map(item => (
                <li key={item} className="flex items-start gap-2 text-slate-400 text-sm">
                  <span className="text-slate-600 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PillarSection>

      {/* Section 7 — Keep Learning Together */}
      <PillarSection
        badge="Section 7"
        heading="Keep Learning Together."
        subheading="These resources support the Digital Growth Office and Growth Roadmap. They are not separate products competing for attention."
        dark
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {LEARNING_RESOURCES.map(({ label, desc, href }) => (
            <Link
              key={label}
              to={href}
              className="flex items-start gap-3 bg-slate-900 border border-slate-800 hover:border-blue-700 rounded-xl p-4 transition-all group"
            >
              <div className="flex-1">
                <p className="text-white text-sm font-semibold group-hover:text-blue-300 transition-colors">
                  {label}
                </p>
                <p className="text-slate-500 text-xs mt-1">{desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 flex-shrink-0 mt-0.5 transition-colors" />
            </Link>
          ))}
        </div>
      </PillarSection>

      {/* Final CTA — Conversation First */}
      <section className="bg-slate-950 border-t border-slate-800 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Start With a Conversation.
          </h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            You don't have to know what service or technology you need. Start with what's on your
            mind. NTA will listen, ask questions, and help you understand what might make sense next.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/start"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
            >
              Start a Free Growth Conversation <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/growth-guide"
              className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Ask Your Digital Growth Guide™
            </Link>
          </div>
          <a
            href="tel:+16414208816"
            className="inline-flex items-center gap-2 mt-6 text-slate-400 hover:text-slate-200 text-sm transition-colors"
          >
            <Phone className="w-4 h-4" /> Talk to My Office™ — call or text 641-420-8816
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}