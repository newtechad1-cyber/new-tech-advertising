import test from 'node:test';
import assert from 'node:assert/strict';
import { isJournalFollowUp, journalIssueKey, mergeJournalEditions, mergePublicJournalIssues } from '../src/lib/journalIssueIdentity.js';

const original = { id: 'saved-original', issue_number: 14, slug: 'issue-14-original', title: 'Tuesday lesson', status: 'Published', newsletter_sent: true, date: '2026-11-03', from_ricks_desk: 'Original teaching' };
const followUp = { id: 'saved-follow-up', issue_number: 14, slug: 'issue-14-video-follow-up', title: 'Issue 14 Follow-up', series: 'NTA Journal Follow-up', status: 'Draft', newsletter_sent: false, date: '2026-11-06', from_ricks_desk: 'Sorry for the delay.' };

test('the original sent issue and its unsent follow-up remain separate editing records', () => {
  const seeds = [{ ...original, id: undefined }, { ...followUp, id: undefined }];
  const before = JSON.stringify(original);
  const editions = mergeJournalEditions(seeds, [followUp, { ...original, id: 'old-review', status: 'Review' }, original]);
  assert.equal(editions.length, 2);
  assert.equal(editions.find(item => !isJournalFollowUp(item)).id, original.id);
  assert.equal(editions.find(isJournalFollowUp).id, followUp.id);
  assert.equal(editions.find(isJournalFollowUp).newsletter_sent, false);
  assert.equal(JSON.stringify(original), before);
  assert.equal(Math.max(...editions.map(item => item.issue_number)) + 1, 15);
  assert.notEqual(journalIssueKey(original), journalIssueKey(followUp));
});

test('public follow-up data never replaces the original weekly lesson', () => {
  const publishedFollowUp = { ...followUp, status: 'Published' };
  const merged = mergePublicJournalIssues([original, publishedFollowUp], [{ ...original, id: 'seed-original' }, { ...publishedFollowUp, id: 'seed-follow-up' }]);
  assert.equal(merged.length, 2);
  assert.equal(merged.find(item => item.slug === original.slug).id, original.id);
  assert.equal(merged.find(item => item.slug === followUp.slug).id, followUp.id);
  assert.equal(merged.filter(item => !isJournalFollowUp(item)).length, 1);
});

test('archived duplicates do not replace the original or its follow-up', () => {
  const merged = mergeJournalEditions([], [original, followUp, { ...original, id: 'archived', status: 'Archived' }, { ...followUp, id: 'duplicate', series: 'Duplicate - Archived' }]);
  assert.deepEqual(merged.map(item => item.id), [original.id, followUp.id]);
});
