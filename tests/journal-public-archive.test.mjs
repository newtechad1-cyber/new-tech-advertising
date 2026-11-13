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

test('all 15 weekly issues remain visible without any admin-only email fields', () => {
  const archive = getPublicJournalArchive(publicIssues);
  assert.deepEqual(archive.map(issue => issue.issue_number), Array.from({ length: 15 }, (_, i) => 15 - i));
  assert.equal(archive[0].slug, 'issue-15-can-ai-understand-your-business');
  assert.equal(archive[0].related_video_url, 'https://youtu.be/8PQyPhqT_LE');
  assert.ok(archive.every(issue => restricted.every(key => !(key in issue))));
  assert.equal(archive.find(issue => issue.issue_number === 1).slug, 'issue-1-the-system-behind-the-work');
  assert.equal(archive.find(issue => issue.issue_number === 2).slug, 'issue-2-what-i-learned-while-rebuilding-nta');
});

test('drafts, archived records, legacy articles, follow-ups and duplicates stay out of the weekly archive', () => {
  const issue = publicIssues.find(item => item.issue_number === 15);
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
  assert.equal(archive.length, 15);
  assert.equal(archive[0].slug, issue.slug);
  assert.equal(JSON.stringify(publicIssues), before);
  assert.deepEqual(getPublicJournalArchive(), []);
  assert.deepEqual(getPublicJournalArchive(null), []);
});

test('public saved editions replace snapshots without depending on newsletter_subject', () => {
  const issue = publicIssues.find(item => item.issue_number === 15);
  const saved = { ...issue, id: 'saved-public', title: 'Saved published title' };
  const archive = getPublicJournalArchive(mergePublicJournalIssues([saved], seeds));
  assert.equal(archive[0].id, 'saved-public');
  assert.equal(archive[0].title, saved.title);
  assert.equal(archive.length, 15);
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
