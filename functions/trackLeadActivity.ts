import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const SCORE_MAP = {
  guide_download: 5,
  demo_video_watch: 10,
  pricing_page_visit: 10,
  trial_started: 20,
  proposal_viewed: 25,
  page_view: 1,
  email_opened: 2,
  email_clicked: 3,
  form_submission: 5,
  quote_viewed: 8,
};

const HOT_THRESHOLD = 20;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { lead_id, activity_type, page_visited, content_downloaded, video_watched, details } = await req.json();

    if (!lead_id || !activity_type) {
      return Response.json({ error: 'lead_id and activity_type required' }, { status: 400 });
    }

    // Record activity
    await base44.asServiceRole.entities.LeadActivity.create({
      lead_id,
      activity_type,
      page_visited: page_visited || '',
      content_downloaded: content_downloaded || '',
      video_watched: video_watched || '',
      details: details || ''
    });

    // Get or create lead score
    const scores = await base44.asServiceRole.entities.LeadScore.filter({ lead_id });
    const increment = SCORE_MAP[activity_type] || 1;
    const now = new Date().toISOString();

    let leadScore;
    if (scores.length > 0) {
      const existing = scores[0];
      const newScore = (existing.score || 0) + increment;
      const newStatus = newScore >= HOT_THRESHOLD ? 'hot' : newScore >= 10 ? 'warm' : 'cold';
      leadScore = await base44.asServiceRole.entities.LeadScore.update(existing.id, {
        score: newScore,
        last_activity: now,
        status: newStatus
      });
      leadScore = { ...existing, score: newScore, status: newStatus };
    } else {
      const initScore = increment;
      const initStatus = initScore >= HOT_THRESHOLD ? 'hot' : initScore >= 10 ? 'warm' : 'cold';
      leadScore = await base44.asServiceRole.entities.LeadScore.create({
        lead_id,
        score: initScore,
        last_activity: now,
        status: initStatus
      });
    }

    // Trigger hot lead notification if threshold crossed
    if (leadScore.score >= HOT_THRESHOLD) {
      const leads = await base44.asServiceRole.entities.Lead.filter({ id: lead_id });
      if (leads.length > 0) {
        const lead = leads[0];

        // Check if we already sent a hot lead notification recently (avoid spam)
        const existingNotifs = await base44.asServiceRole.entities.SalesNotification.filter({
          related_lead_id: lead_id,
          notification_type: 'hot_lead',
          status: 'unread'
        });

        if (existingNotifs.length === 0) {
          await base44.asServiceRole.entities.SalesNotification.create({
            title: '🔥 Hot Lead Detected',
            message: `${lead.business_name} (${lead.city || 'Unknown City'}) has reached a lead score of ${leadScore.score}.\n\nService Interest: ${lead.service_interest || 'Not specified'}\nLast Activity: ${activity_type.replace(/_/g, ' ')}\nContact: ${lead.email}`,
            priority: 'urgent',
            notification_type: 'hot_lead',
            related_lead_id: lead_id,
            status: 'unread'
          });

          // Send email alert
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: 'admin@nationaltelevisionads.com',
            subject: `🔥 Hot Lead: ${lead.business_name} — Score ${leadScore.score}`,
            body: `Hot lead alert!\n\nBusiness: ${lead.business_name}\nCity: ${lead.city}\nService Interest: ${lead.service_interest}\nScore: ${leadScore.score}\nLast Activity: ${activity_type.replace(/_/g, ' ')}\nEmail: ${lead.email}`
          });
        }
      }
    }

    return Response.json({ success: true, score: leadScore.score, status: leadScore.status });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});