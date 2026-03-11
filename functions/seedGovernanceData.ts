import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    // Seed Core Entities
    const entities = [
      {
        entity_key: 'Client',
        entity_name: 'Client Company',
        entity_category: 'core',
        description: 'Primary client company record',
        canonical_owner_type: 'agency',
        tenant_scoped: true,
        context_scoped: true,
        status: 'active',
        source_of_truth: 'system',
        lifecycle_model_json: JSON.stringify({ name: 'Client Lifecycle' }),
        visibility_rules_json: JSON.stringify({ views: ['agency', 'client'] }),
        edit_rules_json: JSON.stringify({ editable: ['admin', 'client'] }),
        dependent_dashboards_json: JSON.stringify(['ClientDashboard', 'AdminClients']),
        dependent_agents_json: JSON.stringify(['clientSuccessAgent']),
      },
      {
        entity_key: 'AgentTask',
        entity_name: 'Agent Task',
        entity_category: 'ai_orchestration',
        description: 'Work item for AI agent execution',
        canonical_owner_type: 'system',
        tenant_scoped: true,
        context_scoped: false,
        status: 'active',
        source_of_truth: 'orchestrator',
        lifecycle_model_json: JSON.stringify({ name: 'Task Lifecycle' }),
        visibility_rules_json: JSON.stringify({ views: ['admin', 'system'] }),
        edit_rules_json: JSON.stringify({ editable: ['agent', 'admin'] }),
        dependent_agents_json: JSON.stringify(['taskOrchestrator']),
      },
      {
        entity_key: 'VideoPublishJob',
        entity_name: 'Video Publish Job',
        entity_category: 'publishing',
        description: 'Video distribution and publishing work',
        canonical_owner_type: 'client',
        tenant_scoped: true,
        context_scoped: true,
        status: 'active',
        source_of_truth: 'system',
        lifecycle_model_json: JSON.stringify({ name: 'Publish Lifecycle' }),
        visibility_rules_json: JSON.stringify({ views: ['agency', 'client'] }),
        edit_rules_json: JSON.stringify({ editable: ['admin', 'client'] }),
        dependent_dashboards_json: JSON.stringify(['AdminVideoPublishing']),
      },
    ];

    await Promise.all(
      entities.map(e => base44.asServiceRole.entities.MasterEntityDefinition.create(e))
    );

    // Seed Fields for Client
    const fields = [
      {
        entity_key: 'Client',
        field_key: 'name',
        field_label: 'Client Name',
        data_type: 'string',
        required: true,
        display_group: 'Basic Info',
        indexed: true,
        description: 'Legal business name',
      },
      {
        entity_key: 'Client',
        field_key: 'status',
        field_label: 'Status',
        data_type: 'enum',
        required: true,
        allowed_values_json: JSON.stringify(['prospect', 'active', 'churned']),
        display_group: 'Status',
        admin_only: true,
        description: 'Client lifecycle status',
      },
      {
        entity_key: 'AgentTask',
        field_key: 'task_status',
        field_label: 'Task Status',
        data_type: 'enum',
        required: true,
        allowed_values_json: JSON.stringify(['pending', 'running', 'completed', 'failed']),
        display_group: 'Status',
        admin_only: true,
      },
    ];

    await Promise.all(
      fields.map(f => base44.asServiceRole.entities.MasterFieldDefinition.create(f))
    );

    // Seed Relationships
    const relationships = [
      {
        parent_entity_key: 'Client',
        child_entity_key: 'VideoPublishJob',
        relationship_type: 'one_to_many',
        cardinality: '1:N',
        required: true,
        cascade_rules_json: JSON.stringify({ delete: 'cascade' }),
        description: 'Client owns published videos',
      },
    ];

    await Promise.all(
      relationships.map(r => base44.asServiceRole.entities.EntityRelationshipDefinition.create(r))
    );

    // Seed Lifecycles
    const lifecycles = [
      {
        entity_key: 'Client',
        lifecycle_name: 'Client Lifecycle',
        allowed_statuses_json: JSON.stringify(['prospect', 'active', 'churned']),
        allowed_transitions_json: JSON.stringify([
          { from: 'prospect', to: ['active'] },
          { from: 'active', to: ['churned'] },
        ]),
        terminal_statuses_json: JSON.stringify(['churned']),
      },
      {
        entity_key: 'AgentTask',
        lifecycle_name: 'Task Lifecycle',
        allowed_statuses_json: JSON.stringify(['pending', 'running', 'completed', 'failed']),
        allowed_transitions_json: JSON.stringify([
          { from: 'pending', to: ['running'] },
          { from: 'running', to: ['completed', 'failed'] },
        ]),
        terminal_statuses_json: JSON.stringify(['completed', 'failed']),
      },
    ];

    await Promise.all(
      lifecycles.map(l => base44.asServiceRole.entities.EntityLifecycleDefinition.create(l))
    );

    // Seed Dependencies
    const dependencies = [
      {
        entity_key: 'Client',
        dependency_type: 'used_by_page',
        dependency_name: 'AdminClients',
        dependency_target: 'pages/AdminClients.jsx',
        notes: 'Lists and manages client records',
      },
      {
        entity_key: 'AgentTask',
        dependency_type: 'used_by_dashboard',
        dependency_name: 'AdminAgents',
        dependency_target: 'pages/AdminAgents.jsx',
        notes: 'Displays task queue and execution status',
      },
    ];

    await Promise.all(
      dependencies.map(d => base44.asServiceRole.entities.EntityDependencyMap.create(d))
    );

    // Create health snapshot
    const health = await base44.asServiceRole.entities.SchemaHealthSnapshot.create({
      entity_key: 'master',
      required_field_coverage_score: 92,
      naming_consistency_score: 88,
      relationship_integrity_score: 95,
      lifecycle_consistency_score: 85,
      orphan_record_risk_score: 5,
      governance_health_score: 89,
      issues_json: JSON.stringify([
        {
          severity: 'warning',
          type: 'naming',
          title: 'Inconsistent naming in VideoPublishJob',
          message: 'Some fields use camelCase, others use snake_case',
        },
      ]),
      snapshot_time: new Date().toISOString(),
    });

    return Response.json({
      success: true,
      message: 'Governance data seeded',
      records: {
        entities: entities.length,
        fields: fields.length,
        relationships: relationships.length,
        lifecycles: lifecycles.length,
        dependencies: dependencies.length,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});