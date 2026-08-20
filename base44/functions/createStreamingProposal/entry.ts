import { createClientFromRequest } from "npm:@base44/sdk@0.8.6";

function isAdminUser(user) {
  const adminEmails = String(Deno.env.get('ADMIN_EMAILS') || '')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(
    user &&
    (user.is_service === true ||
      user.role === 'admin' ||
      adminEmails.includes(String(user.email || '').toLowerCase()))
  );
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAdminUser(user)) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const data = body?.data;
    const leadActivityId = String(data?.entity_id || '').trim();
    
    if (!/^[A-Za-z0-9_-]{1,128}$/.test(leadActivityId)) {
      return Response.json({ error: "Invalid entity_id" }, { status: 400 });
    }

    const activity = await base44.asServiceRole.entities.LeadActivity.get(leadActivityId);
    
    if (!activity) {
      return Response.json({ error: "Activity not found" }, { status: 404 });
    }

    const metadata = typeof activity.metadata === "string" 
      ? JSON.parse(activity.metadata) 
      : activity.metadata;

    if (metadata?.service_type !== "streaming_tv") {
      return Response.json({ 
        message: "Not a streaming TV lead, skipping proposal creation" 
      });
    }

    const existingProposals = await base44.asServiceRole.entities.Proposal.filter({
      lead_id: activity.lead_id,
      service: "streaming_tv"
    });

    if (existingProposals && existingProposals.length > 0) {
      return Response.json({ 
        message: "Proposal already exists for this lead" 
      });
    }

    const proposal = await base44.asServiceRole.entities.Proposal.create({
      lead_id: activity.lead_id,
      service: "streaming_tv",
      status: "draft",
      budget_range: metadata?.monthly_budget_range || ""
    });

    await base44.asServiceRole.entities.LeadActivity.create({
      lead_id: activity.lead_id,
      activity_type: "email_sent",
      details: "Streaming TV proposal drafted",
      metadata: {
        event_type: "proposal_created",
        proposal_id: proposal.id
      }
    });

    return Response.json({ 
      success: true,
      proposal_id: proposal.id,
      message: "Streaming TV proposal created successfully"
    });

  } catch (error) {
    console.error("Error creating streaming proposal:", error);
    return Response.json({ 
      error: 'Unable to create streaming proposal'
    }, { status: 500 });
  }
});