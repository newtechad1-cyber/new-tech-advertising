
import { base44 } from '@base44/sdk';

export default async function(req, res) {
  const { session_id, public_session_key, consent_type, state, affirmative_action, source, notice_version } = req.body;
  
  const session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
  if (!session || session.public_session_key !== public_session_key) return res.status(401).json({ error: 'Unauthorized' });

  const now = new Date().toISOString();

  if (state === 'granted' && (!affirmative_action)) {
    return res.status(400).json({ error: 'Granted consent requires affirmative action' });
  }

  const payload = {
    session_id,
    consent_type,
    state,
    affirmative_action,
    source,
    notice_version
  };

  if (state === 'granted') payload.captured_at = now;
  if (state === 'withdrawn') payload.withdrawn_at = now;

  const consent = await base44.asServiceRole.entities.DiscoveryConsent.create(payload);

  await base44.asServiceRole.entities.DiscoveryAuditEvent.create({
    session_id,
    event_type: 'consent_changed',
    actor_type: 'owner',
    occurred_at: now,
    target_record_type: 'DiscoveryConsent',
    target_record_id: consent.id
  });

  return res.json(consent);
}
  