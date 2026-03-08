import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Lock } from 'lucide-react';

export default function ClientGuard({ children }) {
  const [status, setStatus] = useState('loading'); // loading | authorized | forbidden
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const u = await base44.auth.me();
        if (!u) { base44.auth.redirectToLogin(window.location.pathname); return; }
        setUser(u);
        // admin can also view client pages (for previewing)
        if (u.role === 'admin' || u.role === 'client' || u.role === 'staff') {
          setStatus('authorized');
        } else {
          setStatus('forbidden');
        }
      } catch {
        base44.auth.redirectToLogin(window.location.pathname);
      }
    })();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading your dashboard...</p>
      </div>
    );
  }

  if (status === 'forbidden') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border p-8 max-w-md w-full text-center">
          <Lock className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Access Restricted</h2>
          <p className="text-slate-500 mb-4">You don't have permission to view this page.</p>
          <button onClick={() => window.location.href = createPageUrl('Home')} className="text-sm text-blue-600 hover:underline">
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return children;
}