import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { isVideoPublicationTimestamp, requireVideoPublicationTimestamp } from '../src/lib/videoPublication.js';
import { getVideoPublicationTimestamp, VIDEO_WATCH_PAGES, videoSchemaFor } from '../src/data/videoSeo.js';
import { SEED_GROWTH_SHOW_EPISODES } from '../src/data/growthShowEpisodes.js';

const evidence = JSON.parse(fs.readFileSync('docs/releases/search-delivery-2026-10-28/video-publication-evidence.json'));
test('publication times retain verified YouTube originals', () => {
  for (const item of evidence) assert.equal(getVideoPublicationTimestamp(item.youtubeId), item.publishedAt);
  for (const episode of SEED_GROWTH_SHOW_EPISODES.filter(e => e.status === 'Published')) {
    assert.ok(isVideoPublicationTimestamp(getVideoPublicationTimestamp(episode.youtube_video_id)), episode.slug);
  }
  for (const video of VIDEO_WATCH_PAGES) assert.equal(videoSchemaFor(video).uploadDate, getVideoPublicationTimestamp(video.id));
});
test('date-only and timezone-free values cannot become video schema dates', () => {
  for (const value of ['2026-08-10', '2026-08-10T14:00:57', 'not-a-date', null]) {
    assert.equal(isVideoPublicationTimestamp(value), false);
    assert.throws(() => requireVideoPublicationTimestamp(value), /timezone/);
    assert.throws(() => videoSchemaFor({id:'test', publishedAt:value || 'bad'}), /timezone/);
  }
  assert.equal(getVideoPublicationTimestamp('unverified-new-video', false), null);
  assert.throws(() => getVideoPublicationTimestamp('unverified-new-video'), /timezone/);
});
test('generated video schema and sitemap use the same original timestamps', () => {
  const sitemap = fs.readFileSync('dist/sitemap.xml','utf8');
  for (const block of sitemap.matchAll(/<video:video>[\s\S]*?<\/video:video>/g)) {
    const id = block[0].match(/\/embed\/([A-Za-z0-9_-]+)/)[1];
    const timestamp = block[0].match(/<video:publication_date>([^<]+)/)[1];
    assert.equal(timestamp, getVideoPublicationTimestamp(id));
  }
  const routes = [...VIDEO_WATCH_PAGES.map(v=>v.path), ...SEED_GROWTH_SHOW_EPISODES.filter(e=>e.status==='Published').map(e=>'/growth-show/'+e.slug)];
  for (const route of new Set(routes)) {
    const html = fs.readFileSync('dist'+route+'.html','utf8');
    const objects = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
    const videos = objects.filter(o=>o['@type']==='VideoObject');
    assert.equal(videos.length,1,route);
    assert.ok(isVideoPublicationTimestamp(videos[0].uploadDate),route);
    const id=videos[0].embedUrl.match(/\/embed\/([A-Za-z0-9_-]+)/)[1];
    assert.equal(videos[0].uploadDate,getVideoPublicationTimestamp(id),route);
  }
});

test('all 37 initially flagged pages have their own initial HTML and canonical', () => {
  const urls=JSON.parse(fs.readFileSync('docs/releases/search-delivery-2026-10-28/initially-flagged-urls.json'));
  for (const url of urls) {
    const html=fs.readFileSync('dist'+new URL(url).pathname+'.html','utf8');
    assert.ok(html.includes('<link rel="canonical" href="'+url+'"'),url);
    assert.match(html, /<h1[ >]/,url);
    assert.doesNotMatch(html, /<h1>Advertise Better|<title>Advertise Better/,url);
    assert.doesNotMatch(html, /name="robots" content="[^"]*noindex/,url);
  }
});
