import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { assertPublicDns } from '../shared/security.ts';

const ALLOWED_IMAGE_HOSTS = new Set([
  'base44.app',
  'qtrypzzcjebvfcihiynt.supabase.co',
  'images.unsplash.com',
  'images.pexels.com',
  'via.placeholder.com',
]);

function isTrustedInternalUser(user) {
  const adminEmails = String('' || '')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(
    user &&
    (user.is_service === true ||
      user.role === 'admin' ||
      adminEmails.includes(String(user.email || '').toLowerCase()))
  );
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch(() => null);

  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isTrustedInternalUser(user)) {
    return Response.json({ error: 'Admin access required' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const rawUrl = String(body?.url || '').trim();
  if (!rawUrl || rawUrl.length > 2048) {
    return Response.json({ error: 'Valid image URL required' }, { status: 400 });
  }

  let imageUrl;
  try {
    imageUrl = new URL(rawUrl);
  } catch {
    return Response.json({ error: 'Invalid image URL' }, { status: 400 });
  }

  if (
    imageUrl.protocol !== 'https:' ||
    imageUrl.username ||
    imageUrl.password ||
    !ALLOWED_IMAGE_HOSTS.has(imageUrl.hostname.toLowerCase())
  ) {
    return Response.json({ error: 'Image host is not allowed' }, { status: 400 });
  }

  let current = imageUrl;
  let response: Response | null = null;

  for (let redirectCount = 0; redirectCount <= 3; redirectCount += 1) {
    await assertPublicDns(current.hostname);
    response = await fetch(current.toString(), { redirect: 'manual' });

    if (![301, 302, 303, 307, 308].includes(response.status)) break;

    const location = response.headers.get('location');
    if (!location || redirectCount === 3) {
      return Response.json({ error: 'Image redirected too many times' }, { status: 502 });
    }

    let next: URL;
    try {
      next = new URL(location, current);
    } catch {
      return Response.json({ error: 'Invalid image redirect' }, { status: 502 });
    }

    if (
      next.protocol !== 'https:' ||
      next.username ||
      next.password ||
      !ALLOWED_IMAGE_HOSTS.has(next.hostname.toLowerCase())
    ) {
      return Response.json({ error: 'Image redirect host is not allowed' }, { status: 400 });
    }
    current = next;
  }

  if (!response || !response.ok) {
    return Response.json({ error: 'Failed to fetch image' }, { status: 502 });
  }

  const contentType = response.headers.get('content-type') || '';
  const contentLength = Number(response.headers.get('content-length') || 0);
  if (!/^image\/(?:png|jpe?g|gif|webp|avif|svg\+xml)$/i.test(contentType) || contentLength > 10 * 1024 * 1024) {
    return Response.json({ error: 'Only supported images up to 10MB are allowed' }, { status: 415 });
  }

  const buffer = await response.arrayBuffer();
  if (buffer.byteLength > 10 * 1024 * 1024) {
    return Response.json({ error: 'Image exceeds the 10MB limit' }, { status: 413 });
  }

  return new Response(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'private, no-store',
    },
  });
});