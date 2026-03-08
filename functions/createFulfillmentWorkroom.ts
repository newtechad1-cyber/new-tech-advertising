import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const FULFILLMENT_TEMPLATES = {
  streaming_tv: {
    tasks: [
      { title: 'Campaign Setup Review', type: 'campaign_setup', priority: 'high', required: true },
      { title: 'Audience & ZIP Targeting Review', type: 'campaign_optimization', priority: 'high', required: true },
      { title: 'Script Creation', type: 'video_script', priority: 'high', required: true },
      { title: 'Video Creative Production', type: 'video_production', priority: 'high', required: true },
      { title: 'Request Client Approval', type: 'client_approval', priority: 'high', required: true, visible_to_client: true },
      { title: 'Campaign Launch', type: 'campaign_setup', priority: 'high', required: true },
      { title: 'Monthly Performance Report', type: 'report_review', priority: 'medium', recurring: true },
      { title: 'Optimization Review', type: 'campaign_optimization', priority: 'medium', recurring: true },
    ],
    deliverables: [
      { type: 'ad_creative', title: 'Script Draft', approval_required: true },
      { type: 'video', title: 'Video Ad', approval_required: true },
      { type: 'report', title: 'Launch Summary', visible_to_client: true },
      { type: 'report', title: 'Monthly Performance Report', recurring: true, visible_to_client: true },
    ],
  },
  website_rebuild: {
    tasks: [
      { title: 'Page Production', type: 'website_edit', priority: 'high', required: true },
      { title: 'Content Revisions', type: 'website_edit', priority: 'high', required: true },
      { title: 'Accessibility Fixes', type: 'website_edit', priority: 'high', required: true },
      { title: 'SEO Page Creation', type: 'seo_page', priority: 'high', required: true },
      { title: 'Internal Review', type: 'website_edit', priority: 'high', required: true },
      { title: 'Request Client Approval', type: 'client_approval', priority: 'high', required: true, visible_to_client: true },
      { title: 'Publish Updates', type: 'website_edit', priority: 'high', required: true },
      { title: 'Monthly SEO Report', type: 'report_review', priority: 'medium', recurring: true },
    ],
    deliverables: [
      { type: 'website_update', title: 'New Page Drafts', approval_required: true },
      { type: 'website_update', title: 'Approved Pages', visible_to_client: true },
      { type: 'report', title: 'Accessibility Update Summary', visible_to_client: true },
      { type: 'report', title: 'Monthly SEO Report', recurring: true, visible_to_client: true },
    ],
  },
  social_media: {
    tasks: [
      { title: 'Monthly Content Plan', type: 'content_brief', priority: 'high', required: true },
      { title: 'Social Post Batch Creation', type: 'social_post_batch', priority: 'high', required: true },
      { title: 'Image Creation', type: 'social_post_batch', priority: 'high', required: true },
      { title: 'Video Script Creation', type: 'video_script', priority: 'medium', required: false },
      { title: 'Video Production', type: 'video_production', priority: 'medium', required: false },
      { title: 'Request Approval', type: 'client_approval', priority: 'high', required: true, visible_to_client: true },
      { title: 'Schedule Posts', type: 'campaign_setup', priority: 'high', required: true },
      { title: 'Monthly Recap', type: 'report_review', priority: 'medium', recurring: true },
    ],
    deliverables: [
      { type: 'social_post_set', title: 'Post Batch', approval_required: true },
      { type: 'video', title: 'Video Set', approval_required: false },
      { type: 'monthly_plan', title: 'Content Calendar', visible_to_client: true },
      { type: 'report', title: 'Monthly Recap Report', recurring: true, visible_to_client: true },
    ],
  },
  local_seo: {
    tasks: [
      { title: 'Keyword Research & Strategy', type: 'content_brief', priority: 'high', required: true },
      { title: 'SEO Page Creation', type: 'seo_page', priority: 'high', required: true },
      { title: 'Content Optimization', type: 'website_edit', priority: 'high', required: true },
      { title: 'Client Approval', type: 'client_approval', priority: 'high', required: true, visible_to_client: true },
      { title: 'Publish Pages', type: 'website_edit', priority: 'high', required: true },
      { title: 'Monthly SEO Report', type: 'report_review', priority: 'medium', recurring: true },
    ],
    deliverables: [
      { type: 'seo_page', title: 'SEO Pages', approval_required: true },
      { type: 'report', title: 'Monthly SEO Report', recurring: true, visible_to_client: true },
    ],
  },
  video_marketing: {
    tasks: [
      { title: 'Video Brief & Planning', type: 'content_brief', priority: 'high', required: true },
      { title: 'Script Writing', type: 'video_script', priority: 'high', required: true },
      { title: 'Script Approval', type: 'client_approval', priority: 'high', required: true, visible_to_client: true },
      { title: 'Video Production', type: 'video_production', priority: 'high', required: true },
      { title: 'Draft Review', type: 'client_approval', priority: 'high', required: true, visible_to_client: true },
      { title: 'Final Approval & Delivery', type: 'client_approval', priority: 'high', required: true, visible_to_client: true },
    ],
    deliverables: [
      { type: 'video', title: 'Final Video', approval_required: true, visible_to_client: true },
      { type: 'report', title: 'Video Performance Report', visible_to_client: true },
    ],
  },
  ada_rebuild: {
    tasks: [
      { title: 'Website Audit & Assessment', type: 'website_edit', priority: 'high', required: true },
      { title: 'Accessibility Fixes', type: 'website_edit', priority: 'high', required: true },
      { title: 'Content Updates', type: 'website_edit', priority: 'medium', required: true },
      { title: 'Internal Compliance Review', type: 'website_edit', priority: 'high', required: true },
      { title: 'Client Review', type: 'client_approval', priority: 'high', required: true, visible_to_client: true },
      { title: 'Publish Updates', type: 'website_edit', priority: 'high', required: true },
    ],
    deliverables: [
      { type: 'report', title: 'Audit Report', visible_to_client: true },
      { type: 'website_update', title: 'Accessibility Updates', approval_required: true, visible_to_client: true },
      { type: 'report', title: 'Compliance Certification', visible_to_client: true },
    ],
  },
  general: {
    tasks: [
      { title: 'Monthly Check-in', type: 'monthly_checkin', priority: 'medium', required: true },
      { title: 'Strategy Review', type: 'content_brief', priority: 'medium', required: false },
      { title: 'Deliverable Review', type: 'client_approval', priority: 'high', required: false, visible_to_client: true },
      { title: 'Monthly Reporting', type: 'report_review', priority: 'medium', recurring: true },
    ],
    deliverables: [
      { type: 'monthly_plan', title: 'Monthly Plan', visible_to_client: true },
      { type: 'report', title: 'Monthly Report', recurring: true, visible_to_client: true },
    ],
  },
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { onboarding_workroom_id, company_id, proposal_id, service_type, assigned_admin_user_id } = await req.json();

    if (!onboarding_workroom_id || !company_id || !service_type || !assigned_admin_user_id) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check for existing active fulfillment workroom
    const existing = await base44.asServiceRole.entities.FulfillmentWorkrooms.filter({
      company_id,
      service_type,
      status: 'active',
    });

    if (existing.length > 0) {
      return Response.json({ 
        warning: 'Active fulfillment workroom already exists', 
        workroom_id: existing[0].id 
      }, { status: 200 });
    }

    // Get company name for title
    const companies = await base44.asServiceRole.entities.Company.filter({ id: company_id });
    const companyName = companies[0]?.name || company_id;

    // Get proposal if available
    let proposal = null;
    if (proposal_id) {
      const proposals = await base44.asServiceRole.entities.Proposal.filter({ id: proposal_id });
      proposal = proposals[0];
    }

    // Create fulfillment workroom
    const workroomData = {
      company_id,
      onboarding_workroom_id,
      proposal_id: proposal_id || null,
      assigned_admin_user_id,
      title: `${companyName} - ${service_type} Fulfillment`,
      service_type,
      status: 'active',
      phase: 'setup',
      progress_percent: 0,
      billing_cycle: proposal?.monthly_fee ? 'monthly' : 'one_time',
      current_period_start: new Date().toISOString().split('T')[0],
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      next_delivery_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      next_review_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: `Created from onboarding completion. Service: ${service_type}`,
    };

    const workroom = await base44.asServiceRole.entities.FulfillmentWorkrooms.create(workroomData);

    // Get template
    const template = FULFILLMENT_TEMPLATES[service_type] || FULFILLMENT_TEMPLATES.general;

    // Create tasks
    const taskIds = [];
    for (const taskTemplate of template.tasks) {
      const task = await base44.asServiceRole.entities.FulfillmentTasks.create({
        workroom_id: workroom.id,
        company_id,
        task_title: taskTemplate.title,
        task_type: taskTemplate.type,
        description: `${taskTemplate.title} for ${service_type} fulfillment`,
        priority: taskTemplate.priority || 'medium',
        status: 'pending',
        recurring: taskTemplate.recurring || false,
        required_for_delivery: taskTemplate.required || false,
        visible_to_client: taskTemplate.visible_to_client || false,
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      taskIds.push(task.id);
    }

    // Create deliverables
    for (const delivTemplate of template.deliverables) {
      await base44.asServiceRole.entities.Deliverables.create({
        workroom_id: workroom.id,
        company_id,
        deliverable_type: delivTemplate.type,
        title: delivTemplate.title,
        description: `${delivTemplate.title} for ${service_type}`,
        visible_to_client: delivTemplate.visible_to_client !== false,
        approval_required: delivTemplate.approval_required || false,
        approval_status: 'draft',
      });
    }

    // Create admin notification
    await base44.asServiceRole.entities.SalesNotification.create({
      title: `🚀 Fulfillment Workroom Created — ${companyName}`,
      message: `New ${service_type} fulfillment workroom ready. ${template.tasks.length} initial tasks created.`,
      priority: 'high',
      notification_type: 'fulfillment_created',
      related_company_id: company_id,
      company_name: companyName,
      assigned_admin_user_id,
      status: 'unread',
    });

    return Response.json({
      success: true,
      workroom_id: workroom.id,
      tasks_created: taskIds.length,
      company_name: companyName,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});