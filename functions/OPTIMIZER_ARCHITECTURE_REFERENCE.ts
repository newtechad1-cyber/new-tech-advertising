/**
 * AUTONOMOUS CAMPAIGN OPTIMIZER - COMPLETE ARCHITECTURE REFERENCE
 * 
 * This file documents the entire Optimizer system: routes, entities, rules, and integrations.
 * It serves as a verification checklist and integration guide.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTES & PAGES
// ═══════════════════════════════════════════════════════════════════════════════

const ROUTES = {
  admin: {
    optimizer: '/admin/optimizer',
    optimizerDetail: '/admin/optimizer/:opportunity_id',
  },
  integration: {
    commandCenter: '/admin/command-center',  // OptimizerMetrics widget added
    executiveDashboard: '/admin/executive',  // Top opportunities summary
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ENTITIES
// ═══════════════════════════════════════════════════════════════════════════════

const ENTITIES = {
  OptimizationOpportunities: {
    file: 'entities/OptimizationOpportunities.json',
    keyFields: [
      'company_id',
      'fulfillment_workroom_id',
      'executive_report_id',
      'related_deliverable_id',
      'related_growth_opportunity_id',
      'optimization_type',
      'title',
      'description',
      'root_cause_summary',
      'recommendation_summary',
      'priority', // [low, medium, high, urgent]
      'status', // [new, reviewing, accepted, in_progress, completed, dismissed, snoozed]
      'confidence_score', // 0-100
      'impact_potential', // [low, medium, high, significant]
      'recommended_service_area',
      'assigned_admin_user_id',
      'signals_count',
      'last_analyzed_date'
    ],
    relationships: [
      'has_many: OptimizationSignals',
      'has_many: OptimizationActions',
      'belongs_to: Companies',
      'belongs_to: FulfillmentWorkrooms',
      'belongs_to: ExecutiveReports',
      'belongs_to: Deliverables',
      'belongs_to: GrowthOpportunities'
    ]
  },

  OptimizationSignals: {
    file: 'entities/OptimizationSignals.json',
    keyFields: [
      'company_id',
      'optimization_opportunity_id',
      'signal_type', // [traffic_up_leads_flat, content_output_high_results_flat, high_approvals_low_publish, ...]
      'signal_label',
      'signal_value',
      'source_type', // [reporting, fulfillment, deliverables, communications, approvals, strategy, growth, workflow, campaign, seo]
      'severity' // [informational, warning, critical]
    ],
    relationships: [
      'belongs_to: OptimizationOpportunities',
      'belongs_to: Companies'
    ]
  },

  OptimizationActions: {
    file: 'entities/OptimizationActions.json',
    keyFields: [
      'optimization_opportunity_id',
      'action_type', // [create_task, adjust_content_plan, create_landing_page, create_video, ...]
      'title',
      'description',
      'priority', // [low, medium, high, urgent]
      'status', // [pending, in_progress, completed, blocked, skipped]
      'owner_type', // [admin, system, shared]
      'owner_user_id',
      'related_task_id',
      'related_proposal_id',
      'related_strategy_review_id',
      'due_date',
      'sort_order'
    ],
    relationships: [
      'belongs_to: OptimizationOpportunities',
      'belongs_to: SalesTasks',
      'belongs_to: Proposals',
      'belongs_to: StrategyReviews'
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// OPTIMIZATION DETECTION RULES
// ═══════════════════════════════════════════════════════════════════════════════

const DETECTION_RULES = {

  1: {
    name: 'Conversion Optimization',
    detection: `
      IF (website_visits trending UP in last 3 periods
          AND leads_generated is FLAT (< 10% growth)
          AND content published consistently)
      THEN create: conversion_optimization
    `,
    signals: ['traffic_up_leads_flat', 'stalled_conversion_rate'],
    confidence_base: 78,
    impact_potential: 'high',
    recommended_service_area: null
  },

  2: {
    name: 'Content Mix Adjustment',
    detection: `
      IF (content_output HIGH (> 10 items/period)
          AND results FLAT (traffic/leads unchanged)
          AND mix lacks high-impact formats)
      THEN create: content_mix_adjustment
    `,
    signals: ['content_output_high_results_flat'],
    confidence_base: 72,
    impact_potential: 'high',
    recommended_service_area: null
  },

  3: {
    name: 'Approval Bottleneck Reduction',
    detection: `
      IF (pending_approvals > 0
          AND (pending_approvals > 3 OR avg_approval_days > 5))
      THEN create: approval_bottleneck_reduction
    `,
    signals: ['high_approvals_low_publish', 'slow_approval_cycle'],
    confidence_base: 85,
    impact_potential: 'high',
    recommended_service_area: null
  },

  4: {
    name: 'Video Expansion',
    detection: `
      IF (video_deliverables < 20% of total
          AND (traffic OR engagement trending UP
               OR service supports visual selling))
      THEN create: video_expansion
    `,
    signals: ['low_video_output'],
    confidence_base: 65,
    impact_potential: 'significant',
    recommended_service_area: 'Video Production'
  },

  5: {
    name: 'Delivery Pacing Adjustment',
    detection: `
      IF (deliverables_created > deliverables_published * 1.5
          AND fulfillment_workroom_status = active)
      THEN create: delivery_pacing_adjustment
    `,
    signals: ['delivery_pacing_adjustment'],
    confidence_base: 70,
    impact_potential: 'high',
    recommended_service_area: null
  },

  6: {
    name: 'Creative Refresh',
    detection: `
      IF (oldest_active_deliverable > 60 days old
          AND (engagement_trending_flat OR declining))
      THEN create: creative_refresh
    `,
    signals: ['stale_creative'],
    confidence_base: 60,
    impact_potential: 'medium',
    recommended_service_area: null
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIDENCE SCORING RULES
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIDENCE_SCORING = {
  formula: 'base_confidence + signal_strength_bonus + pattern_recency_bonus + data_consistency_bonus - contradictory_penalties',
  
  baseConfidence: {
    'approval_bottleneck_reduction': 85,
    'conversion_optimization': 78,
    'content_mix_adjustment': 72,
    'video_expansion': 65,
    'delivery_pacing_adjustment': 70,
    'creative_refresh': 60
  },

  modifiers: {
    signal_strength: {
      'each_additional_signal': '+3%',
      'multiple_sources': '+5%',
      'critical_severity': '+10%'
    },
    pattern_recency: {
      'repeated_in_last_1_period': '+5%',
      'repeated_in_last_2_3_periods': '+10%',
      'repeated_in_last_4+_periods': '+15%'
    },
    data_consistency: {
      'supported_by_2+_sources': '+5%',
      'same_issue_in_previous_reports': '+10%',
      'mentioned_in_strategy_reviews': '+5%'
    },
    penalties: {
      'opposing_signal_detected': '-10%',
      'recent_improvement_trend': '-15%'
    }
  },

  caps: {
    minimum: 0,
    maximum: 100,
    rule: 'Cannot exceed 100% even with multiple bonuses'
  },

  scoring_bands: {
    '80-100': 'Strong pattern',
    '60-79': 'Likely optimization',
    '40-59': 'Moderate signal',
    'below_40': 'Weak / informational'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// IMPACT POTENTIAL SCORING
// ═══════════════════════════════════════════════════════════════════════════════

const IMPACT_POTENTIAL_SCORING = {
  SIGNIFICANT: {
    criteria: [
      'Affects >3 core metrics (leads, traffic, revenue, conversion)',
      'Account value > $50K annually',
      'Repeated issue across 2+ periods',
      'Blocks delivery or conversion',
      'Service expansion potential > $10K'
    ]
  },

  HIGH: {
    criteria: [
      'Affects 2 core metrics',
      'Account value > $20K annually',
      'Recurring issue (2+ periods)',
      'Directly impacts customer outcome',
      'Service expansion potential > $5K'
    ]
  },

  MEDIUM: {
    criteria: [
      'Affects 1 core metric',
      'Account value > $10K annually',
      'Single occurrence or rare',
      'Indirect impact on customer outcome',
      'Service expansion potential > $2K'
    ]
  },

  LOW: {
    criteria: [
      'Affects operational efficiency only',
      'Account value < $10K',
      'Single occurrence',
      'Minimal customer outcome impact',
      'Service expansion potential < $2K'
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ACTION GENERATION RULES
// ═══════════════════════════════════════════════════════════════════════════════

const ACTION_GENERATION_RULES = {

  conversion_optimization: {
    actions: [
      {
        sort_order: 1,
        action_type: 'create_task',
        title: 'Review landing page performance data',
        priority: 'high',
        owner_type: 'admin'
      },
      {
        sort_order: 2,
        action_type: 'create_task',
        title: 'Analyze CTA placement and messaging',
        priority: 'high',
        owner_type: 'admin'
      },
      {
        sort_order: 3,
        action_type: 'create_task',
        title: 'Simplify conversion path',
        priority: 'medium',
        owner_type: 'admin'
      },
      {
        sort_order: 4,
        action_type: 'schedule_strategy_review',
        title: 'Q2 conversion optimization review',
        priority: 'high',
        owner_type: 'admin',
        due_date: '+14 days'
      }
    ]
  },

  content_mix_adjustment: {
    actions: [
      {
        sort_order: 1,
        action_type: 'create_task',
        title: 'Audit current content performance',
        priority: 'high',
        owner_type: 'admin'
      },
      {
        sort_order: 2,
        action_type: 'create_task',
        title: 'Identify high-impact content types to prioritize',
        priority: 'high',
        owner_type: 'admin'
      },
      {
        sort_order: 3,
        action_type: 'create_proposal',
        title: 'Content strategy realignment package',
        priority: 'high',
        owner_type: 'system'
      },
      {
        sort_order: 4,
        action_type: 'schedule_strategy_review',
        title: 'Content mix realignment review',
        priority: 'medium',
        owner_type: 'admin',
        due_date: '+21 days'
      }
    ]
  },

  approval_bottleneck_reduction: {
    actions: [
      {
        sort_order: 1,
        action_type: 'create_task',
        title: 'Set approval SLA with client',
        priority: 'urgent',
        owner_type: 'admin'
      },
      {
        sort_order: 2,
        action_type: 'create_task',
        title: 'Implement approval escalation workflow',
        priority: 'high',
        owner_type: 'admin'
      },
      {
        sort_order: 3,
        action_type: 'create_task',
        title: 'Simplify/reduce approval gates where possible',
        priority: 'medium',
        owner_type: 'admin'
      },
      {
        sort_order: 4,
        action_type: 'schedule_strategy_review',
        title: 'Approval process optimization',
        priority: 'high',
        owner_type: 'admin',
        due_date: '+7 days'
      }
    ]
  },

  video_expansion: {
    actions: [
      {
        sort_order: 1,
        action_type: 'create_task',
        title: 'Identify 3-5 video content opportunities',
        priority: 'medium',
        owner_type: 'admin'
      },
      {
        sort_order: 2,
        action_type: 'create_proposal',
        title: 'Video production service expansion',
        priority: 'high',
        owner_type: 'system'
      },
      {
        sort_order: 3,
        action_type: 'create_task',
        title: 'Prepare video ROI talking points',
        priority: 'medium',
        owner_type: 'admin',
        due_date: '+14 days'
      }
    ]
  },

  delivery_pacing_adjustment: {
    actions: [
      {
        sort_order: 1,
        action_type: 'create_task',
        title: 'Implement content calendar',
        priority: 'high',
        owner_type: 'admin'
      },
      {
        sort_order: 2,
        action_type: 'create_task',
        title: 'Identify and reduce handoff delays',
        priority: 'high',
        owner_type: 'admin'
      },
      {
        sort_order: 3,
        action_type: 'create_task',
        title: 'Automate scheduling where safe',
        priority: 'medium',
        owner_type: 'admin'
      },
      {
        sort_order: 4,
        action_type: 'schedule_strategy_review',
        title: 'Fulfillment pacing assessment',
        priority: 'medium',
        owner_type: 'admin',
        due_date: '+14 days'
      }
    ]
  },

  creative_refresh: {
    actions: [
      {
        sort_order: 1,
        action_type: 'create_task',
        title: 'Develop 3 new creative variations',
        priority: 'medium',
        owner_type: 'admin'
      },
      {
        sort_order: 2,
        action_type: 'create_task',
        title: 'Update messaging angles and test',
        priority: 'medium',
        owner_type: 'admin',
        due_date: '+10 days'
      },
      {
        sort_order: 3,
        action_type: 'create_task',
        title: 'Create seasonal/fresh asset pack',
        priority: 'low',
        owner_type: 'admin'
      }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// DUPLICATE PROTECTION RULES
// ═══════════════════════════════════════════════════════════════════════════════

const DUPLICATE_PROTECTION = {
  algorithm: `
    function opportunityExists(opportunities, type) {
      return opportunities.some(o => 
        o.optimization_type === type 
        AND o.status IN ['new', 'reviewing', 'accepted']
      );
    }
  `,

  rules: [
    'No duplicate OPEN opportunities for same (company_id + optimization_type)',
    'Completed or dismissed opportunities do NOT block new ones',
    'Snoozed opportunities do NOT block new ones',
    'Only 1 "new/reviewing/accepted" opportunity per type per company',
    'If opportunity exists in "new" state, re-analysis skips creation'
  ],

  implementation_location: 'functions/analyzeCampaignOptimization.js',
  check_timing: 'BEFORE creating each OptimizationOpportunity',
  purpose: 'Prevents duplicate signal noise'
};

// ═══════════════════════════════════════════════════════════════════════════════
// ORCHESTRATOR INTEGRATION POINTS
// ═══════════════════════════════════════════════════════════════════════════════

const ORCHESTRATOR_INTEGRATION = {

  integration_location: 'functions/analyzeCampaignOptimization.js',

  trigger_1_high_confidence_conversion: {
    description: 'High-confidence conversion issue',
    condition: 'confidence_score >= 75 AND priority = "high"',
    orchestration_type: 'renewal',
    trigger_event: 'conversion_optimization_opportunity',
    payload: {
      trigger_source: 'optimization_opportunity',
      company_id: 'companyId',
      related_opportunity_id: 'opportunityId',
      context: {
        issue: 'conversion_optimization',
        confidence: 'confidence_score',
        impact: 'impact_potential'
      }
    }
  },

  trigger_2_approval_bottleneck: {
    description: 'Approval bottleneck impacting fulfillment',
    condition: 'confidence_score >= 80 AND signal_count >= 2',
    orchestration_type: 'fulfillment',
    trigger_event: 'approval_bottleneck_detected',
    payload: {
      trigger_source: 'optimization_opportunity',
      company_id: 'companyId',
      related_opportunity_id: 'opportunityId'
    }
  },

  trigger_3_video_expansion_upsell: {
    description: 'Video expansion opportunity for renewal/upsell',
    condition: 'optimization_type = "video_expansion" AND confidence >= 70 AND impact = "significant"',
    orchestration_type: 'renewal',
    trigger_event: 'expansion_ready',
    payload: {
      trigger_source: 'optimization_opportunity',
      company_id: 'companyId',
      related_growth_opportunity_id: 'growthOppId'
    }
  },

  trigger_4_fulfillment_stabilization: {
    description: 'Fulfillment pacing or process optimization needed',
    condition: 'optimization_type IN ["approval_bottleneck_reduction", "delivery_pacing_adjustment"] AND confidence >= 70',
    orchestration_type: 'fulfillment',
    trigger_event: 'fulfillment_optimization_needed',
    payload: {
      trigger_source: 'optimization_opportunity',
      company_id: 'companyId'
    }
  },

  feedback_loop: 'Optimizer checks WorkflowRuns for related company. If orchestrator already created tasks/reviews, mark opportunity as "accepted" and link related IDs to prevent duplicate actions.'
};

// ═══════════════════════════════════════════════════════════════════════════════
// COPILOT INTEGRATION POINTS
// ═══════════════════════════════════════════════════════════════════════════════

const COPILOT_INTEGRATION = {

  insight_rule_1_high_impact_conversion: {
    name: 'High-Impact Conversion Issue on VIP Account',
    condition: 'optimization_type = "conversion_optimization" AND confidence >= 75 AND annual_value >= $50K',
    creates: 'CopilotInsight',
    fields: {
      insight_type: 'revenue_opportunity',
      title: 'Conversion Gap Optimization Opportunity',
      description: 'From recommendation_summary',
      priority: 'high',
      severity: 'critical',
      visible_in_brief: true
    }
  },

  insight_rule_2_repeated_bottleneck: {
    name: 'Repeated Fulfillment Bottleneck',
    condition: 'optimization_type = "approval_bottleneck_reduction" AND signals_count >= 3 AND confidence >= 80',
    creates: 'CopilotInsight',
    fields: {
      insight_type: 'operational_risk',
      title: 'Fulfillment Bottleneck Blocking Delivery',
      description: 'Approval delays impacting campaign pace and satisfaction',
      priority: 'high',
      severity: 'warning'
    }
  },

  insight_rule_3_expansion_opportunity: {
    name: 'Service Expansion via Optimization',
    condition: 'optimization_type IN ["video_expansion", "seo_expansion", "landing_page_need"] AND confidence >= 70 AND impact IN ["high", "significant"]',
    creates: 'CopilotInsight',
    fields: {
      insight_type: 'revenue_opportunity',
      title: 'Service Expansion Opportunity',
      description: 'From recommendation_summary',
      priority: 'medium',
      severity: 'informational'
    }
  },

  action_queue_rule_1_urgent_vip: {
    name: 'Urgent Optimization on VIP Account',
    condition: 'priority = "urgent" AND confidence >= 80 AND annual_value >= $100K',
    creates: 'CopilotActionQueue',
    fields: {
      action_title: 'opportunity.title',
      action_type: 'mapped from optimization_type',
      description: 'opportunity.recommendation_summary',
      priority: 'urgent',
      owner_type: 'owner',
      recommended_due_date: 'today + 3 days',
      sort_order: 1
    }
  },

  action_queue_rule_2_strategic_expansion: {
    name: 'Strategic Expansion Opportunity',
    condition: 'recommended_service_area NOT NULL AND impact = "significant" AND confidence >= 75',
    creates: 'CopilotActionQueue',
    fields: {
      action_title: 'Propose Service: ' + recommended_service_area,
      action_type: 'create_proposal',
      description: 'Client is expansion-ready',
      priority: 'high',
      owner_type: 'shared',
      recommended_due_date: 'today + 7 days'
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// TASK/PROPOSAL/REVIEW CREATION RULES
// ═══════════════════════════════════════════════════════════════════════════════

const TASK_PROPOSAL_REVIEW_RULES = {

  sales_tasks: {
    creation_condition: 'OptimizationAction.priority IN ["high", "urgent"]',
    prevent_duplicates: `
      DO NOT create IF (
        SalesTask exists for same company
        AND description matches OptimizationAction.description
        AND status IN ['pending', 'in_progress']
        AND created_date >= 7 days ago
      )
    `,
    due_date_rules: {
      high: '7 days',
      medium: '14 days',
      low: '21 days',
      urgent: '2 days'
    },
    assignment_rules: [
      'Use OptimizationAction.owner_user_id if present',
      'Otherwise: assign to account owner from Company record'
    ]
  },

  proposals: {
    trigger_conditions: [
      'optimization_type IN ["video_expansion", "seo_expansion", "landing_page_need", "creative_refresh"]',
      'recommended_service_area IS NOT NULL',
      'confidence_score >= 70'
    ],
    template: {
      company_id: 'opportunity.company_id',
      proposal_type: 'optimization_service',
      title: 'Proposal: ' + recommended_service_area,
      summary: 'Service expansion to address: ' + opportunity.title,
      description: 'Root Cause: + root_cause_summary + Recommendation: + recommendation_summary',
      recommended_value: 'calculateServiceValue(optimization_type, company.size)',
      status: 'draft',
      linked_opportunity_id: 'opportunity_id'
    },
    prevent_duplicates: `
      DO NOT create IF (
        Proposal exists for same (company_id + recommended_service_area)
        AND status IN ['draft', 'sent', 'viewed']
        AND created_date >= 30 days ago
      )
    `
  },

  strategy_reviews: {
    trigger_conditions: [
      'opportunity.status = "accepted"',
      'confidence_score >= 70',
      'At least 1 OptimizationAction exists'
    ],
    template: {
      company_id: 'opportunity.company_id',
      review_type: 'optimization_review',
      review_title: 'Optimization Review: ' + opportunity.title,
      period_label: 'Q + currentQuarter + 2026',
      summary: 'opportunity.recommendation_summary',
      account_health_status: 'calculateHealthFromOpportunity(opportunity)',
      recommendations: 'OptimizationActions joined by priority'
    },
    prevent_duplicates: `
      DO NOT create IF (
        StrategyReview exists for same (company_id + optimization_type)
        AND status IN ['draft', 'scheduled', 'completed']
        AND created_date >= 60 days ago
      )
    `
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// WEEKLY/MONTHLY AUTOMATION RULES
// ═══════════════════════════════════════════════════════════════════════════════

const AUTOMATION_RULES = {

  weekly_campaign_optimization_sweep: {
    function: 'weeklyCampaignOptimizationSweep.js',
    schedule: 'Every Monday 6:00 AM CT',
    automation_config: {
      automation_type: 'scheduled',
      name: 'Weekly Campaign Optimization Sweep',
      function_name: 'weeklyCampaignOptimizationSweep',
      schedule_type: 'simple',
      repeat_unit: 'weeks',
      repeat_interval: 1,
      repeat_on_days: [1], // Monday
      start_time: '06:00', // 6 AM CT
      ends_type: 'never'
    },
    algorithm: `
      1. GET all active FulfillmentWorkrooms (status IN ['active', 'in_progress'])
      2. Extract unique company_ids
      3. FOR EACH company_id:
           INVOKE analyzeCampaignOptimization({ company_id })
           IF success: track opportunities & signals created
           IF error: log and continue
      4. Return summary: accounts_analyzed, opportunities_created, signals_created
    `,
    output: [
      'Creates new OptimizationOpportunities for detected patterns',
      'Creates OptimizationSignals',
      'Generates OptimizationActions',
      'Logs analysis results'
    ]
  },

  monthly_optimization_review_consolidation: {
    function: 'monthlyOptimizationReviewConsolidation.js (future)',
    schedule: 'First of month 8:00 AM CT',
    algorithm: `
      1. GET all opportunities created in last 30 days
      2. GROUP by company_id
      3. FOR EACH company:
           IDENTIFY repeated optimization_types
           IF optimization_type appears 2+ times:
             - Increase priority
             - Flag as 'high_pattern'
             - Create escalation task
           CALCULATE aggregate patterns across portfolio
           IF pattern affects >20% of accounts:
             - Create platform-wide insight
      4. Create summary insights for copilot
      5. Generate owner action items for strategic review
    `,
    output: [
      'Updated priority/status on repeated opportunities',
      'Platform insights for executive awareness',
      'Action queue items for strategic planning'
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT INTEGRATION SUMMARY
// ═══════════════════════════════════════════════════════════════════════════════

const COMPONENTS = {

  OptimizerMetrics: {
    location: 'components/command/OptimizerMetrics.jsx',
    used_in: '/admin/command-center',
    displays: [
      'Open opportunities count',
      'High confidence opportunities (score >= 70)',
      'Urgent count',
      'Top opportunity by confidence',
      'Link to /admin/optimizer'
    ]
  },

  executiveDashboardIntegration: {
    location: '/admin/executive',
    displays: [
      'Top 3 high-impact opportunities (sorted by confidence * impact)',
      'Biggest conversion gap account',
      'Best expansion-through-optimization account',
      'Links to full optimizer view'
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// VERIFICATION CHECKLIST
// ═══════════════════════════════════════════════════════════════════════════════

const VERIFICATION_CHECKLIST = {
  entities: {
    'OptimizationOpportunities': '✓ Created',
    'OptimizationSignals': '✓ Created',
    'OptimizationActions': '✓ Created'
  },

  detection_rules: {
    'Conversion Optimization': '✓ Implemented',
    'Content Mix Adjustment': '✓ Implemented',
    'Approval Bottleneck Reduction': '✓ Implemented',
    'Video Expansion': '✓ Implemented',
    'Delivery Pacing Adjustment': '✓ Implemented',
    'Creative Refresh': '✓ Implemented'
  },

  scoring: {
    'Confidence Scoring Logic': '✓ Implemented (0-100%, type-specific base + modifiers)',
    'Impact Potential Scoring': '✓ Implemented (low/medium/high/significant matrix)'
  },

  rules: {
    'Action Generation Rules': '✓ Implemented (typed actions with priority/ownership)',
    'Duplicate Protection': '✓ Implemented (company + type + status check)',
    'Task/Proposal/Review Creation': '✓ Implemented (typed, templated, duplicate-protected)'
  },

  integration: {
    'Orchestrator Integration Points': '✓ 4 trigger scenarios mapped',
    'Copilot Insights Integration': '✓ 3 insight rules + 2 action queue rules',
    'Command Center Widget': '✓ OptimizerMetrics component',
    'Executive Dashboard Summary': '✓ Top opportunities display'
  },

  automation: {
    'Weekly Sweep Automation': '✓ Function + scheduled automation',
    'Monthly Review Consolidation': '✓ Function framework (future)'
  },

  routes: {
    '/admin/optimizer': '✓ Dashboard page created',
    '/admin/optimizer/:opportunity_id': '✓ Detail page created'
  }
};

// Export for reference
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ROUTES,
    ENTITIES,
    DETECTION_RULES,
    CONFIDENCE_SCORING,
    IMPACT_POTENTIAL_SCORING,
    ACTION_GENERATION_RULES,
    DUPLICATE_PROTECTION,
    ORCHESTRATOR_INTEGRATION,
    COPILOT_INTEGRATION,
    TASK_PROPOSAL_REVIEW_RULES,
    AUTOMATION_RULES,
    COMPONENTS,
    VERIFICATION_CHECKLIST
  };
}