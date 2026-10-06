import fs from 'node:fs';
import { SEED_GROWTH_SHOW_EPISODES } from '../src/data/growthShowEpisodes.js';
import { GROWTH_SHOW_AUDIO } from '../src/data/growthShowAudio.js';
import { createPodcastRss } from '../src/lib/growthShowPodcast.js';
// One existing episode record drives the website and feed. No directory submission.
const byId = new Map(SEED_GROWTH_SHOW_EPISODES.map(r => [r.youtube_video_id || r.id, r]));
const response = await fetch('https://base44.app/api/apps/691f41a18de4a7f498c8f884/entities/GrowthShowEpisode', { signal: AbortSignal.timeout(20000) });
if (!response.ok) throw new Error('Cannot refresh existing GrowthShowEpisode records: ' + response.status);
const body = await response.json();
const records = Array.isArray(body) ? body : body.items || body.entities;
if (!Array.isArray(records)) throw new Error('Unexpected episode response');
for (const record of records) byId.set(record.youtube_video_id || record.id, record);
const episodes = [...byId.values()].map(r => ({ ...GROWTH_SHOW_AUDIO[r.youtube_video_id], ...r }));
const rss = createPodcastRss(episodes);
fs.writeFileSync('public/growth-show.xml', rss);
console.log('Podcast XML generated from ' + episodes.length + ' existing episode identities; ' + (rss.match(/<item>/g) || []).length + ' ready audio enclosures.');
