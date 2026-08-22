import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Point values per activity type
const POINTS = {
  guide_download: 5,
  demo_video_watch: 10,
  pricing_page_visit: 10,
  trial_started: 20,
  proposal_viewed: 25,
  proposal_viewed_again: 10,  // additional for repeat views
  form_submission: 10,
  client_request: 5,
  support_request: 5,
  call_request: 8,
};

function isAdminUser(user) {
  const adminEmails = String('' || '')
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
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin" && user.is_service !== true) {
      return Response.json({ error: "Admin access required" }, { status: 403 });
    }
    const isAdmin = isAdminUser(user);
    const body = await req.json().catch(() => ({}));

    const lead_id = String(body?.lead_id || '').trim();
    const activity_type = String(body?.activity_type || '').trim();
    const details = String(body?.details || '').slice(0, 2000);
    const page_visited = String(body?.page_visited || '').slice(0, 500);
    const content_downloaded = String(body?.content_downloaded || '').slice(0, 500);
    const video_watched = String(body?.video_watched || '').slice(0, 500);
    const proposal_id = body?.proposal_id ? String(body.proposal_id).trim() : '';
    const public_token = body?.public_token ? String(body.public_token).trim() : '';
    const company_name = String(body?.company_name || '').slice(0, 200);

    if (!/^[A-Za-z0-9_-]{1,128}$/.test(lead_id)) {
      return Response.json({ error: 'Invalid lead_id' }, { status: 400 });
    }
    if (!Object.prototype.hasOwnProperty.call(POINTS, activity_type)) {
      return Response.json({ error: 'Invalid activity_type' }, { status: 400 });
    }
    if (proposal_id && !/^[A-Za-z0-9_-]{1,128}$/.test(proposal_id)) {
      return Response.json({ error: 'Invalid proposal_id' }, { status: 400 });
    }

    // Internal callers use the signed-in admin context. The only public
    // capability is a matching proposal token for proposal engagement.
    if (!isAdmin) {
      if (!proposal_id || !/^[A-Za-z0-9_-]{8,256}$/.test(public_token)) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const proposals = await base44.asServiceRole.entities.Proposal.filter({
        id: proposal_id,
        public_token,
      });
      if (!proposals[0] || String(proposals[0].lead_id || '') !== lead_id) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // 1. Record the activity
    await base44.asServiceRole.entities.LeadActivity.create({
      lead_id,
      activity_type,
      details: details || '',
      page_visited: page_visited || '',
      content_downloaded: content_downloaded || '',
      video_watched: video_watched || '',
      proposal_id: proposal_id || null,
      company_name: company_name || '',
    });

    // 2. Look up or create LeadScore record
    const existing = await base44.asServiceRole.entities.LeadScore.filter({ lead_id });
    let scoreRecord = existing[0];
    let currentScore = scoreRecord?.score || 0;
    let wasAlreadyHot = scoreRecord?.status === 'hot';

    // Determine points for this activity
    let pointsToAdd = POINTS[activity_type] || 0;

    // Extra points for repeated proposal views
    if (activity_type === 'proposal_viewed' && currentScore > 0) {
      pointsToAdd += POINTS.proposal_viewed_again;
    }

    const newScore = currentScore + pointsToAdd;
    const newStatus = newScore >= 50 ? 'hot' : newScore >= 20 ? 'warm' : 'cold';
    const now = new Date().toISOString();

    // Parse/update score breakdown
    let breakdown = {};
    try { breakdown = JSON.parse(scoreRecord?.score_breakdown || '{}'); } catch {}
    breakdown[activity_type] = (breakdown[activity_type] || 0) + pointsToAdd;

    if (scoreRecord) {
      await base44.asServiceRole.entities.LeadScore.update(scoreRecord.id, {
        score: newScore,
        status: newStatus,
        last_activity: now,
        score_breakdown: JSON.stringify(breakdown),
        company_name: company_name || scoreRecord.company_name,
      });
    } else {
      await base44.asServiceRole.entities.LeadScore.create({
        lead_id,
        score: newScore,
        status: newStatus,
        last_activity: now,
        score_breakdown: JSON.stringify(breakdown),
        company_name: company_name || '',
        hot_notified: false,
      });
    }

    // 3. If newly hot (score crosses 20 for first time) → create hot lead notification
    const justBecameHot = newScore >= 20 && !wasAlreadyHot;
    const alreadyNotified = scoreRecord?.hot_notified;

    if (justBecameHot && !alreadyNotified) {
      // Get lead data
      const leads = await base44.asServiceRole.entities.Lead.filter({ id: lead_id });
      const lead = leads[0];

      await base44.asServiceRole.entities.SalesNotification.create({
        title: '🔥 Hot Lead Alert',
        message: `${lead?.business_name || company_name || 'A lead'} has reached a lead score of ${newScore}.\n\nActivity: ${activity_type.replace(/_/g, ' ')}\nContact: ${lead?.name || 'N/A'}\nEmail: ${lead?.email || 'N/A'}\nService: ${lead?.service_interest || 'N/A'}\nCity: ${lead?.city || 'N/A'}`,
        priority: 'urgent',
        notification_type: 'hot_lead',
        related_lead_id: lead_id,
        company_name: lead?.business_name || company_name || '',
        contact_name: lead?.name || '',
        contact_email: lead?.email || '',
        service_interest: lead?.service_interest || '',
        status: 'unread',
      });

      // Email alert
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: 'admin@newtechadvertising.com',
          subject: `🔥 Hot Lead: ${lead?.business_name || company_name} (Score: ${newScore})`,
          body: `A lead just hit hot status!\n\nBusiness: ${lead?.business_name || company_name}\nContact: ${lead?.name}\nEmail: ${lead?.email}\nScore: ${newScore}\nActivity: ${activity_type}\nService Interest: ${lead?.service_interest}\n\nLog in to the admin dashboard to follow up.`,
        });
      } catch (_) { /* non-critical */ }

      // Mark as notified
      const updated = await base44.asServiceRole.entities.LeadScore.filter({ lead_id });
      if (updated[0]) {
        await base44.asServiceRole.entities.LeadScore.update(updated[0].id, { hot_notified: true });
      }
    }

    return Response.json({
      success: true,
      score: newScore,
      status: newStatus,
      points_added: pointsToAdd,
      hot_alert_created: justBecameHot && !alreadyNotified,
    });
  } catch (error) {
    console.error('[trackLeadActivity] failed:', error);
    return Response.json({ error: 'Unable to record lead activity' }, { status: 500 });
  }
});