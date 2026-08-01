import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('homepage opens the existing Digital Growth Guide as its conversational front door', async () => {
  const hero = await read('src/components/home-conversion/HeroSection.jsx');
  const home = await read('src/pages/Home.jsx');
  const guide = await read('src/components/nta-guide/YourDigitalGrowthGuide.jsx');

  assert.match(hero, /Work with AI without changing how you work/);
  assert.match(hero, /Talk to My Office™/);
  assert.match(hero, /nta:open-growth-guide/);
  assert.match(home, /talk_to_my_office_primary/);
  assert.match(home, /dispatchEvent\(new CustomEvent\('nta:open-growth-guide'\)\)/);
  assert.match(guide, /addEventListener\('nta:open-growth-guide'/);
});

test('public guide has a working response path instead of a silent agent-loading state', async () => {
  const guide = await read('src/components/nta-guide/YourDigitalGrowthGuide.jsx');

  assert.match(guide, /functions\.invoke\('growthGuideChat'/);
  assert.match(guide, /Retry AI response/);
  assert.doesNotMatch(guide, /setAuthStep\('connect'\)/);
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
