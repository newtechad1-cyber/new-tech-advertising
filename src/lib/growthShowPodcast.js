// Shared by the website, RSS generator and publishing checks.
export const PODCAST_FEED_PATH = '/growth-show.xml';
export function isPodcastAudioReady(record) {
  try {
    const url = new URL(record.audio_url);
    return record.audio_status === 'Ready' && url.protocol === 'https:' &&
      !url.search && !['youtube.com', 'www.youtube.com', 'youtu.be', 'drive.google.com'].includes(url.hostname) &&
      record.audio_content_type === 'audio/mpeg' &&
      Number.isSafeInteger(record.audio_byte_length) && record.audio_byte_length > 0 &&
      Number.isFinite(record.audio_duration_seconds) && record.audio_duration_seconds > 0 &&
      record.audio_complete === true && record.audio_sound_checked === true &&
      record.audio_seek_checked === true && Boolean(record.audio_verified_at);
  } catch { return false; }
}
export const podcastGuid = record => 'nta-growth-show:' + (record.youtube_video_id || record.id);
const xml = value => String(value || '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));
export function createPodcastRss(records) {
  const unique = new Map();
  for (const record of records) {
    if (record.status !== 'Published' || !record.slug || !isPodcastAudioReady(record) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(record.published_date || '') ||
        !Number.isFinite(Date.parse(record.published_date))) continue;
    unique.set(podcastGuid(record), record);
  }
  const episodes = [...unique.values()].sort((a,b) => b.published_date.localeCompare(a.published_date));
  const items = episodes.map(r => `<item>
<title>${xml(r.title)}</title><link>https://newtechadvertising.com/growth-show/${xml(r.slug)}</link>
<guid isPermaLink="false">${xml(podcastGuid(r))}</guid>
<description>${xml(r.summary)}</description><pubDate>${new Date(r.published_date + 'T12:00:00Z').toUTCString()}</pubDate>
<enclosure url="${xml(r.audio_url)}" length="${r.audio_byte_length}" type="${xml(r.audio_content_type)}"/>
<itunes:duration>${Math.round(r.audio_duration_seconds)}</itunes:duration><itunes:explicit>false</itunes:explicit>
</item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom">
<channel><title>The NTA Growth Show</title><link>https://newtechadvertising.com/growth-show</link>
<description>Practical business and AI conversations with Rick Hesse and the Free AI Guy. Listen, watch, and continue into connected NTA teaching.</description>
<language>en-us</language><itunes:author>Rick Hesse — New Tech Advertising</itunes:author>
<itunes:explicit>false</itunes:explicit><itunes:category text="Business"/>
<atom:link href="https://newtechadvertising.com${PODCAST_FEED_PATH}" rel="self" type="application/rss+xml"/>
${items}</channel></rss>\n`;
}
