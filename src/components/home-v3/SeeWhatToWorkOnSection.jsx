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
          <p className="mt-4 leading-relaxed text-slate-300">Start with something you recognize in your business. Together, we look at one relevant possibility and decide whether it belongs in the plan—what to work on now, what can wait, and why.</p>
          <p className="mt-4 leading-relaxed text-slate-300">We help put the agreed improvement to work, show the team how to use it, and test it in a real customer situation. Then we review what happened and adjust. That might mean easier shopping, clearer menus and smoother restaurant service, better customer conversations, or less repeated work.</p>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm font-semibold tracking-wide text-cyan-200">
          Understand the business → Choose a priority → Put it to work → Teach and test → Review and improve
        </p>

        <div className="mt-8 text-center">
          <Link to="/growth-roadmap-generator" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white transition-colors hover:bg-blue-500">
            Explore the Digital Growth Roadmap™ <ArrowRight className="h-5 w-5" />
          </Link>
          <Link to="/knowledge/ai-foundations/how-do-you-put-ai-to-work-in-a-real-business" className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-cyan-200 underline underline-offset-4 transition-colors hover:text-white">
            See how AI fits a real business <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}