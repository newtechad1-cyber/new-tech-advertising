import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = path => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const coreSource = read('../src/data/aiFoundations.js');
const lessonSources = [
  coreSource,
  ...Array.from({ length: 6 }, (_, index) => read(`../src/data/aiFoundationsLesson${index + 7}.js`))
];
const collectionSource = read('../src/pages/KnowledgeCollection.jsx');
const masterSource = read('../src/data/masterCurriculum.js');

const titles = lessonSources.flatMap(source =>
  [...source.matchAll(/^\s*title:\s*"([^"]+)"/gm)].map(match => match[1])
);
const slugs = lessonSources.flatMap(source =>
  [...source.matchAll(/^\s*slug:\s*"([^"]+)"/gm)].map(match => match[1])
);

test('all 12 AI Foundations lessons are represented once with unique titles and routes', () => {
  assert.equal(titles.length, 12);
  assert.equal(slugs.length, 12);
  assert.equal(new Set(titles).size, 12);
  assert.equal(new Set(slugs).size, 12);
  assert.match(masterSource, /aiFoundationsLesson11/);
  assert.match(masterSource, /aiFoundationsLesson12/);
});

test('the collection distinguishes the seven core foundations from five AI in Practice lessons', () => {
  assert.match(collectionSource, /The Seven Core Foundations/);
  assert.match(collectionSource, /AI in Practice: Rick’s Experience and Perspective/);
  assert.match(collectionSource, /idx === 7/);

  const lesson7 = lessonSources[1];
  assert.match(lesson7, /Completing the Core Foundations/);
  assert.doesNotMatch(lesson7, /completed the second collection/);
  assert.match(lesson7, /The next five lessons form \*\*AI in Practice\*\*/);
});

test('overlapping lessons retain distinct reader outcomes', () => {
  assert.match(coreSource, /Put AI in the Right Place/);
  assert.match(coreSource, /Context Has a Shelf Life/);
  assert.match(coreSource, /Match the Review to the Consequence/);
  assert.match(coreSource, /Have You Ever Met Someone Who Thinks They Know Everything\?/);

  assert.match(lessonSources[1], /Create a One-Page Pilot Brief/);
  assert.match(lessonSources[4], /From Conversation to a Working Business System/);
  assert.match(lessonSources[5], /The Five Tests I Use/);
  assert.match(lessonSources[6], /Create a Safe First Experience/);
});

test('plain content lines use complete punctuation or valid Markdown structure', () => {
  const exceptions = [];

  lessonSources.forEach((source, sourceIndex) => {
    const contentBlocks = [...source.matchAll(/content:\s*`([\s\S]*?)`,/g)];
    contentBlocks.forEach(({ 1: content }) => {
      content.split('\n').forEach((line, lineIndex) => {
        const text = line.trim();
        if (
          !text ||
          /^(###|[*>\d-]|\[)/.test(text) ||
          /[.!?:;”’)]$/.test(text)
        ) {
          return;
        }
        exceptions.push(`source ${sourceIndex + 1}, content line ${lineIndex + 1}: ${text}`);
      });
    });
  });

  assert.deepEqual(exceptions, []);
});
