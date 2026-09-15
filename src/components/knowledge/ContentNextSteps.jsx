import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, MessageCircle, Play } from 'lucide-react';
import { useGrowthShow } from '@/hooks/useGrowthShow';
import { contentContext, followUpPath, learningLinks, relatedEpisodeLinks } from '@/lib/contentJourney';
import { trackJourneyEvent } from '@/lib/journeyAnalytics';

export function ContentNextSteps({ title, path, resources = [] }) {
  const context = contentContext({ title, path });
  const links = learningLinks(resources, path);

  const openGuide = () => {
    trackJourneyEvent('content_growth_guide_opened', { route: context?.path, source: 'content_next_step' });
    window.dispatchEvent(new CustomEvent('nta:open-growth-guide', {
      detail: { ...context, question: context?.title, source: 'content_next_step' },
    }));
  };

  return (
    <aside className="not-prose rounded-2xl border border-blue-500/25 bg-slate-900/70 p-6 md:p-8" aria-label="Continue learning or ask for help">
      {links.length > 0 && (
        <div className="mb-7 border-b border-slate-700 pb-7">
          <h2 className="text-xl font-bold text-white">Keep exploring this idea</h2>
          <div className="mt-4 grid gap-3">
            {links.map(link => {
              const Icon = link.kind === 'video' ? Play : BookOpen;
              const contents = <><Icon className="mt-1 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" /><span className="min-w-0 break-words"><span className="block text-xs font-semibold text-slate-400">{link.kind === 'video' ? 'Watch the related video' : 'Read the related article or lesson'}</span><span className="mt-1 block font-semibold text-white">{link.title}</span></span><ArrowRight className="ml-auto mt-1 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" /></>;
              const className = 'flex items-start gap-3 rounded-xl border border-slate-700 p-4 transition-colors hover:border-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400';
              return link.href.startsWith('/')
                ? <Link key={link.href} to={link.href} className={className}>{contents}</Link>
                : <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={className}>{contents}</a>;
            })}
          </div>
        </div>
      )}
      <h2 className="text-2xl font-bold text-white">What could this help you improve?</h2>
      <p className="mt-3 leading-7 text-slate-300">Ask Your Digital Growth Guide™ how this fits your business. The Guide opens with this topic ready for you to edit and send.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button type="button" onClick={openGuide} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-500">
          <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" /> Ask about this topic
        </button>
        <Link to={followUpPath(context)} onClick={() => trackJourneyEvent('content_follow_up_opened', { route: context?.path, source: 'content_next_step' })} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-5 py-3 font-bold text-white hover:border-blue-400">
          Ask Rick to follow up <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </Link>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-400">For a personal reply, choose email, call or text on the request form. This topic goes with your message so Rick has the starting point.</p>
      <div className="mt-5 flex flex-col gap-3 border-t border-slate-700 pt-5 text-sm sm:flex-row sm:flex-wrap sm:gap-x-6">
        <Link to="/services#first-project" className="font-semibold text-blue-300 hover:text-blue-200">See how a first project works</Link>
        <Link to="/nta-journal#subscribe" className="font-semibold text-blue-300 hover:text-blue-200">Keep learning with the Tuesday Journal</Link>
      </div>
    </aside>
  );
}

export default function ConnectedContentNextSteps(props) {
  const { episodes } = useGrowthShow();
  const relatedVideos = props.resources?.some(resource => resource.kind === 'video') ? [] : relatedEpisodeLinks(props, episodes);
  return <ContentNextSteps {...props} resources={[...(props.resources || []), ...relatedVideos]} />;
}
