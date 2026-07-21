import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { session_id, public_session_key, action, summary_data, summary_id } = body;

    // 1. Inline Session Authentication
    if (!session_id || !public_session_key) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let session;
    try {
      session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
    } catch (e) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session || session.public_session_key !== public_session_key) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (['deleted', 'expired', 'deletion_requested'].includes(session.status)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date().toISOString();

    // 2. Action: create_draft
    if (action === 'create_draft') {
      const draftableStatuses = ['started', 'in_progress', 'paused', 'summary_ready'];
      if (!draftableStatuses.includes(session.status)) {
        return Response.json({ error: 'Session is not accepting summary drafts' }, { status: 409 });
      }

      if (!summary_data || typeof summary_data !== 'object') {
        return Response.json({ error: 'Invalid summary data' }, { status: 400 });
      }

      // Explicitly select allowed fields
      const safeData = {
        why_owner_came: summary_data.why_owner_came ? String(summary_data.why_owner_came).substring(0, 5000) : '',
        owner_goal: summary_data.owner_goal ? String(summary_data.owner_goal).substring(0, 5000) : '',
        greatest_difficulty: summary_data.greatest_difficulty ? String(summary_data.greatest_difficulty).substring(0, 5000) : '',
        present_process: summary_data.present_process ? String(summary_data.present_process).substring(0, 5000) : '',
        what_is_working: summary_data.what_is_working ? String(summary_data.what_is_working).substring(0, 5000) : '',
        possibly_missing_or_disconnected: summary_data.possibly_missing_or_disconnected ? String(summary_data.possibly_missing_or_disconnected).substring(0, 5000) : '',
        desired_improvement: summary_data.desired_improvement ? String(summary_data.desired_improvement).substring(0, 5000) : '',
        readiness: summary_data.readiness ? String(summary_data.readiness).substring(0, 5000) : '',
        information_still_needed: summary_data.information_still_needed ? String(summary_data.information_still_needed).substring(0, 5000) : '',
        owner_corrections: Array.isArray(summary_data.owner_corrections) ? summary_data.owner_corrections.map((c: any) => String(c).substring(0, 1000)) : []
      };

      const existing = await base44.asServiceRole.entities.DiscoveryConfirmedSummary.filter({ session_id });
      const version = existing.length + 1;

      const newSummary = await base44.asServiceRole.entities.DiscoveryConfirmedSummary.create({
        session_id,
        version,
        ...safeData,
        confirmation_state: 'draft',
        created_at: now
      });

      await base44.asServiceRole.entities.DiscoverySession.update(session_id, {
        status: 'summary_ready',
        stage: 'review_what_we_heard',
        last_activity_at: now
      });

      return Response.json({
        id: newSummary.id,
        session_id: newSummary.session_id,
        version: newSummary.version,
        why_owner_came: newSummary.why_owner_came,
        owner_goal: newSummary.owner_goal,
        greatest_difficulty: newSummary.greatest_difficulty,
        present_process: newSummary.present_process,
        what_is_working: newSummary.what_is_working,
        possibly_missing_or_disconnected: newSummary.possibly_missing_or_disconnected,
        desired_improvement: newSummary.desired_improvement,
        readiness: newSummary.readiness,
        information_still_needed: newSummary.information_still_needed,
        owner_corrections: newSummary.owner_corrections,
        confirmation_state: newSummary.confirmation_state,
        created_at: newSummary.created_at
      });
    }

    // 3. Action: confirm_draft
    if (action === 'confirm_draft') {
      if (session.status !== 'summary_ready') {
        return Response.json({ error: 'Session is not ready for summary confirmation' }, { status: 409 });
      }

      if (!summary_id) {
        return Response.json({ error: 'Missing summary id' }, { status: 400 });
      }

      let existingSummary;
      try {
        existingSummary = await base44.asServiceRole.entities.DiscoveryConfirmedSummary.get(summary_id);
      } catch (e) {
        return Response.json({ error: 'Summary not found' }, { status: 404 });
      }
      
      // Verify existence and ownership
      if (!existingSummary || existingSummary.session_id !== session_id) {
        return Response.json({ error: 'Summary not found' }, { status: 404 });
      }

      if (existingSummary.confirmation_state !== 'draft') {
        return Response.json({ error: 'Only drafts can be confirmed' }, { status: 400 });
      }

      // Update the summary
      const confirmedSummary = await base44.asServiceRole.entities.DiscoveryConfirmedSummary.update(summary_id, {
        confirmation_state: 'confirmed',
        confirmed_at: now
      });

      // Update the session
      await base44.asServiceRole.entities.DiscoverySession.update(session_id, {
        status: 'confirmed',
        confirmed_at: now,
        last_activity_at: now
      });

      // Create Audit Event
      await base44.asServiceRole.entities.DiscoveryAuditEvent.create({
        session_id,
        event_type: 'status_changed',
        actor_type: 'owner',
        occurred_at: now,
        target_record_type: 'DiscoveryConfirmedSummary'
      });

      return Response.json({
        id: confirmedSummary.id,
        session_id: confirmedSummary.session_id,
        version: confirmedSummary.version,
        why_owner_came: confirmedSummary.why_owner_came,
        owner_goal: confirmedSummary.owner_goal,
        greatest_difficulty: confirmedSummary.greatest_difficulty,
        present_process: confirmedSummary.present_process,
        what_is_working: confirmedSummary.what_is_working,
        possibly_missing_or_disconnected: confirmedSummary.possibly_missing_or_disconnected,
        desired_improvement: confirmedSummary.desired_improvement,
        readiness: confirmedSummary.readiness,
        information_still_needed: confirmedSummary.information_still_needed,
        owner_corrections: confirmedSummary.owner_corrections,
        confirmation_state: confirmedSummary.confirmation_state,
        created_at: confirmedSummary.created_at,
        confirmed_at: confirmedSummary.confirmed_at
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});