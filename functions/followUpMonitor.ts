import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const created = [];
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();

    // Helper: check if a notification of a given type/lead already exists unresolved
    const hasUnresolved = async (filters) => {
      const found = await base44.asServiceRole.entities.SalesNotification.filter({
        ...filters,
        status: 'unread',
      });
      return found.length > 0;
    };

    // ─── 1. HOT LEADS inactive for 3+ days ───────────────────────────────────
    const hotScores = await base44.asServiceRole.entities.LeadScore.filter({ status: 'hot' });
    for (const ls of hotScores) {
      if (ls.last_activity && ls.last_activity < threeDaysAgo) {
        const already = await hasUnresolved({ related_lead_id: ls.lead_id, notification_type: 'followup_needed' });
        if (!already) {
          const leads = await base44.asServiceRole.entities.Lead.filter({ id: ls.lead_id });
          const lead = leads[0];
          if (lead) {
            await base44.asServiceRole.entities.SalesNotification.create({
              title: '⏰ Hot Lead Gone Cold — Follow Up Now',
              message: `${lead.business_name} scored ${ls.score} points but hasn't been active for 3+ days.\n\nContact: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone || 'N/A'}\nService: ${lead.service_interest || 'N/A'}\nCity: ${lead.city || 'N/A'}`,
              priority: 'high',
              notification_type: 'followup_needed',
              related_lead_id: ls.lead_id,
              company_name: lead.business_name,
              contact_name: lead.name,
              contact_email: lead.email,
              service_interest: lead.service_interest || '',
              status: 'unread',
            });
            created.push(`cold-hot-lead: ${lead.business_name}`);
          }
        }
      }
    }

    // ─── 2. PROPOSALS sent 2+ days ago, never viewed ─────────────────────────
    const sentProposals = await base44.asServiceRole.entities.Proposal.filter({ status: 'sent' });
    for (const p of sentProposals) {
      const sentDate = p.sent_at || p.created_date;
      if (sentDate && sentDate < twoDaysAgo && !(p.views > 0)) {
        const already = await hasUnresolved({ related_proposal_id: p.id, notification_type: 'proposal_no_response' });
        if (!already) {
          await base44.asServiceRole.entities.SalesNotification.create({
            title: '📬 Proposal Not Opened — Resend or Call',
            message: `"${p.title}" was sent ${Math.floor((now - new Date(sentDate)) / 86400000)} days ago and has never been opened.\n\nBusiness: ${p.business_name || 'N/A'}\nService: ${p.service_type?.replace(/_/g, ' ')}\nSent: ${new Date(sentDate).toLocaleDateString()}\n\nConsider a follow-up call or re-sending.`,
            priority: 'high',
            notification_type: 'proposal_no_response',
            related_proposal_id: p.id,
            company_name: p.business_name || '',
            service_interest: p.service_type || '',
            status: 'unread',
          });
          created.push(`proposal-not-opened: ${p.title}`);
        }
      }
    }

    // ─── 3. PROPOSALS viewed but no response after 3 days ────────────────────
    const viewedProposals = await base44.asServiceRole.entities.Proposal.filter({ status: 'viewed' });
    for (const p of viewedProposals) {
      const viewedDate = p.last_viewed_date;
      if (viewedDate && viewedDate < threeDaysAgo) {
        const already = await hasUnresolved({ related_proposal_id: p.id, notification_type: 'proposal_followup' });
        if (!already) {
          await base44.asServiceRole.entities.SalesNotification.create({
            title: '📄 Proposal Viewed — No Reply in 3 Days',
            message: `"${p.title}" was viewed ${p.views || 1}x but no response in 3+ days.\n\nBusiness: ${p.business_name || 'N/A'}\nService: ${p.service_type?.replace(/_/g, ' ')}\nLast viewed: ${new Date(viewedDate).toLocaleDateString()}\nValue: ${p.monthly_fee ? `$${p.monthly_fee}/mo` : 'N/A'}\n\nReach out now — buyer may be comparing options.`,
            priority: 'urgent',
            notification_type: 'proposal_followup',
            related_proposal_id: p.id,
            company_name: p.business_name || '',
            service_interest: p.service_type || '',
            status: 'unread',
          });
          created.push(`proposal-no-reply: ${p.title}`);
        }
      }
    }

    // ─── 4. TRIALS started but onboarding incomplete after 2 days ────────────
    const activeTrials = await base44.asServiceRole.entities.TrialAccount.list('-created_date', 200);
    for (const trial of activeTrials) {
      const incomplete = trial.onboarding_status !== 'ready_for_dashboard' &&
                         trial.onboarding_status !== 'failed' &&
                         trial.trial_status !== 'draft';
      if (incomplete && trial.created_date && trial.created_date < twoDaysAgo) {
        const already = await hasUnresolved({ related_trial_id: trial.id, notification_type: 'trial_incomplete' });
        if (!already) {
          await base44.asServiceRole.entities.SalesNotification.create({
            title: '🚀 Trial Onboarding Stalled',
            message: `${trial.name} started a trial but hasn't finished onboarding (${trial.onboarding_status || 'pending'}).\n\nIndustry: ${trial.industry}\nCity: ${trial.location_city}, ${trial.location_state}\nEmail: ${trial.email}\nGoal: ${trial.primary_goal?.replace(/_/g, ' ') || 'N/A'}\n\nA personal check-in could convert this to a paid client.`,
            priority: 'medium',
            notification_type: 'trial_incomplete',
            related_trial_id: trial.id,
            company_name: trial.name,
            contact_name: trial.full_name || '',
            contact_email: trial.email,
            status: 'unread',
          });
          created.push(`trial-stalled: ${trial.name}`);
        }
      }
    }

    // ─── 5. HOT LEADS in CRM with no next_follow_up date set ─────────────────
    const hotLeads = await base44.asServiceRole.entities.Lead.filter({ status: 'qualified' });
    for (const lead of hotLeads) {
      if (!lead.next_follow_up) {
        const already = await hasUnresolved({ related_lead_id: lead.id, notification_type: 'followup_needed' });
        if (!already) {
          await base44.asServiceRole.entities.SalesNotification.create({
            title: '📋 Qualified Lead — No Follow-Up Scheduled',
            message: `${lead.business_name} is marked qualified but has no follow-up date.\n\nContact: ${lead.name}\nEmail: ${lead.email}\nService: ${lead.service_interest || 'N/A'}\nSource: ${lead.source || 'N/A'}`,
            priority: 'medium',
            notification_type: 'followup_needed',
            related_lead_id: lead.id,
            company_name: lead.business_name,
            contact_name: lead.name,
            contact_email: lead.email,
            service_interest: lead.service_interest || '',
            status: 'unread',
          });
          created.push(`no-followup-date: ${lead.business_name}`);
        }
      }
    }

    // ─── 6. Auto-resolve trial alerts for completed onboarding ───────────────
    const completedTrials = await base44.asServiceRole.entities.TrialAccount.filter({
      onboarding_status: 'ready_for_dashboard',
    });
    for (const trial of completedTrials) {
      const unresolvedAlerts = await base44.asServiceRole.entities.SalesNotification.filter({
        related_trial_id: trial.id,
        notification_type: 'trial_incomplete',
        status: 'unread',
      });
      for (const alert of unresolvedAlerts) {
        await base44.asServiceRole.entities.SalesNotification.update(alert.id, {
          status: 'resolved',
          resolved_date: new Date().toISOString(),
        });
      }
    }

    return Response.json({
      success: true,
      notifications_created: created.length,
      details: created,
      checked_at: now.toISOString(),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});