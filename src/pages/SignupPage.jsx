import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';

export default function SignupPage() {
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
      <SEOHead title="Sign Up | New Tech Advertising" description="Create your free account." />
      
      <div className="bg-slate-900 border border-slate-800 p-10 rounded-2xl max-w-md w-full text-center shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-2">Create an account</h1>
        <p className="text-slate-400 mb-8 text-sm">Get started with your free account.</p>
        
        <Button 
          onClick={() => base44.auth.redirectToLogin(window.location.origin + '/signup')}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 text-md rounded-xl"
        >
          <UserPlus className="w-5 h-5 mr-3" />
          Sign Up
        </Button>
        
        <p className="text-sm text-slate-500 mt-6 leading-relaxed">
          Already have an account? <Link to="/Login" className="text-blue-500 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}