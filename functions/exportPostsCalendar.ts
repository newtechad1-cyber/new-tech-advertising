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
      business_profile_id,
      template_slug = 'base44-posting-calendar-csv',
    } = payload;

    if (!business_profile_id || post_ids.length === 0) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Load template
    const templates = await base44.entities.CalendarImportTemplate.filter({
      template_slug,
      active: true,
    });

    if (templates.length === 0) {
      return Response.json({ error: 'Template not found' }, { status: 404 });
    }

    const template = templates[0];
    const columnSchema = JSON.parse(template.column_schema);
    const columnMapping = JSON.parse(template.column_mapping);

    // Fetch business profile for slug
    const businessProfile = await base44.entities.BusinessProfile.get(business_profile_id);
    if (!businessProfile) {
      return Response.json({ error: 'Business profile not found' }, { status: 404 });
    }

    // Fetch posts
    const posts = [];
    for (const id of post_ids) {
      const post = await base44.entities.SocialPost.get(id);
      if (post) posts.push(post);
    }

    if (posts.length === 0) {
      return Response.json({ error: 'No posts found' }, { status: 400 });
    }

    // Generate CSV with template mapping
    const csvContent = generateCalendarCSV(
      posts,
      businessProfile,
      columnSchema,
      columnMapping
    );

    // Create export batch
    const exportBatch = await base44.entities.ContentExportBatch.create({
      business_profile_id,
      export_name: `Calendar Import - ${new Date().toISOString().split('T')[0]}`,
      export_type: 'selected_posts',
      file_format: 'csv',
      record_count: posts.length,
      generated_by: user.email,
      generated_at: new Date().toISOString(),
      status: 'ready',
      platforms_included: [...new Set(posts.map(p => p.platform))],
      social_post_ids: posts.map(p => p.id),
      notes: `Calendar import template: ${template_slug}`,
    });

    // Mark posts as exported
    for (const post of posts) {
      await base44.entities.SocialPost.update(post.id, {
        export_status: 'exported',
        export_batch_id: exportBatch.id,
        external_calendar_status: 'ready_for_import',
      });
    }

    const fileName = `nta-calendar-import-${businessProfile.business_slug}-${new Date().toISOString().split('T')[0]}.csv`;

    return Response.json({
      success: true,
      batch_id: exportBatch.id,
      file_name: fileName,
      record_count: posts.length,
      file_content: csvContent,
    });
  } catch (error) {
    console.error('[exportPostsCalendar] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function generateCalendarCSV(posts, businessProfile, columnSchema, columnMapping) {
  const headers = columnSchema.columns;

  const rows = posts.map((post) => {
    const row = {};
    for (const [csvCol, sourceField] of Object.entries(columnMapping)) {
      let value = '';

      if (sourceField === 'business_slug') {
        value = businessProfile.business_slug || '';
      } else if (sourceField.includes('hashtags')) {
        value = (post.hashtags || []).map(h => (h.startsWith('#') ? h : `#${h}`)).join(' ');
      } else if (sourceField === 'scheduled_date') {
        value = post.suggested_publish_date || '';
      } else if (sourceField === 'scheduled_time') {
        value = post.suggested_publish_time || '';
      } else if (sourceField === 'source_social_post_id') {
        value = post.id || '';
      } else if (sourceField === 'source_export_batch_id') {
        value = post.export_batch_id || '';
      } else if (post[sourceField] !== undefined) {
        value = post[sourceField] || '';
      }

      row[csvCol] = value;
    }
    return row;
  });

  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((col) => escapeCSVValue(String(row[col] || '')))
        .join(',')
    ),
  ].join('\n');

  return csv;
}

function escapeCSVValue(str) {
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}