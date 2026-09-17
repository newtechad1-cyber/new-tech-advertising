import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { XMLParser } from 'fast-xml-parser';
import { mergeGalleryVideos, galleryCategories, filterGalleryVideos } from '../src/lib/videoGallery.js';
import { VERIFIED_VIDEO_SELECTION } from '../src/data/videoGallery.js';

const xml = '<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom" xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/"><entry><yt:videoId>PmXSEkj03ak</yt:videoId><title>Business &amp; Technology</title><published>2026-09-15T14:00:49+00:00</published><media:group><media:description>Rick&apos;s practical lesson.</media:description></media:group></entry></feed>';

function backend({ user = null, feed = xml } = {}) {
  const source = readFileSync('base44/functions/getYouTubePlaylist/entry.ts', 'utf8').replace(/^import[^\n]*\n/gm, '');
  let handler;
  const outbound = [];
  const context = {
    exports: {}, URL, Request, Response, Headers, AbortSignal, XMLParser,
    console: { error() {} },
    Deno: { env: { get() {} }, serve(fn) { handler = fn; } },
    createClientFromRequest() {
      return {
        auth: { async me() { return user; } },
        get asServiceRole() { throw new Error('Public gallery must not access privileged records'); },
      };
    },
    async fetch(url) { outbound.push(String(url)); return new Response(feed); },
  };
  const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
  vm.runInNewContext(compiled, context);
  return { handler, parse: context.parsePlaylistFeed, outbound };
}

function request(origin, body = {}) {
  return new Request('https://newtechadvertising.com/api/test', {
    method: 'POST',
    headers: { ...(origin ? { Origin: origin } : {}), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

test('YouTube Atom parsing works without browser DOMParser and decodes text', () => {
  const fixture = backend();
  const videos = fixture.parse(xml);
  assert.equal(videos.length, 1);
  assert.equal(videos[0].title, 'Business & Technology');
  assert.equal(videos[0].description, "Rick's practical lesson.");
  assert.equal(videos[0].youtubeUrl, 'https://www.youtube.com/watch?v=PmXSEkj03ak');
  assert.equal(videos[0].publishedAt, '2026-09-15T14:00:49+00:00');
  assert.equal(videos[0].embedUrl, 'https://www.youtube-nocookie.com/embed/PmXSEkj03ak?rel=0');
});

test('feed parser rejects malformed, oversized, and entity-declaration payloads', () => {
  const fixture = backend();
  for (const value of ['<html>error</html>', '<feed><entry></feed>', '<!DOCTYPE feed [<!ENTITY x "unsafe">]><feed/>', 'x'.repeat(1_000_001)]) {
    assert.throws(() => fixture.parse(value));
  }
});

test('public feed keeps origin and method checks before outbound requests', async () => {
  const fixture = backend();
  for (const origin of [undefined, 'https://untrusted.example', 'https://newtechadvertising.com.untrusted.example']) {
    assert.equal((await fixture.handler(request(origin))).status, 401);
  }
  assert.equal((await fixture.handler(new Request('https://newtechadvertising.com/api/test'))).status, 405);
  assert.equal(fixture.outbound.length, 0);
});

test('anonymous website visitors receive only fixed public YouTube metadata with caching and rate limits', async () => {
  const fixture = backend();
  const response = await fixture.handler(request('https://newtechadvertising.com', { url: 'http://127.0.0.1', playlist_id: 'attacker' }));
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.videos.length, 1);
  assert.deepEqual(Object.keys(result), ['videos']);
  assert.equal(fixture.outbound[0], 'https://www.youtube.com/feeds/videos.xml?playlist_id=UUdGaYoTxcO-W6wuC3iDqFDg');
  for (let i = 1; i < 60; i++) assert.equal((await fixture.handler(request('https://newtechadvertising.com'))).status, 200);
  const limited = await fixture.handler(request('https://newtechadvertising.com'));
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get('Retry-After')) > 0);
  assert.equal(fixture.outbound.length, 1);
});

test('feed errors remain explicit so the frontend can show the verified selection', async () => {
  const fixture = backend({ feed: '<html>Temporary upstream error</html>' });
  const response = await fixture.handler(request('https://newtechadvertising.com'));
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { error: 'Unable to load videos right now' });
});

test('new uploads merge with the verified archive, deduplicate, and sort by publication date', () => {
  const latest = { youtubeId: 'NEWvideo123', title: 'New public video', publishedAt: '2026-09-17T12:00:00Z' };
  const duplicate = { ...VERIFIED_VIDEO_SELECTION[0], title: 'Updated title from YouTube' };
  const videos = mergeGalleryVideos([latest, duplicate], VERIFIED_VIDEO_SELECTION);
  assert.equal(videos.length, VERIFIED_VIDEO_SELECTION.length + 1);
  assert.equal(videos[0].youtubeId, latest.youtubeId);
  assert.equal(videos.find(video => video.youtubeId === duplicate.youtubeId).title, duplicate.title);
  assert.ok(videos.some(video => video.youtubeId === '3_P36VrK9jc'));
});

test('gallery contains no placeholders or private videos and does not trust supplied external destinations', () => {
  const videos = mergeGalleryVideos([
    { youtubeId: 'NEWvideo123', title: 'Valid video', youtubeUrl: 'https://untrusted.example', embedUrl: 'javascript:bad' },
    { youtubeId: 'draft123456', title: 'Draft', status: 'planned' },
    { youtubeId: 'priva123456', title: 'Private', visibility: 'Private' },
    { youtubeId: 'delet123456', title: 'Deleted video' },
    { youtubeId: 'invalid', title: 'Bad ID' },
    { id: 'placeholder', title: 'Coming soon' },
  ]);
  assert.equal(videos.length, 1);
  assert.equal(videos[0].youtubeUrl, 'https://www.youtube.com/watch?v=NEWvideo123');
  assert.match(videos[0].embedUrl, /^https:\/\/www.youtube-nocookie.com\/embed\//);
});

test('every verified video is reachable through its topic and search intersects the topic', () => {
  const videos = mergeGalleryVideos([], VERIFIED_VIDEO_SELECTION);
  const categories = galleryCategories(videos);
  assert.equal(categories.reduce((sum, category) => sum + filterGalleryVideos(videos, category).length, 0), videos.length);
  assert.ok(filterGalleryVideos(videos, 'Growth Show', 'multitask').some(video => video.youtubeId === '6lhiYFHFsCQ'));
  assert.equal(filterGalleryVideos(videos, 'Video Work', 'multitask').length, 0);
  assert.equal(filterGalleryVideos(videos, 'All', 'no-matching-video-anywhere').length, 0);
});
