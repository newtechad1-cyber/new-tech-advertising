import assert from 'node:assert/strict';
import test from 'node:test';
import { contentPath, contentContext, followUpPath, contextFromSearch, guideQuestion, learningLinks, relatedEpisodeLinks, followUpDetails } from '../src/lib/contentJourney.js';

const context = { path: '/knowledge/ai-foundations/working-with-ai', title: 'AI & your everyday work?' };

test('article context survives the handoff without carrying tracking or private query values', () => {
  const value = contentContext({ ...context, path: 'https://newtechadvertising.com' + context.path + '?email=private@example.com#part-two' });
  assert.deepEqual(value, context);
  const link = followUpPath(value);
  assert.deepEqual(contextFromSearch(link.slice(link.indexOf('?'))), context);
  assert.equal(link.includes('private'), false);
  assert.match(guideQuestion(value), /AI & your everyday work/);
});

test('untrusted destinations and active URL schemes cannot become a content handoff', () => {
  for (const path of ['https://evil.example/lesson', '//evil.example/lesson', 'javascript:alert(1)', '/\\\\evil.example/lesson', 'https://newtechadvertising.com.evil.example/lesson']) {
    assert.equal(contentPath(path), '', path);
    assert.equal(followUpPath({ ...context, path }), '/contact');
  }
});

test('learning links omit invalid, duplicate and self links', () => {
  assert.deepEqual(learningLinks([
    { title: 'Self', path: context.path },
    { title: 'Unsafe', href: 'javascript:alert(1)' },
    { title: 'Another lesson', path: '/canon/example' },
    { title: 'Duplicate', path: 'https://newtechadvertising.com/canon/example' },
    { title: 'A video', kind: 'video', href: 'https://www.youtube.com/watch?v=Wz9Gqshyk3o' },
  ], context.path).map(link => link.title), ['Another lesson', 'A video']);
});

test('video recommendations require an explicit published relationship to this content', () => {
  const matched = { status: 'Published', slug: 'working-with-ai', title: 'Working with AI', lessons: [{ canonical_url: context.path }] };
  const result = relatedEpisodeLinks(context, [matched, { ...matched, status: 'Draft', slug: 'draft' }, { ...matched, slug: 'other', lessons: [{ canonical_url: '/canon/unrelated' }] }]);
  assert.deepEqual(result, [{ path: '/growth-show/working-with-ai', title: 'Working with AI', kind: 'video' }]);
});

test('follow-up preserves the chosen reply channel, source and question for Core', () => {
  const detail = followUpDetails({ context, preference: 'text', message: 'Could you help our office do this?' });
  assert.match(detail.notes, /Preferred reply: text/);
  assert.match(detail.notes, /Could you help our office do this/);
  assert.match(detail.notes, /https:\/\/newtechadvertising.com\/knowledge\//);
  assert.equal(detail.metadata.requested_follow_up, true);
  assert.equal(detail.metadata.preferred_contact, 'text');
  assert.deepEqual(detail.metadata.content_context, context);
  assert.match(detail.metadata.consent_scope, /newsletter subscription is separate/);
  assert.ok(followUpDetails({ context, message: 'x'.repeat(9000) }).notes.length < 4000);
});
