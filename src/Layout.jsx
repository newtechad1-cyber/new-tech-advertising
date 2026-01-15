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

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('admin');
  
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const loadUser = async () => {
      try {
        const authenticatedUser = await base44.auth.me();
        setUser(authenticatedUser);
      } catch (error) {
        console.log('User not authenticated');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  useEffect(() => {
    if (user && !isAdmin && viewMode !== 'client') {
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
    </ViewModeContext.Provider>
  );
}