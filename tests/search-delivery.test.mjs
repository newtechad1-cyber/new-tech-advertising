import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { SEED_GROWTH_SHOW_EPISODES } from '../src/data/growthShowEpisodes.js';
import { getSeoMetadata } from '../src/config/seoMetadata.js';

function output(route) {
  for (const file of ['dist' + route, 'dist' + route + '.html', 'dist' + route + '/index.html']) {
    if (fs.existsSync(file) && fs.statSync(file).isFile()) return fs.readFileSync(file, 'utf8');
  }
  assert.fail('Missing output for ' + route);
}

test('every published Growth Show episode has its own initial content and native route', () => {
  const registry = fs.readFileSync('src/pages.config.js', 'utf8');
  const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
  for (const episode of SEED_GROWTH_SHOW_EPISODES.filter(e => e.status === 'Published')) {
    const route = '/growth-show/' + episode.slug;
    const html = output(route);
    assert.ok(html.includes('<h1>' + episode.title.replaceAll('&', '&amp;').replaceAll("\'", '&#39;') + '</h1>'), route);
    assert.ok(html.includes('youtube-nocookie.com/embed/' + episode.youtube_video_id), route);
    assert.ok(registry.includes("'" + route.slice(1) + "':"), route);
    assert.ok(sitemap.includes('<loc>https://newtechadvertising.com' + route + '</loc>'), route);
    assert.ok(getSeoMetadata(route).title.includes(episode.title));
    assert.doesNotMatch(html, /<h1>Advertise Better/);
    assert.doesNotMatch(html, /nta-journal-issue-5-fallback/);
  }
});

test('podcast initial content and error output are distinct from the homepage', () => {
  const podcasts = output('/podcasts');
  assert.match(podcasts, /<h1>Prefer to listen\? Start here\.<\/h1>/);
  assert.equal((podcasts.match(/<audio /g) || []).length, 8);
  assert.doesNotMatch(podcasts, /nta-journal-issue-5-fallback/);
  assert.match(output('/404.html'), /name="robots" content="noindex, nofollow"/);
  assert.equal(getSeoMetadata('/definitely-not-a-real-page').noIndex, true);
  assert.equal(getSeoMetadata('/knowledge/business-foundations/nonexistent-lesson').noIndex, true);
});

test('clean public routes have matching directory indexes for exact-path hosting', () => {
  const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
  for (const route of urls.filter(route => route !== '/')) {
    const directoryHtml = fs.readFileSync('dist' + route + '/index.html', 'utf8');
    assert.equal(directoryHtml, output(route), route);
    assert.match(directoryHtml, /<link rel="canonical"/, route);
  }
});

test('lesson metadata uses approved lesson information', () => {
  const metadata = getSeoMetadata('/knowledge/truth-about-business-growth/business-owners-are-tired-of-being-sold');
  assert.match(metadata.title, /Business Owners Are Tired of Being Sold/);
  assert.notEqual(metadata.description, 'A practical lesson for small-business owners about AI, growth, customer trust, and useful business systems.');
});
