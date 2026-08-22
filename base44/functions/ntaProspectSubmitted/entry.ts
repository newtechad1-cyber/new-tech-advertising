/**
 * Legacy prospect endpoint.
 * Manual prospects are written directly into the private office pipeline.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const authUser = await base44.auth.me().catch(() => null);
    if (!authUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (authUser.role !== 'admin' && authUser.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }
    const body = await req.json();
    const { business_name, contact_name, website, phone, email, industry, city } = body;

    if (!business_name) {
      return Response.json({ error: 'business_name is required' }, { status: 400 });
    }

    const response = await base44.asServiceRole.functions.invoke('ntaUnifiedIntake', {
      submission_type: 'free_audit_request',
      offer_type: 'marketing_audit',
      mapping_confidence: 'hardcoded',
      mapping_notes: 'Legacy ntaProspectSubmitted routed to canonical office intake',
      detected_route: '/ops/quick-action/prospect',
      detected_component: 'ntaProspectSubmitted',
      source_system: 'crm_manual',
      source_page: '/ops/quick-action/prospect',
      name: contact_name || business_name,
      business_name,
      email: email || '',
      phone: phone || '',
      website: website || '',
      city: city || '',
      industry: industry || '',
      notes: 'Manual prospect added from the office quick action.',
      raw_payload: body,
    });
    const data = response?.data ?? response;
    return Response.json({
      success: true,
      prospect_id: data?.sales_lead_id || null,
      sales_lead_id: data?.sales_lead_id || null,
      canonical: data,
    });
  } catch (error) {
    const status = error?.response?.status || 500;
    const detail = error?.response?.data || { error: error?.message || 'Canonical intake failed' };
    console.error('[ntaProspectSubmitted] Canonical office intake failed:', detail);
    return Response.json(detail, { status });
  }
});
