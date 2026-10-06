import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { GROWTH_SHOW_AUDIO } from '../src/data/growthShowAudio.js';
import { isPodcastAudioReady, createPodcastRss, podcastGuid } from '../src/lib/growthShowPodcast.js';
import { buildGrowthShowEpisodes } from '../src/lib/growthShow.js';
const ready = { ...Object.values(GROWTH_SHOW_AUDIO)[0], title: 'A & B <teaching>', summary: 'Learn & grow', slug:'verified-show', status:'Published', published_date:'2026-09-08', youtube_video_id:'verified-id' };
test('incomplete media cannot expose a Listen player or enter RSS', () => {
  for (const patch of [{audio_status:'Review'}, {audio_byte_length:0}, {audio_complete:false},
    {audio_sound_checked:false}, {audio_seek_checked:false}, {audio_url:'https://youtu.be/abc'},
    {audio_url:'https://example.com/audio.mp3?Expires=42'}, {audio_verified_at:''}]) {
    const record = {...ready,...patch};
    assert.equal(isPodcastAudioReady(record),false);
    assert.equal(createPodcastRss([record]).includes('<item>'),false);
    const [episode] = buildGrowthShowEpisodes({episodeRecords:[record]});
    assert.equal(episode.audioReady,false);
    assert.equal(episode.audioUrl,'');
  }
});
test('RSS is XML, escapes teaching text, and retains stable identities', () => {
  const rss=createPodcastRss([ready,{...ready,id:'different-record'}, {...ready,youtube_video_id:'private',status:'Draft'}]);
  assert.equal(XMLValidator.validate(rss),true);
  const parsed=new XMLParser({ignoreAttributes:false}).parse(rss);
  assert.equal(parsed.rss.channel.item.title,ready.title);
  assert.equal(parsed.rss.channel.item.guid['#text'],podcastGuid(ready));
  assert.equal(parsed.rss.channel.item.enclosure['@_type'],'audio/mpeg');
  assert.equal((rss.match(/<item>/g)||[]).length,1);
});
test('every current enclosure has actual complete MP3 bytes; no sample or duplicate entries', () => {
  const xml=fs.readFileSync('public/growth-show.xml','utf8');
  assert.equal(XMLValidator.validate(xml),true);
  const parsed=new XMLParser({ignoreAttributes:false}).parse(xml);
  const items=[parsed.rss.channel.item].flat();
  assert.equal(items.length,8);
  const ids=new Set();
  for(const item of items) {
    const enclosure=item.enclosure; const file='public'+new URL(enclosure['@_url']).pathname;
    assert.equal(fs.statSync(file).size,Number(enclosure['@_length']));
    assert.equal(enclosure['@_type'],'audio/mpeg');
    assert.ok(!ids.has(item.guid['#text']));ids.add(item.guid['#text']);
  }
});
