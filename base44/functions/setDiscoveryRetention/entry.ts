
import { base44 } from '@base44/sdk';
import { authenticateSession } from '../discoveryAuthHelper/entry.ts';

export default async function(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { session_id, public_session_key, target, action } = req.body;
  
  const auth = await authenticateSession(session_id, public_session_key);
  if (auth.error) return res.status(auth.status).json({ error: auth.error });
  const { session } = auth;
  
  if (!['raw_audio', 'working_transcript', 'working_discovery', 'confirmed_summary', 'relationship_record'].includes(target)) {
    return res.status(400).json({ error: 'Invalid target' });
  }

  if (!['delete', 'save'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  // If saving, verify consent
  if (action === 'save') {
    if (target === 'working_discovery') {
       const consents = await base44.asServiceRole.entities.DiscoveryConsent.filter({ session_id, consent_type: 'save_and_return', state: 'granted' });
       if (consents.length === 0) return res.status(403).json({ error: 'Consent required to save working discovery' });
    }
  }

  const now = new Date().toISOString();

  const instruction = await base44.asServiceRole.entities.DiscoveryRetentionInstruction.create({
    session_id,
    target,
    action,
    requested_by: 'owner',
    requested_at: now,
    status: 'pending' // Actual execution handled by the sweep
  });

  await base44.asServiceRole.entities.DiscoveryAuditEvent.create({
    session_id,
    event_type: 'retention_changed',
    actor_type: 'owner',
    occurred_at: now,
    target_record_type: 'DiscoveryRetentionInstruction',
    target_record_id: instruction.id,
    metadata: { target, action }
  });

  return res.json(instruction);
}
