import { useState } from 'react';
import { Headphones } from 'lucide-react';
export default function GrowthShowAudioPlayer({ episode }) {
  const [failed, setFailed] = useState(false);
  if (!episode?.audioReady) return null;
  return (
    <section id="listen" aria-label={'Listen to ' + episode.title} className="my-8 rounded-2xl border border-cyan-400/30 bg-slate-900 p-5 sm:p-7">
      <h2 className="flex items-center gap-2 text-xl font-bold text-white"><Headphones aria-hidden="true" className="h-5 w-5 text-cyan-300" /> Listen to this episode</h2>
      <p className="mt-2 text-sm text-slate-300">The complete show, with the original voices. Keep listening here, then continue into the related teaching.</p>
      {failed ? <p role="alert" className="mt-4 text-slate-200">Audio could not load. Please try again later, or watch the episode below.</p> : (
        <audio key={episode.audioUrl} controls preload="none" className="mt-4 w-full min-w-0" aria-label={episode.title + ' podcast audio'} onError={() => setFailed(true)}>
          <source src={new URL(episode.audioUrl).pathname} type={episode.audioContentType} />
          Your browser does not support audio playback.
        </audio>
      )}
      <p className="mt-3 text-xs text-slate-400">{Math.floor(episode.audioDurationSeconds / 60)}:{String(Math.round(episode.audioDurationSeconds) % 60).padStart(2, '0')} · Full episode</p>
    </section>
  );
}
