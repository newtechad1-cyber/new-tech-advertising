import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { action, token, proposal_id, viewer_name, viewer_email, section, time_spent } = body;

    // Find proposal by token or ID (no auth required — public endpoint)
    const findProposal = async () => {
      if (token) {
        const results = await base44.asServiceRole.entities.Proposal.filter({ public_token: token });
        return results[0] || null;
      }
      if (proposal_id) {
        const results = await base44.asServiceRole.entities.Proposal.list('-created_date', 500);
        return results.find(p => p.id === proposal_id) || null;
      }
      return null;
    };

    const proposal = await findProposal();

    if (!proposal) {
      return Response.json({ error: 'Proposal not found' }, { status: 404 });
    }

    const now = new Date().toISOString();

    // ── GET: return public-safe fields ──────────────────────────────────
    if (action === 'get') {
      const safe = [
        'id', 'title', 'business_name', 'service_type', 'status', 'expires_at',
        'executive_summary', 'problem_summary', 'solution_summary', 'deliverables',
        'timeline_summary', 'pricing_summary', 'faq_items', 'testimonial_blocks',
        'roi_inputs', 'roi_projection_summary', 'proposal_video_url', 'proposal_thumbnail_url',
        'monthly_fee', 'one_time_fee', 'contract_term', 'estimated_value',
        'cta_text', 'acceptance_terms', 'accepted_online', 'rejected_online',
        'last_action_taken', 'public_token', 'views',
      ];
      const safeProposal = {};
      safe.forEach(f => { if (proposal[f] !== undefined) safeProposal[f] = proposal[f]; });
      return Response.json({ success: true, proposal: safeProposal });
    }

    // ── VIEW: record engagement ─────────────────────────────────────────
    if (action === 'view') {
      const newViews = (proposal.views || 0) + 1;
      const updates = {
        views: newViews,
        view_session_count: (proposal.view_session_count || 0) + 1,
        last_viewed_date: now,
      };
      if (proposal.status === 'sent') {
        updates.status = 'viewed';
        updates.pipeline_stage = 'proposal_viewed';
      }
      if (viewer_name) updates.viewer_name = viewer_name;
      if (viewer_email) updates.viewer_email = viewer_email;
      await base44.asServiceRole.entities.Proposal.update(proposal.id, updates);

      if (!proposal.last_viewed_date) {
        await base44.asServiceRole.entities.SalesNotification.create({
          title: `👀 Proposal Opened — ${proposal.business_name || proposal.title}`,
          message: `"${proposal.title}" was opened for the first time.\n\nBusiness: ${proposal.business_name || 'N/A'}\nService: ${(proposal.service_type || '').replace(/_/g, ' ')}`,
          priority: 'high',
          notification_type: 'proposal_viewed',
          related_proposal_id: proposal.id,
          company_name: proposal.business_name || '',
          status: 'unread',
        });
      } else if (newViews === 3) {
        await base44.asServiceRole.entities.SalesNotification.create({
          title: `🔥 Hot Signal — Proposal Viewed ${newViews}x`,
          message: `"${proposal.title}" has been opened ${newViews} times — strong buying signal!\n\nBusiness: ${proposal.business_name || 'N/A'}`,
          priority: 'urgent',
          notification_type: 'proposal_viewed_multiple',
          related_proposal_id: proposal.id,
          company_name: proposal.business_name || '',
          status: 'unread',
        });
      }
      return Response.json({ success: true });
    }

    // ── SECTION VIEWED ─────────────────────────────────────────────────
    if (action === 'section_viewed') {
      const sections = (() => { try { return JSON.parse(proposal.sections_viewed || '{}'); } catch { return {}; } })();
      sections[section] = true;
      const upd = { sections_viewed: JSON.stringify(sections) };
      if (time_spent) upd.time_on_proposal_seconds = (proposal.time_on_proposal_seconds || 0) + time_spent;
      await base44.asServiceRole.entities.Proposal.update(proposal.id, upd);
      return Response.json({ success: true });
    }

    // ── ACCEPT ─────────────────────────────────────────────────────────
    if (action === 'accept') {
      await base44.asServiceRole.entities.Proposal.update(proposal.id, {
        status: 'accepted', pipeline_stage: 'won',
        accepted_at: now, accepted_online: true,
        last_action_taken: 'accepted_online',
        viewer_name: viewer_name || proposal.viewer_name,
        viewer_email: viewer_email || proposal.viewer_email,
      });
      await base44.asServiceRole.entities.SalesNotification.create({
        title: `🎉 PROPOSAL ACCEPTED — ${proposal.business_name || proposal.title}`,
        message: `"${proposal.title}" was approved online by ${viewer_name || 'the prospect'}!\n\nBusiness: ${proposal.business_name || 'N/A'}\nEmail: ${viewer_email || 'N/A'}\nValue: ${proposal.estimated_value ? '$' + Number(proposal.estimated_value).toLocaleString() : 'N/A'}`,
        priority: 'urgent',
        notification_type: 'proposal_viewed',
        related_proposal_id: proposal.id,
        company_name: proposal.business_name || '',
        contact_name: viewer_name || '',
        contact_email: viewer_email || '',
        status: 'unread',
      });
      await base44.asServiceRole.entities.SalesTasks.create({
        task_title: `Begin onboarding — ${proposal.business_name || proposal.title}`,
        task_type: 'check_in',
        proposal_id: proposal.id,
        company_name: proposal.business_name || '',
        priority: 'urgent',
        due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        status: 'pending',
        notes: `Proposal accepted online by ${viewer_name || 'prospect'} (${viewer_email || ''}). Start onboarding immediately.`,
      });

      // Auto-create onboarding workroom
      try {
        await base44.asServiceRole.functions.invoke('createOnboardingWorkroom', {
          proposal_id: proposal.id,
          onboarding_type: proposal.service_type || 'general_marketing',
        });
      } catch (e) {
        console.log('Workroom creation failed:', e.message);
      }

      return Response.json({ success: true });
    }

    // ── REVISION ───────────────────────────────────────────────────────
    if (action === 'revision') {
      await base44.asServiceRole.entities.Proposal.update(proposal.id, {
        status: 'negotiation', pipeline_stage: 'negotiation',
        last_action_taken: 'revision_requested',
        viewer_name: viewer_name || proposal.viewer_name,
        viewer_email: viewer_email || proposal.viewer_email,
      });
      await base44.asServiceRole.entities.SalesNotification.create({
        title: `✏️ Revisions Requested — ${proposal.business_name || proposal.title}`,
        message: `"${proposal.title}" — prospect requested revisions.\n\nFrom: ${viewer_name || 'Prospect'}\nEmail: ${viewer_email || 'N/A'}\nBusiness: ${proposal.business_name || 'N/A'}`,
        priority: 'high',
        notification_type: 'proposal_followup',
        related_proposal_id: proposal.id,
        company_name: proposal.business_name || '',
        contact_name: viewer_name || '', contact_email: viewer_email || '',
        status: 'unread',
      });
      await base44.asServiceRole.entities.SalesTasks.create({
        task_title: `Revise proposal — ${proposal.business_name || proposal.title}`,
        task_type: 'proposal_revision',
        proposal_id: proposal.id,
        company_name: proposal.business_name || '',
        priority: 'high',
        due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        status: 'pending',
        notes: `Revision requested by ${viewer_name || 'prospect'} (${viewer_email || ''}).`,
      });
      return Response.json({ success: true });
    }

    // ── CALL REQUEST ───────────────────────────────────────────────────
    if (action === 'call_request') {
      await base44.asServiceRole.entities.Proposal.update(proposal.id, {
        last_action_taken: 'call_requested',
        viewer_name: viewer_name || proposal.viewer_name,
        viewer_email: viewer_email || proposal.viewer_email,
      });
      await base44.asServiceRole.entities.SalesNotification.create({
        title: `📞 Call Requested — ${proposal.business_name || proposal.title}`,
        message: `Prospect wants to schedule a call.\n\nFrom: ${viewer_name || 'Prospect'}\nEmail: ${viewer_email || 'N/A'}\nBusiness: ${proposal.business_name || 'N/A'}\nProposal: "${proposal.title}"`,
        priority: 'urgent',
        notification_type: 'client_request',
        related_proposal_id: proposal.id,
        company_name: proposal.business_name || '',
        contact_name: viewer_name || '', contact_email: viewer_email || '',
        status: 'unread',
      });
      await base44.asServiceRole.entities.SalesTasks.create({
        task_title: `Call prospect about proposal — ${proposal.business_name || proposal.title}`,
        task_type: 'call',
        proposal_id: proposal.id,
        company_name: proposal.business_name || '',
        priority: 'urgent',
        due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        status: 'pending',
        notes: `${viewer_name || 'Prospect'} (${viewer_email || ''}) requested a call after viewing the proposal.`,
      });
      return Response.json({ success: true });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});