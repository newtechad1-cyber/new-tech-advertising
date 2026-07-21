import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const sourceUrl = new URL(
  '../base44/functions/triggerDiscoveryInterpretation/entry.ts',
  import.meta.url
);
const source = await readFile(sourceUrl, 'utf8');

test('adapter uses the Base44 service-role function transport', () => {
  assert.match(
    source,
    /base44\.asServiceRole\.functions\.fetch\(\s*['"]\/coordinateDiscoveryInterpretation['"]/
  );
});

test('adapter does not derive a sibling function URL from the incoming request', () => {
  assert.doesNotMatch(source, /new URL\(req\.url\)/);
  assert.doesNotMatch(source, /fetch\(coordinatorUrl/);
});

test('adapter forwards the private bearer credential and original create event', () => {
  assert.match(source, /['"]authorization['"]:\s*`Bearer \$\{secret\}`/);
  assert.match(source, /JSON\.stringify\(\{ event: payload\.event \}\)/);
});

test('automation remains guarded by exact entity-create validation', () => {
  assert.match(source, /event\?\.type !== ['"]create['"]/);
  assert.match(source, /event\?\.entity_name !== ['"]DiscoveryConversationEntry['"]/);
  assert.match(source, /entry\.speaker !== ['"]owner['"]/);
});
