import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Seed baseline workflows and agent definitions
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Define baseline agents
    const agents = [
      {
        agent_key: 'videoTranscriptAgent',
        agent_name: 'Video Transcript',
        agent_category: 'Video Processing',
        description: 'Generates transcripts from video files',
        active: true,
        tenant_scope: 'universal',
        supported_contexts_json: JSON.stringify(['client', 'agency']),
        supported_task_types_json: JSON.stringify(['transcribe_video']),
        max_concurrency: 5,
        retry_policy_json: JSON.stringify({ max_retries: 3, backoff_ms: 1000, backoff_multiplier: 2 }),
        escalation_policy_json: JSON.stringify({ failure_threshold: 3, escalate_to_role: 'admin', timeout_minutes: 30 }),
      },
      {
        agent_key: 'videoCaptionAgent',
        agent_name: 'Video Caption Generator',
        agent_category: 'Video Processing',
        description: 'Generates captions from transcripts',
        active: true,
        tenant_scope: 'universal',
        supported_contexts_json: JSON.stringify(['client', 'agency']),
        supported_task_types_json: JSON.stringify(['generate_captions']),
        max_concurrency: 5,
      },
      {
        agent_key: 'videoBrandingAgent',
        agent_name: 'Video Branding',
        agent_category: 'Video Processing',
        description: 'Applies branding to video (logos, colors, overlays)',
        active: true,
        tenant_scope: 'universal',
        supported_contexts_json: JSON.stringify(['client', 'agency']),
        supported_task_types_json: JSON.stringify(['apply_branding']),
        max_concurrency: 3,
      },
      {
        agent_key: 'videoRenderAgent',
        agent_name: 'Video Renderer',
        agent_category: 'Video Processing',
        description: 'Renders final video output',
        active: true,
        tenant_scope: 'universal',
        supported_contexts_json: JSON.stringify(['client', 'agency']),
        supported_task_types_json: JSON.stringify(['render_video']),
        max_concurrency: 2,
      },
      {
        agent_key: 'publishingAgent',
        agent_name: 'Content Publisher',
        agent_category: 'Publishing',
        description: 'Publishes content to social platforms',
        active: true,
        tenant_scope: 'universal',
        supported_contexts_json: JSON.stringify(['client', 'agency']),
        supported_task_types_json: JSON.stringify(['publish_facebook', 'publish_instagram', 'publish_youtube', 'publish_tiktok']),
        max_concurrency: 10,
      },
      {
        agent_key: 'reportGeneratorAgent',
        agent_name: 'Report Generator',
        agent_category: 'Reporting',
        description: 'Aggregates metrics and generates performance reports',
        active: true,
        tenant_scope: 'universal',
        supported_contexts_json: JSON.stringify(['client', 'reseller', 'agency']),
        supported_task_types_json: JSON.stringify(['generate_report']),
        max_concurrency: 5,
      },
      {
        agent_key: 'clientOnboardingAgent',
        agent_name: 'Client Onboarding',
        agent_category: 'Onboarding',
        description: 'Orchestrates client onboarding workflow',
        active: true,
        tenant_scope: 'client',
        supported_contexts_json: JSON.stringify(['client']),
        supported_task_types_json: JSON.stringify(['onboard_client']),
        max_concurrency: 3,
      },
      {
        agent_key: 'resellerOnboardingAgent',
        agent_name: 'Reseller Onboarding',
        agent_category: 'Reseller Operations',
        description: 'Orchestrates reseller account setup',
        active: true,
        tenant_scope: 'reseller',
        supported_contexts_json: JSON.stringify(['reseller']),
        supported_task_types_json: JSON.stringify(['onboard_reseller']),
        max_concurrency: 2,
      },
      {
        agent_key: 'schoolMediaAgent',
        agent_name: 'School Media Processor',
        agent_category: 'School Media',
        description: 'Processes and publishes school media content',
        active: true,
        tenant_scope: 'school',
        supported_contexts_json: JSON.stringify(['school']),
        supported_task_types_json: JSON.stringify(['process_school_video']),
        max_concurrency: 4,
      },
    ];

    // Create agents
    for (const agent of agents) {
      try {
        await base44.entities.AgentDefinition.create(agent);
      } catch (e) {
        console.log('Agent already exists:', agent.agent_key);
      }
    }

    // Define baseline workflows
    const workflows = [
      {
        workflow_key: 'videoProductionWorkflow',
        workflow_name: 'Video Production',
        workflow_category: 'Content Creation',
        trigger_type: 'event-based',
        active: true,
        context_scope: 'client',
        step_definition_json: JSON.stringify([
          { step: 1, agent_key: 'videoTranscriptAgent', name: 'Transcribe', depends_on: [] },
          { step: 2, agent_key: 'videoCaptionAgent', name: 'Generate Captions', depends_on: [1] },
          { step: 3, agent_key: 'videoBrandingAgent', name: 'Apply Branding', depends_on: [2] },
          { step: 4, agent_key: 'videoRenderAgent', name: 'Render Video', depends_on: [3] },
        ]),
        description: 'Full video production workflow: transcript → captions → branding → render',
      },
      {
        workflow_key: 'publishingWorkflow',
        workflow_name: 'Content Publishing',
        workflow_category: 'Publishing',
        trigger_type: 'manual',
        active: true,
        context_scope: 'client',
        step_definition_json: JSON.stringify([
          { step: 1, agent_key: 'publishingAgent', name: 'Publish to Platforms', depends_on: [] },
        ]),
        description: 'Publishes content to Facebook, Instagram, YouTube, TikTok',
      },
      {
        workflow_key: 'reportingWorkflow',
        workflow_name: 'Performance Reporting',
        workflow_category: 'Reporting',
        trigger_type: 'scheduled',
        active: true,
        context_scope: 'client',
        step_definition_json: JSON.stringify([
          { step: 1, agent_key: 'reportGeneratorAgent', name: 'Generate Report', depends_on: [] },
        ]),
        description: 'Generates client performance reports',
      },
      {
        workflow_key: 'clientOnboardingWorkflow',
        workflow_name: 'Client Onboarding',
        workflow_category: 'Onboarding',
        trigger_type: 'event-based',
        active: true,
        context_scope: 'client',
        step_definition_json: JSON.stringify([
          { step: 1, agent_key: 'clientOnboardingAgent', name: 'Activate Portal', depends_on: [] },
          { step: 2, agent_key: 'clientOnboardingAgent', name: 'Setup Branding', depends_on: [1] },
          { step: 3, agent_key: 'clientOnboardingAgent', name: 'Connect Accounts', depends_on: [2] },
          { step: 4, agent_key: 'clientOnboardingAgent', name: 'Launch First Campaign', depends_on: [3] },
        ]),
        description: 'Orchestrates complete client onboarding process',
      },
      {
        workflow_key: 'resellerOnboardingWorkflow',
        workflow_name: 'Reseller Onboarding',
        workflow_category: 'Onboarding',
        trigger_type: 'event-based',
        active: true,
        context_scope: 'reseller',
        step_definition_json: JSON.stringify([
          { step: 1, agent_key: 'resellerOnboardingAgent', name: 'Create Account', depends_on: [] },
          { step: 2, agent_key: 'resellerOnboardingAgent', name: 'Brand Setup', depends_on: [1] },
          { step: 3, agent_key: 'resellerOnboardingAgent', name: 'Domain Setup', depends_on: [2] },
          { step: 4, agent_key: 'resellerOnboardingAgent', name: 'Go Live', depends_on: [3] },
        ]),
        description: 'Orchestrates reseller partner onboarding',
      },
      {
        workflow_key: 'schoolMediaWorkflow',
        workflow_name: 'School Media Processing',
        workflow_category: 'System Automation',
        trigger_type: 'event-based',
        active: true,
        context_scope: 'school',
        step_definition_json: JSON.stringify([
          { step: 1, agent_key: 'schoolMediaAgent', name: 'Process Media', depends_on: [] },
        ]),
        description: 'Processes and publishes school media content',
      },
    ];

    // Create workflows
    for (const workflow of workflows) {
      try {
        await base44.entities.AgentWorkflow.create(workflow);
      } catch (e) {
        console.log('Workflow already exists:', workflow.workflow_key);
      }
    }

    return Response.json({
      message: 'Workflows and agents seeded',
      agents_created: agents.length,
      workflows_created: workflows.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});