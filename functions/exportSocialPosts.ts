import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    const {
      post_ids = [],
      export_type = 'selected_posts',
      file_format = 'csv',
      business_profile_id,
      weekly_marketing_plan_id,
      campaign_id,
    } = payload;

    if (!business_profile_id) {
      return Response.json({ error: 'business_profile_id required' }, { status: 400 });
    }

    if (post_ids.length === 0 && export_type === 'selected_posts') {
      return Response.json({ error: 'No posts selected for export' }, { status: 400 });
    }

    // Create export batch record
    const exportBatch = await base44.entities.ContentExportBatch.create({
      business_profile_id,
      export_name: `Export ${export_type} - ${new Date().toISOString().split('T')[0]}`,
      export_type,
      file_format,
      generated_by: user.email,
      generated_at: new Date().toISOString(),
      status: 'generating',
      weekly_marketing_plan_id,
      campaign_id,
      platforms_included: [],
    });

    // Fetch posts
    let posts = [];
    if (post_ids.length > 0) {
      for (const id of post_ids) {
        const post = await base44.entities.SocialPost.get(id);
        if (post) posts.push(post);
      }
    }

    if (posts.length === 0) {
      await base44.entities.ContentExportBatch.update(exportBatch.id, {
        status: 'failed',
        error_message: 'No valid posts found for export',
      });
      return Response.json({ error: 'No valid posts found' }, { status: 400 });
    }

    // Generate file content
    let fileContent;
    let fileName;
    const timestamp = new Date().toISOString().split('T')[0];
    const businessSlug = business_profile_id.substring(0, 8);

    if (file_format === 'csv') {
      fileContent = generateCSV(posts);
      fileName = `nta-social-posts-${businessSlug}-${timestamp}.csv`;
    } else if (file_format === 'json') {
      fileContent = JSON.stringify(posts, null, 2);
      fileName = `nta-social-posts-${businessSlug}-${timestamp}.json`;
    } else {
      throw new Error('Unsupported file format');
    }

    // Update export batch
    const platforms = [...new Set(posts.map(p => p.platform))];
    await base44.entities.ContentExportBatch.update(exportBatch.id, {
      status: 'ready',
      record_count: posts.length,
      platforms_included: platforms,
      social_post_ids: posts.map(p => p.id),
      file_url: `data:text/plain;base64,${btoa(fileContent)}`,
    });

    // Mark posts as exported
    for (const post of posts) {
      await base44.entities.SocialPost.update(post.id, {
        export_status: 'exported',
        export_batch_id: exportBatch.id,
      });
    }

    return Response.json({
      success: true,
      batch_id: exportBatch.id,
      file_name: fileName,
      record_count: posts.length,
      file_content: fileContent,
      file_format,
    });
  } catch (error) {
    console.error('[exportSocialPosts] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function generateCSV(posts) {
  const headers = [
    'business_name',
    'platform',
    'post_title',
    'post_type',
    'caption',
    'short_caption',
    'hashtags',
    'call_to_action',
    'destination_url',
    'image_url',
    'video_url',
    'suggested_publish_date',
    'suggested_publish_time',
    'timezone',
    'topic_cluster',
    'campaign_type',
    'offer_type',
    'audience_type',
    'source_page',
    'source_tool',
    'source_campaign',
    'scheduling_status',
    'export_batch_id',
    'notes',
  ];

  const rows = posts.map((post) => [
    post.business_name || '',
    post.platform || '',
    post.title || '',
    post.post_type || '',
    escapeCSV(post.caption || ''),
    escapeCSV(post.short_caption || ''),
    (post.hashtags || []).join(', '),
    escapeCSV(post.call_to_action || ''),
    post.destination_url || '',
    post.image_url || '',
    post.video_url || '',
    post.suggested_publish_date || '',
    post.suggested_publish_time || '',
    post.timezone || '',
    post.topic_cluster || '',
    post.campaign_type || '',
    post.offer_type || '',
    post.audience_type || '',
    post.source_page || '',
    post.source_tool || '',
    post.source_campaign || '',
    post.scheduling_status || '',
    post.export_batch_id || '',
    escapeCSV(post.notes || ''),
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csv;
}

function escapeCSV(str) {
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}