import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

export async function authenticateSession(session_id, public_session_key, allowDeletionRequested = false) {
  if (!session_id || !public_session_key) {
    return { error: 'Unauthorized', status: 401 };
  }

  const session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
  if (!session || session.public_session_key !== public_session_key) {
    return { error: 'Unauthorized', status: 401 };
  }

  // Check expiration
  if (session.expires_at && new Date(session.expires_at) < new Date()) {
    return { error: 'Session expired', status: 403 };
  }

  // Check status
  if (['deleted', 'expired'].includes(session.status)) {
    return { error: 'Session no longer active', status: 403 };
  }
  
  if (!allowDeletionRequested && session.status === 'deletion_requested') {
    return { error: 'Session no longer active', status: 403 };
  }

  return { session, error: null };
}