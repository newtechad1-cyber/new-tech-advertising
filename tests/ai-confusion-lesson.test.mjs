import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { AI_CONFUSION_PATH, AI_CONFUSION_SOURCES, lesson17 } from '../src/data/aiFoundationsLesson17.js';
import { getCollectionBySlug, getLessonBySlug, getRelatedLessons } from '../src/data/masterCurriculum.js';

const read = file => readFileSync(file, 'utf8');
const nativePath = 'src/pages/knowledge/ai-foundations/is-using-ai-cheating.jsx';

test('one governing lesson is registered with real previous and related lessons', () => {
  const collection = getCollectionBySlug('ai-foundations');
  const matches = collection.lessons.filter(lesson => lesson.slug === lesson17.slug);
  assert.equal(matches.length, 1);
  assert.equal(matches[0].content, lesson17.content);
  assert.equal(matches[0].previousLessonSlug, 'how-do-you-put-ai-to-work-in-a-real-business');
  assert.equal(collection.lessons.at(-2).nextLessonSlug, lesson17.slug);
  assert.equal(getRelatedLessons('ai-foundations', lesson17.slug).length, 3);
});

test('all nine external sources have explanatory notes and are present as links', () => {
  assert.equal(AI_CONFUSION_SOURCES.length, 9);
  assert.equal(new Set(AI_CONFUSION_SOURCES.map(source => source.id)).size, 9);
  assert.equal(new Set(AI_CONFUSION_SOURCES.map(source => source.url)).size, 9);
  for (const source of AI_CONFUSION_SOURCES) {
    assert.equal(new URL(source.url).protocol, 'https:');
    assert.ok(source.publisher && source.note.length > 40);
    assert.ok(lesson17.content.includes('](' + source.url + ')'), source.id);
  }
});

test('every internal lesson link resolves in the current curriculum', () => {
  const targets = [...lesson17.content.matchAll(/\]\((\/knowledge\/[^)]+)\)/g)].map(match => match[1]);
  targets.push(...lesson17.relatedLessons.map(item => item.link));
  for (const target of targets) {
    const [, , collection, slug] = target.split('/');
    assert.ok(getLessonBySlug(collection, slug), target);
  }
});

test('native route and Library discovery use the exact same lesson identity', () => {
  const page = read(nativePath);
  assert.match(page, /lesson17 as lesson/);
  assert.doesNotMatch(page, /const CONTENT =/);
  assert.ok(read('src/config/publicRoutes.js').includes("alias('" + AI_CONFUSION_PATH + "', AIConfusionLesson)"));
  assert.ok(read('src/pages.config.js').includes("'knowledge/ai-foundations/is-using-ai-cheating': AIConfusionLesson"));
  assert.ok(read('src/pages/KnowledgeLibrary.jsx').includes(AI_CONFUSION_PATH));
  assert.ok(read('src/pages/AIFoundationsCollection.jsx').includes(AI_CONFUSION_PATH));
  assert.ok(read('src/pages/knowledge/ai-foundations/how-do-you-put-ai-to-work-in-a-real-business.jsx').includes('const NEXT_PATH = "' + AI_CONFUSION_PATH + '"'));
});

test('source navigation, paragraph preservation and scoped progress are explicit', () => {
  const page = read(nativePath);
  assert.match(page, /id="lesson-sources"/);
  assert.match(page, /href="#lesson-sources"/);
  assert.match(page, /scrollIntoView/);
  assert.match(page, /preserveParagraphs/);
  assert.match(page, /updateLearningProgress\(PROGRESS_KEY, true\)/);
  assert.match(page, /role="alert"/);
  assert.match(read('src/components/knowledge/LessonArticle.jsx'), /preserveParagraphs = false/);
});

test('no invented video or podcast is advertised for this lesson', () => {
  const page = read(nativePath);
  assert.match(page, /LessonMediaOptions path=\{AI_CONFUSION_PATH\}/);
  assert.doesNotMatch(page, /youtube\.com|\.mp3|Watch the episode|Listen to the podcast/);
});

test('both production HTML forms contain the actual teaching and source links', () => {
  for (const suffix of ['.html', '/index.html']) {
    const html = read('dist' + AI_CONFUSION_PATH + suffix);
    assert.ok(html.includes('AI Confusion: Is Using AI Cheating?'));
    assert.ok(html.includes('https://newtechadvertising.com' + AI_CONFUSION_PATH));
    assert.doesNotMatch(html, /name="robots"[^>]*noindex/);
    assert.ok(html.includes('Sources and further reading'));
    assert.ok(html.includes('Community cleanup'));
    for (const source of AI_CONFUSION_SOURCES) assert.ok(html.includes(source.url), source.id);
  }
  assert.ok(read('public/sitemap.xml').includes(AI_CONFUSION_PATH));
  assert.ok(read('public/ai-sitemap.json').includes(AI_CONFUSION_PATH));
});
