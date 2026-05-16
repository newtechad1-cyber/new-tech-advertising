import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

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
        const userRecords = await base44.entities.User.filter({ email: user.email });
        console.log("[AdminGuard] checking email:", user.email, "found records:", userRecords?.length, "roles:", userRecords?.map(r => r.role));
        if (userRecords && userRecords.length > 0) {
          setIsAdmin(userRecords.some(record => record.role === 'admin'));
        } else {
          setIsAdmin(false);
        }
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Verifying access...</p>
      </div>
    );
  }

  if (!user) {
    navigateToLogin();
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-3 text-red-600">
              <Lock className="w-6 h-6" />
              <CardTitle>Admin Access Required</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">
              This page is only accessible to administrators. If you believe you should have access, please contact support.
            </p>
            <Button onClick={() => window.location.href = createPageUrl('ClientDashboard')} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
}