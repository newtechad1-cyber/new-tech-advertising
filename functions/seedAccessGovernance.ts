import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const MASTER_ROLES = [
  {
    role_key: 'platform_superadmin',
    role_name: 'Platform Super Admin',
    role_category: 'platform',
    description: 'Full platform access, governance override, system administration',
    default_scope_type: 'global',
    priority_level: 1000,
    active: true,
  },
  {
    role_key: 'platform_operations',
    role_name: 'Platform Operations',
    role_category: 'platform',
    description: 'Monitor and maintain platform health, access logs, audit trails',
    default_scope_type: 'global',
    priority_level: 800,
    active: true,
  },
  {
    role_key: 'reseller_owner',
    role_name: 'Reseller Owner',
    role_category: 'reseller',
    description: 'Owns reseller account, manages clients, sets permissions',
    default_scope_type: 'tenant',
    priority_level: 500,
    active: true,
  },
  {
    role_key: 'reseller_admin',
    role_name: 'Reseller Admin',
    role_category: 'reseller',
    description: 'Administrates reseller operations, onboarding, billing',
    default_scope_type: 'tenant',
    priority_level: 450,
    active: true,
  },
  {
    role_key: 'client_owner',
    role_name: 'Client Owner',
    role_category: 'client',
    description: 'Client account owner, approves content, manages permissions',
    default_scope_type: 'context',
    priority_level: 300,
    active: true,
  },
  {
    role_key: 'client_approver',
    role_name: 'Client Approver',
    role_category: 'client',
    description: 'Approves content publications and changes',
    default_scope_type: 'context',
    priority_level: 250,
    active: true,
  },
  {
    role_key: 'client_viewer',
    role_name: 'Client Viewer',
    role_category: 'client',
    description: 'View-only access to client resources',
    default_scope_type: 'limited',
    priority_level: 100,
    active: true,
  },
  {
    role_key: 'school_admin',
    role_name: 'School Admin',
    role_category: 'school',
    description: 'Administrates school account and content',
    default_scope_type: 'context',
    priority_level: 350,
    active: true,
  },
  {
    role_key: 'automation_system_role',
    role_name: 'Automation System Role',
    role_category: 'system',
    description: 'System role for automation execution and event handling',
    default_scope_type: 'global',
    priority_level: 900,
    active: true,
  },
];

