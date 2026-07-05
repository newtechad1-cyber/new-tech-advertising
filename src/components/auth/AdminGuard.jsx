import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import NoIndexMeta from './NoIndexMeta';

export default function AdminGuard({ children }) {
  const { user, isLoadingAuth, authChecked, navigateToLogin } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    async function verifyAdmin() {
      if (!user) {
        setIsVerifying(false);
        return;
      }
      try {
        const ADMIN_EMAILS = ["info@newtechadvertising.com", "newtechad1@gmail.com"];
        const adminByRole = user.role === "admin";
        const adminByEmail = ADMIN_EMAILS.includes(user.email?.toLowerCase());
        setIsAdmin(adminByRole || adminByEmail);
        console.log("[AdminGuard] email:", user.email, "role:", user.role, "isAdmin:", adminByRole || adminByEmail);
      } catch (error) {
        console.error("Failed to verify admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsVerifying(false);
      }
    }

    if (authChecked && !isLoadingAuth) {
      verifyAdmin();
    }
  }, [user, authChecked, isLoadingAuth]);

  if (isLoadingAuth || !authChecked || isVerifying) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-800 border-t-violet-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    navigateToLogin();
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <NoIndexMeta />
        <Card className="max-w-md w-full bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-3 text-red-500">
              <Lock className="w-6 h-6" />
              <CardTitle className="text-white">Admin Access Required</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-400">
              This page is only accessible to administrators. If you believe you should have access, please contact support.
            </p>
            <Button onClick={() => window.location.href = createPageUrl('ClientDashboard')} className="w-full bg-violet-600 hover:bg-violet-500 text-white">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <NoIndexMeta />
      {children}
    </>
  );
}
