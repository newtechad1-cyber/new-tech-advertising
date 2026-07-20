import { base44 } from '@base44/sdk';
import { authenticateSession } from '../discoveryAuthHelper/entry.ts';

export default async function(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { session_id, public_session_key, text, speaker = 'owner', source_mode = 'text', corrects_entry_id, correction_reason } = req.body;
  
  const auth = await authenticateSession(session_id, public_session_key);
  if (auth.error) return res.status(auth.status).json({ error: auth.error });
  const { session } = auth;
  
  if (!text || typeof text !== 'string' || text.trim() === '' || text.length > 5000) {
    return res.status(400).json({ error: 'Invalid text payload' });
  }

  if (speaker !== 'owner') {
    return res.status(403).json({ error: 'Cannot impersonate restricted speakers' });
  }
  
  if (source_mode !== 'text' && source_mode !== 'voice_transcript') {
    return res.status(403).json({ error: 'Invalid source mode' });
  }
  
  if (source_mode === 'voice_transcript') {
    // Check transcription consent
    const consents = await base44.asServiceRole.entities.DiscoveryConsent.filter({ session_id, consent_type: 'transcription', state: 'granted' });
    if (consents.length === 0) {
      return res.status(403).json({ error: 'Transcription consent missing' });
    }
  }

  const now = new Date().toISOString();
  
  // Preserve correction history instead of silently overwriting
  if (corrects_entry_id) {
    // Verify it belongs to this session
    const oldEntry = await base44.asServiceRole.entities.DiscoveryConversationEntry.get(corrects_entry_id);
    if (!oldEntry || oldEntry.session_id !== session_id) {
      return res.status(400).json({ error: 'Invalid correction target' });
    }
    await base44.asServiceRole.entities.DiscoveryConversationEntry.update(corrects_entry_id, {
      superseded_at: now
    });
  }
  
  const entry = await base44.asServiceRole.entities.DiscoveryConversationEntry.create({
    session_id,
    speaker,
    text: text.trim(),
    source_mode,
    corrects_entry_id: corrects_entry_id || undefined,
    correction_reason: correction_reason || undefined,
    occurred_at: now
  });

  await base44.asServiceRole.entities.DiscoverySession.update(session_id, { last_activity_at: now });
  
  await base44.asServiceRole.entities.DiscoveryAuditEvent.create({
    session_id,
    event_type: corrects_entry_id ? 'corrected' : 'created',
    actor_type: 'owner',
    occurred_at: now,
    target_record_type: 'DiscoveryConversationEntry',
    target_record_id: entry.id,
  });

  return res.json(entry);
}