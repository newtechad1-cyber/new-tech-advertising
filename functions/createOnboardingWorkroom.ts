import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const TASK_TEMPLATES = {
  streaming_tv: [
    { title: 'Complete Campaign Intake Form', type: 'intake_form', visible: true, required: true },
    { title: 'Upload Logo & Brand Assets', type: 'asset_upload', visible: true, required: true },
    { title: 'Provide Service Area / ZIP Targets', type: 'questionnaire', visible: true, required: true },
    { title: 'Provide Offer / CTA', type: 'questionnaire', visible: true, required: true },
    { title: 'Upload Photos or Approve AI Creative', type: 'asset_upload', visible: true, required: true },
    { title: 'Kickoff Call', type: 'kickoff_call', visible: true, required: true },
    { title: 'Ad Account / Tracking Setup', type: 'ad_account_setup', visible: false, required: true },
    { title: 'First Script Approval', type: 'content_approval', visible: true, required: true },
    { title: 'Launch Approval', type: 'launch_check', visible: true, required: true },
  ],
  website_rebuild: [
    { title: 'Complete Website Intake Form', type: 'intake_form', visible: true, required: true },
    { title: 'Upload Logo & Brand Assets', type: 'asset_upload', visible: true, required: true },
    { title: 'Provide Service Pages', type: 'website_content', visible: true, required: true },
    { title: 'Provide Target Cities', type: 'questionnaire', visible: true, required: true },
    { title: 'Domain / DNS Access Request', type: 'access_request', visible: true, required: true },
    { title: 'Analytics / Search Console Setup', type: 'analytics_setup', visible: false, required: true },
    { title: 'Content Approval', type: 'content_approval', visible: true, required: true },
    { title: 'Accessibility Review', type: 'launch_check', visible: false, required: true },
    { title: 'Launch Approval', type: 'launch_check', visible: true, required: true },
  ],
  social_media: [
    { title: 'Complete Brand Questionnaire', type: 'questionnaire', visible: true, required: true },
    { title: 'Upload Logo & Visual Assets', type: 'asset_upload', visible: true, required: true },
    { title: 'Provide Services / Offers / Priorities', type: 'questionnaire', visible: true, required: true },
    { title: 'Connect Social Accounts', type: 'access_request', visible: true, required: true },
    { title: 'Kickoff Call', type: 'kickoff_call', visible: true, required: true },
    { title: 'First Content Batch Approval', type: 'content_approval', visible: true, required: true },
  ],
  local_seo: [
    { title: 'Complete Business Intake', type: 'intake_form', visible: true, required: true },
    { title: 'Upload Logo & Brand Assets', type: 'asset_upload', visible: true, required: true },
    { title: 'Provide Service Areas / Cities', type: 'seo_city_targeting', visible: true, required: true },
    { title: 'Google Business Profile Access', type: 'access_request', visible: true, required: true },
    { title: 'Analytics / Search Console Access', type: 'analytics_setup', visible: false, required: true },
    { title: 'Kickoff Call', type: 'kickoff_call', visible: true, required: true },
    { title: 'Content Approval', type: 'content_approval', visible: true, required: true },
  ],
  ada_rebuild: [
    { title: 'Complete Website Audit', type: 'intake_form', visible: true, required: true },
    { title: 'Domain / CMS Access', type: 'access_request', visible: true, required: true },
    { title: 'Provide Brand Guidelines', type: 'asset_upload', visible: true, required: true },
    { title: 'Accessibility Review Plan', type: 'launch_check', visible: false, required: true },
    { title: 'Kickoff Call', type: 'kickoff_call', visible: true, required: true },
    { title: 'Content Migration Approval', type: 'content_approval', visible: true, required: true },
    { title: 'Compliance Review', type: 'launch_check', visible: false, required: true },
  ],
  video_marketing: [
    { title: 'Complete Video Brief', type: 'questionnaire', visible: true, required: true },
    { title: 'Upload Brand Assets', type: 'asset_upload', visible: true, required: true },
    { title: 'Provide Script / Message', type: 'website_content', visible: true, required: true },
    { title: 'First Draft Review', type: 'content_approval', visible: true, required: true },
    { title: 'Final Approval & Publishing', type: 'launch_check', visible: true, required: true },
  ],
  general_marketing: [
    { title: 'Complete Business Intake', type: 'intake_form', visible: true, required: true },
    { title: 'Upload Logo & Brand Assets', type: 'asset_upload', visible: true, required: true },
    { title: 'Strategy Kickoff Call', type: 'kickoff_call', visible: true, required: true },
    { title: 'Initial Plan Approval', type: 'content_approval', visible: true, required: true },
  ],
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { proposal_id, onboarding_type } = body;

    if (!proposal_id || !onboarding_type) {
      return Response.json({ error: 'proposal_id and onboarding_type required' }, { status: 400 });
    }

    // Fetch proposal
    const proposals = await base44.asServiceRole.entities.Proposal.filter({ id: proposal_id });
    if (proposals.length === 0) {
      return Response.json({ error: 'Proposal not found' }, { status: 404 });
    }
    const proposal = proposals[0];

    // Check for existing workroom
    const existing = await base44.asServiceRole.entities.OnboardingWorkrooms.filter({
      proposal_id: proposal_id,
      status: { $ne: 'launched' },
    });
    if (existing.length > 0) {
      return Response.json({ success: false, workroom_id: existing[0].id, message: 'Workroom already exists' });
    }

    // Get current user for admin assignment
    const user = await base44.auth.me();

    // Create workroom
    const workroom = await base44.asServiceRole.entities.OnboardingWorkrooms.create({
      company_id: proposal.company_id,
      proposal_id: proposal_id,
      assigned_admin_user_id: user?.id || proposal.assigned_admin_user_id,
      title: `${proposal.business_name || 'Client'} Onboarding - ${proposal.title}`,
      onboarding_type: onboarding_type,
      status: 'not_started',
      progress_percent: 0,
    });

    // Create tasks from template
    const template = TASK_TEMPLATES[onboarding_type] || TASK_TEMPLATES.general_marketing;
    for (const taskTemplate of template) {
      await base44.asServiceRole.entities.OnboardingTasks.create({
        workroom_id: workroom.id,
        company_id: proposal.company_id,
        task_title: taskTemplate.title,
        task_type: taskTemplate.type,
        visible_to_client: taskTemplate.visible,
        required_for_launch: taskTemplate.required,
        status: 'pending',
        priority: taskTemplate.required ? 'high' : 'medium',
      });
    }

    // Create initial assets placeholders
    const assetTypes = ['logo', 'service_list', 'service_area'];
    for (const assetType of assetTypes) {
      await base44.asServiceRole.entities.OnboardingAssets.create({
        workroom_id: workroom.id,
        company_id: proposal.company_id,
        asset_type: assetType,
        asset_name: assetType.replace(/_/g, ' '),
        status: 'missing',
        visible_to_client: true,
      });
    }

    // Create initial forms
    const formTemplates = {
      streaming_tv: { type: 'streaming_tv_intake', title: 'Streaming TV Campaign Intake' },
      website_rebuild: { type: 'website_content_intake', title: 'Website Content Intake' },
      social_media: { type: 'brand_questionnaire', title: 'Brand Questionnaire' },
      local_seo: { type: 'business_intake', title: 'Business Intake Form' },
    };
    const formType = formTemplates[onboarding_type];
    if (formType) {
      await base44.asServiceRole.entities.OnboardingForms.create({
        workroom_id: workroom.id,
        company_id: proposal.company_id,
        form_type: formType.type,
        form_title: formType.title,
        form_schema: {},
        status: 'draft',
        visible_to_client: false,
      });
    }

    // Create admin task
    await base44.asServiceRole.entities.SalesTasks.create({
      task_title: `Begin client onboarding - ${proposal.business_name || proposal.title}`,
      task_type: 'check_in',
      proposal_id: proposal_id,
      company_name: proposal.business_name || '',
      priority: 'high',
      due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      status: 'pending',
      notes: `Onboarding workroom created. Access at /admin/onboarding/${workroom.id}`,
    });

    // Create notification
    await base44.asServiceRole.entities.SalesNotification.create({
      title: `🎯 New Onboarding Workroom — ${proposal.business_name}`,
      message: `Workroom created for ${proposal.title}.\n\nType: ${onboarding_type.replace(/_/g, ' ')}\nAccess: /admin/onboarding/${workroom.id}`,
      priority: 'high',
      notification_type: 'client_request',
      related_proposal_id: proposal_id,
      company_name: proposal.business_name || '',
      status: 'unread',
    });

    return Response.json({ success: true, workroom_id: workroom.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});