const MASTER_PERMISSIONS = [
  // Page Access Permissions
  {
    permission_key: 'access_admin_dashboard',
    permission_label: 'Access Admin Dashboard',
    permission_category: 'page_access',
    description: 'View platform admin dashboard',
    target_type: 'AdminDashboard',
    action_type: 'view',
    tenant_sensitive: false,
    high_risk: false,
    active: true,
  },
  {
    permission_key: 'access_admin_access',
    permission_label: 'Access Admin Access Control',
    permission_category: 'page_access',
    description: 'View and manage access governance',
    target_type: 'AdminAccess',
    action_type: 'view',
    tenant_sensitive: false,
    high_risk: true,
    active: true,
  },
  {
    permission_key: 'access_admin_audit',
    permission_label: 'Access Audit Center',
    permission_category: 'page_access',
    description: 'View access audit logs',
    target_type: 'AdminAccessAudit',
    action_type: 'view',
    tenant_sensitive: true,
    high_risk: false,
    active: true,
  },
  // Entity CRUD Permissions
  {
    permission_key: 'create_user',
    permission_label: 'Create User',
    permission_category: 'entity_crud',
    description: 'Create new user accounts',
    target_type: 'User',
    action_type: 'create',
    tenant_sensitive: true,
    high_risk: true,
    active: true,
  },
  {
    permission_key: 'read_user',
    permission_label: 'Read User Data',
    permission_category: 'entity_crud',
    description: 'View user data and information',
    target_type: 'User',
    action_type: 'read',
    tenant_sensitive: true,
    high_risk: false,
    active: true,
  },
  {
    permission_key: 'update_user',
    permission_label: 'Update User',
    permission_category: 'entity_crud',
    description: 'Modify user data',
    target_type: 'User',
    action_type: 'update',
    tenant_sensitive: true,
    high_risk: true,
    active: true,
  },
  {
    permission_key: 'delete_user',
    permission_label: 'Delete User',
    permission_category: 'entity_crud',
    description: 'Delete user accounts',
    target_type: 'User',
    action_type: 'delete',
    tenant_sensitive: true,
    high_risk: true,
    active: true,
  },
  {
    permission_key: 'create_content',
    permission_label: 'Create Content',
    permission_category: 'entity_crud',
    description: 'Create content items',
    target_type: 'Content',
    action_type: 'create',
    tenant_sensitive: false,
    high_risk: false,
    active: true,
  },
  {
    permission_key: 'publish_content',
    permission_label: 'Publish Content',
    permission_category: 'page_access',
    description: 'Publish content to live channels',
    target_type: 'Content',
    action_type: 'publish',
    tenant_sensitive: false,
    high_risk: true,
    active: true,
  },
  // Agent Execution Permissions
  {
    permission_key: 'execute_agent_task',
    permission_label: 'Execute Agent Task',
    permission_category: 'agent_execution',
    description: 'Execute agent workflow tasks',
    target_type: 'Agent',
    action_type: 'execute',
    tenant_sensitive: false,
    high_risk: true,
    active: true,
  },
  {
    permission_key: 'execute_ai_video_agent',
    permission_label: 'Execute AI Video Agent',
    permission_category: 'agent_execution',
    description: 'Run AI video generation agent',
    target_type: 'AIVideoAgent',
    action_type: 'execute',
    tenant_sensitive: false,
    high_risk: false,
    active: true,
  },
  // Automation Permissions
  {
    permission_key: 'manage_automations',
    permission_label: 'Manage Automations',
    permission_category: 'automation',
    description: 'Create, update, delete automation rules',
    target_type: 'Automation',
    action_type: 'create',
    tenant_sensitive: false,
    high_risk: true,
    active: true,
  },
  {
    permission_key: 'view_automation_audit',
    permission_label: 'View Automation Audit',
    permission_category: 'automation',
    description: 'View automation execution logs',
    target_type: 'Automation',
    action_type: 'read',
    tenant_sensitive: false,
    high_risk: false,
    active: true,
  },
  // Reporting Permissions
  {
    permission_key: 'view_analytics',
    permission_label: 'View Analytics',
    permission_category: 'reporting',
    description: 'View analytics and performance reports',
    target_type: 'Analytics',
    action_type: 'view',
    tenant_sensitive: false,
    high_risk: false,
    active: true,
  },
  {
    permission_key: 'generate_reports',
    permission_label: 'Generate Reports',
    permission_category: 'reporting',
    description: 'Generate custom reports',
    target_type: 'Reports',
    action_type: 'create',
    tenant_sensitive: false,
    high_risk: false,
    active: true,
  },
  // Billing Permissions
  {
    permission_key: 'manage_billing',
    permission_label: 'Manage Billing',
    permission_category: 'billing',
    description: 'View and manage billing',
    target_type: 'Billing',
    action_type: 'update',
    tenant_sensitive: true,
    high_risk: true,
    active: true,
  },
  // Admin Permissions
  {
    permission_key: 'manage_roles',
    permission_label: 'Manage Roles',
    permission_category: 'admin',
    description: 'Create and modify roles',
    target_type: 'Role',
    action_type: 'create',
    tenant_sensitive: false,
    high_risk: true,
    active: true,
  },
  {
    permission_key: 'manage_permissions',
    permission_label: 'Manage Permissions',
    permission_category: 'admin',
    description: 'Define and modify permissions',
    target_type: 'Permission',
    action_type: 'create',
    tenant_sensitive: false,
    high_risk: true,
    active: true,
  },
  {
    permission_key: 'impersonate_user',
    permission_label: 'Impersonate User',
    permission_category: 'admin',
    description: 'Access system as another user',
    target_type: 'User',
    action_type: 'execute',
    tenant_sensitive: true,
    high_risk: true,
    active: true,
  },
];

