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

    await base44.asServiceRole.entities.Proposal.update(proposal_id, {
      views: newViews,
      last_viewed_date: now,
      status: 'viewed'
    });

    // Create notification for first view
    await base44.asServiceRole.entities.SalesNotification.create({
      title: newViews >= 2 ? '🔥 Proposal Viewed Again!' : '👀 Proposal Viewed',
      message: `Proposal "${proposal.title}" was just viewed (view #${newViews}).\n\nBusiness: ${proposal.business_name || 'N/A'}\nService: ${proposal.service_type}`,
      priority: newViews >= 2 ? 'urgent' : 'high',
      notification_type: 'proposal_viewed',
      related_proposal_id: proposal_id,
      status: 'unread'
    });

    // Email alert for every view
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'admin@nationaltelevisionads.com',
      subject: `👀 Proposal Viewed: ${proposal.title} (View #${newViews})`,
      body: `A proposal was just viewed!\n\nProposal: ${proposal.title}\nBusiness: ${proposal.business_name || 'N/A'}\nService: ${proposal.service_type}\nView Count: ${newViews}\nTime: ${new Date().toLocaleString()}`
    });

    return Response.json({ success: true, views: newViews });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});