import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Revokes a student session immediately.
 * Browser should also clear localStorage after calling this.
 */
const TRUSTED_PUBLIC_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);
const REQUEST_WINDOW_MS = 15 * 60 * 1000;
const REQUEST_LIMIT = 24;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function isTrustedPublicOrigin(req: Request) {
  const rawOrigin = req.headers.get('origin') || req.headers.get('referer');
  if (!rawOrigin) return false;

  try {
    return TRUSTED_PUBLIC_ORIGINS.has(new URL(rawOrigin).origin);
  } catch {
    return false;
  }
}

function requestClientIdentity(req: Request) {
  return String(
    req.headers.get('cf-connecting-ip')
    || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown',
  ).slice(0, 128);
}

function isRateLimited(req: Request) {
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
  return 0;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  const base44 = createClientFromRequest(req);
    const publicBoundaryUser = await base44.auth.me().catch(() => null);
    const trustedPublicService = publicBoundaryUser?.role === 'admin' || publicBoundaryUser?.is_service === true;

    if (!trustedPublicService && !isTrustedPublicOrigin(req)) {
      return Response.json({ error: 'Untrusted request origin' }, { status: 403 });
    }

    if (!trustedPublicService) {
      const retryAfterSeconds = isRateLimited(req);
      if (retryAfterSeconds) {
        return Response.json(
          { error: 'Too many requests. Please try again shortly.' },
          { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
        );
      }
    }

  try {
    const { student_user_id, school_slug, session_token } = await req.json();

    if (!student_user_id || !school_slug || !session_token) {
      return Response.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Hash the token
    const tokenBuffer = new TextEncoder().encode(session_token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', tokenBuffer);
    const sessionTokenHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Find and revoke the session
    const sessions = await base44.asServiceRole.entities.StudentSessions.filter({
      student_user_id: student_user_id,
      school_slug: school_slug,
      session_token_hash: sessionTokenHash,
      is_active: true,
    });

    if (sessions && sessions.length > 0) {
      await base44.asServiceRole.entities.StudentSessions.update(sessions[0].id, {
        is_active: false,
        revoked_at: new Date().toISOString(),
      });
    }

    return Response.json({
      success: true,
      message: 'Session revoked',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return Response.json({ error: 'Logout failed' }, { status: 500 });
  }
});