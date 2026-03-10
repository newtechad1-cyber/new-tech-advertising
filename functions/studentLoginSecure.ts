import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Secure login that creates a server-side session record.
 * Implements concurrent session control: revokes older sessions on new login (safer default).
 * Returns an opaque session token that must be validated server-side on every request.
 */
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  const base44 = createClientFromRequest(req);

  try {
    const { school_slug, email, access_code } = await req.json();

    if (!school_slug || !email || !access_code) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Step 1: Validate student credentials
    const students = await base44.asServiceRole.entities.StudentUsers.filter({
      school_slug: school_slug.trim(),
      email: email.toLowerCase().trim(),
      access_code: access_code.trim(),
      is_active: true,
    });

    if (!students || students.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const student = students[0];

    // Step 2: Check suspension
    if (student.suspended_until && new Date(student.suspended_until) > new Date()) {
      return Response.json({ error: 'Account suspended' }, { status: 403 });
    }

    // Step 3: Check upload access
    if (!student.can_upload) {
      return Response.json({ error: 'Upload access disabled' }, { status: 403 });
    }

    // Step 4: CONCURRENT SESSION CONTROL
    // Safer default for school use: revoke all previous sessions on new login
    // This prevents account sharing and unauthorized concurrent access
    const oldSessions = await base44.asServiceRole.entities.StudentSessions.filter({
      student_user_id: student.id,
      school_slug: school_slug,
      is_active: true,
    });
    
    if (oldSessions && oldSessions.length > 0) {
      // Revoke all existing sessions for this student
      for (const oldSession of oldSessions) {
        await base44.asServiceRole.entities.StudentSessions.update(oldSession.id, {
          is_active: false,
          revoked_at: new Date().toISOString(),
        });
      }
    }

    // Step 5: Generate cryptographically strong random session token
    const sessionToken = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Step 6: Hash the token using SubtleCrypto (for server-side storage only)
    const tokenBuffer = new TextEncoder().encode(sessionToken);
    const hashBuffer = await crypto.subtle.digest('SHA-256', tokenBuffer);
    const sessionTokenHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Step 7: Create server-side session record
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session

    const session = await base44.asServiceRole.entities.StudentSessions.create({
      student_user_id: student.id,
      school_slug: school_slug,
      session_token_hash: sessionTokenHash,
      created_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      last_seen_at: new Date().toISOString(),
      user_agent: req.headers.get('user-agent') || 'unknown',
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      is_active: true,
    });

    // Step 8: Update student last_login_at
    await base44.asServiceRole.entities.StudentUsers.update(student.id, {
      last_login_at: new Date().toISOString(),
    });

    // Return opaque token (browser cannot decode or forge)
    return Response.json({
      success: true,
      session: {
        session_token: sessionToken, // Only returned once - store in localStorage
        student_user_id: student.id,
        student_name: student.full_name,
        email: student.email,
        school_slug: school_slug,
        expires_at: expiresAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Secure login error:', error);
    return Response.json({ error: 'Login failed' }, { status: 500 });
  }
});