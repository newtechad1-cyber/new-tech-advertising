import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Automation handler: triggered on StudentUsers update.
 * Revokes all active sessions if:
 * - is_active changed from true to false
 * - suspended_until is set
 * - can_upload changed from true to false
 */
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  try {
    const { event, data, old_data } = await req.json();

    if (!event || event.type !== 'update') {
      return Response.json({ success: true, message: 'Not an update event' });
    }

    const student_id = event.entity_id;
    const student = data;
    const previousStudent = old_data;

    if (!student || !student.school_slug) {
      return Response.json({ success: true, message: 'Missing data' });
    }

    // Detect if session should be revoked
    let shouldRevoke = false;
    let revocationReason = '';

    // Case 1: Student deactivated
    if (previousStudent?.is_active === true && student.is_active === false) {
      shouldRevoke = true;
      revocationReason = 'Account deactivated';
    }

    // Case 2: Student suspended
    if (!previousStudent?.suspended_until && student.suspended_until) {
      shouldRevoke = true;
      revocationReason = 'Account suspended';
    }

    // Case 3: Upload access revoked
    if (previousStudent?.can_upload === true && student.can_upload === false) {
      shouldRevoke = true;
      revocationReason = 'Upload access revoked';
    }

    if (!shouldRevoke) {
      return Response.json({ success: true, message: 'No session revocation needed' });
    }

    // Revoke all active sessions
    const activeSessions = await base44.asServiceRole.entities.StudentSessions.filter({
      student_user_id: student_id,
      school_slug: student.school_slug,
      is_active: true,
    });

    if (!activeSessions || activeSessions.length === 0) {
      return Response.json({
        success: true,
        message: 'No active sessions to revoke',
        reason: revocationReason,
      });
    }

    let revokedCount = 0;
    for (const session of activeSessions) {
      await base44.asServiceRole.entities.StudentSessions.update(session.id, {
        is_active: false,
        revoked_at: new Date().toISOString(),
      });
      revokedCount++;
    }

    console.log(`Revoked ${revokedCount} sessions for student ${student_id}. Reason: ${revocationReason}`);

    return Response.json({
      success: true,
      revoked_count: revokedCount,
      reason: revocationReason,
    });
  } catch (error) {
    console.error('Session revocation automation error:', error);
    return Response.json({ error: 'Automation failed' }, { status: 500 });
  }
});