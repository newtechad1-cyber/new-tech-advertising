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

test('public guide records and transcribes voice without silently sending it', async () => {
  const guide = await read('src/components/nta-guide/YourDigitalGrowthGuide.jsx');
  const transcriber = await read('base44/functions/transcribeGrowthGuideVoice/entry.ts');

  assert.match(guide, /new MediaRecorder/);
  assert.match(guide, /siteFunctionUrl[\s\S]*transcribeGrowthGuideVoice/);
  assert.match(guide, /directFunctionUrl[\s\S]*transcribeGrowthGuideVoice/);
  assert.match(guide, /method: 'POST'/);
  assert.match(guide, /audio_base64/);
  assert.match(guide, /setInput\(nextInput\)/);
  assert.match(guide, /Ask about growth, websites, AI, trust, or your next step/);
  assert.doesNotMatch(guide, /onstop[\s\S]{0,2000}sendToAgent/);
  assert.match(transcriber, /audio\.transcriptions\.create/);
  assert.match(transcriber, /model: 'whisper-1'/);
  assert.match(transcriber, /MAX_BASE64_LENGTH/);
});

test('public guide makes recording and fresh-session state visible', async () => {
  const guide = await read('src/components/nta-guide/YourDigitalGrowthGuide.jsx');

  assert.match(guide, /Start fresh/);
  assert.match(guide, /Recording ·/);
  assert.match(guide, /audioLevel/);
  assert.match(guide, /Transcript ready below/);
  assert.match(guide, /I’m not detecting sound/);
  assert.doesNotMatch(guide, /scrollQuickActions/);
});

test('Talk to My Office is introduced as a confirm-before-action approach', async () => {
  const homepage = await read('src/pages/Home.jsx');

  assert.match(homepage, /What is Talk to My Office™\?/);
  assert.match(homepage, /confirms what it heard/);
  assert.match(homepage, /before anything important happens/);
});
