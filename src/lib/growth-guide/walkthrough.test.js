import test from 'node:test';
import assert from 'node:assert/strict';
import { getReassuringProgress, selectNextQuestion } from './walkthrough.js';

test('starts with the owner reason', () => {
  assert.equal(selectNextQuestion()?.category, 'reason_for_conversation');
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
