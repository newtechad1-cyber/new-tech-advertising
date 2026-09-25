import { Link } from 'react-router-dom';
import { useGrowthShow } from '@/hooks/useGrowthShow';
import { findGrowthShowEpisode } from '@/lib/growthShow';
import { ContentNextSteps } from '@/components/knowledge/ContentNextSteps';

export default function GrowthShowEpisodeConnections({ slug, title, path, existingLinks = [], skipTestimonial = false }) {
  const { episodes } = useGrowthShow();
  const episode = findGrowthShowEpisode(episodes, slug);
  if (!episode) return null;

  const resources = [];
  const primaryLesson = episode.lessons[0] || episode.article;
  if (primaryLesson) resources.push({
    label: 'Knowledge Library',
    title: primaryLesson.title,
    url: primaryLesson.canonical_url || '/' + primaryLesson.slug,
  });
  for (const journal of episode.journals) resources.push({
    label: 'NTA Journal',
    title: journal.title,
    url: '/journal/' + (journal.slug || 'issue-' + journal.issue_number),
  });
  for (const book of episode.books) resources.push({
    label: 'NTA book',
    title: book.title,
    url: '/' + book.slug,
  });
  for (const asset of episode.socialAssets) resources.push({
    label: asset.platform + ' content',
    title: asset.label || episode.title + ' on ' + asset.platform,
    url: asset.url,
    external: true,
  });
  for (const item of episode.downloadableResources) resources.push({
    label: 'Download',
    title: item.title,
    url: item.url,
    external: true,
  });
  if (episode.podcastUrl) resources.push({
    label: 'Podcast',
    title: 'Listen to this episode',
    url: episode.podcastUrl,
    external: true,
  });

  const normalized = url => String(url || '').replace(/^https:\/\/newtechadvertising\.com/, '');
  const visibleResources = resources.filter(resource => !existingLinks.some(link => normalized(link) === normalized(resource.url)));

  return (
    <section className="mt-12 border-t border-slate-800 pt-8" aria-label="Connected episode resources">
      {episode.testimonial && !skipTestimonial && (
        <div className="mb-10 rounded-2xl border border-blue-400/25 bg-blue-500/5 p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-300">{episode.testimonial.label || 'A viewer’s response'}</h2>
          <blockquote className="mt-4 text-xl text-white">“{episode.testimonial.quote}”</blockquote>
          <p className="mt-3 text-sm text-slate-300">— {episode.testimonial.attribution}{episode.testimonial.business && ', ' + episode.testimonial.business}{episode.testimonial.location && ' · ' + episode.testimonial.location}</p>
          {episode.testimonial.context && <p className="mt-3 text-sm text-slate-400">{episode.testimonial.context}</p>}
        </div>
      )}
      {visibleResources.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-white">More from this episode</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {visibleResources.map(resource => (
              <div key={resource.label + resource.url} className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-300">{resource.label}</p>
                {resource.external
                  ? <a href={resource.url} target="_blank" rel="noopener noreferrer" className="mt-2 block font-semibold text-white hover:text-blue-300">{resource.title}</a>
                  : <Link to={resource.url} className="mt-2 block font-semibold text-white hover:text-blue-300">{resource.title}</Link>}
              </div>
            ))}
          </div>
        </>
      )}
      <div className="mt-12"><ContentNextSteps title={title} path={path} /></div>
    </section>
  );
}
