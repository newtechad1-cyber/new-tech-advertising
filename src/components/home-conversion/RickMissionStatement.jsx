// Rick approved this exact personal statement on October 12, 2026 for both
// New Tech Advertising and Talking About Jesus. Keep its wording synchronized
// with the approved quote in Rick Hesse Working Brain; do not paraphrase it.
const MISSION_STATEMENT = 'My mission is to help everyday people and small-business owners understand AI—to clear up the confusion, make it less intimidating, and help them see where it can be useful in their own lives. I want people to have a place to ask their questions and get explanations they can understand, without pressure, judgment, or hype.';

export default function RickMissionStatement() {
  return (
    <figure
      id="ricks-mission"
      aria-labelledby="ricks-mission-label ricks-mission-author"
      className="mx-auto my-8 max-w-3xl scroll-mt-28 rounded-r-2xl border-l-4 border-cyan-300 bg-slate-900 px-5 py-6 text-left sm:px-7"
    >
      <p id="ricks-mission-label" className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
        My mission
      </p>
      <blockquote className="text-lg leading-8 text-white md:text-xl md:leading-8">
        <p>&ldquo;{MISSION_STATEMENT}&rdquo;</p>
      </blockquote>
      <figcaption id="ricks-mission-author" className="mt-4 text-base font-semibold text-cyan-200">
        &mdash; Rick Hesse
      </figcaption>
    </figure>
  );
}
