import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const ADMIN = { user_condition: { role: 'admin' } };
const CONTENT_RULES = [
  ['PublishingArticle', 'status', 'Published', false],
  ['GrowthShowEpisode', 'status', 'Published', false],
  ['YouTubeKnowledge', 'publish_status', 'Published', true],
  ['JournalIssue', 'status', 'Published', false],
  ['WebsiteVideoStory', 'publish_status', 'published', false],
  ['CanonCollection', 'status', 'Published', false],
  ['CaseStudy', 'status', 'published', false],
];
const RESTRICTED_FIELDS = {
  PublishingArticle: ['featured_image_prompt', 'workflow_notes', 'reviewer_notes'],
  GrowthShowEpisode: ['notes'],
  YouTubeKnowledge: ['thumbnail_prompt', 'video_script_long', 'video_script_short', 'shorts_hook', 'notes'],
  JournalIssue: ['featured_image_prompt', 'newsletter_subject', 'newsletter_sent', 'subscriber_count', 'scheduled_date', 'scheduled_time'],
  CaseStudy: ['video_script', 'blog_article', 'social_posts', 'description'],
};
const readSchema = name => JSON.parse(readFileSync(new URL(`../base44/entities/${name}.jsonc`, import.meta.url), 'utf8'));

test('draft-capable content entities require published status for anonymous reads', () => {
  for (const [name, field, published, requirePublicVisibility] of CONTENT_RULES) {
    const schema = readSchema(name);
    const publicCondition = requirePublicVisibility
      ? { $and: [{ [`data.${field}`]: published }, { 'data.visibility': 'Public' }] }
      : { [`data.${field}`]: published };
    assert.deepEqual(schema.rls.read, { $or: [ADMIN, publicCondition] }, name);
    assert.deepEqual(schema.rls.create, ADMIN, `${name} create`);
    assert.deepEqual(schema.rls.update, ADMIN, `${name} update`);
    assert.deepEqual(schema.rls.delete, ADMIN, `${name} delete`);
  }
});

test('editorial fields declare admin-only read rules in entity schemas', () => {
  for (const [entity, fields] of Object.entries(RESTRICTED_FIELDS)) {
    const schema = readSchema(entity);
    for (const field of fields) {
      assert.deepEqual(schema.properties[field].rls?.read, ADMIN, `${entity}.${field}`);
    }
  }
});

test('video-story public route requests only published rows', () => {
  const source = readFileSync(new URL('../src/pages/VideoStory.jsx', import.meta.url), 'utf8');
  assert.match(source, /WebsiteVideoStory\.filter\(\{\s*slug,\s*publish_status:\s*['"]published['"]\s*\}\)/);
  assert.doesNotMatch(source, /WebsiteVideoStory\.filter\(\{\s*slug\s*\}\)/);
});
