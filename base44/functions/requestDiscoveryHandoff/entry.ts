
import { base44 } from '@base44/sdk';
import { authenticateSession } from '../discoveryAuthHelper/entry.ts';

export default async function(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { session_id, public_session_key, handoff_type, confirmed_summary_id, contact_preferences, suggested_follow_up_questions } = req.body;
  
  const auth = await authenticateSession(session_id, public_session_key);
  if (auth.error) return res.status(auth.status).json({ error: auth.error });
  const { session } = auth;
  const now = new Date().toISOString();

  const allowedTypes = ["schedule_growth_conversation", "call_nta", "request_callback", "continue_by_email", "receive_summary", "save_and_return"];
  if (!allowedTypes.includes(handoff_type)) return res.status(400).json({ error: 'Invalid handoff type' });

  let rickReviewState = 'not_requested';
  
  if (confirmed_summary_id) {
    const summary = await base44.asServiceRole.entities.DiscoveryConfirmedSummary.get(confirmed_summary_id);
    if (!summary || summary.session_id !== session_id) return res.status(404).json({ error: 'Confirmed summary not found' });
    if (summary.confirmation_state !== 'confirmed') return res.status(400).json({ error: 'Summary must be confirmed' });
    rickReviewState = 'needs_review';
  } else if (handoff_type === 'schedule_growth_conversation' || handoff_type === 'receive_summary') {
    return res.status(400).json({ error: `${handoff_type} requires a confirmed summary` });
  }

  let contactPreferenceId;
  if (contact_preferences) {
    const { preferred_channel, name, email, phone, best_time } = contact_preferences;
    if (!['phone', 'text_message', 'email', 'meeting'].includes(preferred_channel)) {
      return res.status(400).json({ error: 'Invalid preferred channel' });
    }
    
    // Check follow-up consent
    const followUpConsent = await base44.asServiceRole.entities.DiscoveryConsent.filter({ session_id, consent_type: 'personal_follow_up', state: 'granted' });
    const follow_up_consent_id = followUpConsent.length > 0 ? followUpConsent[0].id : undefined;

    const contactPref = await base44.asServiceRole.entities.DiscoveryContactPreference.create({
      session_id,
      preferred_channel,
      name: name ? String(name).substring(0, 100) : undefined,
      email: email ? String(email).substring(0, 200) : undefined,
      phone: phone ? String(phone).substring(0, 50) : undefined,
      best_time: best_time ? String(best_time).substring(0, 100) : undefined,
      follow_up_consent_id
    });
    contactPreferenceId = contactPref.id;
  } else if (['request_callback', 'continue_by_email', 'receive_summary'].includes(handoff_type)) {
    return res.status(400).json({ error: 'Contact preferences required for this handoff' });
  }

  const handoff = await base44.asServiceRole.entities.DiscoveryHandoff.create({
    session_id,
    handoff_type,
    requested_at: now,
    rick_review_state: rickReviewState,
    confirmed_summary_id,
    contact_preference_id: contactPreferenceId,
    suggested_follow_up_questions: Array.isArray(suggested_follow_up_questions) ? suggested_follow_up_questions.map(q => String(q).substring(0, 1000)) : []
  });

  await base44.asServiceRole.entities.DiscoverySession.update(session_id, {
    status: 'handoff_requested',
    last_activity_at: now
  });

  await base44.asServiceRole.entities.DiscoveryAuditEvent.create({
    session_id,
    event_type: 'status_changed',
    actor_type: 'owner',
    occurred_at: now,
    target_record_type: 'DiscoveryHandoff',
    target_record_id: handoff.id,
    metadata: { handoff_type }
  });

  return res.json(handoff);
}
