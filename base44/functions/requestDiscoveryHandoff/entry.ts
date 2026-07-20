
import { base44 } from '@base44/sdk';

export default async function(req, res) {
  const { session_id, public_session_key, handoff_type, confirmed_summary_id, contact_info } = req.body;
  
  const session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
  if (!session || session.public_session_key !== public_session_key) return res.status(401).json({ error: 'Unauthorized' });

  const now = new Date().toISOString();
  
  if (['schedule_growth_conversation', 'call_nta'].includes(handoff_type) && !confirmed_summary_id) {
    return res.status(400).json({ error: 'Rick review must be grounded in a confirmed summary' });
  }

  let contact_pref_id = null;
  if (contact_info) {
    const pref = await base44.asServiceRole.entities.DiscoveryContactPreference.create({
      session_id,
      preferred_channel: contact_info.channel || 'email',
      name: contact_info.name,
      email: contact_info.email,
      phone: contact_info.phone
    });
    contact_pref_id = pref.id;
  }

  const handoff = await base44.asServiceRole.entities.DiscoveryHandoff.create({
    session_id,
    handoff_type,
    requested_at: now,
    confirmed_summary_id,
    contact_preference_id: contact_pref_id,
    rick_review_state: confirmed_summary_id ? 'needs_review' : 'not_requested'
  });

  await base44.asServiceRole.entities.DiscoverySession.update(session_id, { status: 'handoff_requested' });

  return res.json(handoff);
}
  