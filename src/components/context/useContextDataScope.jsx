import { useCallback } from 'react';
import { useGlobalContext } from './useGlobalContext.js';

/**
 * useContextDataScope Hook
 * 
 * Returns filter functions to scope queries by active context
 * Prevents cross-company/school data bleed
 * 
 * Usage:
 * const { getEntityFilter } = useContextDataScope();
 * const filter = getEntityFilter('ClientCompanies');
 * const companies = await base44.entities.ClientCompanies.filter(filter);
 */
export function useContextDataScope() {
  const { context } = useGlobalContext();

  /**
   * Get filter object for entity query based on context
   * Returns filter with company_id, school_id, etc. as needed
   */
  const getEntityFilter = useCallback((entityName) => {
    if (!context) return {};

    const filters = {};

    // Company-scoped entities
    const companyScoped = [
      'ClientCompanies',
      'VideoPublishingProfile',
      'MetaConnectionProfile',
      'YouTubeConnectionProfile',
      'VideoPublishJob',
      'VideoPublishAuditLog',
      'WebsiteVideoStory',
      'VideoRequests',
      'ContentAsset',
      'AuthorityContentCore',
    ];

    // School-scoped entities
    const schoolScoped = [
      'SchoolLeads',
      'SchoolOutreachActivity',
      'SchoolOutreachCampaigns',
      'SchoolSettings',
      'SchoolUsers',
      'SchoolBranding',
      'StudentUsers',
      'StudentSessions',
      'SchoolVideoProjects',
      'SchoolVideoClips',
      'SchoolVideoRenders',
      'SchoolVideoPublishing',
    ];

    // Apply company filter if in client context
    if (context.active_context_type === 'client' && context.active_company_id) {
      if (companyScoped.includes(entityName)) {
        filters.company_id = context.active_company_id;
      }
    }

    // Apply school filter if in school context
    if (context.active_context_type === 'school' && context.active_school_id) {
      if (schoolScoped.includes(entityName)) {
        filters.school_id = context.active_school_id;
      }
    }

    // Apply vertical filter if in vertical context
    if (context.active_context_type === 'vertical_system' && context.active_vertical_type) {
      filters.vertical_type = context.active_vertical_type;
    }

    return filters;
  }, [context]);

  /**
   * Apply scope filter to base44 query
   */
  const scopedQuery = useCallback(async (entity, method = 'list', args = {}) => {
    const filter = getEntityFilter(entity.name || entity.constructor.name);
    
    if (method === 'list') {
      return entity.filter(filter, args.sort, args.limit);
    } else if (method === 'filter') {
      const combined = { ...filter, ...args };
      return entity.filter(combined, args.sort, args.limit);
    }
    
    return [];
  }, [getEntityFilter]);

  /**
   * Get scope info for display/logging
   */
  const getScopeInfo = useCallback(() => {
    if (!context) return { scope: 'none' };

    const info = {
      contextType: context.active_context_type,
    };

    if (context.active_context_type === 'client' && context.active_company_id) {
      info.scope = 'company';
      info.scopeId = context.active_company_id;
      info.scopeName = context.active_company_name;
    } else if (context.active_context_type === 'school' && context.active_school_id) {
      info.scope = 'school';
      info.scopeId = context.active_school_id;
      info.scopeName = context.active_school_name;
    } else if (context.active_context_type === 'vertical_system') {
      info.scope = 'vertical';
      info.scopeId = context.active_vertical_type;
      info.scopeName = context.active_vertical_type?.toUpperCase();
    } else {
      info.scope = 'agency';
    }

    return info;
  }, [context]);

  return {
    getEntityFilter,
    scopedQuery,
    getScopeInfo,
  };
}