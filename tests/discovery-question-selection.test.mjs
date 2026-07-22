import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DISCOVERY_QUESTIONS,
  selectNextQuestion,
} from '../src/lib/growth-guide/walkthrough.js';

test('interpretation prioritizes follow-ups without ending an unfinished walkthrough', () => {
  const first = DISCOVERY_QUESTIONS[0];
  const second = DISCOVERY_QUESTIONS[1];
  const interpretations = DISCOVERY_QUESTIONS.map(question => ({
    category_key: question.category,
    completion_state: 'complete',
  }));

  const next = selectNextQuestion({ interpretations, askedCategories: [first.category] });

  assert.equal(next.category, second.category);
});

test('the walkthrough ends only after every visitor question has been asked', () => {
  const next = selectNextQuestion({
    askedCategories: DISCOVERY_QUESTIONS.map(question => question.category),
  });

  assert.equal(next, null);
});
