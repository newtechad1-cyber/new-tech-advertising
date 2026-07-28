import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const lessonSlug = 'a-prompt-is-the-beginning-of-a-conversation';
const dataDirectory = new URL('../src/data/', import.meta.url);
const dataSources = fs.readdirSync(dataDirectory)
  .filter(file => file.endsWith('.js'))
  .map(file => fs.readFileSync(new URL(file, dataDirectory), 'utf8'))
  .join('\n');
const aiFoundationsSource = fs.readFileSync(new URL('../src/data/aiFoundations.js', import.meta.url), 'utf8');
const lessonStart = aiFoundationsSource.indexOf(`slug: "${lessonSlug}"`);
const lessonEnd = aiFoundationsSource.indexOf('\n  {\n    id: 6,', lessonStart);
const lesson = aiFoundationsSource.slice(lessonStart, lessonEnd);

test('AI conversation lesson is revised in place without a duplicate lesson or slug', () => {
  assert.ok(lessonStart >= 0);
  assert.ok(lessonEnd > lessonStart);
  assert.match(lesson, /title: "Why AI Sometimes Gives You the Wrong Answer"/);
  assert.equal(
    dataSources.match(new RegExp(`\\bslug:\\s*"${lessonSlug}"`, 'g'))?.length,
    1
  );
  assert.equal(
    dataSources.match(/\btitle:\s*"Why AI Sometimes Gives You the Wrong Answer"/g)?.length,
    1
  );
  assert.doesNotMatch(dataSources, /\bslug:\s*"why-ai-sometimes-gives-you-the-wrong-answer"/);
});

test('lesson preserves the required human-responsibility teaching and practical questions', () => {
  const requiredLanguage = [
    'AI may have knowledge, but the business owner brings experience, judgment, context, and wisdom.',
    'The smartest people I know keep asking questions.',
    'What assumptions are you making?',
    'What information might you be missing?',
    'Explain why you reached that conclusion.',
    'Give me another interpretation.',
    'What would an experienced small-business owner question about this?',
    'How confident are you in this answer?',
    'Separate what you know from what you are assuming.',
    'This does not fit my experience. Let’s reconsider it.'
  ];

  requiredLanguage.forEach(text => assert.match(lesson, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))));
  assert.match(lesson, /AI does not have feelings/);
  assert.match(lesson, /verify it with the original or authoritative source/);
});

test('publishing package and discoverability records point to the established canonical route', () => {
  assert.match(lesson, /primarySearchPhrase: "why AI gives wrong answers"/);
  assert.match(lesson, /relatedSearchPhrases:/);
  assert.match(lesson, /facebook:/);
  assert.match(lesson, /linkedin:/);
  assert.match(lesson, /youtubeShortsHooks:/);
  const canonicalPath = `/knowledge/ai-foundations/${lessonSlug}`;
  assert.match(lesson, new RegExp(canonicalPath));

  const aiSitemap = fs.readFileSync(new URL('../public/ai-sitemap.json', import.meta.url), 'utf8');
  const xmlSitemap = fs.readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  assert.equal(aiSitemap.match(new RegExp(`"slug": "${lessonSlug}"`, 'g'))?.length, 1);
  assert.equal(xmlSitemap.match(new RegExp(canonicalPath, 'g'))?.length, 1);
});
