import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminGuard({ children }) {
  const { user, isLoadingAuth, authChecked, navigateToLogin } = useAuth();

  if (isLoadingAuth || !authChecked) {
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

  if (user.role !== 'admin') {
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
            <Button onClick={() => window.location.href = '/client/dashboard'} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
}