import React, { useState, useEffect, createContext, useContext } from 'react';
import { base44 } from '@/api/base44Client';

const ViewModeContext = createContext();

export const useViewMode = () => {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within Layout');
  }
  return context;
};

import ADAComplianceBanner from '@/components/marketing/ADAComplianceBanner';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('admin');
  
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const loadUser = async () => {
      try {
        const authenticatedUser = await base44.auth.me();
        setUser(authenticatedUser);
        console.log('[Layout] User loaded:', authenticatedUser?.email, 'Role:', authenticatedUser?.role);
      } catch (error) {
        console.log('[Layout] User not authenticated:', error.message);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  useEffect(() => {
    // Auto-switch to client view for non-admin users
    // This prevents non-admin users from accessing admin-only features
    // Admin users can toggle between views manually
    if (user && !isAdmin && viewMode !== 'client') {
      console.log('[Layout] Auto-setting viewMode to client for non-admin user');
      setViewMode('client');
    }
  }, [user, isAdmin, viewMode]);

  const contextValue = {
    user,
    isAdmin,
    viewMode,
    setViewMode,
    isLoading
  };

  return (
    <ViewModeContext.Provider value={contextValue}>
      {children}
      <ADAComplianceBanner />
    </ViewModeContext.Provider>
  );
}