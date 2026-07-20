
import { base44 } from '@base44/sdk';
import { authenticateSession } from '../discoveryAuthHelper/entry.ts';

export default async function(req, res) {
  if (req.method !== 'POST' && req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const { session_id, public_session_key, category_id, completion_state, owner_supported_facts, supporting_entry_ids } = req.body;
  
  const auth = await authenticateSession(session_id, public_session_key);
  if (auth.error) return res.status(auth.status).json({ error: auth.error });
  const { session } = auth;
  
  if (!category_id) return res.status(400).json({ error: 'Missing category_id' });

  const category = await base44.asServiceRole.entities.DiscoveryCategory.get(category_id);
  if (!category || category.session_id !== session_id) {
    return res.status(404).json({ error: 'Category not found or access denied' });
  }

  // Validate state
  const allowedStates = ['not_started', 'in_progress', 'complete', 'not_yet_known'];
  if (completion_state && !allowedStates.includes(completion_state)) {
    return res.status(400).json({ error: 'Invalid completion state' });
  }

  // Validate entry ids belong to session
  if (supporting_entry_ids && Array.isArray(supporting_entry_ids) && supporting_entry_ids.length > 0) {
    for (const entryId of supporting_entry_ids) {
      const entry = await base44.asServiceRole.entities.DiscoveryConversationEntry.get(entryId);
      if (!entry || entry.session_id !== session_id) {
         return res.status(400).json({ error: 'Invalid supporting entry reference' });
      }
    }
  }

  const now = new Date().toISOString();
  
  // Note: AI observations are explicitly not updated here.
  
  const updateData = { updated_at: now };
  if (completion_state) updateData.completion_state = completion_state;
  if (owner_supported_facts && Array.isArray(owner_supported_facts)) {
    updateData.owner_supported_facts = owner_supported_facts.map(f => String(f).substring(0, 1000));
  }
  if (supporting_entry_ids && Array.isArray(supporting_entry_ids)) {
    updateData.supporting_entry_ids = supporting_entry_ids;
  }

  const updated = await base44.asServiceRole.entities.DiscoveryCategory.update(category_id, updateData);

  await base44.asServiceRole.entities.DiscoverySession.update(session_id, { last_activity_at: now });

  return res.json(updated);
}
