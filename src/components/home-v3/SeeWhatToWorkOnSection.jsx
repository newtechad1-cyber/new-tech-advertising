import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SeeWhatToWorkOnSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">Now You Can See What to Work on Next.</p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">As the business brings its people, knowledge and customer experience together, patterns become easier to see.</h2>
        </div>

        <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-slate-300">
          What&rsquo;s working? What&rsquo;s causing frustration? What are customers asking for? Where is information getting lost? What part of the business needs attention now?
        </p>

        <div className="mx-auto mt-9 max-w-3xl rounded-2xl border border-cyan-800/40 bg-cyan-950/20 p-7 text-center">
          <p className="text-lg leading-relaxed text-slate-200">That&rsquo;s where the <strong className="text-white">Digital Growth Roadmap™</strong> becomes useful.</p>
          <p className="mt-4 leading-relaxed text-slate-300">NTA helps you turn what you&rsquo;re learning into practical priorities—what to work on now, what can wait, and what could make the biggest difference next.</p>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm font-semibold tracking-wide text-cyan-200">
          Listen → Capture → Understand → Decide → Act → Measure → Learn → Improve
        </p>

        <div className="mt-8 text-center">
          <Link to="/growth-roadmap-generator" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white transition-colors hover:bg-blue-500">
            Explore the Digital Growth Roadmap™ <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}