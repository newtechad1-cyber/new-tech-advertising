import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

// Hook: resolves the current portal user's client_id and client record
export function usePortalClient() {
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null);
  const [portalUser, setPortalUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const u = await base44.auth.me();
        setUser(u);

        // Find ClientPortalUser record matching this email
        const portalUsers = await base44.entities.ClientPortalUser.filter({ email: u.email });
        if (portalUsers.length > 0) {
          const pu = portalUsers[0];
          setPortalUser(pu);
          // Load the client record
          if (pu.client_id) {
            const clients = await base44.entities.Clients.filter({ id: pu.client_id });
            setClient(clients[0] || null);
          }
        } else if (u.role === 'admin') {
          // Admin browsing portal — no restriction
          const clients = await base44.entities.Clients.filter({ archived: false });
          setClient(clients[0] || null); // fallback to first
        } else {
          setError('No client portal access found for your account.');
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { user, client, portalUser, loading, error };
}