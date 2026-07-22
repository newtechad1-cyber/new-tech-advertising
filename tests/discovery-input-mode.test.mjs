import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('visitor is offered explicit voice and text answer modes', async () => {
  const source = await read('src/components/nta-guide/DiscoveryWalkthrough.jsx');
  assert.match(source, /Talk it through/);
  assert.match(source, /Type my answers/);
  assert.match(source, /raw_audio_retention/);
  assert.match(source, /voice_transcript/);
});

test('voice capture verifies the microphone and recovers from unintended browser stops', async () => {
  const source = await read('src/components/nta-guide/DiscoveryWalkthrough.jsx');
  assert.match(source, /getUserMedia\(\{ audio: true \}\)/);
  assert.match(source, /shouldListenRef/);
  assert.match(source, /recognition\.continuous = false/);
  assert.match(source, /recognition\.start\(\)/);
  assert.match(source, /event\.error === 'no-speech'/);
  assert.match(source, /microphone is blocked/i);
});

test('voice transcripts require processing, microphone, and transcription consent', async () => {
  const source = await read('base44/functions/appendDiscoveryEntry/entry.ts');
  assert.match(source, /granted\.has\('discovery_processing'\)/);
  assert.match(source, /granted\.has\('microphone'\)/);
  assert.match(source, /granted\.has\('transcription'\)/);
  assert.match(source, /source_mode: 'voice_transcript'|source_mode,/);
});
