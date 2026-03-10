import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { school_lead_id, days_until_followup, activity_type, activity_note } = await req.json();

    if (!school_lead_id || !days_until_followup) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Fetch the lead
    const leads = await base44.entities.SchoolLeads.filter({ id: school_lead_id });
    if (leads.length === 0) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    const lead = leads[0];

    // Calculate next followup date
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + days_until_followup);

    // Update the lead
    await base44.entities.SchoolLeads.update(school_lead_id, {
      next_followup_date: nextDate.toISOString(),
      last_contact_date: new Date().toISOString(),
    });

    // Create activity record
    if (activity_type) {
      await base44.entities.SchoolOutreachActivity.create({
        school_lead_id,
        activity_type,
        activity_date: new Date().toISOString(),
        message: activity_note || `Scheduled followup for ${nextDate.toLocaleDateString()}`,
        response_status: 'pending',
      });
    }

    return Response.json({
      success: true,
      school_lead_id,
      next_followup_date: nextDate.toISOString(),
      days_until_followup,
      message: `Followup scheduled for ${nextDate.toLocaleDateString()} (${days_until_followup} days)`,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});