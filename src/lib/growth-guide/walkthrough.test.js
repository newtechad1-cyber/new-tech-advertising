import test from 'node:test';
import assert from 'node:assert/strict';
import { getContextualQuestion, getReassuringProgress, identifyConversationFocus, selectNextQuestion } from './walkthrough.js';
import { buildSummaryFromInterpretation, describeOwnerCorrections, hasUsefulSummary } from './summaryReview.js';

test('starts with the owner reason', () => {
  assert.equal(selectNextQuestion()?.category, 'reason_for_conversation');
});

test('carries an advertising focus into the next question', () => {
  const question = selectNextQuestion({ askedCategories: ['reason_for_conversation'] });
  const contextual = getContextualQuestion(question, [
    { speaker: 'owner', text: 'I need help understanding what advertising will work.' },
  ]);

  assert.equal(identifyConversationFocus([{ speaker: 'owner', text: 'We need better advertising.' }]), 'advertising');
  assert.match(contextual.prompt, /advertising/i);
  assert.match(contextual.prompt, /accomplish/i);
});

test('skips categories the promoted interpretation says are complete', () => {
  const next = selectNextQuestion({
    interpretations: [{ category_key: 'reason_for_conversation', completion_state: 'complete' }],
  });
  assert.equal(next.category, 'owner_goals');
});

test('does not immediately repeat a category that was already asked', () => {
  const next = selectNextQuestion({ askedCategories: ['reason_for_conversation'] });
  assert.equal(next.category, 'owner_goals');
});

test('progress uses reassuring language instead of question counts', () => {
  assert.deepEqual(getReassuringProgress(), { label: 'Getting oriented', percent: 8 });
  assert.deepEqual(getReassuringProgress({ interpretations: [
    { category_key: 'reason_for_conversation', completion_state: 'complete' },
    { category_key: 'owner_goals', completion_state: 'complete' },
    { category_key: 'stated_pain', completion_state: 'complete' },
  ] }), { label: 'Understanding what is happening now', percent: 52 });
});

test('builds the owner review only from promoted interpreted facts', () => {
  const summary = buildSummaryFromInterpretation([
    { category_key: 'reason_for_conversation', interpreted_facts: [{ statement: 'The owner wants steadier leads.' }] },
    { category_key: 'present_process', interpreted_facts: [{ statement: 'Follow-up is handled manually.' }] },
    { category_key: 'existing_tools_and_information', interpreted_facts: [{ statement: 'The business uses a CRM.' }] },
    { category_key: 'desired_improvement', interpreted_facts: [{ statement: 'A consistent follow-up process is desired.' }] },
  ]);

  assert.equal(summary.why_owner_came, 'The owner wants steadier leads.');
  assert.equal(summary.present_process, 'Follow-up is handled manually.\nThe business uses a CRM.');
  assert.equal(summary.desired_improvement, 'A consistent follow-up process is desired.');
  assert.equal(hasUsefulSummary(summary), true);
});

test('brings interpretation uncertainty into the review', () => {
  const summary = buildSummaryFromInterpretation([
    { category_key: 'owner_goals', uncertainties: [{ statement: 'The desired timing is not yet clear.' }] },
  ]);
  assert.equal(summary.information_still_needed, 'The desired timing is not yet clear.');
});

test('records which review sections the owner corrected without storing old text', () => {
  const original = { owner_goal: 'Grow quickly', greatest_difficulty: 'Lead flow' };
  const edited = { owner_goal: 'Grow steadily', greatest_difficulty: 'Lead flow' };
  assert.deepEqual(describeOwnerCorrections(original, edited), [
    'What you want to accomplish was corrected by the owner during review.',
  ]);
});