const ROLE_PERMISSION_MAPS = [
  // Platform Super Admin - Full Access
  { role_key: 'platform_superadmin', permission_keys: [
    'access_admin_dashboard', 'access_admin_access', 'access_admin_audit',
    'create_user', 'read_user', 'update_user', 'delete_user',
    'create_content', 'publish_content',
    'execute_agent_task', 'execute_ai_video_agent',
    'manage_automations', 'view_automation_audit',
    'view_analytics', 'generate_reports',
    'manage_billing', 'manage_roles', 'manage_permissions', 'impersonate_user',
  ]},
  // Platform Operations
  { role_key: 'platform_operations', permission_keys: [
    'access_admin_dashboard', 'access_admin_audit',
    'read_user', 'view_analytics', 'view_automation_audit',
  ]},
  // Reseller Owner - Full client control
  { role_key: 'reseller_owner', permission_keys: [
    'access_admin_dashboard', 'read_user', 'update_user',
    'create_content', 'publish_content',
    'execute_agent_task', 'execute_ai_video_agent',
    'view_analytics', 'generate_reports', 'manage_billing',
  ]},
  // Reseller Admin - Operations level
  { role_key: 'reseller_admin', permission_keys: [
    'access_admin_dashboard', 'read_user',
    'create_content', 'view_analytics',
  ]},
  // Client Owner
  { role_key: 'client_owner', permission_keys: [
    'read_user', 'create_content', 'publish_content',
    'execute_ai_video_agent', 'view_analytics', 'generate_reports',
  ]},
  // Client Approver
  { role_key: 'client_approver', permission_keys: [
    'create_content', 'publish_content', 'view_analytics',
  ]},
  // Client Viewer
  { role_key: 'client_viewer', permission_keys: [
    'view_analytics',
  ]},
  // School Admin
  { role_key: 'school_admin', permission_keys: [
    'access_admin_dashboard', 'read_user', 'update_user',
    'create_content', 'publish_content',
    'execute_ai_video_agent', 'view_analytics',
  ]},
  // Automation System Role
  { role_key: 'automation_system_role', permission_keys: [
    'create_content', 'publish_content',
    'execute_agent_task', 'execute_ai_video_agent',
    'manage_automations',
  ]},
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Seed Roles
    const createdRoles = await base44.entities.MasterRoleDefinition?.bulkCreate?.(MASTER_ROLES).catch(() => []);
    console.log(`Created ${createdRoles?.length || 0} roles`);

    // Seed Permissions
    const createdPerms = await base44.entities.MasterPermissionDefinition?.bulkCreate?.(MASTER_PERMISSIONS).catch(() => []);
    console.log(`Created ${createdPerms?.length || 0} permissions`);

    // Seed Role-Permission Maps
    const roleMaps = [];
    ROLE_PERMISSION_MAPS.forEach(mapping => {
      mapping.permission_keys.forEach(perm_key => {
        roleMaps.push({
          role_key: mapping.role_key,
          permission_key: perm_key,
          scope_override_json: '{}',
          conditional_rules_json: '{}',
          active: true,
        });
      });
    });
    const createdMaps = await base44.entities.RolePermissionMap?.bulkCreate?.(roleMaps).catch(() => []);
    console.log(`Created ${createdMaps?.length || 0} role-permission mappings`);

    // Seed Tenant Scopes
    const tenantScopes = [
      {
        role_key: 'platform_superadmin',
        tenant_level: 'global',
        access_depth: 'full_access',
        data_visibility_rules_json: JSON.stringify({ can_see_parent: true, can_see_siblings: true, can_see_children: true }),
        active: true,
      },
      {
        role_key: 'reseller_owner',
        tenant_level: 'reseller',
        access_depth: 'parent_only',
        data_visibility_rules_json: JSON.stringify({ can_see_parent: false, can_see_siblings: false, can_see_children: true }),
        active: true,
      },
      {
        role_key: 'client_owner',
        tenant_level: 'client',
        access_depth: 'self_only',
        data_visibility_rules_json: JSON.stringify({ can_see_parent: false, can_see_siblings: false, can_see_children: false }),
        active: true,
      },
      {
        role_key: 'school_admin',
        tenant_level: 'school',
        access_depth: 'self_only',
        data_visibility_rules_json: JSON.stringify({ can_see_parent: false, can_see_siblings: false, can_see_children: true }),
        active: true,
      },
    ];
    const createdScopes = await base44.entities.TenantAccessScope?.bulkCreate?.(tenantScopes).catch(() => []);
    console.log(`Created ${createdScopes?.length || 0} tenant scopes`);

    return Response.json({
      success: true,
      roles_created: createdRoles?.length || 0,
      permissions_created: createdPerms?.length || 0,
      mappings_created: createdMaps?.length || 0,
      scopes_created: createdScopes?.length || 0,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});