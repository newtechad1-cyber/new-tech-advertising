import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Lead score increments per event type
const SCORE_MAP = {
  demo_start: 5,
  demo_overview: 5,
  demo_platform: 5,
  demo_examples: 5,
  demo_pricing: 20,
  deal_room_visit: 10,
  deal_room_pricing: 20,
  deal_room_proposal: 30,
  deal_room_roi: 15,
  deal_room_case_studies: 5,
  cta_start_trial: 25,
  cta_request_setup: 20,
  cta_book_call: 25,
  ai_question: 5,
  video_50: 10,
  video_85: 15,
  video_complete: 15,
};

// Status promotion logic (one-way, only upgrade)
const STATUS_ORDER = ['new', 'watching_demo', 'engaged', 'pricing_viewed', 'proposal_viewed', 'trial_started', 'booked_call', 'closed'];

function promoteStatus(current, event_type, score) {
  const idx = STATUS_ORDER.indexOf(current);
  let target = current;

  if (['demo_start', 'demo_overview', 'demo_platform', 'demo_examples'].includes(event_type)) {
    target = 'watching_demo';
  }
  if (score >= 30 && idx < STATUS_ORDER.indexOf('engaged')) {
    target = 'engaged';
  }
  if (['demo_pricing', 'deal_room_pricing'].includes(event_type)) {
    target = 'pricing_viewed';
  }
  if (event_type === 'deal_room_proposal') {
    target = 'proposal_viewed';
  }
  if (event_type === 'cta_start_trial') {
    target = 'trial_started';
  }
  if (event_type === 'cta_book_call') {
    target = 'booked_call';
  }

  // Only upgrade, never downgrade
  const targetIdx = STATUS_ORDER.indexOf(target);
  return targetIdx > idx ? target : current;
}

// Plan recommendation based on score and events
function recommendPlan(score, eventTypes) {
  const hasProposal = eventTypes.includes('deal_room_proposal');
  const hasROI = eventTypes.includes('deal_room_roi');
  const hasPricing = eventTypes.includes('deal_room_pricing') || eventTypes.includes('demo_pricing');

  if (score >= 80 || hasProposal || hasROI) return 'pro';
  if (score >= 40 || hasPricing) return 'growth';
  return 'starter';
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { event_type, page_path, session_key, prospect_id, metadata } = body;

    const now = new Date().toISOString();

    // 1. Find or create session
    let sessionId = null;
    if (session_key) {
      const sessions = await base44.asServiceRole.entities.SalesSessions.filter({ session_key });
      if (sessions.length > 0) {
        sessionId = sessions[0].id;
        const updates = { last_activity_at: now };
        if (['demo_pricing', 'deal_room_pricing'].includes(event_type)) {
          updates.pricing_views = (sessions[0].pricing_views || 0) + 1;
        }
        if (event_type === 'deal_room_proposal') {
          updates.proposal_views = (sessions[0].proposal_views || 0) + 1;
        }
        if (event_type === 'deal_room_roi') {
          updates.roi_uses = (sessions[0].roi_uses || 0) + 1;
        }
        if (event_type.startsWith('cta_')) {
          updates.cta_clicks = (sessions[0].cta_clicks || 0) + 1;
        }
        updates.page_count = (sessions[0].page_count || 0) + 1;
        await base44.asServiceRole.entities.SalesSessions.update(sessionId, updates);
      } else {
        const newSession = await base44.asServiceRole.entities.SalesSessions.create({
          session_key,
          started_at: now,
          last_activity_at: now,
          page_count: 1,
          session_source: metadata?.source || 'organic',
        });
        sessionId = newSession.id;
      }
    }

    // 2. Log the event
    await base44.asServiceRole.entities.SalesEvents.create({
      prospect_id: prospect_id || null,
      session_id: sessionId,
      event_type,
      page_path: page_path || '',
      metadata_json: metadata ? JSON.stringify(metadata) : null,
      created_at: now,
    });

    // 3. Update prospect lead score + status
    let updatedProspect = null;
    if (prospect_id) {
      const prospects = await base44.asServiceRole.entities.SalesProspects.filter({ id: prospect_id });
      if (prospects.length > 0) {
        const p = prospects[0];
        const increment = SCORE_MAP[event_type] || 0;
        const newScore = (p.lead_score || 0) + increment;

        // Get recent events for this prospect to inform plan recommendation
        const recentEvents = await base44.asServiceRole.entities.SalesEvents.filter({ prospect_id }, '-created_at', 50);
        const eventTypes = recentEvents.map(e => e.event_type);
        eventTypes.push(event_type);

        const newStatus = promoteStatus(p.status, event_type, newScore);
        const recommendedPlan = recommendPlan(newScore, eventTypes);

        await base44.asServiceRole.entities.SalesProspects.update(prospect_id, {
          lead_score: newScore,
          status: newStatus,
          recommended_plan: recommendedPlan,
          last_activity_at: now,
        });

        updatedProspect = { lead_score: newScore, status: newStatus, recommended_plan: recommendedPlan };

        // Link session to prospect if not already
        if (sessionId) {
          await base44.asServiceRole.entities.SalesSessions.update(sessionId, { prospect_id });
        }
      }
    }

    return Response.json({ success: true, session_id: sessionId, prospect: updatedProspect });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});