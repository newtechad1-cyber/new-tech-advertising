/**
 * OPERATIONS SLA / ACCOUNTABILITY ENGINE - VERIFICATION GUIDE
 * 
 * Complete specification of all routes, entities, logic, and integrations.
 * Use this as a checklist to verify full implementation.
 */

export const SLA_VERIFICATION_GUIDE = {
  // ============================================================================
  // 1. ROUTES & ENDPOINTS
  // ============================================================================
  routes: {
    api: [
      {
        method: 'POST',
        path: '/api/sla-rules/initialize',
        function: 'initializeSLARules',
        auth: 'Admin only',
        effect: 'Creates 9 SLA profiles + 10 default rules',
        response: '{ success, profiles_created, rules_created }'
      },
      {
        method: 'POST',
        path: '/api/sla-compliance',
        function: 'evaluateSLACompliance',
        auth: 'Admin only',
        effect: 'Evaluates all active SLA rules, creates events, executes actions',
        response: '{ evaluated_count, breaches_found, tasks_created }'
      }
    ],
    ui: [
      {
        path: '/admin/operations',
        component: 'pages/AdminOperations.jsx',
        auth: 'Admin only',
        features: [
          'Filter by status (all, active, breached, critical)',
          'Summary cards (critical breaches, active issues, team score, at-risk accounts)',
          'Breaches grouped by entity type',
          'Full SLA events table (50+ records)',
          'Accountability scores leaderboard'
        ]
      },
      {
        path: '/admin/operations/company?company_id={id}',
        component: 'pages/AdminOperationsCompany.jsx',
        auth: 'Admin only',
        features: [
          'Company-specific SLA breaches',
          'Stalled requests (7+ days pending)',
          'Pending message threads',
          'Critical issues highlighted',
          'Operational recommendations'
        ]
      }
    ]
  },

  // ============================================================================
  // 2. ENTITIES
  // ============================================================================
  entities: {
    SLAProfiles: {
      fields: {
        profile_name: 'string',
        profile_type: 'enum[onboarding|fulfillment|communication|approval|reporting|strategy_review|proposal_followup|support]',
        applies_to_service_type: 'string (optional)',
        applies_to_workflow_type: 'string (optional)',
        description: 'string',
        active: 'boolean (default: true)'
      }
    },
    SLARules: {
      fields: {
        sla_profile_id: 'string → SLAProfiles',
        rule_name: 'string',
        rule_type: 'enum[response_time|completion_time|approval_wait_time|delivery_deadline|review_due|inactivity|publication_delay|followup_delay]',
        applies_to_entity: 'enum[OnboardingTasks|FulfillmentTasks|Deliverables|ClientRequests|MessageThreads|StrategyReviews|ExecutiveReports|SalesTasks|Proposals]',
        target_status: 'string (optional)',
        threshold_value: 'number',
        threshold_unit: 'enum[hours|days|weeks]',
        severity: 'enum[low|medium|high|critical]',
        breach_action: 'enum[create_alert|create_task|escalate_owner|flag_account|notify_admin|notify_manager]',
        active: 'boolean (default: true)',
        visible_in_dashboard: 'boolean (default: true)'
      }
    },
    SLAEvents: {
      fields: {
        company_id: 'string → Companies (optional)',
        user_id: 'string → Users (optional)',
        sla_rule_id: 'string → SLARules',
        related_entity_type: 'string',
        related_entity_id: 'string',
        related_workroom_id: 'string (optional)',
        event_type: 'enum[response_due|response_breached|task_overdue|approval_blocked|delivery_missed|report_late|review_late|inactivity_breach|followup_late]',
        severity: 'enum[low|medium|high|critical]',
        status: 'enum[active|breached|resolved|dismissed]',
        started_at: 'date-time',
        due_at: 'date-time',
        breached_at: 'date-time (optional)',
        resolved_at: 'date-time (optional)',
        duration_hours: 'number (optional)',
        notes: 'string (optional)'
      }
    },
    AccountabilityScores: {
      fields: {
        company_id: 'string → Companies (optional)',
        user_id: 'string → Users (optional)',
        scope_type: 'enum[company|admin_user|workflow|service_type]',
        score_label: 'string',
        score_value: 'number (0-100)',
        score_period_label: 'string (e.g., "March 2026")',
        period_start: 'date',
        period_end: 'date',
        factors_summary: 'string'
      }
    }
  },

  // ============================================================================
  // 3. DEFAULT SLA PROFILES & RULES
  // ============================================================================
  defaultRules: [
    {
      profile: 'Communication SLA',
      rule: 'Admin Response to Waiting Threads',
      entity: 'MessageThreads',
      target_status: 'waiting_on_admin',
      threshold: '1 day',
      severity: 'high',
      action: 'create_alert'
    },
    {
      profile: 'Approval SLA',
      rule: 'Client Approval Response',
      entity: 'Deliverables',
      target_status: 'pending_approval',
      threshold: '3 days',
      severity: 'medium',
      action: 'create_alert'
    },
    {
      profile: 'Fulfillment SLA',
      rule: 'High Priority Task Completion',
      entity: 'FulfillmentTasks',
      threshold: '1 day',
      severity: 'high',
      action: 'create_alert'
    },
    {
      profile: 'Fulfillment SLA',
      rule: 'Fulfillment Workroom Inactivity',
      entity: 'FulfillmentTasks',
      rule_type: 'inactivity',
      threshold: '5 days',
      severity: 'medium',
      action: 'create_alert'
    },
    {
      profile: 'Onboarding SLA',
      rule: 'Onboarding Task Completion',
      entity: 'OnboardingTasks',
      threshold: '7 days',
      severity: 'medium',
      action: 'flag_account'
    },
    {
      profile: 'Reporting SLA',
      rule: 'Executive Report Publication',
      entity: 'ExecutiveReports',
      target_status: 'draft',
      threshold: '3 days',
      severity: 'high',
      action: 'notify_admin'
    },
    {
      profile: 'Strategy Review SLA',
      rule: 'Scheduled Strategy Review Completion',
      entity: 'StrategyReviews',
      target_status: 'scheduled',
      threshold: '0 days (due on scheduled date)',
      severity: 'high',
      action: 'create_alert'
    },
    {
      profile: 'Proposal Follow-Up SLA',
      rule: 'Proposal Follow-Up After View',
      entity: 'Proposals',
      target_status: 'viewed',
      threshold: '2 days',
      severity: 'high',
      action: 'create_alert'
    },
    {
      profile: 'Support SLA',
      rule: 'Urgent Client Request Resolution',
      entity: 'ClientRequests',
      threshold: '1 day',
      severity: 'critical',
      action: 'create_alert'
    },
    {
      profile: 'Sales Task SLA',
      rule: 'High Priority Sales Task Completion',
      entity: 'SalesTasks',
      target_status: 'pending',
      threshold: '2 days',
      severity: 'high',
      action: 'create_alert'
    }
  ],

  // ============================================================================
  // 4. EVALUATION LOGIC
  // ============================================================================
  evaluationLogic: `
FOR EACH active SLARule:

1. FETCH matching entities:
   WHERE applies_to_entity = rule.applies_to_entity
   AND (target_status = rule.target_status OR target_status is NULL)
   AND status NOT IN ['completed', 'resolved', 'approved', 'published']

2. CALCULATE AGE:
   age_ms = now() - entity.created_date
   threshold_ms = rule.threshold_value * convert(rule.threshold_unit)

3. CHECK STATUS:
   IF age_ms > threshold_ms:
     STATUS: BREACHED
     → Check for existing active SLAEvent (see duplicate protection)
     → Create SLAEvent with status='breached'
     → Set breached_at = now()
     → Execute breach_action

   ELSE IF age_ms > (threshold_ms - 86400000):  // within 24h
     STATUS: WARNING
     → Check for existing active SLAEvent
     → Create SLAEvent with status='active'
     → Do NOT execute breach_action yet

   ELSE:
     STATUS: OK
     → Skip

4. FOR EACH resolved SLAEvent:
   → Auto-resolve when underlying entity condition met
   → Calculate duration_hours
   → Update AccountabilityScores
  `,

  // ============================================================================
  // 5. DUPLICATE PROTECTION RULES
  // ============================================================================
  duplicateProtection: {
    rule1: `
BEFORE creating SLAEvent:
  existing = Query SLAEvents WHERE
    sla_rule_id = rule.id AND
    related_entity_id = entity.id AND
    related_entity_type = rule.applies_to_entity AND
    status IN ['active', 'breached']
  
  IF existing FOUND → Skip creating new event
  ELSE → Create new SLAEvent
    `,
    rule2: `
BEFORE creating auto-task from breach:
  existingTask = Query SalesTasks WHERE
    company_id = breach.company_id AND
    task_type = mapEventToTaskType(breach.event_type) AND
    status = 'pending'
  
  IF existingTask FOUND → Skip task creation
  ELSE → Create new SalesTasks record
    `,
    rule3: `
BEFORE creating escalation task:
  escalationTask = Query SalesTasks WHERE
    company_id = breach.company_id AND
    task_type = 'escalation' AND
    related_sla_event_id = breach.id AND
    status IN ['pending', 'in_progress']
  
  IF escalationTask FOUND → Increment priority only
  ELSE → Create new escalation task
    `
  },

  // ============================================================================
  // 6. TASK / ESCALATION RULES
  // ============================================================================
  taskEscalationRules: {
    mapping: {
      'response_breached': { type: 'call', priority: 'high' },
      'approval_blocked': { type: 'approval_followup', priority: 'medium' },
      'task_overdue': { type: 'follow_up', priority: 'high' },
      'delivery_missed': { type: 'delivery_recovery', priority: 'urgent' },
      'report_late': { type: 'reporting', priority: 'high' },
      'review_late': { type: 'follow_up', priority: 'high' },
      'inactivity_breach': { type: 'follow_up', priority: 'medium' },
      'followup_late': { type: 'follow_up', priority: 'high' }
    },
    severityToPriority: {
      'critical': 'urgent',
      'high': 'high',
      'medium': 'medium',
      'low': 'low'
    },
    severityToDueDate: {
      'critical': '4 hours from now',
      'high': '1 day from now',
      'medium': '2 days from now',
      'low': '3 days from now'
    },
    breachActions: {
      'create_alert': 'Create SalesNotification with priority=severity',
      'create_task': 'Create SalesTasks with duplicate prevention',
      'escalate_owner': 'Create urgent task assigned to account owner',
      'flag_account': 'Create account-level alert signal',
      'notify_admin': 'Create admin-only notification',
      'notify_manager': 'Route task to manager queue'
    }
  },

  // ============================================================================
  // 7. RESOLUTION LOGIC
  // ============================================================================
  resolutionLogic: {
    triggers: [
      { entity: 'MessageThreads', resolves_when: "status → 'resolved' | 'closed'" },
      { entity: 'Deliverables', resolves_when: "status → 'approved' | 'confirmed'" },
      { entity: 'FulfillmentTasks', resolves_when: "status → 'completed' | 'done'" },
      { entity: 'OnboardingTasks', resolves_when: "status → 'completed' | 'done'" },
      { entity: 'ClientRequests', resolves_when: "status → 'resolved' | 'closed'" },
      { entity: 'ExecutiveReports', resolves_when: "status → 'published'" },
      { entity: 'StrategyReviews', resolves_when: "status → 'completed'" },
      { entity: 'SalesTasks', resolves_when: "status → 'completed'" }
    ],
    steps: [
      '1. Set status = "resolved"',
      '2. Set resolved_at = now()',
      '3. Calculate duration_hours = (resolved_at - started_at) / 3600000',
      '4. Update related AccountabilityScores',
      '5. Mark related notification as resolved',
      '6. Mark related task as completed',
      '7. Update success playbook signals if critical'
    ]
  },

  // ============================================================================
  // 8. ACCOUNTABILITY SCORE RULES
  // ============================================================================
  accountabilityScores: {
    company: {
      calculation: `
score = 100
score -= Math.min(active_breaches * 10, 30)
score -= Math.min(slow_requests_7d * 2, 20)
score -= Math.min(stalled_tasks_14d * 3, 20)
return Math.max(score, 0)
      `,
      bands: {
        '85-100': 'Excellent (on track)',
        '70-84': 'Stable (minor issues)',
        '50-69': 'Needs Attention (concerning)',
        '0-49': 'Critical (immediate action)'
      }
    },
    admin: {
      calculation: `
score = 100
score -= Math.min(overdue_tasks * 5, 25)
score -= Math.min(slow_response_threads_24h * 5, 25)
return Math.max(score, 0)
      `,
      bands: {
        '85-100': 'Excellent performance',
        '70-84': 'Good (minor delays)',
        '50-69': 'Concerning (many delays)',
        '0-49': 'Critical (needs improvement)'
      }
    },
    recalculation: [
      'Trigger on SLAEvent.create → Recalculate company score',
      'Trigger on SLAEvent.update → Recalculate company score',
      'Trigger on SalesTasks.create (overdue) → Recalculate admin score',
      'Trigger on SalesTasks.due_date past → Recalculate admin score',
      'Scheduled daily at 6:00 AM → Recalculate all scores',
      'Scheduled weekly Monday 8:00 AM → Deep historical snapshot'
    ]
  },

  // ============================================================================
  // 9. AUTOMATION RULES
  // ============================================================================
  automations: {
    daily: {
      name: 'Daily SLA Evaluator',
      schedule: 'Every day at 6:00 AM (Chicago time)',
      function: 'evaluateSLACompliance',
      operations: [
        'Evaluate all 10 active SLA rules',
        'Create/update SLAEvents for breached + warning items',
        'Execute breach actions (alerts, tasks, escalations)',
        'Resolve events where conditions met',
        'Recalculate company accountability scores',
        'Recalculate admin accountability scores',
        'Update SalesNotifications for open breaches'
      ]
    },
    weekly: {
      name: 'Weekly Accountability Scorer',
      schedule: 'Every Monday at 8:00 AM (Chicago time)',
      function: 'evaluateSLACompliance (with deep calculation)',
      operations: [
        'Run full daily evaluation',
        'Historical snapshot of all scores',
        'Create AccountabilityScores records',
        'Calculate trend vs previous week',
        'Identify slowest accounts (multi-breach)',
        'Identify slowest team members',
        'Update playbook signals for at-risk accounts'
      ]
    },
    eventDriven: [
      {
        trigger: 'ExecutiveReports.create',
        effect: 'Start 3-day publication countdown'
      },
      {
        trigger: 'StrategyReviews.update (status=scheduled)',
        effect: 'Start countdown to review due date'
      },
      {
        trigger: 'MessageThreads.update (status=waiting_on_admin)',
        effect: 'Start 1-day admin response countdown'
      },
      {
        trigger: 'ClientRequests.create',
        effect: 'Start 1-day urgent resolution countdown'
      },
      {
        trigger: 'FulfillmentTasks.update (status=pending)',
        effect: 'Start task completion countdown'
      },
      {
        trigger: 'Proposals.update (status=viewed)',
        effect: 'Start 2-day follow-up countdown'
      }
    ]
  },

  // ============================================================================
  // 10. INTEGRATION MATRIX
  // ============================================================================
  integrations: {
    onboarding: {
      entity: 'OnboardingTasks',
      rule: 'Onboarding Task Completion (7-day)',
      flow: [
        'Task created → SLAEvent started',
        'Day 7 → Event breaches',
        'Breach action → flag_account',
        'Flag triggers success playbook signal',
        'Admin notified in /admin/operations',
        'Auto-task created for follow-up',
        'Task completed → Event auto-resolves',
        'Score updated'
      ]
    },
    fulfillment: {
      entities: ['FulfillmentTasks', 'Deliverables'],
      rules: ['High Priority Task Completion (1d)', 'Fulfillment Inactivity (5d)', 'Approval Response (3d)'],
      flow: [
        'Task/deliverable created → SLAEvent started',
        'Threshold breached → create_alert + create_task',
        'Alert shown in /admin/operations',
        'Auto-task assigned to account owner',
        'Completion/approval → Event auto-resolves',
        'Duration recorded',
        'Accountability score updated'
      ]
    },
    communication: {
      entity: 'MessageThreads',
      rule: 'Admin Response to Waiting Threads (1d)',
      flow: [
        'Thread status → waiting_on_admin → SLAEvent created',
        'Day 1 → Event breached',
        'Breach action → create_alert + create_task',
        'SalesNotification shows in dashboard',
        'Auto-task routes to assigned admin',
        'Admin responds → Thread resolved → Event auto-resolves',
        'Response time recorded',
        'Admin accountability score updated'
      ]
    },
    strategy: {
      entity: 'StrategyReviews',
      rule: 'Scheduled Strategy Review Completion (0d)',
      flow: [
        'Review scheduled → SLAEvent created with due_date',
        'On due date, breach if not completed',
        'Breach action → create_alert',
        'Admin notified in /admin/operations',
        'Auto-task created for completion',
        'Review completed → Event auto-resolves',
        'Success playbook updated with signals'
      ]
    },
    reporting: {
      entity: 'ExecutiveReports',
      rule: 'Executive Report Publication (3d)',
      flow: [
        'Report created (draft) → SLAEvent started',
        'Day 3 → Event breached if still draft',
        'Breach action → notify_admin',
        'Alert shows in /admin/operations',
        'Auto-task created "Publish overdue report"',
        'Report published → Event auto-resolves',
        'Publication delay recorded'
      ]
    },
    proposals: {
      entity: 'Proposals',
      rule: 'Proposal Follow-Up After View (2d)',
      flow: [
        'Proposal viewed → SLAEvent started',
        'Day 2 → Event breached if no action',
        'Breach action → create_alert + create_task',
        'SalesNotification shows in dashboard',
        'Auto-task "Proposal follow-up" created',
        'Follow-up email sent or call logged → Resolves',
        'Follow-up time recorded'
      ]
    },
    tasks: {
      entity: 'SalesTasks',
      rule: 'Sales Task Completion (2d)',
      flow: [
        'Sales task created → SLAEvent may start',
        'Day 2 → Event breached if still pending',
        'Breach action → create_alert',
        'Alert shown in /admin/operations',
        'Task completed → Event auto-resolves',
        'Completion time recorded',
        'Admin user accountability score updated'
      ]
    }
  },

  // ============================================================================
  // 11. FINAL VERIFICATION CHECKLIST
  // ============================================================================
  verification: {
    entities: [
      '✅ SLAProfiles created and schema defined',
      '✅ SLARules created and schema defined',
      '✅ SLAEvents created and schema defined',
      '✅ AccountabilityScores created and schema defined'
    ],
    functions: [
      '✅ evaluateSLACompliance() deployed',
      '✅ initializeSLARules() deployed',
      '✅ Both functions tested'
    ],
    ui: [
      '✅ /admin/operations dashboard created',
      '✅ /admin/operations/company detail created',
      '✅ All filter controls implemented',
      '✅ Summary cards and metrics visible'
    ],
    rules: [
      '✅ 9 SLA profiles defined',
      '✅ 10 SLA rules defined',
      '✅ Rules cover all 9 entity types'
    ],
    logic: [
      '✅ Evaluation algorithm implemented',
      '✅ Age calculation correct',
      '✅ Breach/warning detection working',
      '✅ Auto-resolution implemented'
    ],
    protection: [
      '✅ No duplicate events per rule+entity',
      '✅ No duplicate tasks per company+type',
      '✅ Idempotent escalations'
    ],
    tasks: [
      '✅ Event → Task type mapping (8 types)',
      '✅ Severity → Priority mapping',
      '✅ All breach actions implemented',
      '✅ Task creation with duplicate prevention'
    ],
    resolution: [
      '✅ Auto-resolve triggers for all entity types',
      '✅ Duration calculation working',
      '✅ Score updates on resolution',
      '✅ Related record cleanup'
    ],
    scores: [
      '✅ Company score calculation',
      '✅ Admin score calculation',
      '✅ Score band definitions',
      '✅ Recalculation triggers'
    ],
    automations: [
      '✅ Daily automation defined (6:00 AM)',
      '✅ Weekly automation defined (Monday 8:00 AM)',
      '✅ Event-driven automations defined (6 types)',
      '✅ Ready to schedule'
    ],
    integration: [
      '✅ Onboarding → OnboardingTasks SLA',
      '✅ Fulfillment → FulfillmentTasks + Deliverables SLA',
      '✅ Communication → MessageThreads SLA',
      '✅ Strategy Reviews → StrategyReviews SLA',
      '✅ Reporting → ExecutiveReports SLA',
      '✅ Proposals → Proposals SLA',
      '✅ Tasks → SalesTasks SLA'
    ]
  }
};

export default SLA_VERIFICATION_GUIDE;