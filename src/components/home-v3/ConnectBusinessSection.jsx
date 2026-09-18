import { Link2, Globe, Star, Database, FileText } from 'lucide-react';

const PIECES = [
  { icon: Globe, label: 'Website & Google presence' },
  { icon: Star, label: 'Reviews' },
  { icon: Database, label: 'Customer records' },
  { icon: FileText, label: 'Existing systems' },
];

export default function ConnectBusinessSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">Connect the Business.</p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Once people begin sharing what they know, you can connect the rest of the business around it.</h2>
        </div>

        <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-slate-300">
          Customers ask questions. Employees hear them. Owners make decisions. Vendors provide information. Your website, Google presence, reviews, customer records and existing systems all contain another piece of the story.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          {PIECES.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-200">
              <Icon className="h-4 w-4 text-blue-400" /> {label}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-cyan-800/40 bg-cyan-950/20 p-7 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200">
            <Link2 className="h-5 w-5" />
          </div>
          <p className="text-lg leading-relaxed text-slate-200">Your <strong className="text-white">Digital Growth Office™</strong> gives those pieces a place to come together.</p>
          <p className="mt-4 leading-relaxed text-slate-300">Instead of information being scattered across people, systems and conversations, the business begins developing one shared source of knowledge that everyone can build from.</p>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xl font-semibold leading-relaxed text-blue-200">
          Better communication inside the business leads to better communication with the customer.
        </p>
      </div>
    </section>
  );
}