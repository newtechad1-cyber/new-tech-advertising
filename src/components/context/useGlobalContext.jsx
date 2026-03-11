import { useEffect, useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

/**
 * Global App Context Hook
 * Manages active operating context across the platform
 * 
 * Returns:
 * - context: current GlobalAppContext record
 * - loading: boolean
 * - switchContext: function to change context
 * - isContextType: helper to check current type
 * - getContextLabel: helper to get display label
 */
export function useGlobalContext() {
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Load user and initialize context
  useEffect(() => {
    const initializeContext = async () => {
      try {
        const authenticatedUser = await base44.auth.me();
        setUser(authenticatedUser);

        // Try to load existing context for this user
        const existingContexts = await base44.entities.GlobalAppContext.filter(
          { created_by: authenticatedUser.email, active: true },
          '-updated_date',
          1
        );

        if (existingContexts.length > 0) {
          setContext(existingContexts[0]);
        } else {
          // Create default agency context
          const defaultContext = await base44.entities.GlobalAppContext.create({
            active_context_type: 'agency',
            active_user_role: authenticatedUser.role || 'viewer',
            active_nav_family: 'main_admin',
            session_id: generateSessionId(),
          });
          setContext(defaultContext);
        }
      } catch (error) {
        console.error('[useGlobalContext] Error initializing context:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeContext();
  }, []);

  // Switch context
  const switchContext = useCallback(async (contextUpdate) => {
    if (!context) return;

    try {
      const updated = await base44.entities.GlobalAppContext.update(context.id, {
        ...contextUpdate,
        last_context_switch_at: new Date().toISOString(),
        last_context_switch_by: user?.email,
      });
      setContext(updated);
      return updated;
    } catch (error) {
      console.error('[useGlobalContext] Error switching context:', error);
      throw error;
    }
  }, [context, user]);

  // Helper: Check if context type matches
  const isContextType = useCallback((type) => {
    return context?.active_context_type === type;
  }, [context]);

  // Helper: Get display label for current context
  const getContextLabel = useCallback(() => {
    if (!context) return 'Loading...';
    
    switch (context.active_context_type) {
      case 'agency':
        return 'Agency Admin';
      case 'client':
        return context.active_company_name ? `Client: ${context.active_company_name}` : 'Client Mode';
      case 'school':
        return context.active_school_name ? `School: ${context.active_school_name}` : 'School Mode';
      case 'vertical_system':
        return `Vertical: ${context.active_vertical_type?.toUpperCase() || 'Unknown'}`;
      default:
        return 'Unknown';
    }
  }, [context]);

  // Helper: Get context metadata
  const getContextMetadata = useCallback(() => {
    if (!context?.context_metadata) return {};
    try {
      return JSON.parse(context.context_metadata);
    } catch {
      return {};
    }
  }, [context]);

  return {
    context,
    loading,
    user,
    switchContext,
    isContextType,
    getContextLabel,
    getContextMetadata,
  };
}

/**
 * Generate unique session ID
 */
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Helper: Create context metadata JSON
 */
export function createContextMetadata(meta) {
  return JSON.stringify(meta);
}