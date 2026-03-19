import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { createHash } from 'node:crypto';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    const { csv_content, business_profile_id } = payload;

    if (!csv_content || !business_profile_id) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Parse CSV
    const lines = csv_content.trim().split('\n');
    if (lines.length < 2) {
      return Response.json({ error: 'CSV must have header and at least one data row' }, { status: 400 });
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const expectedHeaders = [
      'business_slug', 'platform', 'post_title', 'post_type', 'caption', 'hashtags',
      'call_to_action', 'destination_url', 'image_url', 'video_url', 'scheduled_date',
      'scheduled_time', 'timezone', 'topic_cluster', 'campaign_type', 'offer_type',
      'audience_type', 'source_page', 'source_tool', 'source_campaign',
      'source_social_post_id', 'source_export_batch_id', 'notes',
    ];

    // Validate headers
    const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      return Response.json({
        error: 'Invalid CSV format',
        missing_headers: missingHeaders,
      }, { status: 400 });
    }

    const results = {
      imported: 0,
      updated: 0,
      failed: 0,
      errors: [],
    };

    // Process rows
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        const row = {};
        headers.forEach((header, idx) => {
          row[header] = values[idx] || '';
        });

        // Validate required fields
        if (!row.platform || !row.caption) {
          results.failed++;
          results.errors.push({
            row: i + 1,
            reason: 'Missing platform or caption',
            data: row,
          });
          continue;
        }

        // Build scheduled_datetime
        let scheduled_datetime = null;
        if (row.scheduled_date && row.scheduled_time) {
          try {
            const tzOffset = getTimezoneOffset(row.timezone || 'America/Chicago');
            const dt = new Date(`${row.scheduled_date}T${row.scheduled_time}:00`);
            scheduled_datetime = dt.toISOString();
          } catch (err) {
            results.failed++;
            results.errors.push({ row: i + 1, reason: 'Invalid date/time', data: row });
            continue;
          }
        }

        // Check for duplicates (idempotency)
        const uniqueKey = buildUniqueKey(row, scheduled_datetime);
        const existing = await findExistingCalendarItem(
          base44,
          business_profile_id,
          row.source_social_post_id,
          scheduled_datetime,
          uniqueKey
        );

        let scheduledPost;
        if (existing) {
          // Update existing
          await base44.entities.ScheduledPost.update(existing.id, {
            platform: row.platform,
            scheduled_at: scheduled_datetime,
          });
          results.updated++;
          scheduledPost = existing;
        } else {
          // Create new
          scheduledPost = await base44.entities.ScheduledPost.create({
            company_id: business_profile_id,
            content_item_id: row.source_social_post_id || `import-${uniqueKey}`,
            social_account_id: `${row.platform}_${business_profile_id}`,
            platform: row.platform,
            scheduled_at: scheduled_datetime || new Date().toISOString(),
            status: scheduled_datetime ? 'scheduled' : 'draft',
          });
          results.imported++;
        }

        // Update SocialPost if source exists
        if (row.source_social_post_id) {
          try {
            await base44.entities.SocialPost.update(row.source_social_post_id, {
              external_calendar_status: 'imported',
            });
          } catch (err) {
            console.warn('[importPostsCalendar] Could not update SocialPost:', err.message);
          }
        }
      } catch (err) {
        results.failed++;
        results.errors.push({
          row: i + 1,
          reason: err.message,
        });
      }
    }

    return Response.json({
      success: true,
      results,
      total_rows: lines.length - 1,
    });
  } catch (error) {
    console.error('[importPostsCalendar] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

function getTimezoneOffset(tz) {
  // Simple timezone offset getter (UTC assumed for now)
  const offsets = {
    'America/Chicago': -6,
    'America/New_York': -5,
    'UTC': 0,
  };
  return offsets[tz] || 0;
}

function buildUniqueKey(row, scheduledDateTime) {
  const hashInput = `${row.platform}|${row.caption}|${scheduledDateTime || 'unscheduled'}`;
  return createHash('md5').update(hashInput).digest('hex').substring(0, 12);
}

async function findExistingCalendarItem(
  base44,
  businessProfileId,
  sourceSocialPostId,
  scheduledDateTime,
  uniqueKey
) {
  try {
    const items = await base44.entities.ScheduledPost.filter({
      company_id: businessProfileId,
    });

    if (sourceSocialPostId) {
      return items.find(
        item =>
          item.content_item_id === sourceSocialPostId &&
          (!scheduledDateTime || item.scheduled_at === scheduledDateTime)
      );
    }

    return null;
  } catch (err) {
    console.warn('[findExistingCalendarItem] Error:', err.message);
    return null;
  }
}