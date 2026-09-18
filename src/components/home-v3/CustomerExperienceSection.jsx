import { Globe, Users, Megaphone, Reply, RefreshCw } from 'lucide-react';

const CONSISTENT = [
  { icon: Globe, text: 'The website can answer the questions customers actually ask.' },
  { icon: Users, text: 'Employees can give better answers.' },
  { icon: Megaphone, text: 'Marketing can reflect what is really happening in the business.' },
  { icon: Reply, text: 'Follow-up can become more useful.' },
  { icon: RefreshCw, text: 'Customer feedback can come back into the business so the team keeps learning from it.' },
];

export default function CustomerExperienceSection() {
  return (
    <section className="border-y border-slate-800 bg-slate-900/40 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">Give the Customer a Consistent Experience.</p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Customers shouldn&rsquo;t get one answer from your website, another from an employee and something different when they call the office.</h2>
        </div>

        <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-slate-300">
          When your team works from shared knowledge, the whole business can become more consistent.
        </p>

        <div className="mx-auto mt-9 grid max-w-4xl gap-4 sm:grid-cols-2">
          {CONSISTENT.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                <Icon className="h-5 w-5" />
              </div>
              <p className="leading-relaxed text-slate-200">{text}</p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-xl font-semibold leading-relaxed text-blue-200">
          The customer becomes part of the learning process—not just the person at the end of it.
        </p>
      </div>
    </section>
  );
}