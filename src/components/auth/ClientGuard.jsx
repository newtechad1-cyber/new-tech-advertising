import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Lock } from 'lucide-react';

const ALLOWED_ROLES = ['admin', 'client', 'staff'];

export default function ClientGuard({ children }) {
  const { user, isLoadingAuth, authChecked, navigateToLogin } = useAuth();

  if (isLoadingAuth || !authChecked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    navigateToLogin();
    return null;
  }

  if (!ALLOWED_ROLES.includes(user.role)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border p-8 max-w-md w-full text-center">
          <Lock className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Access Restricted</h2>
          <p className="text-slate-500 mb-4">You don't have permission to view this page.</p>
          <button onClick={() => window.location.href = '/'} className="text-sm text-blue-600 hover:underline">
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return children;
}