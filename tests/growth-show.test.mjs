import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGrowthShowEpisodes, findGrowthShowEpisode } from '../src/lib/growthShow.js';

const video = {
  id: 'yt-record-1',
  video_title: 'A Better Way to Grow',
  youtube_video_id: 'abc123',
  video_url: 'https://www.youtube.com/watch?v=abc123',
  source_canon_id: 'A-100',
  source_asset_slug: 'a-better-way-to-grow',
  asset_format: 'Long Form',
  publish_status: 'Published',
  visibility: 'Public',
};

const article = {
  id: 'article-1',
  canon_id: 'A-100',
  title: 'A Better Way to Grow',
  slug: 'a-better-way-to-grow',
  summary: 'The canonical lesson summary.',
  status: 'Published',
};

test('published long-form videos become public Growth Show episodes', () => {
  const [episode] = buildGrowthShowEpisodes({ videos: [video], articles: [article] });
  assert.equal(episode.slug, 'a-better-way-to-grow');
  assert.equal(episode.youtubeVideoId, 'abc123');
  assert.equal(episode.lessons[0].canon_id, 'A-100');
  assert.equal(episode.status, 'Published');
});

test('episode records add publishing-system relationships without replacing video identity', () => {
  const [episode] = buildGrowthShowEpisodes({
    videos: [video],
    articles: [article],
    journals: [{ id: 'journal-2', slug: 'issue-two', title: 'Issue Two', status: 'Published' }],
    episodeRecords: [{
      id: 'episode-1',
      title: 'Growth Show: A Better Way to Grow',
      slug: 'growth-show-a-better-way-to-grow',
      status: 'Published',
      youtube_video_id: 'abc123',
      source_canon_id: 'A-100',
      related_journal_issue_ids: ['journal-2'],
      social_assets: [{ platform: 'LinkedIn', label: 'Episode post', url: 'https://example.com/post' }],
    }],
  });

  assert.equal(episode.slug, 'growth-show-a-better-way-to-grow');
  assert.equal(episode.youtubeVideoId, 'abc123');
  assert.equal(episode.journals[0].slug, 'issue-two');
  assert.equal(episode.socialAssets[0].label, 'Episode post');
});

test('shorts and private videos do not become show episodes', () => {
  const episodes = buildGrowthShowEpisodes({
    videos: [
      { ...video, youtube_video_id: 'short1', asset_format: 'Short' },
      { ...video, youtube_video_id: 'private1', visibility: 'Private' },
    ],
    articles: [article],
  });
  assert.equal(episodes.length, 0);
});

test('episode lookup accepts canonical slug and YouTube ID', () => {
  const episodes = buildGrowthShowEpisodes({ videos: [video], articles: [article] });
  assert.equal(findGrowthShowEpisode(episodes, 'a-better-way-to-grow')?.youtubeVideoId, 'abc123');
  assert.equal(findGrowthShowEpisode(episodes, 'abc123')?.slug, 'a-better-way-to-grow');
});
