import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';

export default function Login() {
  const { user, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If already logged in, route them appropriately
  if (user) {
    const isAdmin = user.role === 'admin' || user.email === 'info@newtechadvertising.com';
    return <Navigate to={isAdmin ? "/admin-dashboard" : "/client-dashboard"} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <SEOHead title="Login | New Tech Advertising" description="Secure client and admin login." />
      
      <div className="bg-slate-900 border border-slate-800 p-10 rounded-2xl max-w-md w-full text-center shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-slate-400 mb-8 text-sm">Please log in to access your dashboard.</p>
        
        <Button 
          onClick={() => base44.auth.redirectToLogin(window.location.origin + '/Login')}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 text-md rounded-xl"
        >
          <LogIn className="w-5 h-5 mr-3" />
          Secure Login
        </Button>
        
        <p className="text-xs text-slate-500 mt-6 leading-relaxed">
          Need to set or reset your password?<br/>
          Click login and select <strong>"Forgot Password"</strong>.
        </p>
      </div>
    </div>
  );
}