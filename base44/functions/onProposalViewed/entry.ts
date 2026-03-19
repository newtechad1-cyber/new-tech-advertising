import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { proposal_id } = await req.json();

    if (!proposal_id) {
      return Response.json({ error: 'proposal_id required' }, { status: 400 });
    }

    const proposals = await base44.asServiceRole.entities.Proposal.filter({ id: proposal_id });
    if (proposals.length === 0) {
      return Response.json({ error: 'Proposal not found' }, { status: 404 });
    }

    const proposal = proposals[0];
    const newViews = (proposal.views || 0) + 1;
    const now = new Date().toISOString();
    const isRepeatView = newViews >= 2;

    // Update proposal — also advance pipeline stage if needed
    const pipelineUpdate = {};
    if (isRepeatView && proposal.pipeline_stage === 'proposal_sent') {
      pipelineUpdate.pipeline_stage = 'proposal_viewed';
    }
    await base44.asServiceRole.entities.Proposal.update(proposal_id, {
      views: newViews,
      last_viewed_date: now,
      status: 'viewed',
      ...pipelineUpdate,
    });

    // Determine notification type and priority
    const notifType = isRepeatView ? 'proposal_viewed_multiple' : 'proposal_viewed';
    const priority = isRepeatView ? 'urgent' : 'high';
    const title = isRepeatView
      ? `🔥 Proposal Viewed ${newViews}x — Strong Buying Signal`
      : `👀 Proposal Viewed — Follow Up Today`;

    // Always create a new notification per view (they are actionable events)
    await base44.asServiceRole.entities.SalesNotification.create({
      title,
      message: `"${proposal.title}" was viewed (total: ${newViews} views).\n\nBusiness: ${proposal.business_name || 'N/A'}\nService: ${proposal.service_type?.replace(/_/g, ' ')}\nValue: ${proposal.monthly_fee ? `$${proposal.monthly_fee}/mo` : 'N/A'}\nTime: ${new Date().toLocaleString()}\n\n${isRepeatView ? '⚡ Multiple views = high intent. Call or email now.' : 'Follow up within 24 hours while it\'s fresh.'}`,
      priority,
      notification_type: notifType,
      related_proposal_id: proposal_id,
      company_name: proposal.business_name || '',
      service_interest: proposal.service_type || '',
      status: 'unread',
    });

    // Record as lead activity if lead is attached
    if (proposal.opportunity_id || proposal.company_id) {
      try {
        const leads = await base44.asServiceRole.entities.Lead.filter({
          business_name: proposal.business_name,
        });
        if (leads[0]) {
          await base44.asServiceRole.entities.LeadActivity.create({
            lead_id: leads[0].id,
            activity_type: 'proposal_viewed',
            proposal_id,
            company_name: proposal.business_name || '',
            details: `View #${newViews} of proposal "${proposal.title}"`,
          });

          // Trigger lead scoring
          await base44.asServiceRole.functions.invoke('trackLeadActivity', {
            lead_id: leads[0].id,
            activity_type: isRepeatView ? 'proposal_viewed' : 'proposal_viewed',
            proposal_id,
            company_name: proposal.business_name || '',
            details: `View #${newViews}`,
          });
        }
      } catch (_) { /* non-critical */ }
    }

    // Auto-create urgent task when viewed 2+ times
    if (isRepeatView) {
      try {
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        // Check if an urgent call task already exists for this proposal
        const existingTasks = await base44.asServiceRole.entities.SalesTasks.filter({
          proposal_id,
          status: 'pending',
          task_type: 'call_client',
        });
        if (existingTasks.length === 0) {
          await base44.asServiceRole.entities.SalesTasks.create({
            task_title: `Call client about proposal — viewed ${newViews}x`,
            task_type: 'call_client',
            proposal_id,
            company_name: proposal.business_name || '',
            priority: 'urgent',
            due_date: tomorrow,
            status: 'pending',
            notes: `Proposal "${proposal.title}" has been viewed ${newViews} times. High intent — call today.`,
            alert_created: false,
          });
        }
      } catch (_) { /* non-critical */ }
    }

    // Email alert
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: 'admin@newtechadvertising.com',
        subject: `${isRepeatView ? '🔥' : '👀'} Proposal ${isRepeatView ? `Viewed ${newViews}x` : 'Viewed'}: ${proposal.title}`,
        body: `A proposal was just viewed!\n\nProposal: ${proposal.title}\nBusiness: ${proposal.business_name || 'N/A'}\nService: ${proposal.service_type}\nView Count: ${newViews}\nTime: ${new Date().toLocaleString()}\n\n${isRepeatView ? 'Multiple views is a strong buying signal — follow up NOW.' : 'Follow up within 24 hours.'}\n\nLog in to the admin dashboard: https://app.base44.com`,
      });
    } catch (_) { /* non-critical */ }

    return Response.json({ success: true, views: newViews, notification_created: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});