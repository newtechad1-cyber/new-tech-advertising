import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { AlertTriangle } from 'lucide-react';

/**
 * ResellerGuard
 * 
 * Protects reseller-scoped routes.
 * Validates:
 * - User is authenticated
 * - User has reseller_id set
 * - User has required reseller role
 * - Reseller account is active
 */
export default function ResellerGuard({ children, requiredRole = 'analyst' }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const validateResellerAccess = async () => {
      try {
        const authenticatedUser = await base44.auth.me();
        
        // Check if user has reseller context
        if (!authenticatedUser?.reseller_id) {
          setIsAuthorized(false);
          return;
        }

        // Validate reseller account is active
        const reseller = await base44.entities.ResellerAccount?.read?.(authenticatedUser.reseller_id);
        if (!reseller || reseller.status !== 'active') {
          setIsAuthorized(false);
          return;
        }

        // Check role permissions
        const roleHierarchy = ['owner', 'admin', 'sales', 'content_manager', 'support', 'analyst'];
        const userRoleIndex = roleHierarchy.indexOf(authenticatedUser.reseller_role || 'analyst');
        const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

        if (userRoleIndex > requiredRoleIndex) {
          setIsAuthorized(false);
          return;
        }

        setUser(authenticatedUser);
        setIsAuthorized(true);
      } catch (error) {
        console.error('Reseller auth check failed:', error);
        setIsAuthorized(false);
      }
    };

    validateResellerAccess();
  }, [requiredRole]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Verifying access...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-red-700 rounded-lg p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-300 text-sm mb-6">
            You don't have permission to access this area or your reseller account is not active.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return children;
}