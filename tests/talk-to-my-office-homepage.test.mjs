import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('homepage opens the existing Digital Growth Guide as its conversational front door', async () => {
  const hero = await read('src/components/home-conversion/HeroSection.jsx');
  const guide = await read('src/components/nta-guide/YourDigitalGrowthGuide.jsx');

  assert.match(hero, /Work with AI without changing how you work/);
  assert.match(hero, /Talk with the Digital Growth Guide/);
  assert.match(hero, /nta:open-growth-guide/);
  assert.match(guide, /addEventListener\('nta:open-growth-guide'/);
});

test('public guide accepts voice input without silently sending the transcript', async () => {
  const guide = await read('src/components/nta-guide/YourDigitalGrowthGuide.jsx');

  assert.match(guide, /SpeechRecognition \|\| window\.webkitSpeechRecognition/);
  assert.match(guide, /setInput\(transcript\)/);
  assert.match(guide, /Speak or type what you need help with/);
  assert.doesNotMatch(guide, /onresult[\s\S]{0,500}sendToAgent/);
});

test('Talk to My Office is introduced as a confirm-before-action approach', async () => {
  const homepage = await read('src/pages/Home.jsx');

  assert.match(homepage, /What is Talk to My Office™\?/);
  assert.match(homepage, /confirms what it heard/);
  assert.match(homepage, /before anything important happens/);
});
