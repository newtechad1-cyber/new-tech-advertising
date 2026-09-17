import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { XMLParser } from 'npm:fast-xml-parser@5.11.1';

const PLAYLIST_ID = Deno.env.get('YOUTUBE_PLAYLIST_ID') || 'UUdGaYoTxcO-W6wuC3iDqFDg';
const CACHE_TTL_MS = 15 * 60 * 1000;
const REQUEST_WINDOW_MS = 10 * 60 * 1000;
const REQUEST_LIMIT = 60;
const TRUSTED_PUBLIC_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);

let cachedPlaylist = { expiresAt: 0, videos: [] };
const requestBuckets = new Map();

function isTrustedPublicOrigin(req) {
  const rawOrigin = req.headers.get('origin') || req.headers.get('referer');
  if (!rawOrigin) return false;

  try {
    return TRUSTED_PUBLIC_ORIGINS.has(new URL(rawOrigin).origin);
  } catch {
    return false;
  }
}

function requestClientIdentity(req) {
  const forwarded = req.headers.get('cf-connecting-ip')
    || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown';

  return String(forwarded).slice(0, 128);
}

function isRateLimited(req) {
  const now = Date.now();
  const key = requestClientIdentity(req);
  let bucket = requestBuckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + REQUEST_WINDOW_MS };
    requestBuckets.set(key, bucket);
  }

  if (bucket.count >= REQUEST_LIMIT) {
    return Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  }

  bucket.count += 1;

  if (requestBuckets.size > 2000) {
    for (const [bucketKey, entry] of requestBuckets) {
      if (entry.resetAt <= now) requestBuckets.delete(bucketKey);
    }
  }

  return 0;
}

const playlistParser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: false,
  trimValues: true,
});

function slugify(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function parsePlaylistFeed(xml) {
  if (typeof xml !== 'string' || xml.length > 1_000_000 || /<!DOCTYPE|<!ENTITY/i.test(xml)) {
    throw new Error('Invalid YouTube playlist feed');
  }
  const feed = playlistParser.parse(xml, true)?.feed;
  if (!feed) throw new Error('Invalid YouTube playlist feed');
  const entries = Array.isArray(feed.entry) ? feed.entry : feed.entry ? [feed.entry] : [];
  const seen = new Set();
  return entries.slice(0, 50).map(entry => {
    const youtubeId = String(entry['yt:videoId'] || '');
    const title = String(entry.title || '').trim().slice(0, 500);
    if (!/^[A-Za-z0-9_-]{11}$/.test(youtubeId) || !title || /^(private|deleted) video$/i.test(title) || seen.has(youtubeId)) return null;
    seen.add(youtubeId);
    const publishedAt = String(entry.published || '');
    return {
      title,
      description: String(entry['media:group']?.['media:description'] || '').slice(0, 5000),
      youtubeId,
      youtubeUrl: 'https://www.youtube.com/watch?v=' + youtubeId,
      embedUrl: 'https://www.youtube-nocookie.com/embed/' + youtubeId + '?rel=0',
      thumbnailUrl: 'https://i.ytimg.com/vi/' + youtubeId + '/hqdefault.jpg',
      publishedAt: Number.isFinite(Date.parse(publishedAt)) ? publishedAt : '',
      duration: '',
      slug: slugify(title),
    };
  }).filter(Boolean);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  const base44 = createClientFromRequest(req);
  const authUser = await base44.auth.me().catch(() => null);

  // Signed-in callers are identified by Base44. Anonymous callers are allowed
  // only from the public NTA properties because this endpoint returns public
  // YouTube metadata used by the Learning Center.
  if (!authUser && !isTrustedPublicOrigin(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const retryAfterSeconds = isRateLimited(req);
  if (retryAfterSeconds) {
    return Response.json(
      { error: 'Too many playlist requests. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
    );
  }

  try {
    if (cachedPlaylist.expiresAt > Date.now()) {
      return Response.json(
        { videos: cachedPlaylist.videos },
        { headers: { 'Cache-Control': 'public, max-age=900' } },
      );
    }

    const playlistUrl = 'https://www.youtube.com/feeds/videos.xml?playlist_id=' + encodeURIComponent(PLAYLIST_ID);
    const response = await fetch(playlistUrl, {
      headers: { Accept: 'application/atom+xml' },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error('YouTube returned ' + response.status);
    }

    const videos = parsePlaylistFeed(await response.text());
    cachedPlaylist = {
      videos,
      expiresAt: Date.now() + CACHE_TTL_MS,
    };

    return Response.json(
      { videos },
      { headers: { 'Cache-Control': 'public, max-age=900' } },
    );
  } catch (error) {
    console.error('[getYouTubePlaylist] failed:', error?.message || error);
    return Response.json({ error: 'Unable to load videos right now' }, { status: 502 });
  }
});