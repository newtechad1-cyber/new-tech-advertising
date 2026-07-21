import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const base44 = createClientFromRequest(req);

  try {
    const { session_id, public_session_key } = await req.json();

    if (!session_id || !public_session_key) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
    if (!session || session.public_session_key !== public_session_key) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch all durable entries for the session
    // We assume < 500 for a single session, or we could paginate. For rebuild, we'll fetch up to 500.
    const allEntries = await base44.asServiceRole.entities.DiscoveryConversationEntry.list(
      'occurred_at', 
      500, 
      0, 
      { session_id }
    );

    // 2. We can clear or reset existing derived category data (interpreted_facts, conflicts, supporting_entry_ids).
    // Because updateDiscoveryCategory merges uniquely, we can just wipe them and re-run.
    const categories = await base44.asServiceRole.entities.DiscoveryCategory.filter({ session_id });
    for (const cat of categories) {
      await base44.asServiceRole.entities.DiscoveryCategory.update(cat.id, {
        interpreted_facts: [],
        conflicts: [],
        supporting_entry_ids: [],
        completion_state: 'not_started',
        uncertainty: ''
      });
    }

    // Also clear existing jobs so they can be re-run cleanly, or just bypass them.
    // For rebuild, we will just invoke `generateCategoryInterpretation` sequentially.
    for (const entry of allEntries) {
      // Create or reset the job
      const existingJobs = await base44.asServiceRole.entities.CategoryInterpretationJob.filter({
        session_id,
        entry_id: entry.id
      });
      if (existingJobs.length > 0) {
        await base44.asServiceRole.entities.CategoryInterpretationJob.delete(existingJobs[0].id);
      }

      await base44.asServiceRole.functions.invoke('generateCategoryInterpretation', {
        session_id,
        entry_id: entry.id
      });
    }

    return Response.json({ status: 'success', rebuilt_entries: allEntries.length });

  } catch (error) {
    return Response.json({ status: 'failed', error: 'Rebuild failed' }, { status: 500 });
  }
});