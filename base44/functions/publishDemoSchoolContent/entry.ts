import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { content_id, publish } = await req.json();

    const updateData = {
      publish_status: publish ? 'published' : 'draft'
    };

    if (publish) {
      updateData.publish_date = new Date().toISOString();
    }

    await base44.asServiceRole.entities.DemoSchoolContent.update(content_id, updateData);

    return Response.json({
      success: true,
      message: `Content ${publish ? 'published' : 'unpublished'}`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});