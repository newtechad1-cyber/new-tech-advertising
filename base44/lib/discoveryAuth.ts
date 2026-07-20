export async function authenticateSession(base44: any, session_id: string, public_session_key: string) {
  return { session: null, error: 'Unauthorized', status: 401 };
}