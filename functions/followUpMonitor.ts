import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const created = [];
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();

    // 1. Hot leads inactive for 3+ days
    const hotScores = await base44.asServiceRole.entities.LeadScore.filter({ status: 'hot' });
    for (const ls of hotScores) {
      if (ls.last_activity && ls.last_activity < threeDaysAgo) {
        const existing = await base44.asServiceRole.entities.SalesNotification.filter({
          related_lead_id: ls.lead_id,
          notification_type: 'followup_needed',
          status: 'unread'
        });
        if (existing.length === 0) {
          const leads = await base44.asServiceRole.entities.Lead.filter({ id: ls.lead_id });
          const lead = leads[0];
          if (lead) {
            await base44.asServiceRole.entities.SalesNotification.create({
              title: '⏰ Follow-Up Needed — Hot Lead Gone Cold',
              message: `${lead.business_name} was a hot lead (score: ${ls.score}) but has been inactive for 3+ days.\n\nContact: ${lead.email}\nCity: ${lead.city || 'N/A'}\nService: ${lead.service_interest || 'N/A'}`,
              priority: 'high',
              notification_type: 'followup_needed',
              related_lead_id: ls.lead_id,
              status: 'unread'
            });
            created.push(`followup: ${lead.business_name}`);
          }
        }
      }
    }

    // 2. Proposals sent 3+ days ago with no response (still "sent" status)
    const sentProposals = await base44.asServiceRole.entities.Proposal.filter({ status: 'sent' });
    for (const proposal of sentProposals) {
      if (proposal.sent_at && proposal.sent_at < threeDaysAgo) {
        const existing = await base44.asServiceRole.entities.SalesNotification.filter({
          related_proposal_id: proposal.id,
          notification_type: 'proposal_followup',
          status: 'unread'
        });
        if (existing.length === 0) {
          await base44.asServiceRole.entities.SalesNotification.create({
            title: '📄 Proposal Follow-Up Needed',
            message: `Proposal "${proposal.title}" (${proposal.business_name || 'Unknown'}) was sent 3+ days ago with no response.\n\nService: ${proposal.service_type}\nSent: ${new Date(proposal.sent_at).toLocaleDateString()}`,
            priority: 'high',
            notification_type: 'proposal_followup',
            related_proposal_id: proposal.id,
            status: 'unread'
          });
          created.push(`proposal followup: ${proposal.title}`);
        }
      }
    }

    // 3. Proposals viewed multiple times — high buying signal
    const viewedProposals = await base44.asServiceRole.entities.Proposal.filter({ status: 'viewed' });
    for (const proposal of viewedProposals) {
      if ((proposal.views || 0) >= 2) {
        const existing = await base44.asServiceRole.entities.SalesNotification.filter({
          related_proposal_id: proposal.id,
          notification_type: 'proposal_viewed',
          status: 'unread'
        });
        if (existing.length === 0) {
          await base44.asServiceRole.entities.SalesNotification.create({
            title: '👀 Proposal Viewed Multiple Times',
            message: `Proposal "${proposal.title}" has been viewed ${proposal.views} times — strong buying signal!\n\nBusiness: ${proposal.business_name || 'N/A'}\nService: ${proposal.service_type}\nLast Viewed: ${proposal.last_viewed_date ? new Date(proposal.last_viewed_date).toLocaleDateString() : 'Unknown'}`,
            priority: 'urgent',
            notification_type: 'proposal_viewed',
            related_proposal_id: proposal.id,
            status: 'unread'
          });
          created.push(`proposal multi-view: ${proposal.title}`);
        }
      }
    }

    // 4. Trials started but onboarding not completed
    const activeTrials = await base44.asServiceRole.entities.TrialAccount.filter({ trial_status: 'active' });
    for (const trial of activeTrials) {
      if (trial.onboarding_status !== 'ready_for_dashboard' && trial.created_date < threeDaysAgo) {
        const existing = await base44.asServiceRole.entities.SalesNotification.filter({
          related_trial_id: trial.id,
          notification_type: 'followup_needed',
          status: 'unread'
        });
        if (existing.length === 0) {
          await base44.asServiceRole.entities.SalesNotification.create({
            title: '🚀 Trial Onboarding Incomplete',
            message: `${trial.name} started a trial 3+ days ago but hasn't completed onboarding.\n\nIndustry: ${trial.industry}\nCity: ${trial.location_city}, ${trial.location_state}\nEmail: ${trial.email}\nOnboarding Status: ${trial.onboarding_status}`,
            priority: 'medium',
            notification_type: 'followup_needed',
            related_trial_id: trial.id,
            status: 'unread'
          });
          created.push(`trial onboarding: ${trial.name}`);
        }
      }
    }

    return Response.json({ success: true, notifications_created: created.length, details: created });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});