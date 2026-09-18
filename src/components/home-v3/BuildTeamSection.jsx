import { Users, MessageCircle, Lightbulb, Truck, BrainCircuit, CheckCircle2 } from 'lucide-react';

const KNOWLEDGE_SOURCES = [
  { icon: Users, label: 'Employees', desc: "Hear customer questions, solve problems, notice what isn't working, and come up with ideas every day." },
  { icon: MessageCircle, label: 'Customers', desc: 'Provide feedback about what they need, like, and wish were different.' },
  { icon: Lightbulb, label: 'Owners', desc: 'Make decisions and set direction based on what they see and hear.' },
  { icon: Truck, label: 'Vendors & Partners', desc: 'Add another part of the picture through their own knowledge of the business.' },
];

const WHAT_IT_MEANS = [
  'Fewer mixed messages',
  'Better communication between owners and employees',
  'More consistent answers for customers',
  'Better training for new people',
  'A team that keeps learning together',
];

export default function BuildTeamSection() {
  return (
    <section className="border-y border-slate-800 bg-slate-900/40 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">Build the Team. Build the Business.</p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">A business grows when its people learn how to work together.</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {KNOWLEDGE_SOURCES.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">{label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
          <p className="text-lg leading-relaxed text-slate-200">The problem is that most of that knowledge gets scattered across conversations, texts, emails, meetings and people&rsquo;s heads.</p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-cyan-800/40 bg-cyan-950/20 p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div className="space-y-4 leading-relaxed text-slate-200">
              <p>Your <strong className="text-white">Digital Growth Office™</strong> gives everyone a common place to bring that knowledge together.</p>
              <p>An employee can ask a question, share an idea, point out a recurring problem or explain what customers are saying. AI can help organize those conversations, identify patterns and bring important information back to the owner. The owner can respond, clarify expectations and turn what the team is learning into better processes, training and decisions.</p>
              <p>Over time, the business begins building a shared <strong className="text-white">Knowledge Library</strong>—one reliable place where people can find answers and understand how the business works.</p>
            </div>
          </div>
        </div>

        <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
          {WHAT_IT_MEANS.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
              <span className="text-slate-200">{item}</span>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-10 max-w-3xl text-center text-xl font-semibold leading-relaxed text-blue-200">
          The knowledge of the whole company becomes a business asset—and the stronger that asset becomes, the stronger the business can become.
        </p>
      </div>
    </section>
  );
}