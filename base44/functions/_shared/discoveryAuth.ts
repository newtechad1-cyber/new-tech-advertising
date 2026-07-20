export async function authenticateSession(base44: any, session_id: string, public_session_key: string) {
  if (!session_id || !public_session_key) {
    return { error: 'Unauthorized', status: 401 };
  }

  try {
    const session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
    if (!session || session.public_session_key !== public_session_key) {
      return { error: 'Unauthorized', status: 401 };
    }

    // Check expiration
    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      return { error: 'Unauthorized', status: 401 };
    }

    // Check status
    if (['deleted', 'expired', 'deletion_requested'].includes(session.status)) {
      return { error: 'Unauthorized', status: 401 };
    }

    return { session, error: null };
  } catch (error) {
    // Catch unexpected session lookup errors without exposing database information
    return { error: 'Unauthorized', status: 401 };
  }
}