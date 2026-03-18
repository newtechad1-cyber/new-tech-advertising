import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Entity automation: triggers when ContentTopics record is created
// Automatically starts content generation for the new topic

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const topic_id = payload?.event?.entity_id || payload?.data?.id;
    if (!topic_id) return Response.json({ error: 'No topic_id in payload' }, { status: 400 });

    // Kick off generation via the main function
    const res = await base44.asServiceRole.functions.invoke('generateContentFromTopic', { topic_id });

    return Response.json({ success: true, topic_id, result: res.data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});