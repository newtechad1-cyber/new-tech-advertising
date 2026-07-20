
import { base44 } from '@base44/sdk';

export default async function(req, res) {
  const { session_id, public_session_key, category_id, completion_state, owner_supported_facts = [], supporting_entry_ids = [] } = req.body;
  
  const session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
  if (!session || session.public_session_key !== public_session_key) return res.status(401).json({ error: 'Unauthorized' });
  
  if (!['not_started', 'in_progress', 'complete', 'not_yet_known'].includes(completion_state)) {
    return res.status(400).json({ error: 'Invalid state' });
  }

  const cat = await base44.asServiceRole.entities.DiscoveryCategory.update(category_id, {
    completion_state,
    owner_supported_facts,
    supporting_entry_ids,
    updated_at: new Date().toISOString()
  });

  return res.json(cat);
}
  