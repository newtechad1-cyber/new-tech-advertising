import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Revokes a student session immediately.
 * Browser should also clear localStorage after calling this.
 */
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  const base44 = createClientFromRequest(req);

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