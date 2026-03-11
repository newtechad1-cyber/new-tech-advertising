import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

/**
 * Global App Context
 * Provides centralized access to active context across platform
 */
const GlobalContext = createContext(null);

/**
 * Default context value — safe fallback if provider not initialized
 */
const DEFAULT_CONTEXT = {
  activeContextType: 'agency',
  activeCompanyId: null,
  activeCompanyName: null,
  activeSchoolId: null,
  activeSchoolName: null,
  activeVertical: null,
  activeNavFamily: 'main_admin',
  activeUserRole: 'viewer',
  activeBrandProfileId: null,
  activePublishingProfileId: null,
  sessionId: null,
  loading: true,
  user: null,
  contextMetadata: {},
};

/**
 * Global Context Provider
 * Wrap your app with this to enable useGlobalContext hook
 */
export function GlobalContextProvider({ children }) {
  const [context, setContext] = useState(DEFAULT_CONTEXT);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Initialize context from Base44 or create default
  useEffect(() => {
    const initializeContext = async () => {
      try {
        const authenticatedUser = await base44.auth.me();
        setUser(authenticatedUser);

        // Try to load existing context for this user
        try {
          const existingContexts = await base44.entities.GlobalAppContext.filter(
            { created_by: authenticatedUser.email, active: true },
            '-updated_date',
            1
          );

          if (existingContexts?.length > 0) {
            const ctx = existingContexts[0];
            setContext({
              activeContextType: ctx.active_context_type || 'agency',
              activeCompanyId: ctx.active_company_id || null,
              activeCompanyName: ctx.active_company_name || null,
              activeSchoolId: ctx.active_school_id || null,
              activeSchoolName: ctx.active_school_name || null,
              activeVertical: ctx.active_vertical_type || null,
              activeNavFamily: ctx.active_nav_family || 'main_admin',
              activeUserRole: ctx.active_user_role || authenticatedUser.role || 'viewer',
              activeBrandProfileId: ctx.active_brand_profile_id || null,
              activePublishingProfileId: ctx.active_publishing_profile_id || null,
              sessionId: ctx.session_id || null,
              loading: false,
              user: authenticatedUser,
              contextMetadata: ctx.context_metadata ? JSON.parse(ctx.context_metadata) : {},
            });
            return;
          }
        } catch (err) {
          console.log('[useGlobalContext] Could not load existing context:', err.message);
        }

        // Create default agency context
        const defaultContext = await base44.entities.GlobalAppContext.create({
          active_context_type: 'agency',
          active_user_role: authenticatedUser.role || 'viewer',
          active_nav_family: 'main_admin',
          session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        });

        setContext({
          activeContextType: 'agency',
          activeCompanyId: null,
          activeCompanyName: null,
          activeSchoolId: null,
          activeSchoolName: null,
          activeVertical: null,
          activeNavFamily: 'main_admin',
          activeUserRole: authenticatedUser.role || 'viewer',
          activeBrandProfileId: null,
          activePublishingProfileId: null,
          sessionId: defaultContext.session_id,
          loading: false,
          user: authenticatedUser,
          contextMetadata: {},
        });
      } catch (error) {
        console.error('[useGlobalContext] Error initializing:', error);
        // Fallback to default context with just the user role
        setContext((prev) => ({
          ...DEFAULT_CONTEXT,
          loading: false,
          activeUserRole: 'viewer',
        }));
      } finally {
        setLoading(false);
      }
    };

    initializeContext();
  }, []);

  // Switch context
  const switchContext = useCallback(async (updates) => {
    try {
      // Update local state immediately for responsive UI
      setContext((prev) => ({
        ...prev,
        ...updates,
      }));

      // Sync to database if we have an existing context record
      // (This is optional — can be added later if needed)
    } catch (error) {
      console.error('[useGlobalContext] Error switching context:', error);
    }
  }, []);

  // Helper: Check context type
  const isContextType = useCallback((type) => {
    return context.activeContextType === type;
  }, [context.activeContextType]);

  // Helper: Get display label
  const getContextLabel = useCallback(() => {
    if (context.activeContextType === 'client' && context.activeCompanyName) {
      return `Client: ${context.activeCompanyName}`;
    }
    if (context.activeContextType === 'school' && context.activeSchoolName) {
      return `School: ${context.activeSchoolName}`;
    }
    if (context.activeContextType === 'vertical_system' && context.activeVertical) {
      return `Vertical: ${context.activeVertical.toUpperCase()}`;
    }
    return 'Agency (All)';
  }, [context.activeContextType, context.activeCompanyName, context.activeSchoolName, context.activeVertical]);

  const value = {
    ...context,
    switchContext,
    isContextType,
    getContextLabel,
  };

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
}

/**
 * Hook: Use global context anywhere in the app
 * Returns safe defaults if context not yet initialized
 */
export function useGlobalContext() {
  const context = useContext(GlobalContext);

  // Return defaults if not wrapped in provider
  if (!context) {
    return DEFAULT_CONTEXT;
  }

  return context;
}