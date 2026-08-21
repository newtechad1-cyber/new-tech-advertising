import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

export default function MeshyConnectionTest() {
  const { user, isLoadingAuth } = useAuth();
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.email === 'info@newtechadvertising.com';

  useEffect(() => {
    if (!isLoadingAuth && isAdmin) runTest();
  }, [isLoadingAuth, isAdmin]);

  async function runTest() {
    setRunning(true);
    try {
      const response = await base44.functions.invoke('meshyAuthTest', {});
      setResult(response?.data ?? response);
    } catch (error) {
      setResult({ ok: false, error: error?.message || 'Meshy connection test failed' });
    } finally {
      setRunning(false);
    }
  }

  if (isLoadingAuth) return <div className="p-8">Checking admin access...</div>;
  if (!user) return <Navigate to="/Login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-3">Meshy Connection Test</h1>
        <p className="text-slate-300 mb-6">Temporary admin-only test. The API key is never displayed.</p>
        <button onClick={runTest} disabled={running} className="px-4 py-2 rounded bg-blue-600 disabled:opacity-50">
          {running ? 'Testing...' : 'Test Meshy Connection'}
        </button>
        {result && (
          <pre className="mt-6 p-4 rounded bg-slate-900 border border-slate-700 overflow-auto text-sm whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </main>
  );
}
