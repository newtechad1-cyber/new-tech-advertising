import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const SOURCE_META = {
  authority_content_seo:  { name: 'Authority Content SEO',      category: 'inbound',  color: '#3b82f6' },
  social_authority:       { name: 'Social Authority Presence',   category: 'inbound',  color: '#8b5cf6' },
  outbound_prospecting:   { name: 'Targeted Outbound',           category: 'outbound', color: '#f59e0b' },
  referral_expansion:     { name: 'Referral Expansion',          category: 'referral', color: '#10b981' },
  territory_campaigns:    { name: 'Territory Campaigns',         category: 'inbound',  color: '#06b6d4' },
  demo_request:           { name: 'Direct Demo Request',         category: 'inbound',  color: '#6366f1' },
  paid_amplification:     { name: 'Paid Amplification',          category: 'paid',     color: '#ec4899' },
  partner:                { name: 'Partner Channel',             category: 'referral', color: '#f97316' },
  other:                  { name: 'Other',                       category: 'other',    color: '#94a3b8' },
};

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { action, ...params } = body;

  // ── GET DASHBOARD OVERVIEW ─────────────────────────────────────────────────
  if (action === 'get_overview') {
    const [attributions, campaigns, opportunities] = await Promise.all([
      base44.asServiceRole.entities.LeadAttribution.list('-first_touch_date', 500),
      base44.asServiceRole.entities.OutreachCampaign.list('-created_date', 100),
      base44.asServiceRole.entities.SalesOpportunity.list('-created_date', 200),
    ]);

    // Aggregate metrics by source
    const bySource = {};
    for (const key of Object.keys(SOURCE_META)) {
      const srcAttribs = attributions.filter(a => a.primary_source_key === key);
      const leads = srcAttribs.length;
      const demos = srcAttribs.filter(a => ['demo_booked','opportunity','verbal_yes','closed_won'].includes(a.outcome)).length;
      const opps = srcAttribs.filter(a => ['opportunity','verbal_yes','closed_won'].includes(a.outcome)).length;
      const won = srcAttribs.filter(a => a.outcome === 'closed_won').length;
      const revenue = srcAttribs.filter(a => a.outcome === 'closed_won').reduce((s, a) => s + (a.deal_value || 0), 0);
      bySource[key] = {
        ...SOURCE_META[key],
        key,
        leads,
        demos,
        opportunities: opps,
        closed_won: won,
        revenue,
        close_rate: leads > 0 ? Math.round((won / leads) * 100) : 0,
        demo_conversion: leads > 0 ? Math.round((demos / leads) * 100) : 0,
        avg_deal: won > 0 ? Math.round(revenue / won) : 0,
      };
    }

    // Pipeline funnel totals
    const totals = {
      total_leads: attributions.length,
      total_demos: attributions.filter(a => ['demo_booked','opportunity','verbal_yes','closed_won'].includes(a.outcome)).length,
      total_opportunities: attributions.filter(a => ['opportunity','verbal_yes','closed_won'].includes(a.outcome)).length,
      total_won: attributions.filter(a => a.outcome === 'closed_won').length,
      total_revenue: attributions.filter(a => a.outcome === 'closed_won').reduce((s, a) => s + (a.deal_value || 0), 0),
    };

    // Top performing campaigns
    const activeCampaigns = campaigns.filter(c => c.status === 'active').map(c => ({
      ...c,
      conversion_rate: c.leads_generated > 0 ? Math.round((c.closed_won / c.leads_generated) * 100) : 0,
      roi: c.budget_spent > 0 ? Math.round(((c.revenue_generated - c.budget_spent) / c.budget_spent) * 100) : 0,
    }));

    // Recent attributions (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
    const recent = attributions.filter(a => a.first_touch_date >= thirtyDaysAgo);
    const recentBySource = {};
    for (const key of Object.keys(SOURCE_META)) {
      recentBySource[key] = recent.filter(a => a.primary_source_key === key).length;
    }

    return Response.json({ bySource, totals, activeCampaigns, recentBySource, sourceMeta: SOURCE_META });
  }

  // ── CREATE LEAD ATTRIBUTION ────────────────────────────────────────────────
  if (action === 'create_attribution') {
    const { opportunity_id, source_key, company_name, contact_name, contact_email, referrer_company, referrer_contact, campaign_id, deal_value, industry, city, content_piece, keyword } = params;

    const record = await base44.asServiceRole.entities.LeadAttribution.create({
      opportunity_id,
      company_name,
      contact_name,
      contact_email,
      primary_source_key: source_key,
      campaign_id,
      referrer_company,
      referrer_contact,
      first_touch_date: new Date().toISOString().split('T')[0],
      outcome: 'lead',
      deal_value: deal_value || 0,
      industry,
      city,
      content_piece_credited: content_piece,
      keyword_credited: keyword,
    });

    // Also update campaign stats if campaign_id provided
    if (campaign_id) {
      const campaigns = await base44.asServiceRole.entities.OutreachCampaign.filter({ id: campaign_id });
      if (campaigns?.length) {
        const c = campaigns[0];
        await base44.asServiceRole.entities.OutreachCampaign.update(campaign_id, { leads_generated: (c.leads_generated || 0) + 1 });
      }
    }

    return Response.json({ success: true, record });
  }

  // ── ADVANCE ATTRIBUTION OUTCOME ────────────────────────────────────────────
  if (action === 'advance_outcome') {
    const { opportunity_id, new_outcome, deal_value, demo_date, close_date } = params;
    const existing = await base44.asServiceRole.entities.LeadAttribution.filter({ opportunity_id });
    if (!existing?.length) return Response.json({ error: 'Attribution not found' }, { status: 404 });

    const attr = existing[0];
    const updates = { outcome: new_outcome };
    if (new_outcome === 'demo_booked' && demo_date) {
      updates.demo_booked_date = demo_date;
      updates.days_to_demo = attr.first_touch_date ? Math.floor((new Date(demo_date) - new Date(attr.first_touch_date)) / 86400000) : null;
    }
    if (new_outcome === 'closed_won' && close_date) {
      updates.closed_date = close_date;
      updates.deal_value = deal_value || attr.deal_value;
      updates.days_to_close = attr.first_touch_date ? Math.floor((new Date(close_date) - new Date(attr.first_touch_date)) / 86400000) : null;
    }

    await base44.asServiceRole.entities.LeadAttribution.update(attr.id, updates);

    // Update campaign counters
    if (attr.campaign_id) {
      const campaigns = await base44.asServiceRole.entities.OutreachCampaign.filter({ id: attr.campaign_id });
      if (campaigns?.length) {
        const c = campaigns[0];
        const campUpdates = {};
        if (new_outcome === 'demo_booked') campUpdates.demos_booked = (c.demos_booked || 0) + 1;
        if (new_outcome === 'opportunity') campUpdates.opportunities_created = (c.opportunities_created || 0) + 1;
        if (new_outcome === 'closed_won') {
          campUpdates.closed_won = (c.closed_won || 0) + 1;
          campUpdates.revenue_generated = (c.revenue_generated || 0) + (deal_value || 0);
        }
        if (Object.keys(campUpdates).length) await base44.asServiceRole.entities.OutreachCampaign.update(attr.campaign_id, campUpdates);
      }
    }

    return Response.json({ success: true });
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 });
});