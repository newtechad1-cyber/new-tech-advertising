import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Headphones, Play } from 'lucide-react';
import { VIDEO_READING_CONNECTIONS } from '@/data/videoLearningConnections';
import { useGrowthShow } from '@/hooks/useGrowthShow';
import GrowthShowAudioPlayer from '@/components/video/GrowthShowAudioPlayer';

export default function LessonMediaOptions({ path }) {
  const { episodes } = useGrowthShow();
  const [selected, setSelected] = useState(null);
  const connections = VIDEO_READING_CONNECTIONS.filter(connection => connection.href === path);
  if (!connections.length) return null;
  return <section className="my-8 rounded-2xl border border-cyan-300/25 bg-slate-900 p-5 sm:p-7" aria-label="Related video and podcast options">
    <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Choose how to explore this idea</p>
    <h2 className="mt-3 text-2xl font-bold text-white">Read the lesson. Watch or listen to the related conversation.</h2>
    <p className="mt-3 text-sm leading-7 text-slate-300">These videos explore the same topic. They are related conversations, rather than word-for-word recordings of this lesson.</p>
    <a href="#lesson-reading" className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-3 font-bold text-white"><BookOpen className="h-4 w-4" /> Read lesson</a>
    {connections.map(connection => {
      const episode = episodes.find(e => e.youtubeVideoId === connection.videoId);
      return <div key={connection.videoId} className="mt-5 border-t border-slate-700 pt-5">
        <p className="font-semibold text-white">{episode?.title || connection.title + ' — related video'}</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <button type="button" onClick={() => setSelected({ mode: 'watch', connection })} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-bold text-white"><Play className="h-4 w-4" /> Watch video</button>
          {episode?.audioReady && <button type="button" onClick={() => setSelected({ mode: 'listen', connection })} className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-3 font-bold text-slate-950"><Headphones className="h-4 w-4" /> Listen to podcast</button>}
          {episode && <Link to={'/growth-show/' + episode.slug} className="py-3 font-semibold text-cyan-300">Episode resources →</Link>}
        </div>
      </div>;
    })}
    {selected?.mode === 'watch' && <div id="watch" className="mt-6 aspect-video scroll-mt-24 overflow-hidden rounded-xl bg-black"><iframe className="h-full w-full" src={'https://www.youtube-nocookie.com/embed/' + selected.connection.videoId + '?rel=0'} title="Related NTA video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>}
    {selected?.mode === 'listen' && <GrowthShowAudioPlayer episode={episodes.find(e => e.youtubeVideoId === selected.connection.videoId)} watchHref={"/growth-show/" + episodes.find(e => e.youtubeVideoId === selected.connection.videoId)?.slug + "#watch"} />}
  </section>;
}
