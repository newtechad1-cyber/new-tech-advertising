import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const VIBE_API_BASE = 'https://clear-platform.vibe.co/rest/reporting/v1';
const VIBE_API_KEY = Deno.env.get('VIBE_CO_API_KEY');

const vibeHeaders = {
  'Authorization': `Bearer ${VIBE_API_KEY}`,
  'Content-Type': 'application/json',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, advertiser_id, campaign_id, start_date, end_date, metrics, dimensions } = body;

    if (action === 'get_advertisers') {
      // List advertisers associated with this API key
      const res = await fetch(`${VIBE_API_BASE}/get_advertiser_ids`, { headers: vibeHeaders });
      const data = await res.json();
      return Response.json(data);
    }

    if (action === 'get_campaigns') {
      // Get campaign details for an advertiser
      const res = await fetch(`${VIBE_API_BASE}/get_campaign_details?advertiser_id=${advertiser_id}`, {
        method: 'GET',
        headers: vibeHeaders,
      });
      const data = await res.json();
      return Response.json(data);
    }

    if (action === 'create_report') {
      // Create async report for analytics data
      const reportPayload = {
        advertiser_id,
        start_date: start_date || getDateDaysAgo(30),
        end_date: end_date || getTodayDate(),
        metrics: metrics || ['impressions', 'spend', 'reach', 'cpm', 'frequency'],
        dimensions: dimensions || ['campaign_name', 'date'],
        timezone: 'America/Chicago',
      };

      if (campaign_id) {
        reportPayload.filters = [{ field: 'campaign_id', operator: 'eq', value: campaign_id }];
      }

      const res = await fetch(`${VIBE_API_BASE}/create_async_report`, {
        method: 'POST',
        headers: vibeHeaders,
        body: JSON.stringify(reportPayload),
      });
      const data = await res.json();
      return Response.json(data);
    }

    if (action === 'get_report_status') {
      const { report_id } = body;
      const res = await fetch(`${VIBE_API_BASE}/reports/async?report_id=${report_id}`, {
        headers: vibeHeaders,
      });
      const data = await res.json();
      return Response.json(data);
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function getDateDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}