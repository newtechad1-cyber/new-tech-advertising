import { base44 } from '@base44/sdk';

export async function authenticateSession(session_id, public_session_key) {
  try {
    if (!session_id || !public_session_key) return { error: 'Unauthorized', status: 401 };
    const session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
    if (!session || session.public_session_key !== public_session_key) return { error: 'Unauthorized', status: 401 };
    if (session.expires_at && new Date(session.expires_at) < new Date()) return { error: 'Unauthorized', status: 401 };
    if (['deleted', 'expired', 'deletion_requested'].includes(session.status)) return { error: 'Unauthorized', status: 401 };
    return { session };
  } catch (e) {
    return { error: 'Unauthorized', status: 401 };
  }
}