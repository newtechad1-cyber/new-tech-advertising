import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Returns session info for a student (used by admin dashboard).
 * Shows active session count, last activity, etc.
 */
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  const base44 = createClientFromRequest(req);

  try {
    const { student_user_id, school_slug } = await req.json();

    if (!student_user_id || !school_slug) {
      return Response.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Get active sessions
    const activeSessions = await base44.asServiceRole.entities.StudentSessions.filter({
      student_user_id: student_user_id,
      school_slug: school_slug,
      is_active: true,
    });

    // Get all sessions (for audit)
    const allSessions = await base44.asServiceRole.entities.StudentSessions.filter({
      student_user_id: student_user_id,
      school_slug: school_slug,
    });

    const activeCount = activeSessions ? activeSessions.length : 0;
    const totalCount = allSessions ? allSessions.length : 0;

    // Find most recent activity
    let lastSeenAt = null;
    if (activeSessions && activeSessions.length > 0) {
      lastSeenAt = activeSessions.reduce((latest, session) => {
        return new Date(session.last_seen_at) > new Date(latest) ? session.last_seen_at : latest;
      }, activeSessions[0].last_seen_at);
    }

    return Response.json({
      student_user_id,
      active_session_count: activeCount,
      total_sessions_created: totalCount,
      last_activity: lastSeenAt,
      sessions: activeSessions ? activeSessions.map(s => ({
        session_id: s.id,
        created_at: s.created_at,
        expires_at: s.expires_at,
        last_seen_at: s.last_seen_at,
        user_agent: s.user_agent,
        ip_address: s.ip_address,
      })) : [],
    });
  } catch (error) {
    console.error('Session info error:', error);
    return Response.json({ error: 'Failed to retrieve session info' }, { status: 500 });
  }
});