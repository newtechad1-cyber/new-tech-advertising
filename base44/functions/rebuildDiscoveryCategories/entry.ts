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

  const { session_id } = payload;
  if (!session_id) {
    return Response.json({ error: 'SESSION_NOT_FOUND' }, { status: 400 });
  }

  // 1. Determine staging target version
  const categories = await base44.asServiceRole.entities.DiscoveryCategory.filter({ session_id });
  let currentActiveVersion = 1;
  if (categories.length > 0) {
    currentActiveVersion = Math.max(...categories.map((c: any) => c.active_interpretation_version || 1));
  }
  
  const newVersion = currentActiveVersion + 1;

  // 2. Fetch all immutable evidence for the owner
  const allOwnerEntries = await base44.asServiceRole.entities.DiscoveryConversationEntry.filter(
    { session_id, speaker: 'owner' },
    'occurred_at',
    500
  );

  // 3. Staging process (Sequential processing into target interpretation_version)
  const workerUrl = new URL(`/api/functions/generateCategoryInterpretation`, req.url).href;
  
  for (const entry of allOwnerEntries) {
    const res = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${expectedToken}`
      },
      body: JSON.stringify({
        entry_id: entry.id,
        interpretation_version: newVersion
      })
    });
    
    // Fail closed: Any error halts promotion; the active view remains intact.
    if (!res.ok) {
      return Response.json({ error: 'REBUILD_FAILED_DURING_STAGING' }, { status: 500 });
    }
  }

  // 4. Atomic-equivalent promotion
  // Updates the active pointer on all categories sequentially.
  const updatedCategories = await base44.asServiceRole.entities.DiscoveryCategory.filter({ session_id });
  for (const cat of updatedCategories) {
    await base44.asServiceRole.entities.DiscoveryCategory.update(cat.id, {
      active_interpretation_version: newVersion,
      updated_at: new Date().toISOString()
    });
  }

  return Response.json({ 
    status: 'success', 
    promoted_version: newVersion, 
    rebuilt_entries: allOwnerEntries.length 
  });
});