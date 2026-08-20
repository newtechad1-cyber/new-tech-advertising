import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const ALLOWED_IMAGE_HOSTS = new Set([
  'base44.app',
  'qtrypzzcjebvfcihiynt.supabase.co',
  'images.unsplash.com',
  'images.pexels.com',
  'via.placeholder.com',
]);

function isTrustedInternalUser(user) {
  const adminEmails = String(Deno.env.get('ADMIN_EMAILS') || '')
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

  const response = await fetch(imageUrl.toString(), { redirect: 'follow' });
  if (!response.ok) {
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