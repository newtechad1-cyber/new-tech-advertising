import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Initialize Master Page Registry
 * Call once to populate all pages from App.jsx into PageRegistry
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'super_admin') {
      return Response.json(
        { error: 'Forbidden: Super admin access required' },
        { status: 403 }
      );
    }

    // Core platform pages registry
    const pageRegistry = [
      // Public/Marketing Pages
      {
        pageKey: 'home',
        displayName: 'Home',
        routePath: '/',
        pageType: 'public_marketing',
        navGroup: 'none',
        requiredRole: 'public',
        isPublic: true,
        icon: 'Home',
        description: 'Platform homepage'
      },
      {
        pageKey: 'about',
        displayName: 'About',
        routePath: '/About',
        pageType: 'public_marketing',
        navGroup: 'marketing',
        requiredRole: 'public',
        isPublic: true,
        icon: 'Info'
      },
      {
        pageKey: 'pricing',
        displayName: 'Pricing',
        routePath: '/Pricing',
        pageType: 'public_marketing',
        navGroup: 'marketing',
        requiredRole: 'public',
        isPublic: true,
        icon: 'DollarSign'
      },
      {
        pageKey: 'contact',
        displayName: 'Contact',
        routePath: '/Contact',
        pageType: 'public_marketing',
        navGroup: 'marketing',
        requiredRole: 'public',
        isPublic: true,
        icon: 'Mail'
      },

      // Trial Onboarding
      {
        pageKey: 'trialWelcome',
        displayName: 'Trial Welcome',
        routePath: '/trial/welcome',
        pageType: 'trial_onboarding',
        navGroup: 'trial',
        requiredRole: 'authenticated',
        description: 'Trial onboarding welcome step'
      },
      {
        pageKey: 'trialBusiness',
        displayName: 'Trial Business Info',
        routePath: '/trial/business',
        pageType: 'trial_onboarding',
        navGroup: 'trial',
        requiredRole: 'authenticated',
        parentPageKey: 'trialWelcome'
      },
      {
        pageKey: 'trialChannels',
        displayName: 'Trial Channels',
        routePath: '/trial/channels',
        pageType: 'trial_onboarding',
        navGroup: 'trial',
        requiredRole: 'authenticated',
        parentPageKey: 'trialBusiness'
      },
      {
        pageKey: 'trialActivation',
        displayName: 'Trial Activation',
        routePath: '/trial/activation',
        pageType: 'trial_onboarding',
        navGroup: 'trial',
        requiredRole: 'authenticated',
        parentPageKey: 'trialChannels'
      },

      // DIY/Client Pages
      {
        pageKey: 'diyDashboard',
        displayName: 'DIY Dashboard',
        routePath: '/client/diy-dashboard',
        pageType: 'client_dashboard',
        navGroup: 'client',
        requiredRole: 'user',
        requiredPlan: 'diy',
        description: 'DIY growth system dashboard'
      },
      {
        pageKey: 'diyOnboarding',
        displayName: 'DIY Onboarding',
        routePath: '/client/diy-onboarding',
        pageType: 'client_dashboard',
        navGroup: 'client',
        requiredRole: 'user',
        requiredPlan: 'diy',
        parentPageKey: 'diyDashboard'
      },
      {
        pageKey: 'diyBilling',
        displayName: 'DIY Billing',
        routePath: '/client/diy-billing',
        pageType: 'client_dashboard',
        navGroup: 'client',
        requiredRole: 'user',
        requiredPlan: 'diy',
        parentPageKey: 'diyDashboard',
        icon: 'CreditCard'
      },
      {
        pageKey: 'clientDashboard',
        displayName: 'Client Dashboard',
        routePath: '/client/dashboard',
        pageType: 'client_dashboard',
        navGroup: 'client',
        requiredRole: 'user',
        description: 'Client marketing dashboard'
      },
      {
        pageKey: 'clientCampaigns',
        displayName: 'My Campaigns',
        routePath: '/client/campaigns',
        pageType: 'client_portal',
        navGroup: 'client',
        requiredRole: 'user',
        parentPageKey: 'clientDashboard'
      },
      {
        pageKey: 'clientROI',
        displayName: 'ROI & Results',
        routePath: '/client/roi',
        pageType: 'client_portal',
        navGroup: 'client',
        requiredRole: 'user',
        parentPageKey: 'clientDashboard'
      },
      {
        pageKey: 'clientChannels',
        displayName: 'My Channels',
        routePath: '/client/channels',
        pageType: 'client_portal',
        navGroup: 'client',
        requiredRole: 'user',
        parentPageKey: 'clientDashboard'
      },

      // Reseller Pages
      {
        pageKey: 'resellerDashboard',
        displayName: 'Reseller Dashboard',
        routePath: '/reseller/dashboard',
        pageType: 'reseller_portal',
        navGroup: 'reseller',
        requiredRole: 'reseller_admin',
        requiredTenantScope: 'reseller',
        description: 'Reseller management dashboard'
      },

      // Admin Pages - Sales
      {
        pageKey: 'adminSalesCommand',
        displayName: 'Sales Command Center',
        routePath: '/admin/sales-command',
        pageType: 'admin_dashboard',
        navGroup: 'admin_sales',
        requiredRole: 'master_admin',
        icon: 'TrendingUp'
      },
      {
        pageKey: 'adminPipeline',
        displayName: 'Sales Pipeline',
        routePath: '/admin/sales-pipeline',
        pageType: 'admin_dashboard',
        navGroup: 'admin_sales',
        requiredRole: 'master_admin',
        parentPageKey: 'adminSalesCommand'
      },

      // Admin Pages - Operations
      {
        pageKey: 'adminOperations',
        displayName: 'Operations Hub',
        routePath: '/admin/operations',
        pageType: 'admin_dashboard',
        navGroup: 'admin_operations',
        requiredRole: 'master_admin',
        icon: 'Settings'
      },
      {
        pageKey: 'adminOperationsCapacity',
        displayName: 'Capacity Planning',
        routePath: '/admin/operations-capacity',
        pageType: 'admin_dashboard',
        navGroup: 'admin_operations',
        requiredRole: 'master_admin',
        parentPageKey: 'adminOperations'
      },

      // Admin Pages - Governance
      {
        pageKey: 'adminAccessGovernance',
        displayName: 'Access Governance',
        routePath: '/admin/access-governance',
        pageType: 'admin_settings',
        navGroup: 'admin_governance',
        requiredRole: 'master_admin',
        icon: 'Shield'
      },
      {
        pageKey: 'adminDataGovernance',
        displayName: 'Data Governance',
        routePath: '/admin/data-governance',
        pageType: 'admin_settings',
        navGroup: 'admin_governance',
        requiredRole: 'master_admin'
      },
      {
        pageKey: 'adminTenantGovernance',
        displayName: 'Tenant Governance',
        routePath: '/admin/tenant-governance',
        pageType: 'admin_settings',
        navGroup: 'admin_governance',
        requiredRole: 'master_admin',
        requiredTenantScope: 'master'
      },
      {
        pageKey: 'adminPageRegistry',
        displayName: 'Page Registry',
        routePath: '/admin/page-registry',
        pageType: 'admin_settings',
        navGroup: 'admin_governance',
        requiredRole: 'master_admin',
        icon: 'Map'
      },

      // System Pages
      {
        pageKey: 'pageNotFound',
        displayName: '404 Not Found',
        routePath: '/404',
        pageType: 'system_page',
        navGroup: 'none',
        requiredRole: 'public',
        isPublic: true,
        isActive: false
      }
    ];

    // Check for duplicates
    const routePaths = new Set();
    const pageKeys = new Set();
    const duplicates = [];

    pageRegistry.forEach(page => {
      if (routePaths.has(page.routePath)) {
        duplicates.push(`Duplicate route: ${page.routePath}`);
      }
      if (pageKeys.has(page.pageKey)) {
        duplicates.push(`Duplicate pageKey: ${page.pageKey}`);
      }
      routePaths.add(page.routePath);
      pageKeys.add(page.pageKey);
    });

    if (duplicates.length > 0) {
      return Response.json(
        { error: 'Registry validation failed', duplicates },
        { status: 400 }
      );
    }

    // Clear existing registry
    const existing = await base44.asServiceRole.entities.PageRegistry.list(
      '-pageKey',
      1000
    );

    for (const page of existing || []) {
      await base44.asServiceRole.entities.PageRegistry.delete(page.id);
    }

    // Insert pages
    const results = await base44.asServiceRole.entities.PageRegistry.bulkCreate(
      pageRegistry.map(page => ({
        ...page,
        createdAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString()
      }))
    );

    return Response.json({
      success: true,
      message: `Initialized ${results.length} pages in registry`,
      pagesCreated: results.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});