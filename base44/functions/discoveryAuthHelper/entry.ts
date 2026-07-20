import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

export async function authenticateSession(base44, session_id, public_session_key) {
  if (!session_id || !public_session_key) {
    return { error: 'Unauthorized', status: 401 };
  }

  const session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
  if (!session || session.public_session_key !== public_session_key) {
    return { error: 'Unauthorized', status: 401 };
  }

  // Check expiration
  if (session.expires_at && new Date(session.expires_at) < new Date()) {
    return { error: 'Unauthorized', status: 401 }; // Return generic 401
  }

  // Check status
  if (['deleted', 'expired', 'deletion_requested'].includes(session.status)) {
    return { error: 'Unauthorized', status: 401 }; // Generic 401
  }

  return { session, error: null };
}

// To satisfy the deployment engine if it tries to boot this file directly
Deno.serve(async (req) => {
  return Response.json({ error: 'This is an internal helper module.' }, { status: 403 });
});