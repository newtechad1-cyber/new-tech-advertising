import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { 
      session_id, 
      public_session_key, 
      category_id, 
      category_key, 
      completion_state, 
      owner_supported_facts, 
      supporting_entry_ids,
      interpreted_facts,
      uncertainty,
      conflicts
    } = body;

    // 1. Inline Session Authentication
    if (!session_id || !public_session_key || typeof session_id !== 'string' || typeof public_session_key !== 'string') {
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

    const answerableStatuses = ['started', 'in_progress', 'paused'];
    if (!answerableStatuses.includes(session.status)) {
      return Response.json({ error: 'Session is not accepting category updates' }, { status: 409 });
    }

    // 2. Fetch Category and Verify Ownership
    let category;
    if (category_id) {
      try {
        category = await base44.asServiceRole.entities.DiscoveryCategory.get(category_id);
      } catch (e) {
        return Response.json({ error: 'Not Found' }, { status: 404 });
      }
    } else if (category_key) {
      const cats = await base44.asServiceRole.entities.DiscoveryCategory.filter({ session_id, category_key });
      if (cats.length > 0) {
        category = cats[0];
      }
    }

    if (category && category.session_id !== session_id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Lazy create missing category
    if (!category && category_key) {
      const validCategoryKeys = [
        "reason_for_conversation", "owner_goals", "stated_pain", "present_process",
        "existing_tools_and_information", "what_works_and_must_be_protected",
        "missing_or_disconnected_pieces", "desired_improvement", "growth_readiness",
        "operational_capacity", "financial_considerations", "nta_fit",
        "potential_first_priority", "information_still_needed",
        "promises_and_representations", "agreed_next_step"
      ];
      
      if (!validCategoryKeys.includes(category_key)) {
        return Response.json({ error: 'Invalid category key' }, { status: 400 });
      }

      category = await base44.asServiceRole.entities.DiscoveryCategory.create({
        session_id,
        category_key,
        completion_state: 'not_started',
        updated_at: new Date().toISOString()
      });
    }

    if (!category) {
      return Response.json({ error: 'Category not found or created' }, { status: 404 });
    }

    // 3. Validations & Merging
    const validStates = ['not_started', 'in_progress', 'complete', 'not_yet_known'];
    let finalState = category.completion_state;
    if (completion_state) {
      if (validStates.includes(completion_state)) {
        finalState = completion_state;
      } else {
        return Response.json({ error: 'Invalid completion state' }, { status: 400 });
      }
    }

    let finalOwnerFacts = category.owner_supported_facts || [];
    if (owner_supported_facts !== undefined && Array.isArray(owner_supported_facts)) {
      finalOwnerFacts = owner_supported_facts.map(f => String(f).substring(0, 1000));
    }

    let finalSupportingEntries = new Set(category.supporting_entry_ids || []);
    if (supporting_entry_ids !== undefined && Array.isArray(supporting_entry_ids)) {
      supporting_entry_ids.forEach(id => finalSupportingEntries.add(String(id)));
    }

    // Merge Interpreted Facts uniquely
    let finalInterpretedFacts = category.interpreted_facts || [];
    if (interpreted_facts !== undefined && Array.isArray(interpreted_facts)) {
      interpreted_facts.forEach(newFact => {
        if (!newFact.statement) return;
        
        // Add evidence entry IDs to overall supporting entries
        if (Array.isArray(newFact.evidence_entry_ids)) {
          newFact.evidence_entry_ids.forEach((id: string) => finalSupportingEntries.add(String(id)));
        }

        // Avoid duplicating exact facts. Instead, append new evidence to existing facts if they match.
        const existingFact = finalInterpretedFacts.find((f: any) => f.statement === newFact.statement);
        if (existingFact) {
          const evidenceSet = new Set(existingFact.evidence_entry_ids || []);
          (newFact.evidence_entry_ids || []).forEach((id: string) => evidenceSet.add(String(id)));
          existingFact.evidence_entry_ids = Array.from(evidenceSet);
        } else {
          finalInterpretedFacts.push({
            statement: newFact.statement,
            evidence_entry_ids: Array.isArray(newFact.evidence_entry_ids) ? newFact.evidence_entry_ids : []
          });
        }
      });
    }

    let finalConflicts = category.conflicts || [];
    if (conflicts !== undefined && Array.isArray(conflicts)) {
      conflicts.forEach(newConflict => {
        if (!newConflict.statement) return;
        const existingConflict = finalConflicts.find((c: any) => c.statement === newConflict.statement);
        if (existingConflict) {
          const conflictSet = new Set(existingConflict.conflicting_entry_ids || []);
          (newConflict.conflicting_entry_ids || []).forEach((id: string) => conflictSet.add(String(id)));
          existingConflict.conflicting_entry_ids = Array.from(conflictSet);
        } else {
          finalConflicts.push({
            statement: newConflict.statement,
            conflicting_entry_ids: Array.isArray(newConflict.conflicting_entry_ids) ? newConflict.conflicting_entry_ids : []
          });
        }
      });
    }

    let finalUncertainty = uncertainty !== undefined ? uncertainty : category.uncertainty;

    // Verify supporting entries (optional check for new additions, but for speed we assume they exist if coming from internal flow. We can keep basic check if needed).
    const now = new Date().toISOString();

    // 4. Update the Category
    await base44.asServiceRole.entities.DiscoveryCategory.update(category.id, {
      completion_state: finalState,
      owner_supported_facts: finalOwnerFacts,
      supporting_entry_ids: Array.from(finalSupportingEntries),
      interpreted_facts: finalInterpretedFacts,
      uncertainty: finalUncertainty,
      conflicts: finalConflicts,
      updated_at: now
    });

    // 5. Update Parent Session
    await base44.asServiceRole.entities.DiscoverySession.update(session_id, { last_activity_at: now });

    // 6. Return Safe Fields
    return Response.json({
      id: category.id,
      session_id: category.session_id,
      category_key: category.category_key,
      completion_state: finalState,
      updated_at: now
    });

  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});