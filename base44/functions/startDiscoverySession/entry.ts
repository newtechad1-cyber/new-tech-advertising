
import { base44 } from '@base44/sdk';
import crypto from 'crypto';

export default async function(req, res) {
  const { mode = 'text' } = req.body;
  if (!['text', 'voice', 'mixed'].includes(mode)) return res.status(400).json({ error: 'Invalid mode' });

  const sessionKey = crypto.randomBytes(32).toString('hex');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

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
  });

  return res.json({ session_id: session.id, public_session_key: sessionKey, expires_at: expiresAt.toISOString() });
}
  