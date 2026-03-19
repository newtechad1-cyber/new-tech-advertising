import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const SCORE_MAP = {
  page_view: 5,
  video_play: 5,
  video_complete: 10,
  question_asked: 5,
  cta_click: 25,
  form_submit: 20,
  roi_use: 15,
  proposal_view: 30,
};

const STEP_ORDER = ['DemoStart', 'DemoProblem', 'DemoPlatform', 'DemoFeatures', 'DemoExamples', 'DemoPricing', 'DemoNext'];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { interaction_type, page_path, session_key, prospect_id, asset_id, value, metadata } = await req.json();

    const now = new Date().toISOString();
    const scoreAdd = SCORE_MAP[interaction_type] || 0;

    // Ensure session exists
    let sessionId = null;
    if (session_key) {
      const existing = await base44.asServiceRole.entities.DemoSessions.filter({ session_key });
      if (existing.length > 0) {
        sessionId = existing[0].id;
        const stepIndex = STEP_ORDER.indexOf(page_path);
        const pct = stepIndex >= 0 ? Math.round(((stepIndex + 1) / STEP_ORDER.length) * 100) : existing[0].completion_percentage;
        await base44.asServiceRole.entities.DemoSessions.update(sessionId, {
          last_activity_at: now,
          current_step: page_path || existing[0].current_step,
          completion_percentage: Math.max(pct, existing[0].completion_percentage || 0),
          lead_score: Math.min((existing[0].lead_score || 0) + scoreAdd, 200),
          prospect_id: prospect_id || existing[0].prospect_id,
        });
      } else {
        const session = await base44.asServiceRole.entities.DemoSessions.create({
          session_key,
          started_at: now,
          last_activity_at: now,
          entry_page: page_path,
          current_step: page_path,
          lead_score: scoreAdd,
          prospect_id: prospect_id || null,
          completion_percentage: 0,
        });
        sessionId = session.id;
      }
    }

    // Record interaction
    await base44.asServiceRole.entities.DemoInteractions.create({
      interaction_type,
      page_path,
      asset_id: asset_id || null,
      value: value || null,
      metadata: metadata ? JSON.stringify(metadata) : null,
      prospect_id: prospect_id || null,
      demo_session_id: sessionId,
    });

    return Response.json({ success: true, session_id: sessionId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});