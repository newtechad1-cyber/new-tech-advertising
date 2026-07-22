import test from 'node:test';
import assert from 'node:assert/strict';
import { contactRequirements, validateHandoffContact } from './handoff.js';

test('callback requires a valid phone number', () => {
  assert.equal(contactRequirements('request_callback').needsPhone, true);
  assert.match(validateHandoffContact('request_callback', { phone: '12' }), /phone/);
  assert.equal(validateHandoffContact('request_callback', { phone: '(641) 555-1212' }), null);
});

test('email continuation and summary delivery require email', () => {
  assert.equal(contactRequirements('receive_summary').needsEmail, true);
  assert.match(validateHandoffContact('continue_by_email', { email: 'wrong' }), /email/);
  assert.equal(validateHandoffContact('receive_summary', { email: 'owner@example.com' }), null);
});

test('schedule and save do not collect contact in the widget', () => {
  assert.equal(contactRequirements('schedule_growth_conversation').needsContact, false);
  assert.equal(validateHandoffContact('save_and_return'), null);
});
