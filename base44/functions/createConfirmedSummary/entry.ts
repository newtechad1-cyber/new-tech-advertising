
import { base44 } from '@base44/sdk';
import { authenticateSession } from '../discoveryAuthHelper/entry.ts';

export default async function(req, res) {
  if (req.method !== 'POST' && req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const { session_id, public_session_key, action, summary_id, summary_data } = req.body;
  
  const auth = await authenticateSession(session_id, public_session_key);
  if (auth.error) return res.status(auth.status).json({ error: auth.error });
  const { session } = auth;
  const now = new Date().toISOString();

  if (action === 'create_draft' || action === 'update_draft') {
    if (!summary_data || typeof summary_data !== 'object') {
      return res.status(400).json({ error: 'Missing summary_data' });
    }
    
    // Explicitly select allowed fields
    const safeData = {
      why_owner_came: summary_data.why_owner_came ? String(summary_data.why_owner_came).substring(0, 5000) : '',
      owner_goal: summary_data.owner_goal ? String(summary_data.owner_goal).substring(0, 5000) : '',
      greatest_difficulty: summary_data.greatest_difficulty ? String(summary_data.greatest_difficulty).substring(0, 5000) : '',
      present_process: summary_data.present_process ? String(summary_data.present_process).substring(0, 5000) : '',
      what_is_working: summary_data.what_is_working ? String(summary_data.what_is_working).substring(0, 5000) : '',
      possibly_missing_or_disconnected: summary_data.possibly_missing_or_disconnected ? String(summary_data.possibly_missing_or_disconnected).substring(0, 5000) : '',
      desired_improvement: summary_data.desired_improvement ? String(summary_data.desired_improvement).substring(0, 5000) : '',
      readiness: summary_data.readiness ? String(summary_data.readiness).substring(0, 5000) : '',
      information_still_needed: summary_data.information_still_needed ? String(summary_data.information_still_needed).substring(0, 5000) : '',
    };

    if (summary_data.owner_corrections && Array.isArray(summary_data.owner_corrections)) {
      safeData.owner_corrections = summary_data.owner_corrections.map(c => String(c).substring(0, 1000));
    }

    if (action === 'create_draft') {
      const existing = await base44.asServiceRole.entities.DiscoveryConfirmedSummary.filter({ session_id });
      const version = existing.length + 1;
      
      const newSummary = await base44.asServiceRole.entities.DiscoveryConfirmedSummary.create({
        session_id,
        version,
        ...safeData,
        confirmation_state: 'draft',
        created_at: now
      });
      return res.json(newSummary);
    } else {
      if (!summary_id) return res.status(400).json({ error: 'Missing summary_id' });
      const existing = await base44.asServiceRole.entities.DiscoveryConfirmedSummary.get(summary_id);
      if (!existing || existing.session_id !== session_id) return res.status(404).json({ error: 'Summary not found' });
      if (existing.confirmation_state === 'confirmed') return res.status(400).json({ error: 'Cannot modify confirmed summary' });
      
      const updated = await base44.asServiceRole.entities.DiscoveryConfirmedSummary.update(summary_id, safeData);
      return res.json(updated);
    }
  }

  if (action === 'confirm') {
    if (!summary_id) return res.status(400).json({ error: 'Missing summary_id' });
    const existing = await base44.asServiceRole.entities.DiscoveryConfirmedSummary.get(summary_id);
    if (!existing || existing.session_id !== session_id) return res.status(404).json({ error: 'Summary not found' });
    if (existing.confirmation_state === 'confirmed') return res.status(400).json({ error: 'Already confirmed' });

    // Validate required fields
    const required = [
      'why_owner_came', 'owner_goal', 'greatest_difficulty', 'present_process',
      'what_is_working', 'possibly_missing_or_disconnected', 'desired_improvement',
      'readiness', 'information_still_needed'
    ];
    for (const field of required) {
      if (!existing[field]) return res.status(400).json({ error: `Missing required field: ${field}` });
    }

    const confirmed = await base44.asServiceRole.entities.DiscoveryConfirmedSummary.update(summary_id, {
      confirmation_state: 'confirmed',
      confirmed_at: now
    });

    await base44.asServiceRole.entities.DiscoverySession.update(session_id, {
      status: 'confirmed',
      confirmed_at: now,
      last_activity_at: now
    });

    await base44.asServiceRole.entities.DiscoveryAuditEvent.create({
      session_id,
      event_type: 'status_changed',
      actor_type: 'owner',
      occurred_at: now,
      target_record_type: 'DiscoveryConfirmedSummary',
      target_record_id: summary_id,
      metadata: { new_status: 'confirmed' }
    });

    return res.json(confirmed);
  }

  return res.status(400).json({ error: 'Invalid action' });
}
