
import { base44 } from '@base44/sdk';

export default async function(req, res) {
  const { session_id, public_session_key, summary_data, confirmation_state } = req.body;
  
  const session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
  if (!session || session.public_session_key !== public_session_key) return res.status(401).json({ error: 'Unauthorized' });

  const now = new Date().toISOString();

  if (confirmation_state === 'confirmed' && !summary_data.confirmed_at) {
    summary_data.confirmed_at = now;
  }

  const summary = await base44.asServiceRole.entities.DiscoveryConfirmedSummary.create({
    session_id,
    created_at: now,
    confirmation_state,
    ...summary_data
  });

  if (confirmation_state === 'confirmed') {
    await base44.asServiceRole.entities.DiscoverySession.update(session_id, { status: 'confirmed' });
    await base44.asServiceRole.entities.DiscoveryAuditEvent.create({
      session_id,
      event_type: 'status_changed',
      actor_type: 'owner',
      occurred_at: now,
      target_record_type: 'DiscoveryConfirmedSummary',
      target_record_id: summary.id
    });
  }

  return res.json(summary);
}
  