
import { base44 } from '@base44/sdk';
import { authenticateSession } from '../discoveryAuthHelper/entry.ts';

export default async function(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { session_id, public_session_key, consent_type, state, source, notice_version, affirmative_action } = req.body;
  
  const auth = await authenticateSession(session_id, public_session_key);
  if (auth.error) return res.status(auth.status).json({ error: auth.error });
  const { session } = auth;
  
  const allowedTypes = ["microphone", "transcription", "raw_audio_retention", "save_and_return", "personal_follow_up", "journal"];
  if (!allowedTypes.includes(consent_type)) return res.status(400).json({ error: 'Invalid consent type' });

  const allowedStates = ["not_asked", "granted", "declined", "withdrawn"];
  if (!allowedStates.includes(state)) return res.status(400).json({ error: 'Invalid state' });

  const allowedSources = ["website_text", "website_voice", "rick_recorded", "rick_written"];
  if (!allowedSources.includes(source)) return res.status(400).json({ error: 'Invalid source' });

  if (source === 'rick_recorded' || source === 'rick_written') {
    return res.status(403).json({ error: 'Public callers cannot assert Rick as source' });
  }
  
  if (!notice_version || typeof notice_version !== 'string') {
    return res.status(400).json({ error: 'Notice version required' });
  }

  const now = new Date().toISOString();
  
  const consentData = {
    session_id,
    consent_type,
    state,
    source,
    notice_version,
    affirmative_action: !!affirmative_action
  };

  if (state === 'granted') {
    if (!affirmative_action) return res.status(400).json({ error: 'Granted consent requires affirmative action' });
    consentData.captured_at = now;
  } else if (state === 'withdrawn') {
    consentData.withdrawn_at = now;
  }

  // Find if already exists
  const existing = await base44.asServiceRole.entities.DiscoveryConsent.filter({ session_id, consent_type });
  let consentRecord;
  if (existing.length > 0) {
    consentRecord = await base44.asServiceRole.entities.DiscoveryConsent.update(existing[0].id, consentData);
  } else {
    consentRecord = await base44.asServiceRole.entities.DiscoveryConsent.create(consentData);
  }

  await base44.asServiceRole.entities.DiscoveryAuditEvent.create({
    session_id,
    event_type: 'consent_changed',
    actor_type: 'owner',
    occurred_at: now,
    target_record_type: 'DiscoveryConsent',
    target_record_id: consentRecord.id,
    metadata: { consent_type, state }
  });

  await base44.asServiceRole.entities.DiscoverySession.update(session_id, { last_activity_at: now });

  return res.json(consentRecord);
}
