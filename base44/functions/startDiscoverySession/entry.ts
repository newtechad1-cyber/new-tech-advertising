import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { mode = 'text' } = body;
    
    if (!['text', 'voice', 'mixed'].includes(mode)) {
      return Response.json({ error: 'Invalid mode' }, { status: 400 });
    }

    // Generate 32 cryptographically secure random bytes -> 64 hex chars
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const sessionKey = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const session = await base44.asServiceRole.entities.DiscoverySession.create({
      model_version: 1,
      public_session_key: sessionKey,
      mode,
      stage: 'your_goal',
      status: 'started',
      created_at: now.toISOString(),
      last_activity_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    });

    const categories = [
      'reason_for_conversation', 'owner_goals', 'stated_pain', 'present_process',
      'existing_tools_and_information', 'what_works_and_must_be_protected',
      'missing_or_disconnected_pieces', 'desired_improvement', 'growth_readiness',
      'operational_capacity', 'financial_considerations', 'nta_fit',
      'potential_first_priority', 'information_still_needed', 'promises_and_representations',
      'agreed_next_step'
    ];

    await base44.asServiceRole.entities.DiscoveryCategory.bulkCreate(
      categories.map(c => ({
        session_id: session.id,
        category_key: c,
        completion_state: 'not_started',
        updated_at: now.toISOString()
      }))
    );

    await base44.asServiceRole.entities.DiscoveryAuditEvent.create({
      session_id: session.id,
      event_type: 'created',
      actor_type: 'owner',
      occurred_at: now.toISOString(),
      target_record_type: 'DiscoverySession',
      target_record_id: session.id,
      reason: 'Session initialized',
      metadata: { mode }
    });

    // Return only the specified fields, hiding internal database structure
    return Response.json({
      session_id: session.id,
      public_session_key: sessionKey,
      mode: session.mode,
      stage: session.stage,
      status: session.status,
      expires_at: session.expires_at
    });
  } catch (error) {
    return Response.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
});