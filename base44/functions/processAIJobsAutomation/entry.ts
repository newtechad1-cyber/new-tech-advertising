import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const ASSET_PROMPTS = {
  blog: (ctx) => `Write a comprehensive, SEO-optimized blog article for a local business.
Client: ${ctx.client}
Topic: ${ctx.title}
Primary Keyword: ${ctx.primary_keyword || 'N/A'}
Market: ${ctx.market || 'N/A'}
Service: ${ctx.service_type || 'N/A'}
Notes: ${ctx.notes || 'N/A'}
Write a 700-900 word blog article in markdown with H2 subheadings, natural keyword use, and a local CTA at the end.`,

  landing_page: (ctx) => `Write a high-converting landing page for a local business service.
Client: ${ctx.client}, Topic: ${ctx.title}, Keyword: ${ctx.primary_keyword || 'N/A'}, Market: ${ctx.market || 'N/A'}, Service: ${ctx.service_type || 'N/A'}
Include: Hero headline, subheadline, 3 benefit blocks, social proof placeholder, and a strong CTA. Write in markdown.`,

  video_script: (ctx) => `Write a 60-90 second HeyGen video script for a local business.
Client: ${ctx.client}, Topic: ${ctx.title}, Keyword: ${ctx.primary_keyword || 'N/A'}
Format: [SCENE: description] followed by spoken text. Include hook, 3 key points, and CTA.`,

  social_series: (ctx) => `Write a 5-post social media series for Facebook and LinkedIn.
Client: ${ctx.client}, Topic: ${ctx.title}, Keyword: ${ctx.primary_keyword || 'N/A'}, Market: ${ctx.market || 'N/A'}
Format each post with POST 1:, POST 2: etc. Mix educational, promotional, and engagement posts.`,

  gbp_post: (ctx) => `Write 3 Google Business Profile posts for a local business.
Client: ${ctx.client}, Topic: ${ctx.title}, Keyword: ${ctx.primary_keyword || 'N/A'}, Market: ${ctx.market || 'N/A'}
Each post: 150-200 words, local focus, strong CTA. Label POST 1:, POST 2:, POST 3:.`,

  email: (ctx) => `Write a marketing email for a local business.
Client: ${ctx.client}, Topic: ${ctx.title}, Keyword: ${ctx.primary_keyword || 'N/A'}
Include: Subject line, preview text, body (300-400 words), and a CTA button label. Write in markdown.`,
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const jobId = body.data?.id || body.event?.entity_id;
    if (!jobId) return Response.json({ error: 'No job ID' }, { status: 400 });

    const job = await base44.asServiceRole.entities.AIJobs.get(jobId);
    if (!job) return Response.json({ error: 'Job not found' }, { status: 404 });
    if (job.status !== 'pending') return Response.json({ message: 'Job already processed', status: job.status });

    // Mark as processing
    await base44.asServiceRole.entities.AIJobs.update(jobId, { status: 'processing' });

    let promptInput = {};
    try { promptInput = JSON.parse(job.prompt_input || '{}'); } catch (_) {}

    const ctx = {
      client: job.client,
      title: job.topic_title,
      ...promptInput,
    };

    const promptFn = ASSET_PROMPTS[job.job_type];
    if (!promptFn) throw new Error(`Unknown job_type: ${job.job_type}`);

    const prompt = promptFn(ctx);
    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    const assetTitle = `${ctx.title} — ${job.job_type.replace('_', ' ')}`;

    // Save to ContentAssets
    const asset = await base44.asServiceRole.entities.ContentAssets.create({
      topic_id: job.topic_id,
      topic_title: job.topic_title,
      client: job.client,
      asset_type: job.job_type,
      title: assetTitle,
      content: result,
      status: 'ready_for_review',
    });

    // Mark job completed
    await base44.asServiceRole.entities.AIJobs.update(jobId, {
      status: 'completed',
      output_reference: asset.id,
      completed_at: new Date().toISOString(),
    });

    // Update topic status if all jobs for this topic are done
    const allJobs = await base44.asServiceRole.entities.AIJobs.filter({ topic_id: job.topic_id });
    const allDone = allJobs.every(j => j.id === jobId || j.status === 'completed');
    if (allDone) {
      await base44.asServiceRole.entities.ContentTopics.update(job.topic_id, { status: 'ready_for_review' });
    }

    return Response.json({ success: true, asset_id: asset.id });
  } catch (error) {
    // Mark job failed
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const jobId = body.data?.id || body.event?.entity_id;
    if (jobId) {
      await base44.asServiceRole.entities.AIJobs.update(jobId, {
        status: 'failed',
        error_message: error.message,
      }).catch(() => {});
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
});