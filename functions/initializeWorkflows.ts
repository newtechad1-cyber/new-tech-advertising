import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Initialize NTA Global Workflows
 * Seeds all 7 core workflows into WorkflowDefinition
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

    const workflows = [
      // 1. Client Onboarding Workflow
      {
        workflowId: 'clientOnboarding',
        workflowName: 'Client Onboarding',
        workflowCategory: 'onboarding',
        description: 'Structured onboarding process from subscription to live campaign',
        startTrigger: 'subscription_created',
        avgDurationDays: 14,
        relatedEntities: ['Organization', 'Subscription', 'OnboardingProfile'],
        relatedAgents: ['onboarding_coordinator', 'brand_analyzer'],
        automationHooks: ['createOnboardingWorkroom', 'sendOnboardingEmail', 'generateAuthorityPlan'],
        successMetrics: {
          completion_rate: 'percentage of subs that complete onboarding',
          avg_duration: 'days from subscription to first campaign',
          engagement_score: 'client activity during onboarding'
        },
        stages: JSON.stringify([
          {
            stageId: 'welcome',
            stageName: 'Welcome & Brand Discovery',
            order: 1,
            description: 'Client fills out brand DNA questionnaire',
            action: 'create_onboarding_profile',
            automationHook: 'sendWelcomeEmail',
            expectedDurationDays: 1,
            isParallel: false,
            successCriteria: {
              requiresManualApproval: false,
              dataRequired: ['businessName', 'industry', 'targetAudience']
            }
          },
          {
            stageId: 'channel_setup',
            stageName: 'Channel Connection',
            order: 2,
            description: 'Connect social and business accounts',
            action: 'create_channel_connections',
            automationHook: 'validateChannelAccess',
            expectedDurationDays: 2,
            isParallel: false,
            successCriteria: {
              minChannelsConnected: 1,
              requiredChannels: ['facebook', 'google_business']
            }
          },
          {
            stageId: 'content_planning',
            stageName: 'Content Plan Creation',
            order: 3,
            description: 'AI generates first content plan',
            action: 'generate_content_plan',
            automationHook: 'runAuthorityPlanner',
            expectedDurationDays: 3,
            isParallel: false,
            successCriteria: {
              plansGenerated: 1,
              tasksAssigned: true
            }
          },
          {
            stageId: 'launch_readiness',
            stageName: 'Launch Readiness Check',
            order: 4,
            description: 'Verify all systems ready for first campaign',
            action: 'validate_launch_readiness',
            automationHook: 'sendLaunchReadyEmail',
            expectedDurationDays: 1,
            isParallel: false,
            successCriteria: {
              requiresManualApproval: true,
              allChecklistsComplete: true
            }
          },
          {
            stageId: 'first_campaign',
            stageName: 'First Campaign Launch',
            order: 5,
            description: 'Launch first marketing campaign',
            action: 'launch_campaign',
            automationHook: 'createFirstCampaign',
            expectedDurationDays: 1,
            isParallel: false,
            successCriteria: {
              campaignPublished: true,
              contentPosted: true
            }
          },
          {
            stageId: 'success_call',
            stageName: 'Success Call',
            order: 6,
            description: 'Onboarding success call with client',
            action: 'schedule_success_call',
            automationHook: 'bookSuccessCall',
            expectedDurationDays: 3,
            isParallel: false,
            successCriteria: {
              callCompleted: true,
              feedbackCollected: true
            }
          }
        ])
      },

      // 2. Weekly Marketing Execution Workflow
      {
        workflowId: 'weeklyMarketingExecution',
        workflowName: 'Weekly Marketing Execution',
        workflowCategory: 'marketing_execution',
        description: 'Systematic weekly content creation, approval, and publishing',
        startTrigger: 'scheduled_weekly',
        avgDurationDays: 7,
        relatedEntities: ['Campaign', 'ContentAsset', 'ScheduledPost'],
        relatedAgents: ['content_generator', 'content_multiplier', 'publishing_orchestrator'],
        automationHooks: ['generateWeeklyPlan', 'createContentAssets', 'requestApprovals', 'publishContent'],
        successMetrics: {
          content_created: 'pieces of content generated',
          approval_time: 'hours until approval',
          publish_success: 'percentage of scheduled posts published'
        },
        stages: JSON.stringify([
          {
            stageId: 'plan_review',
            stageName: 'Weekly Plan Review',
            order: 1,
            description: 'Review and adjust weekly plan',
            action: 'review_marketing_plan',
            automationHook: 'generateWeeklyMarketingPlan',
            expectedDurationDays: 1,
            isParallel: false,
            successCriteria: { planApproved: true }
          },
          {
            stageId: 'content_generation',
            stageName: 'Content Generation',
            order: 2,
            description: 'Generate blog, video, social content',
            action: 'generate_content_batch',
            automationHook: 'runContentMultiplier',
            expectedDurationDays: 2,
            isParallel: true,
            successCriteria: { minContentPieces: 10 }
          },
          {
            stageId: 'asset_creation',
            stageName: 'Asset Creation & Enhancement',
            order: 2,
            description: 'Create images, thumbnails, graphics',
            action: 'create_visual_assets',
            automationHook: 'generateTemplateImages',
            expectedDurationDays: 2,
            isParallel: true,
            successCriteria: { assetsCreated: true }
          },
          {
            stageId: 'approval_queue',
            stageName: 'Client Approval Queue',
            order: 3,
            description: 'Submit content for client review',
            action: 'create_approval_requests',
            automationHook: 'sendApprovalRequest',
            expectedDurationDays: 2,
            isParallel: false,
            successCriteria: { allContentApproved: true }
          },
          {
            stageId: 'scheduling',
            stageName: 'Scheduling & Publishing',
            order: 4,
            description: 'Schedule posts and publish',
            action: 'schedule_posts',
            automationHook: 'publishScheduledPosts',
            expectedDurationDays: 1,
            isParallel: false,
            successCriteria: { postsScheduled: true }
          }
        ])
      },

      // 3. Lead & ROI Tracking Workflow
      {
        workflowId: 'leadRoiTracking',
        workflowName: 'Lead & ROI Tracking',
        workflowCategory: 'lead_management',
        description: 'Track leads from source through conversion and calculate ROI',
        startTrigger: 'lead_qualified',
        avgDurationDays: 30,
        relatedEntities: ['Lead', 'LeadActivity', 'ClientPerformanceMetric'],
        relatedAgents: ['lead_scorer', 'roi_calculator'],
        automationHooks: ['scoreLeadQuality', 'trackLeadActivity', 'calculateROI'],
        successMetrics: {
          lead_conversion: 'percentage of leads converted',
          avg_deal_value: 'average revenue per lead',
          roi_achieved: 'return on marketing investment'
        },
        stages: JSON.stringify([
          {
            stageId: 'lead_capture',
            stageName: 'Lead Capture',
            order: 1,
            description: 'Capture and qualify inbound leads',
            action: 'create_lead_record',
            automationHook: 'qualifyLead',
            expectedDurationDays: 1,
            isParallel: false,
            successCriteria: { leadQualified: true }
          },
          {
            stageId: 'attribution',
            stageName: 'Source Attribution',
            order: 2,
            description: 'Determine lead source and campaign',
            action: 'attribute_lead_source',
            automationHook: 'attributeLeadToSource',
            expectedDurationDays: 1,
            isParallel: false,
            successCriteria: { sourceIdentified: true }
          },
          {
            stageId: 'follow_up',
            stageName: 'Lead Follow-up',
            order: 3,
            description: 'Nurture and follow up with lead',
            action: 'send_follow_up',
            automationHook: 'sendFollowUpSequence',
            expectedDurationDays: 14,
            isParallel: false,
            successCriteria: { engagementScore: 'gt 50' }
          },
          {
            stageId: 'conversion',
            stageName: 'Conversion Tracking',
            order: 4,
            description: 'Track lead to customer conversion',
            action: 'record_conversion',
            automationHook: 'trackConversion',
            expectedDurationDays: 5,
            isParallel: false,
            successCriteria: { converted: true }
          },
          {
            stageId: 'roi_calculation',
            stageName: 'ROI Calculation',
            order: 5,
            description: 'Calculate ROI on campaign spend',
            action: 'calculate_roi',
            automationHook: 'generateROIReport',
            expectedDurationDays: 1,
            isParallel: false,
            successCriteria: { roiCalculated: true }
          }
        ])
      },

      // 4. Upgrade Conversion Workflow
      {
        workflowId: 'upgradeConversion',
        workflowName: 'Upgrade Conversion',
        workflowCategory: 'upgrade_conversion',
        description: 'Identify upgrade-ready clients and convert through targeted campaigns',
        startTrigger: 'engagement_milestone',
        avgDurationDays: 21,
        relatedEntities: ['Organization', 'UpgradeOpportunity', 'Proposal'],
        relatedAgents: ['upgrade_scorer', 'proposal_generator'],
        automationHooks: ['identifyUpgradeReady', 'generateProposal', 'sendUpgradeOffer'],
        successMetrics: {
          identified: 'upgrade-ready clients identified',
          conversion_rate: 'percentage converted',
          revenue_increase: 'incremental MRR from upgrades'
        },
        stages: JSON.stringify([
          {
            stageId: 'identification',
            stageName: 'Identify Upgrade-Ready',
            order: 1,
            description: 'Find clients ready for upgrade',
            action: 'identify_upgrade_candidates',
            automationHook: 'findUpgradeOpportunities',
            expectedDurationDays: 1,
            isParallel: false,
            successCriteria: { engagementScore: 'gt 75', resultsAchieved: true }
          },
          {
            stageId: 'proposal_creation',
            stageName: 'Proposal Generation',
            order: 2,
            description: 'Generate personalized upgrade proposal',
            action: 'create_proposal',
            automationHook: 'generateUpgradeProposal',
            expectedDurationDays: 2,
            isParallel: false,
            successCriteria: { proposalCreated: true }
          },
          {
            stageId: 'outreach',
            stageName: 'Personalized Outreach',
            order: 3,
            description: 'Present upgrade opportunity to client',
            action: 'send_upgrade_offer',
            automationHook: 'sendUpgradeEmail',
            expectedDurationDays: 1,
            isParallel: false,
            successCriteria: { offerSent: true }
          },
          {
            stageId: 'sales_call',
            stageName: 'Strategy Call',
            order: 4,
            description: 'Schedule and conduct upgrade discussion',
            action: 'book_strategy_call',
            automationHook: 'scheduleStrategyCall',
            expectedDurationDays: 7,
            isParallel: false,
            successCriteria: { callScheduled: true }
          },
          {
            stageId: 'conversion',
            stageName: 'Upgrade Conversion',
            order: 5,
            description: 'Close upgrade deal',
            action: 'process_upgrade',
            automationHook: 'processUpgrade',
            expectedDurationDays: 3,
            isParallel: false,
            successCriteria: { upgraded: true, newPlanActive: true }
          }
        ])
      },

      // 5. Retention Rescue Workflow
      {
        workflowId: 'retentionRescue',
        workflowName: 'Retention Rescue',
        workflowCategory: 'retention',
        description: 'Identify at-risk clients and execute retention intervention',
        startTrigger: 'retention_signal',
        avgDurationDays: 14,
        relatedEntities: ['Organization', 'RetentionSignal', 'StrategyReview'],
        relatedAgents: ['retention_analyzer', 'success_coordinator'],
        automationHooks: ['analyzeRetentionRisk', 'createRetentionPlan', 'sendRetentionOffer'],
        successMetrics: {
          at_risk_identified: 'number of at-risk clients caught',
          retention_rate: 'percentage retained after intervention',
          win_back_revenue: 'revenue saved from churn prevention'
        },
        stages: JSON.stringify([
          {
            stageId: 'risk_detection',
            stageName: 'At-Risk Detection',
            order: 1,
            description: 'Identify clients showing churn signals',
            action: 'detect_retention_risk',
            automationHook: 'analyzeRetentionSignals',
            expectedDurationDays: 1,
            isParallel: false,
            successCriteria: { riskScore: 'gt 70' }
          },
          {
            stageId: 'root_cause',
            stageName: 'Root Cause Analysis',
            order: 2,
            description: 'Understand why client is at risk',
            action: 'analyze_root_cause',
            automationHook: 'generateRetentionInsight',
            expectedDurationDays: 2,
            isParallel: false,
            successCriteria: { issueIdentified: true }
          },
          {
            stageId: 'intervention_plan',
            stageName: 'Intervention Plan',
            order: 3,
            description: 'Create custom retention strategy',
            action: 'create_intervention_plan',
            automationHook: 'generateRetentionPlaybook',
            expectedDurationDays: 1,
            isParallel: false,
            successCriteria: { planCreated: true }
          },
          {
            stageId: 'executive_touch',
            stageName: 'Executive Touch',
            order: 4,
            description: 'Personal outreach from executive',
            action: 'schedule_executive_call',
            automationHook: 'bookExecutiveCall',
            expectedDurationDays: 3,
            isParallel: false,
            successCriteria: { callCompleted: true, commitmentReceived: true }
          },
          {
            stageId: 'support_boost',
            stageName: 'Support Boost',
            order: 5,
            description: 'Increase support and attention',
            action: 'increase_support_tier',
            automationHook: 'allocateSuccessResources',
            expectedDurationDays: 7,
            isParallel: false,
            successCriteria: { supportIncreased: true, clientSatisfied: true }
          }
        ])
      },

      // 6. Sales Pipeline Workflow
      {
        workflowId: 'salesPipeline',
        workflowName: 'Sales Pipeline',
        workflowCategory: 'sales_pipeline',
        description: 'Manage prospects from qualification through close',
        startTrigger: 'lead_qualified',
        avgDurationDays: 45,
        relatedEntities: ['SalesOpportunity', 'Proposal', 'DealRoom'],
        relatedAgents: ['sales_assistant', 'proposal_generator', 'demo_coordinator'],
        automationHooks: ['qualifyProspect', 'createDealRoom', 'scheduleDemo', 'sendProposal'],
        successMetrics: {
          pipeline_value: 'total opportunity value',
          win_rate: 'percentage of deals closed',
          sales_velocity: 'days from qualification to close'
        },
        stages: JSON.stringify([
          {
            stageId: 'qualification',
            stageName: 'Prospect Qualification',
            order: 1,
            description: 'Qualify inbound prospect',
            action: 'qualify_prospect',
            automationHook: 'sendQualificationEmail',
            expectedDurationDays: 3,
            isParallel: false,
            successCriteria: { qualified: true, budgetConfirmed: true }
          },
          {
            stageId: 'discovery',
            stageName: 'Discovery Call',
            order: 2,
            description: 'Discover prospect needs',
            action: 'schedule_discovery_call',
            automationHook: 'bookDiscoveryCall',
            expectedDurationDays: 5,
            isParallel: false,
            successCriteria: { callCompleted: true, needsIdentified: true }
          },
          {
            stageId: 'demo',
            stageName: 'Product Demo',
            order: 3,
            description: 'Demonstrate platform fit',
            action: 'schedule_demo',
            automationHook: 'launchDemoFlow',
            expectedDurationDays: 7,
            isParallel: false,
            successCriteria: { demoCompleted: true, engagementScore: 'gt 75' }
          },
          {
            stageId: 'proposal',
            stageName: 'Proposal & Pricing',
            order: 4,
            description: 'Send custom proposal',
            action: 'send_proposal',
            automationHook: 'generateProposal',
            expectedDurationDays: 3,
            isParallel: false,
            successCriteria: { proposalViewed: true }
          },
          {
            stageId: 'negotiation',
            stageName: 'Negotiation',
            order: 5,
            description: 'Handle objections and negotiate',
            action: 'schedule_negotiation',
            automationHook: 'sendNegotiationDocs',
            expectedDurationDays: 10,
            isParallel: false,
            successCriteria: { agreementReached: true }
          },
          {
            stageId: 'close',
            stageName: 'Contract & Close',
            order: 6,
            description: 'Execute contract',
            action: 'send_contract',
            automationHook: 'sendContractForSignature',
            expectedDurationDays: 5,
            isParallel: false,
            successCriteria: { contractSigned: true, paymentReceived: true }
          }
        ])
      },

      // 7. AI Content Production Workflow
      {
        workflowId: 'aiContentProduction',
        workflowName: 'AI Content Production',
        workflowCategory: 'content_production',
        description: 'Automated AI-driven content generation, enhancement, and publishing pipeline',
        startTrigger: 'scheduled_daily',
        avgDurationDays: 5,
        relatedEntities: ['ContentAsset', 'AIJobQueue', 'MediaAsset'],
        relatedAgents: ['content_generator', 'image_generator', 'video_generator', 'publishing_orchestrator'],
        automationHooks: ['generateContent', 'createAssets', 'qualityCheck', 'publishContent'],
        successMetrics: {
          daily_content: 'pieces generated per day',
          quality_score: 'avg AI quality assessment',
          publish_rate: 'percentage successfully published'
        },
        stages: JSON.stringify([
          {
            stageId: 'plan_generation',
            stageName: 'Content Plan Generation',
            order: 1,
            description: 'AI generates content plan from brief',
            action: 'generate_content_plan',
            automationHook: 'runContentPlanner',
            expectedDurationDays: 1,
            isParallel: false,
            successCriteria: { planGenerated: true, topicsIdentified: true }
          },
          {
            stageId: 'text_generation',
            stageName: 'Text Content Generation',
            order: 2,
            description: 'Generate blog posts, emails, social copy',
            action: 'generate_text_content',
            automationHook: 'runAIContentGenerator',
            expectedDurationDays: 1,
            isParallel: true,
            successCriteria: { contentCreated: true, wordCount: 'gt 500' }
          },
          {
            stageId: 'visual_generation',
            stageName: 'Visual Asset Creation',
            order: 2,
            description: 'Generate images and graphics',
            action: 'generate_visual_assets',
            automationHook: 'runImageGenerator',
            expectedDurationDays: 2,
            isParallel: true,
            successCriteria: { imagesCreated: true }
          },
          {
            stageId: 'quality_review',
            stageName: 'Quality & Brand Review',
            order: 3,
            description: 'AI quality check and brand alignment',
            action: 'review_content_quality',
            automationHook: 'runQualityCheck',
            expectedDurationDays: 1,
            isParallel: false,
            successCriteria: { qualityScore: 'gt 70', brandAligned: true }
          },
          {
            stageId: 'enhancement',
            stageName: 'Enhancement & Optimization',
            order: 4,
            description: 'Optimize for SEO, engagement, etc',
            action: 'enhance_content',
            automationHook: 'runContentOptimizer',
            expectedDurationDays: 1,
            isParallel: false,
            successCriteria: { optimized: true }
          },
          {
            stageId: 'publishing',
            stageName: 'Publishing & Distribution',
            order: 5,
            description: 'Publish across channels',
            action: 'publish_content',
            automationHook: 'runPublishingOrchestrator',
            expectedDurationDays: 1,
            isParallel: false,
            successCriteria: { published: true, distributedChannels: 'gt 1' }
          }
        ])
      }
    ];

    // Clear existing workflows
    const existing = await base44.asServiceRole.entities.WorkflowDefinition.list(
      '-workflowId',
      1000
    );

    for (const workflow of existing || []) {
      await base44.asServiceRole.entities.WorkflowDefinition.delete(workflow.id);
    }

    // Insert workflows
    const results = await base44.asServiceRole.entities.WorkflowDefinition.bulkCreate(
      workflows.map(w => ({
        ...w,
        createdAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString()
      }))
    );

    return Response.json({
      success: true,
      message: `Initialized ${results.length} workflows`,
      workflowsCreated: results.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});