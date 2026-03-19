import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Revokes all active sessions for a student (admin use only).
 * Called when student account is disabled, suspended, or on explicit admin request.
 * 
 * SECURITY: This function should only be called by admin backend logic,
 * never from student-facing frontend.
 */
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  const base44 = createClientFromRequest(req);

  try {
    const { student_user_id, school_slug, reason } = await req.json();

    if (!student_user_id || !school_slug) {
      return Response.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Find all active sessions for this student
    const activeSessions = await base44.asServiceRole.entities.StudentSessions.filter({
      student_user_id: student_user_id,
      school_slug: school_slug,
      is_active: true,
    });

    if (!activeSessions || activeSessions.length === 0) {
      return Response.json({
        success: true,
        revoked_count: 0,
        message: 'No active sessions to revoke',
      });
    }

    // Revoke all sessions
    let revokedCount = 0;
    for (const session of activeSessions) {
      await base44.asServiceRole.entities.StudentSessions.update(session.id, {
        is_active: false,
        revoked_at: new Date().toISOString(),
      });
      revokedCount++;
    }

    console.log(`Revoked ${revokedCount} sessions for student ${student_user_id}. Reason: ${reason || 'unspecified'}`);

    return Response.json({
      success: true,
      revoked_count: revokedCount,
      message: `Revoked ${revokedCount} active session(s)`,
    });
  } catch (error) {
    console.error('Session revocation error:', error);
    return Response.json({ error: 'Revocation failed' }, { status: 500 });
  }
});