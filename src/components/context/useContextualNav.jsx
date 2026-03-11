import { useMemo } from 'react';
import { useGlobalContext } from './useGlobalContext.js';

/**
 * useContextualNav Hook
 * 
 * Returns navigation items filtered by current global context
 * 
 * Agency mode: show clients, sales, publishing, infrastructure
 * Client mode: show approvals, campaigns, analytics
 * School mode: show submissions, video library, render queue
 * Vertical mode: show vertical-specific tools
 */
export function useContextualNav() {
  const { context, isContextType } = useGlobalContext();

  // Define all nav items with context requirements
  const ALL_NAV_ITEMS = {
    // Agency-specific items
    clients: {
      label: 'Clients',
      icon: 'users',
      route: '/adminclients',
      contextTypes: ['agency'],
    },
    sales: {
      label: 'Sales Pipeline',
      icon: 'trending-up',
      route: '/adminsales',
      contextTypes: ['agency'],
    },
    publishing: {
      label: 'Publishing',
      icon: 'send',
      route: '/adminpublishing',
      contextTypes: ['agency', 'client'],
    },
    connections: {
      label: 'Connections',
      icon: 'link',
      route: '/adminconnections',
      contextTypes: ['agency', 'client'],
    },
    // Client-specific items
    approvals: {
      label: 'Approvals',
      icon: 'check-circle',
      route: '/clientapprovals',
      contextTypes: ['client'],
    },
    campaigns: {
      label: 'Campaigns',
      icon: 'zap',
      route: '/clientcampaigns',
      contextTypes: ['client'],
    },
    analytics: {
      label: 'Analytics',
      icon: 'bar-chart',
      route: '/clientanalytics',
      contextTypes: ['client'],
    },
    // School-specific items
    submissions: {
      label: 'Submissions',
      icon: 'inbox',
      route: '/adminschoolsubmissions',
      contextTypes: ['school'],
    },
    videolibrary: {
      label: 'Video Library',
      icon: 'video',
      route: '/adminschoolvideolibrary',
      contextTypes: ['school'],
    },
    renderqueue: {
      label: 'Render Queue',
      icon: 'layers',
      route: '/adminschoolrenderqueue',
      contextTypes: ['school'],
    },
    students: {
      label: 'Students',
      icon: 'users',
      route: '/adminschoolstudents',
      contextTypes: ['school'],
    },
    // Vertical-specific items
    verticalcontent: {
      label: 'Content',
      icon: 'file-text',
      route: '/verticalcontent',
      contextTypes: ['vertical_system'],
    },
    verticalsocial: {
      label: 'Social Media',
      icon: 'share-2',
      route: '/verticalsocial',
      contextTypes: ['vertical_system'],
    },
    // Universal items
    dashboard: {
      label: 'Dashboard',
      icon: 'home',
      route: context?.active_context_type === 'client' 
        ? '/clientdashboard'
        : context?.active_context_type === 'school'
        ? '/adminschooldashboard'
        : '/admindashboard',
      contextTypes: ['agency', 'client', 'school', 'vertical_system'],
    },
    settings: {
      label: 'Settings',
      icon: 'settings',
      route: context?.active_context_type === 'client'
        ? '/clientsettings'
        : '/adminsettings',
      contextTypes: ['agency', 'client', 'school', 'vertical_system'],
    },
  };

  // Filter nav items by current context
  const contextualNavItems = useMemo(() => {
    const filtered = {};
    
    Object.entries(ALL_NAV_ITEMS).forEach(([key, item]) => {
      const matches = item.contextTypes.some(type => isContextType(type));
      if (matches) {
        filtered[key] = item;
      }
    });

    return filtered;
  }, [context, isContextType]);

  // Get grouped nav for display
  const getGroupedNav = () => {
    const groups = {};

    if (isContextType('agency')) {
      groups.primary = ['dashboard', 'clients', 'sales'];
      groups.operations = ['publishing', 'connections'];
      groups.settings = ['settings'];
    } else if (isContextType('client')) {
      groups.primary = ['dashboard', 'campaigns'];
      groups.operations = ['approvals', 'publishing', 'analytics'];
      groups.settings = ['settings'];
    } else if (isContextType('school')) {
      groups.primary = ['dashboard', 'submissions'];
      groups.operations = ['videolibrary', 'renderqueue', 'students'];
      groups.settings = ['settings'];
    } else if (isContextType('vertical_system')) {
      groups.primary = ['dashboard', 'verticalcontent'];
      groups.operations = ['verticalsocial', 'publishing'];
      groups.settings = ['settings'];
    }

    // Build group structure
    const result = {};
    Object.entries(groups).forEach(([groupName, itemKeys]) => {
      result[groupName] = itemKeys
        .map(key => contextualNavItems[key])
        .filter(Boolean);
    });

    return result;
  };

  return {
    contextualNavItems,
    getGroupedNav,
    allItems: ALL_NAV_ITEMS,
  };
}

/**
 * Helper: Get nav item by key
 */
export function getNavItem(key, contextualItems) {
  return contextualItems[key];
}