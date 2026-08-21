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

function entryText(entry, tagName) {
  return entry.getElementsByTagName(tagName)[0]?.textContent?.trim() || '';
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parsePlaylistFeed(xml) {
  if (typeof DOMParser === 'undefined') {
    throw new Error('XML parsing is unavailable');
  }

  const document = new DOMParser().parseFromString(xml, 'application/xml');
  if (!document || document.querySelector('parsererror')) {
    throw new Error('Invalid YouTube playlist feed');
  }

  return Array.from(document.getElementsByTagName('entry'))
    .slice(0, 50)
    .map((entry) => {
      const youtubeId = entryText(entry, 'yt:videoId');
      if (!/^[A-Za-z0-9_-]{6,128}$/.test(youtubeId)) return null;

      const title = entryText(entry, 'title').slice(0, 500);
      const description = entryText(entry, 'media:description').slice(0, 5000);
      const thumbnail = entry.getElementsByTagName('media:thumbnail')[0];
      const thumbnailUrl = thumbnail?.getAttribute('url') || null;

      return {
        title,
        description,
        youtubeId,
        youtubeUrl: 'https://youtu.be/' + youtubeId,
        embedUrl: 'https://www.youtube.com/embed/' + youtubeId,
        thumbnailUrl,
        publishedAt: entryText(entry, 'published'),
        duration: '',
        slug: slugify(title),
      };
    })
    .filter(Boolean);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  if (!isTrustedPublicOrigin(req)) {
    return Response.json({ error: 'Untrusted request origin' }, { status: 403 });
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
