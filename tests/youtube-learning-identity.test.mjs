import test from 'node:test';
import assert from 'node:assert/strict';
import {
  findCanonicalLearningMatch,
  getCanonicalVideosForArticle,
} from '../src/lib/youtubeLearningIdentity.js';

const learningContent = [
  { canonId: 'A-001', slug: 'original-title', youtubeId: 'legacy-id' },
  { canonId: 'A-002', slug: 'second-lesson', youtubeId: 'second-id' },
];

test('canonical identity survives a changed YouTube title and slug', () => {
  const result = findCanonicalLearningMatch(
    { youtubeId: 'video-123', slug: 'a-completely-new-title' },
    learningContent,
    [{ youtube_video_id: 'video-123', source_canon_id: 'A-001' }],
  );

  assert.equal(result.content.canonId, 'A-001');
  assert.equal(result.matchedBy, 'canon_id');
});

test('source asset slug supports partially migrated records', () => {
  const result = findCanonicalLearningMatch(
    { youtubeId: 'video-456', slug: 'changed-title' },
    learningContent,
    [{ youtube_video_id: 'video-456', source_asset_slug: 'second-lesson' }],
  );

  assert.equal(result.content.canonId, 'A-002');
  assert.equal(result.matchedBy, 'source_asset_slug');
});

test('legacy YouTube ID remains a compatibility fallback', () => {
  const result = findCanonicalLearningMatch(
    { youtubeId: 'legacy-id', slug: 'changed-title' },
    learningContent,
  );

  assert.equal(result.content.canonId, 'A-001');
  assert.equal(result.matchedBy, 'youtube_id');
});

test('slug remains the final compatibility fallback', () => {
  const result = findCanonicalLearningMatch(
    { youtubeId: 'unknown-id', slug: 'second-lesson' },
    learningContent,
  );

  assert.equal(result.content.canonId, 'A-002');
  assert.equal(result.matchedBy, 'slug');
});

test('Knowledge Graph resolves videos through the same canonical identity', () => {
  const videos = getCanonicalVideosForArticle(
    { canon_id: 'A-001', related_video_ids: ['legacy-video'] },
    [
      { id: '1', video_title: 'Canonical lesson', source_canon_id: 'A-001', youtube_video_id: 'canonical-video' },
      { id: '2', video_title: 'Legacy lesson', youtube_video_id: 'legacy-video' },
      { id: '3', video_title: 'Other lesson', source_canon_id: 'A-002', youtube_video_id: 'other-video' },
    ],
  );

  assert.deepEqual(videos.map(video => video.youtube_video_id), ['canonical-video', 'legacy-video']);
  assert.equal(videos[0].title, 'Canonical lesson');
});
