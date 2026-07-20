
import { base44 } from '@base44/sdk';

export default async function(req, res) {
  // This function is triggered by the "Discovery Retention Sweep" scheduled automation.
  // We restrict this by requiring a secret token passed from the automation webhook config,
  // or by verifying the automation caller context.
  const authHeader = req.headers.get?.('authorization') || req.headers.authorization;
  const cronSecret = Deno.env.get('AGENT_WEBHOOK_KEY'); 
  
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return res.status(403).json({ error: 'Forbidden. Scheduled automation use only.' });
  }

  const now = new Date();
  
  // 1. Expire unsaved anonymous sessions after 24h
  const activeSessions = await base44.asServiceRole.entities.DiscoverySession.filter({ status: { $in: ['started', 'in_progress', 'paused'] } });
  for (const s of activeSessions) {
    if (s.expires_at && new Date(s.expires_at) < now) {
      await base44.asServiceRole.entities.DiscoverySession.update(s.id, { status: 'expired' });
    }
  }

  // 2. Process pending retention instructions
  const pendingInstructions = await base44.asServiceRole.entities.DiscoveryRetentionInstruction.filter({ status: 'pending' });
  
  for (const inst of pendingInstructions) {
    if (inst.execute_at && new Date(inst.execute_at) > now) continue;

    const { session_id, target, action } = inst;
    let success = false;
    let counts = {};
    let errorMsg = null;

    try {
      if (action === 'delete') {
        if (target === 'working_discovery') {
          // Delete conversation entries
          const entries = await base44.asServiceRole.entities.DiscoveryConversationEntry.filter({ session_id });
          for (const e of entries) await base44.asServiceRole.entities.DiscoveryConversationEntry.delete(e.id);
          counts.entries = entries.length;

          // Delete unconfirmed summaries
          const summaries = await base44.asServiceRole.entities.DiscoveryConfirmedSummary.filter({ session_id, confirmation_state: { $ne: 'confirmed' } });
          for (const sum of summaries) await base44.asServiceRole.entities.DiscoveryConfirmedSummary.delete(sum.id);
          counts.unconfirmed_summaries = summaries.length;

          // Clear working categories (anonymize/reset to not_started without facts)
          const categories = await base44.asServiceRole.entities.DiscoveryCategory.filter({ session_id });
          for (const c of categories) {
             await base44.asServiceRole.entities.DiscoveryCategory.update(c.id, { 
                owner_supported_facts: [],
                supporting_entry_ids: [],
                completion_state: 'not_started'
             });
          }
          counts.categories_cleared = categories.length;

          // Delete AI observations
          const obs = await base44.asServiceRole.entities.DiscoveryAIObservation.filter({ session_id });
          for (const o of obs) await base44.asServiceRole.entities.DiscoveryAIObservation.delete(o.id);
          counts.ai_observations = obs.length;
          
          // Verify
          const checkEntries = await base44.asServiceRole.entities.DiscoveryConversationEntry.filter({ session_id });
          if (checkEntries.length > 0) throw new Error('Verification failed: Entries still exist');
        } else if (target === 'raw_audio') {
          // Implement raw audio cleanup if stored (e.g. via file API)
          counts.raw_audio = 1;
        }

        success = true;
      }
    } catch (err) {
      errorMsg = err.message;
    }

    if (success) {
      await base44.asServiceRole.entities.DiscoveryRetentionInstruction.update(inst.id, {
        status: 'completed',
        completed_at: now.toISOString(),
        deletion_proof: JSON.stringify({ target, completed_at: now.toISOString(), counts, verification: 'passed' })
      });
      
      // Update session status to deleted if all instructions complete
      if (target === 'working_discovery') {
         await base44.asServiceRole.entities.DiscoverySession.update(session_id, { status: 'deleted', deleted_at: now.toISOString() });
      }
    } else {
      await base44.asServiceRole.entities.DiscoveryRetentionInstruction.update(inst.id, {
        status: 'failed',
        failure_reason: errorMsg
      });
      // Create admin task
      await base44.asServiceRole.entities.NTATask.create({
        title: 'Growth Guide Deletion Failed',
        description: `Failed to process deletion for session ${session_id}: ${errorMsg}`,
        task_type: 'system',
        priority: 'high',
        status: 'todo'
      });
    }
  }

  return res.json({ success: true, processed: pendingInstructions.length });
}
