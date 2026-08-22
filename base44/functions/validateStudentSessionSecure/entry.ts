import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Validates session token against server-side session record.
 * This is the security boundary - token is hashed and checked server-side.
 * Checks: expiry, revocation, account suspension, upload access.
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

    // Step 1: Hash the provided token
    const tokenBuffer = new TextEncoder().encode(session_token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', tokenBuffer);
    const sessionTokenHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Step 2: Query server-side session record
    const sessions = await base44.asServiceRole.entities.StudentSessions.filter({
      student_user_id: student_user_id,
      school_slug: school_slug,
      session_token_hash: sessionTokenHash,
      is_active: true,
    });

    if (!sessions || sessions.length === 0) {
      return Response.json({ error: 'Invalid session' }, { status: 401 });
    }

    const session = sessions[0];

    // Step 3: Check expiration
    if (new Date(session.expires_at) < new Date()) {
      // Mark session as expired
      await base44.asServiceRole.entities.StudentSessions.update(session.id, {
        is_active: false,
        revoked_at: new Date().toISOString(),
      });
      return Response.json({ error: 'Session expired' }, { status: 401 });
    }

    // Step 4: Check revocation
    if (session.revoked_at && new Date(session.revoked_at) < new Date()) {
      return Response.json({ error: 'Session revoked' }, { status: 401 });
    }

    // Step 5: Re-validate student is still active
    const students = await base44.asServiceRole.entities.StudentUsers.filter({
      id: student_user_id,
      is_active: true,
    });

    if (!students || students.length === 0) {
      // Revoke session if student is no longer active
      await base44.asServiceRole.entities.StudentSessions.update(session.id, {
        is_active: false,
        revoked_at: new Date().toISOString(),
      });
      return Response.json({ error: 'Account no longer active' }, { status: 401 });
    }

    const student = students[0];

    // Step 6: Check suspension
    if (student.suspended_until && new Date(student.suspended_until) > new Date()) {
      await base44.asServiceRole.entities.StudentSessions.update(session.id, {
        is_active: false,
        revoked_at: new Date().toISOString(),
      });
      return Response.json({ error: 'Account suspended' }, { status: 403 });
    }

    // Step 7: Check upload access
    if (!student.can_upload) {
      // Do not auto-revoke if can_upload is false (may be temporary)
      // But deny access
      return Response.json({ error: 'Upload access disabled' }, { status: 403 });
    }

    // Step 8: Update last_seen_at (for audit trail and session timeout detection)
    await base44.asServiceRole.entities.StudentSessions.update(session.id, {
      last_seen_at: new Date().toISOString(),
    });

    // Return authoritative student data
    return Response.json({
      valid: true,
      student: {
        student_user_id: student.id,
        full_name: student.full_name,
        student_name: student.full_name,
        email: student.email,
        role: student.role,
        grade: student.grade,
        team_or_club: student.team_or_club,
        is_active: student.is_active,
        can_upload: student.can_upload,
        school_slug: school_slug,
      },
      session: {
        created_at: session.created_at,
        expires_at: session.expires_at,
        last_seen_at: session.last_seen_at,
      },
    });
  } catch (error) {
    console.error('Session validation error:', error);
    return Response.json({ error: 'Validation failed' }, { status: 500 });
  }
});