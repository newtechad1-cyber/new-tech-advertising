import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export function AdminGuard({ children }) {
    const { user, isLoadingAuth } = useAuth();
    
    if (isLoadingAuth) return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div></div>;
    if (!user) return <Navigate to="/Login" replace />;
    
    // Check if admin (allow legacy hardcoded emails just in case, but rely on new role)
    const isAdmin = user.role === 'admin' || user.email === 'info@newtechadvertising.com';
    
    if (!isAdmin) return <Navigate to="/client-dashboard" replace />;
    
    return <>{children}</>;
}

export function ClientGuard({ children }) {
    const { user, isLoadingAuth } = useAuth();
    
    if (isLoadingAuth) return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div></div>;
    if (!user) return <Navigate to="/Login" replace />;
    
    // Both admins and clients can access client views (admins can "View as")
    return <>{children}</>;
}