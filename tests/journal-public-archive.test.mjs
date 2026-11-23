import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import { getPublicJournalArchive, getJournalLessonPath, mergePublicJournalIssues } from '../src/lib/journalIssueIdentity.js';

// Use the production seed editions, with exactly the fields public RLS permits.
const source = readFileSync(new URL('../src/data/canonSeed.js', import.meta.url), 'utf8');
const seedContext = { YOUTUBE_PLAYLISTS: [] };
vm.runInNewContext(
  source.replace(/^import .*from .*;$/gm, '').replace(/export const /g, 'var ') +
    '\nthis.journals = SEED_JOURNAL_ENTRIES;',
  seedContext
);
const seeds = JSON.parse(JSON.stringify(seedContext.journals));
const schema = JSON.parse(readFileSync(new URL('../base44/entities/JournalIssue.jsonc', import.meta.url), 'utf8'));
const restricted = Object.keys(schema.properties).filter(key => schema.properties[key].rls?.read);
const publicRecord = issue => Object.fromEntries(Object.entries(issue).filter(([key]) => !restricted.includes(key)));
const publicIssues = seeds.map(publicRecord);

test('all 17 weekly issues remain visible without any admin-only email fields', () => {
  const archive = getPublicJournalArchive(publicIssues);
  assert.deepEqual(archive.map(issue => issue.issue_number), Array.from({ length: 17 }, (_, i) => 17 - i));
  assert.equal(archive[0].slug, 'issue-17-the-person-behind-the-ai-matters');
  assert.equal(archive[0].date, '2026-11-23');
  assert.equal(archive[0].related_video_url, 'https://www.youtube.com/watch?v=0WvTalkYedk');
  assert.equal(archive.find(issue => issue.issue_number === 15).related_video_url, 'https://youtu.be/8PQyPhqT_LE');
  assert.ok(archive.every(issue => restricted.every(key => !(key in issue))));
  assert.equal(archive.find(issue => issue.issue_number === 1).slug, 'issue-1-the-system-behind-the-work');
  assert.equal(archive.find(issue => issue.issue_number === 2).slug, 'issue-2-what-i-learned-while-rebuilding-nta');
});

test('drafts, archived records, legacy articles, follow-ups and duplicates stay out of the weekly archive', () => {
  const issue = publicIssues.find(item => item.issue_number === 17);
  const before = JSON.stringify(publicIssues);
  const records = [
    ...publicIssues,
    { ...issue, issue_number: 99, status: 'Draft' },
    { ...issue, issue_number: 98, status: 'Archived' },
    { ...issue, issue_number: 97, from_ricks_desk: '' },
    { ...issue, issue_number: 96, date: '2026-01-01' },
    { ...issue, issue_number: 95, series: 'NTA Journal Follow-up' },
    { ...issue, slug: 'older-alias' },
  ];
  const archive = getPublicJournalArchive(records);
  assert.equal(archive.length, 17);
  assert.equal(archive[0].slug, issue.slug);
  assert.equal(JSON.stringify(publicIssues), before);
  assert.deepEqual(getPublicJournalArchive(), []);
  assert.deepEqual(getPublicJournalArchive(null), []);
});

test('public saved editions replace snapshots without depending on newsletter_subject', () => {
  const issue = publicIssues.find(item => item.issue_number === 15);
  const saved = { ...issue, id: 'saved-public', title: 'Saved published title' };
  const archive = getPublicJournalArchive(mergePublicJournalIssues([saved], seeds));
  const mergedIssue = archive.find(item => item.issue_number === 15);
  assert.equal(mergedIssue.id, 'saved-public');
  assert.equal(mergedIssue.title, saved.title);
  assert.equal(archive[0].issue_number, 17);
  assert.equal(archive.length, 17);
});
test('Issues 16 and 17 preserve their approved teaching in the static archive source', () => {
  const data = JSON.parse(readFileSync(new URL('../public/ai-sitemap.json', import.meta.url), 'utf8'));
  const fields = ['from_ricks_desk', 'what_we_built', 'what_we_learned', 'what_it_means_for_your_business', 'this_weeks_challenge'];
  for (const number of [16, 17]) {
    const issue = publicIssues.find(item => item.issue_number === number);
    const matches = data.journalIssues.filter(item => item.issueNumber === number);
    assert.equal(matches.length, 1);
    const entry = matches[0];
    assert.equal(entry.canonicalUrl, 'https://newtechadvertising.com/journal/' + issue.slug);
    assert.equal(entry.datePublished, issue.date);
    assert.equal(entry.publicStatus, 'published');
    assert.deepEqual(entry.sections.map(section => section.body), fields.map(field => issue[field]));
    assert.equal(entry.featuredVideo.url, issue.related_video_url);
    assert.equal(entry.closingMessage, issue.closing_message);
  }
  const issue = publicIssues.find(item => item.issue_number === 17);
  assert.equal(issue.id, '6b02ee5d06134954a6025290');
  assert.equal(getJournalLessonPath(issue), '/knowledge/ai-foundations/the-person-behind-the-ai-matters');
  assert.match(issue.closing_message, /https:\/\/newtechadvertising\.com\/growth-show\/the-person-behind-the-ai-matters/);
  const native = readFileSync(new URL('../src/pages/journal/' + issue.slug + '.jsx', import.meta.url), 'utf8');
  assert.ok(native.includes('issueSlug="' + issue.slug + '"'));
});


test('public lesson links accept NTA absolute and relative URLs and reject other destinations', () => {
  const path = '/knowledge/ai-foundations/what-is-geo-getting-your-business-ready-for-ai-search';
  assert.equal(getJournalLessonPath(publicIssues.find(item => item.issue_number === 15)), path);
  assert.equal(getJournalLessonPath({ cta_url: path + '#start' }), path + '#start');
  assert.equal(getJournalLessonPath({ cta_url: '/canon/A-001' }), '/canon/A-001');
  assert.equal(getJournalLessonPath({ cta_url: 'https://example.com' + path }), null);
  assert.equal(getJournalLessonPath({ cta_url: 'javascript:alert(1)' }), null);
  assert.equal(getJournalLessonPath({ cta_url: '/admin/journal' }), null);
  assert.equal(getJournalLessonPath({ cta_url: 'https://[' }), null);
  assert.equal(getJournalLessonPath(null), null);
});

test('archive UI uses public content and a recoverable load message', () => {
  const landing = readFileSync(new URL('../src/pages/JournalLanding.jsx', import.meta.url), 'utf8');
  const view = readFileSync(new URL('../src/pages/JournalIssueView.jsx', import.meta.url), 'utf8');
  assert.match(landing, /getPublicJournalArchive\(sourceJournals\)/);
  assert.match(landing, /kg\.journals\?\.length \? kg\.journals : SEED_JOURNAL_ENTRIES/);
  assert.match(landing, /const loading = kg\.loading && !issues\.length/);
  for (const field of restricted) assert.ok(!landing.includes(field), field);
  assert.doesNotMatch(landing, /First Issue Coming Soon|launches with Issue #1/);
  assert.match(landing, /kg\.refresh\(\)/);
  assert.match(view, /getPublicJournalArchive\(published\)/);
  assert.match(view, /getJournalLessonPath\(issue\)/);
});
