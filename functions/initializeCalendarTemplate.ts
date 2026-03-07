import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Check if template already exists
    const existing = await base44.entities.CalendarImportTemplate.filter({
      template_slug: 'base44-posting-calendar-csv',
    });

    if (existing.length > 0) {
      return Response.json({ message: 'Template already exists', template: existing[0] });
    }

    // Define canonical schema
    const columnSchema = {
      columns: [
        'business_slug',
        'platform',
        'post_title',
        'post_type',
        'caption',
        'hashtags',
        'call_to_action',
        'destination_url',
        'image_url',
        'video_url',
        'scheduled_date',
        'scheduled_time',
        'timezone',
        'topic_cluster',
        'campaign_type',
        'offer_type',
        'audience_type',
        'source_page',
        'source_tool',
        'source_campaign',
        'source_social_post_id',
        'source_export_batch_id',
        'notes',
      ],
    };

    // Define column mapping
    const columnMapping = {
      business_slug: 'business_slug',
      platform: 'platform',
      post_title: 'title',
      post_type: 'post_type',
      caption: 'caption',
      hashtags: 'hashtags',
      call_to_action: 'call_to_action',
      destination_url: 'destination_url',
      image_url: 'image_url',
      video_url: 'video_url',
      scheduled_date: 'suggested_publish_date',
      scheduled_time: 'suggested_publish_time',
      timezone: 'timezone',
      topic_cluster: 'topic_cluster',
      campaign_type: 'campaign_type',
      offer_type: 'offer_type',
      audience_type: 'audience_type',
      source_page: 'source_page',
      source_tool: 'source_tool',
      source_campaign: 'source_campaign',
      source_social_post_id: 'id',
      source_export_batch_id: 'export_batch_id',
      notes: 'notes',
    };

    const requiredColumns = ['business_slug', 'platform', 'caption'];

    const defaultValues = {
      timezone: 'America/Chicago',
      platform_fallback: 'facebook',
    };

    const validationRules = {
      platform: { required: true, type: 'string' },
      caption: { required: true, type: 'string' },
      business_slug: { required: true, type: 'string' },
      scheduled_date: { required: false, format: 'YYYY-MM-DD' },
      scheduled_time: { required: false, format: 'HH:MM' },
    };

    // Create template
    const template = await base44.entities.CalendarImportTemplate.create({
      name: 'Posting Calendar Import (Base44)',
      template_slug: 'base44-posting-calendar-csv',
      target_system: 'Base44 Posting Calendar',
      file_format: 'csv',
      column_schema: JSON.stringify(columnSchema),
      column_mapping: JSON.stringify(columnMapping),
      required_columns: requiredColumns,
      default_values: JSON.stringify(defaultValues),
      validation_rules: JSON.stringify(validationRules),
      active: true,
    });

    return Response.json({ success: true, template });
  } catch (error) {
    console.error('[initializeCalendarTemplate] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});