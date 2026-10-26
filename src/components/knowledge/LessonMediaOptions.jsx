import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Headphones, Play } from 'lucide-react';
import { VIDEO_READING_CONNECTIONS } from '@/data/videoLearningConnections';
import { useGrowthShow } from '@/hooks/useGrowthShow';
import GrowthShowAudioPlayer from '@/components/video/GrowthShowAudioPlayer';

export default function LessonMediaOptions({ path, readHref = '#lesson-reading' }) {
  const { episodes } = useGrowthShow();
  const [selected, setSelected] = useState(null);
  const connections = VIDEO_READING_CONNECTIONS.filter(connection => connection.href === path);
  const { hash } = useLocation();
  useEffect(() => {
    if ((hash !== '#listen' && hash !== '#watch') || !connections.length) return;
    const connection = connections[0];
    if (hash === '#listen' && !connection.audioReady && !episodes.some(episode => episode.youtubeVideoId === connection.videoId && episode.audioReady)) return;
    setSelected({ mode: hash.slice(1), connection });
    const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, [hash, path, episodes]);
  if (!connections.length) return null;
  const selectedEpisode = selected && episodes.find(e => e.youtubeVideoId === selected.connection.videoId);
  const selectedAudio = selected?.connection?.audioReady ? selected.connection : selectedEpisode;
  return <section className="my-8 rounded-2xl border border-cyan-300/25 bg-slate-900 p-5 sm:p-7" aria-label="Read, watch or listen">
    <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Choose how to explore this idea</p>
    <h2 className="mt-3 text-2xl font-bold text-white">Read. Watch. Listen.</h2>
    <p className="mt-3 text-sm leading-7 text-slate-300">Read the written lesson, or explore the same idea through the related conversation.</p>
    {connections.map(connection => {
      const episode = episodes.find(e => e.youtubeVideoId === connection.videoId);
      return <div key={connection.videoId} className="mt-5 border-t border-slate-700 pt-5">
        <p className="font-semibold text-white">{episode?.title || connection.title}</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap" aria-label="Choose a format">
          <a href={readHref} onClick={() => setSelected(null)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-500 px-5 py-3 font-bold text-white"><BookOpen aria-hidden="true" className="h-5 w-5" /> Read the lesson</a>
          <button type="button" aria-pressed={selected?.mode === 'watch' && selected.connection.videoId === connection.videoId} onClick={() => setSelected({ mode: 'watch', connection })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-bold text-white"><Play aria-hidden="true" className="h-5 w-5" /> {episode ? 'Watch the episode' : 'Watch the video lesson'}</button>
          {(connection.audioReady || episode?.audioReady) && <button type="button" aria-pressed={selected?.mode === 'listen' && selected.connection.videoId === connection.videoId} onClick={() => setSelected({ mode: 'listen', connection })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 py-3 font-bold text-slate-950"><Headphones aria-hidden="true" className="h-5 w-5" /> Listen to the podcast</button>}
        </div>
        {episode && <Link to={'/growth-show/' + episode.slug} className="mt-4 inline-block font-semibold text-cyan-300">Episode resources →</Link>}
      </div>;
    })}
    {selected?.mode === 'watch' && <div id="watch" className="mt-6 aspect-video scroll-mt-24 overflow-hidden rounded-xl bg-black"><iframe className="h-full w-full" src={'https://www.youtube-nocookie.com/embed/' + selected.connection.videoId + '?rel=0'} title={selectedEpisode?.title || selected.connection.title} referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>}
    {selected?.mode === 'listen' && selectedAudio && (selected?.connection?.audioReady ? <section id="listen" aria-label={'Listen to ' + selected.connection.title} className="scroll-mt-24 mt-6 rounded-xl border border-cyan-400/30 bg-slate-950 p-5">
      <h3 className="flex items-center gap-2 text-lg font-bold text-white"><Headphones aria-hidden="true" className="h-5 w-5 text-cyan-300" /> Listen to the podcast</h3>
      <p className="mt-2 text-sm text-slate-300">The complete audio from this video lesson, including Rick's original outro.</p>
      <audio controls preload="none" className="mt-4 w-full" aria-label={selected.connection.title + ' podcast audio'}>
        <source src={new URL(selected.connection.audioUrl).pathname} type={selected.connection.audioContentType || 'audio/mpeg'} />
        Your browser does not support audio playback.
      </audio>
      <p className="mt-3 text-xs text-slate-400">{Math.floor(selected.connection.audioDurationSeconds / 60)}:{String(Math.round(selected.connection.audioDurationSeconds) % 60).padStart(2, '0')} · Full lesson audio</p>
    </section> : <GrowthShowAudioPlayer episode={selectedEpisode} readHref={readHref} watchHref={"/growth-show/" + selectedEpisode?.slug + "#watch"} />)}
  </section>;
}

