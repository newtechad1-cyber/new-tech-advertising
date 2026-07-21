import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  const expectedToken = Deno.env.get('AGENT_WEBHOOK_KEY');
  const authHeader = req.headers.get('Authorization');
  
  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return Response.json({ error: 'AUTHORIZATION_FAILED' }, { status: 401 });
  }

  const base44 = createClientFromRequest(req);
  let payload;
  try {
    payload = await req.json();
  } catch (e) {
    return Response.json({ error: 'INVALID_PAYLOAD' }, { status: 400 });
  }

  const { session_id, category_key, completion_state, interpreted_facts, provenance_entry_id, interpretation_version } = payload;

  if (!session_id || !category_key || !provenance_entry_id || !interpretation_version) {
    return Response.json({ error: 'MISSING_PARAMETERS' }, { status: 400 });
  }

  let category;
  const cats = await base44.asServiceRole.entities.DiscoveryCategory.filter({ session_id, category_key });
  if (cats.length > 0) {
    category = cats[0];
  } else {
    category = await base44.asServiceRole.entities.DiscoveryCategory.create({
      session_id, 
      category_key, 
      completion_state: 'not_started',
      active_interpretation_version: 1,
      interpreted_facts: [],
      owner_supported_facts: [],
      updated_at: new Date().toISOString()
    });
  }

  // Provenance-based fact replacement
  let newFacts = category.interpreted_facts || [];
  
  // Remove previously generated facts tied to THIS entry for THIS interpretation version
  newFacts = newFacts.filter((f: any) => 
    !(f.provenance_entry_id === provenance_entry_id && f.interpretation_version === interpretation_version)
  );

  if (Array.isArray(interpreted_facts)) {
    newFacts.push(...interpreted_facts);
  }

  await base44.asServiceRole.entities.DiscoveryCategory.update(category.id, {
    completion_state: completion_state || category.completion_state,
    interpreted_facts: newFacts,
    updated_at: new Date().toISOString()
  });

  return Response.json({ status: 'success' });
});