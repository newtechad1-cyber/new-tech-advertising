import { Link } from 'react-router-dom';
import { ArrowRight, Play, Youtube } from 'lucide-react';
import { VIDEO_WORK_EXAMPLES, VIDEO_GALLERY_PATH, CLIENT_SHOWCASE_PLAYLIST_URL } from '@/data/videoLearningConnections';

export default function VideoWorkShowcase() {
  return (
    <section aria-labelledby="video-work-heading">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-600">See the work</p>
      <h2 id="video-work-heading" className="mt-3 text-3xl font-bold text-slate-900">Examples of NTA video work</h2>
      <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">A business introduction, a short brand message, and a teaching conversation each do a different job. These selected public videos show ways NTA helps people explain their work.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {VIDEO_WORK_EXAMPLES.map(({ videoId, video, label, note }) => (
          <article key={videoId} className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <Link to={VIDEO_GALLERY_PATH + '/' + videoId} aria-label={'Watch ' + video.title} className="relative block aspect-video overflow-hidden bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
              <img src={'https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg'} alt="" loading="lazy" width="480" height="360" className="h-full w-full object-cover" />
              <span className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900"><Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" /></span>
            </Link>
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">{label}</p>
              <h3 className="mt-3 text-lg font-bold leading-snug text-slate-900">{video.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{note}</p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold">
                <Link to={VIDEO_GALLERY_PATH + '/' + videoId} className="inline-flex items-center gap-2 rounded text-blue-700 hover:text-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"><Play className="h-4 w-4" aria-hidden="true" /> Watch here</Link>
                <a href={'https://www.youtube.com/watch?v=' + videoId} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded text-slate-700 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"><Youtube className="h-4 w-4" aria-hidden="true" /> YouTube ↗</a>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:gap-x-7">
        <Link to={VIDEO_GALLERY_PATH + '?category=Video%20Work'} className="inline-flex items-center gap-2 rounded font-bold text-blue-700 hover:text-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">Browse video work <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        <a href={CLIENT_SHOWCASE_PLAYLIST_URL} target="_blank" rel="noopener noreferrer" className="rounded text-sm font-semibold text-slate-600 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">More client showcases on YouTube ↗</a>
        <Link to="/knowledge" className="rounded text-sm font-semibold text-slate-600 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">Read about the NTA approach</Link>
      </div>
    </section>
  );
}
