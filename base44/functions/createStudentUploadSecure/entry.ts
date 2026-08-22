import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Creates StudentUpload record with BACKEND-ENFORCED student identity.
 * The browser cannot forge the student_user_id - it's validated here.
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
    const {
      student_user_id,
      school_slug,
      session_token,
      title,
      description,
      category,
      file_url,
      file_size_mb,
      upload_type,
    } = await req.json();

    if (!student_user_id || !school_slug || !session_token || !title || !file_url) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (String(session_token).length > 512) {
      return Response.json({ error: 'Invalid session' }, { status: 401 });
    }

    const tokenBuffer = new TextEncoder().encode(String(session_token));
    const hashBuffer = await crypto.subtle.digest('SHA-256', tokenBuffer);
    const sessionTokenHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const sessions = await base44.asServiceRole.entities.StudentSessions.filter({
      student_user_id,
      school_slug,
      session_token_hash: sessionTokenHash,
      is_active: true,
    });

    const session = sessions?.[0];
    if (!session || (session.expires_at && new Date(session.expires_at) <= new Date()) || session.revoked_at) {
      return Response.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    // CRITICAL: Validate student exists and is active
    const students = await base44.asServiceRole.entities.StudentUsers.filter({
      id: student_user_id,
      school_slug: school_slug,
      is_active: true,
      can_upload: true,
    });

    if (!students || students.length === 0) {
      return Response.json({ error: 'Student not authorized for uploads' }, { status: 403 });
    }

    const student = students[0];

    // Check suspension
    if (student.suspended_until && new Date(student.suspended_until) > new Date()) {
      return Response.json(
        { error: 'Account suspended' },
        { status: 403 }
      );
    }

    // Enforce max file size
    const MAX_SIZE_MB = 500;
    if (file_size_mb > MAX_SIZE_MB) {
      return Response.json(
        { error: `File too large. Max ${MAX_SIZE_MB}MB` },
        { status: 400 }
      );
    }

    // Create upload record with BACKEND-ENFORCED identity
    // Browser cannot override student_user_id
    const upload = await base44.asServiceRole.entities.StudentUploads.create({
      student_user_id: student.id, // Use validated student ID, not browser value
      student_name: student.full_name, // Use student name from record, not browser
      school_slug: school_slug,
      title: title.trim(),
      description: description?.trim() || '',
      category: category || 'other',
      file_urls: JSON.stringify([file_url]),
      upload_type: upload_type || 'video',
      file_size_total_mb: file_size_mb,
      status: 'submitted',
      moderation_status: 'pending',
      consent_confirmed: true,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown', // Audit trail
    });

    // TRIGGER: Automatic content moderation for explicit/nudity detection
    // This runs asynchronously and updates the upload status if explicit content detected
    try {
      await base44.asServiceRole.functions.invoke('moderateStudentUploadContent', {
        upload_id: upload.id,
        file_url: file_url,
        upload_type: upload_type,
        school_slug: school_slug,
      });
    } catch (err) {
      // Log error but don't fail upload creation
      // Admin can manually review if moderation fails
      console.error('Content moderation failed, flagging for review:', err);
      await base44.asServiceRole.entities.StudentUploads.update(upload.id, {
        moderation_status: 'requires_review',
        moderation_notes: 'Automatic moderation analysis failed. Requires manual review.',
      });
    }

    return Response.json({
      success: true,
      upload_id: upload.id,
      message: 'Upload submitted successfully. Content is being reviewed.',
    });
  } catch (error) {
    console.error('Upload creation error:', error);
    return Response.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
});