import { useEffect, useState } from 'react';
import { Headphones } from 'lucide-react';
export default function GrowthShowAudioPlayer({ episode, watchHref }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!episode?.audioReady) return;
    setFailed(false);
    const frame = requestAnimationFrame(() => {
      if (['#watch', '#listen'].includes(window.location.hash)) {
        document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [episode?.audioUrl, episode?.audioReady]);
  if (!episode?.audioReady) return null;
  return (
    <section id="listen" aria-label={'Listen to ' + episode.title} className="scroll-mt-24 my-8 rounded-2xl border border-cyan-400/30 bg-slate-900 p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap gap-3" aria-label="Choose how to enjoy this episode">
        <a href="#listen" className="rounded-lg bg-cyan-400 px-4 py-2 font-bold text-slate-950">Listen to podcast</a>
        <a href={watchHref || (window.location.pathname.replace(/\/$/, "") === "/growth-show" ? `/growth-show/${episode.slug}#watch` : "#watch")} className="rounded-lg border border-blue-400 px-4 py-2 font-bold text-blue-200">Watch video</a>
      </div>
      <h2 className="flex items-center gap-2 text-xl font-bold text-white"><Headphones aria-hidden="true" className="h-5 w-5 text-cyan-300" /> Listen to this episode</h2>
      <p className="mt-2 text-sm text-slate-300">The complete show, with the original voices. Keep listening here, then continue into the related teaching.</p>
      {failed ? <p role="alert" className="mt-4 text-slate-200">Audio could not load. Please try again later, or watch the episode below.</p> : (
        <audio key={episode.audioUrl} controls preload="none" className="mt-4 w-full min-w-0" aria-label={episode.title + ' podcast audio'} onError={() => setFailed(true)}>
          <source src={(new URL(episode.audioUrl).hostname === 'newtechadvertising.com' ? new URL(episode.audioUrl).pathname : episode.audioUrl)} type={episode.audioContentType} />
          Your browser does not support audio playback.
        </audio>
      )}
      <p className="mt-3 text-xs text-slate-400">{Math.floor(episode.audioDurationSeconds / 60)}:{String(Math.round(episode.audioDurationSeconds) % 60).padStart(2, '0')} · Full episode</p>
    </section>
  );
}
