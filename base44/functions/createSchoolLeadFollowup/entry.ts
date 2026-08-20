import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

function isAdminUser(user) {
  const adminEmails = String(Deno.env.get('ADMIN_EMAILS') || '')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(
    user &&
    (user.role === 'admin' || adminEmails.includes(String(user.email || '').toLowerCase()))
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
    const school_lead_id = String(body?.school_lead_id || '').trim();
    const days_until_followup = Number(body?.days_until_followup);
    const activity_type = String(body?.activity_type || '').trim();
    const activity_note = String(body?.activity_note || '').trim().slice(0, 2000);

    if (!/^[A-Za-z0-9_-]{1,128}$/.test(school_lead_id)) {
      return Response.json({ error: 'Invalid school_lead_id' }, { status: 400 });
    }
    if (!Number.isInteger(days_until_followup) || days_until_followup < 0 || days_until_followup > 365) {
      return Response.json({ error: 'Invalid follow-up interval' }, { status: 400 });
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
    console.error('[createSchoolLeadFollowup] failed:', error);
    return Response.json({ error: 'Unable to schedule follow-up' }, { status: 500 });
  }
});