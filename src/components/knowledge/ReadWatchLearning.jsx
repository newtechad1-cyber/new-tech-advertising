import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Play } from 'lucide-react';
import { READ_WATCH_TOPICS, videoWatchPath, VIDEO_GALLERY_PATH } from '@/data/videoLearningConnections';

export default function ReadWatchLearning() {
  return (
    <section className="border-b border-slate-800 bg-slate-950 px-6 py-14" aria-labelledby="read-or-watch-heading">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Learn in the way that works for you</p>
          <h2 id="read-or-watch-heading" className="mt-3 text-3xl font-bold text-white">Choose a topic. Read or watch.</h2>
          <p className="mt-4 leading-relaxed text-slate-300">Each pairing connects a Knowledge Library lesson with a related video conversation. Read at your own pace, hear Rick explain the idea, or use both.</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {READ_WATCH_TOPICS.map(topic => (
            <article key={topic.videoId} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
              <Link to={videoWatchPath(topic.video)} aria-label={'Watch ' + topic.video.title} className="group relative block aspect-video overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">
                <img src={'https://i.ytimg.com/vi/' + topic.videoId + '/hqdefault.jpg'} alt="" loading="lazy" width="480" height="360" className="h-full w-full object-cover" />
                <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-950"><Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden="true" /></span>
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-xl font-bold leading-snug text-white">{topic.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">Related video: {topic.video.title}</p>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-4 text-sm font-bold">
                  <Link to={topic.href} className="inline-flex items-center gap-2 rounded text-cyan-300 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"><BookOpen className="h-4 w-4" aria-hidden="true" /> Read the lesson</Link>
                  <Link to={videoWatchPath(topic.video)} className="inline-flex items-center gap-2 rounded text-white hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"><Play className="h-4 w-4" aria-hidden="true" /> Watch the video</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <Link to={VIDEO_GALLERY_PATH} className="mt-7 inline-flex items-center gap-2 rounded font-semibold text-cyan-300 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">Explore the full video gallery <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
