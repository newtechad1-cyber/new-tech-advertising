import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { session_id, public_session_key, category_id, completion_state, owner_supported_facts, supporting_entry_ids } = body;

    // 1. Inline Session Authentication
    if (!session_id || !public_session_key || !category_id || typeof session_id !== 'string' || typeof public_session_key !== 'string') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let session;
    try {
      session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
    } catch (e) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session || session.public_session_key !== public_session_key) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (['deleted', 'expired', 'deletion_requested'].includes(session.status)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch Category and Verify Ownership
    let category;
    try {
      category = await base44.asServiceRole.entities.DiscoveryCategory.get(category_id);
    } catch (e) {
      return Response.json({ error: 'Not Found' }, { status: 404 });
    }

    if (!category || category.session_id !== session_id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 3. Validations
    const validStates = ['not_started', 'in_progress', 'complete', 'not_yet_known'];
    let finalState = category.completion_state;
    if (completion_state) {
      if (validStates.includes(completion_state)) {
        finalState = completion_state;
      } else {
        return Response.json({ error: 'Invalid completion state' }, { status: 400 });
      }
    }

    let finalFacts = category.owner_supported_facts || [];
    if (owner_supported_facts !== undefined) {
      if (!Array.isArray(owner_supported_facts) || owner_supported_facts.length > 50) {
        return Response.json({ error: 'Invalid owner_supported_facts' }, { status: 400 });
      }
      finalFacts = owner_supported_facts.map(f => String(f).substring(0, 1000));
    }

    let finalEntries = category.supporting_entry_ids || [];
    if (supporting_entry_ids !== undefined) {
      if (!Array.isArray(supporting_entry_ids) || supporting_entry_ids.length > 50) {
        return Response.json({ error: 'Invalid supporting_entry_ids' }, { status: 400 });
      }
      
      // Verify every supporting entry belongs to this session
      if (supporting_entry_ids.length > 0) {
        const entries = await base44.asServiceRole.entities.DiscoveryConversationEntry.filter({
          id: { $in: supporting_entry_ids }
        });
        
        if (entries.length !== supporting_entry_ids.length) {
          return Response.json({ error: 'Invalid or missing entry references' }, { status: 400 });
        }
        
        const allBelong = entries.every((e: any) => e.session_id === session_id);
        if (!allBelong) {
          return Response.json({ error: 'Unauthorized entry references' }, { status: 401 });
        }
      }
      finalEntries = supporting_entry_ids.map(id => String(id));
    }

    const now = new Date().toISOString();

    // 4. Update the Category
    await base44.asServiceRole.entities.DiscoveryCategory.update(category_id, {
      completion_state: finalState,
      owner_supported_facts: finalFacts,
      supporting_entry_ids: finalEntries,
      updated_at: now
    });

    // 5. Update Parent Session
    await base44.asServiceRole.entities.DiscoverySession.update(session_id, { last_activity_at: now });

    // 6. Return Safe Fields
    return Response.json({
      id: category.id,
      session_id: category.session_id,
      category_key: category.category_key,
      owner_supported_facts: finalFacts,
      supporting_entry_ids: finalEntries,
      completion_state: finalState,
      updated_at: now
    });

  } catch (error) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
});