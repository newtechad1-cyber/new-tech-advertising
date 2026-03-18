import { createClientFromRequest } from "npm:@base44/sdk@0.8.6";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { data } = await req.json();

    const leadActivityId = data?.entity_id;
    
    if (!leadActivityId) {
      return Response.json({ error: "Missing entity_id" }, { status: 400 });
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
      error: error.message 
    }, { status: 500 });
  }
});