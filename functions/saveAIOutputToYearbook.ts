import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      ai_job_id, 
      ai_output_id, 
      yearbook_page_id,
      output_type, // 'yearbook_blurb' or 'captions'
    } = await req.json();

    if (!ai_job_id || !yearbook_page_id || !output_type) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch AI output
    const outputs = await base44.asServiceRole.entities.AIContentOutputs.filter({
      id: ai_output_id,
    });

    if (!outputs || outputs.length === 0) {
      return Response.json({ error: 'AI output not found' }, { status: 404 });
    }

    const output = outputs[0];

    // Get yearbook page
    const pages = await base44.asServiceRole.entities.YearbookPages.filter({
      id: yearbook_page_id,
    });

    if (!pages || pages.length === 0) {
      return Response.json({ error: 'Yearbook page not found' }, { status: 404 });
    }

    const page = pages[0];

    // Update page with AI content
    const updateData = {};

    if (output_type === 'yearbook_blurb') {
      updateData.ai_intro_job_id = ai_job_id;
      updateData.ai_intro_text = output.body;
      updateData.ai_intro_status = 'pending_review';
    } else if (output_type === 'captions') {
      updateData.ai_caption_job_id = ai_job_id;
      const captions = JSON.parse(output.caption_options || '[]');
      updateData.ai_caption_options = JSON.stringify(captions);
      updateData.ai_captions_status = 'pending_review';
    }

    updateData.ai_last_updated = new Date().toISOString();

    const updatedPage = await base44.asServiceRole.entities.YearbookPages.update(
      yearbook_page_id,
      updateData
    );

    return Response.json({
      success: true,
      page_id: page.id,
      output_type,
      updated: updatedPage,
    });
  } catch (error) {
    console.error('Save AI output to yearbook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});