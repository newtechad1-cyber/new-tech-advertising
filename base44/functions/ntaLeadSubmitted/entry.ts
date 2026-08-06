/**
 * Legacy lead endpoint.
 * All NTA/public lead submissions now land in the private office SalesLead entity.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { client_id, campaign_id, name, phone, email, service_needed, source_page, source_campaign, business_name, website, city, state, industry } = body;

    const response = await base44.asServiceRole.functions.invoke('ntaUnifiedIntake', {
      submission_type: 'lead',
      offer_type: service_needed || 'consultation',
      mapping_confidence: 'fallback',
      mapping_notes: 'Legacy ntaLeadSubmitted routed to canonical office intake',
      detected_route: source_page || '',
      detected_component: 'ntaLeadSubmitted',
      source_system: 'website',
      source_page: source_page || '',
      source_campaign: source_campaign || '',
      name: name || '',
      business_name: business_name || name || '',
      email: email || '',
      phone: phone || '',
      website: website || '',
      city: city || '',
      state: state || '',
      industry: industry || '',
      notes: client_id ? `Client site lead. Client: ${client_id}. Campaign: ${campaign_id || 'none'}.` : '',
      raw_payload: body,
    });
    const data = response?.data ?? response;
    return Response.json({
      success: true,
      lead_id: data?.sales_lead_id || null,
      sales_lead_id: data?.sales_lead_id || null,
      canonical: data,
      message: 'Thanks! We received your request and will be in touch shortly.',
    });
  } catch (error) {
    const status = error?.response?.status || 500;
    const detail = error?.response?.data || { error: error?.message || 'Canonical intake failed' };
    console.error('[ntaLeadSubmitted] Canonical office intake failed:', detail);
    return Response.json(detail, { status });
  }
});
