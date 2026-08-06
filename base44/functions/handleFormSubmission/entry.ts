/**
 * Legacy form handler retained as a compatibility endpoint.
 * Prospect creation is delegated to the canonical office intake bridge.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const submission = (await req.json())?.data || {};
    if (!Object.keys(submission).length) {
      return Response.json({ success: true, message: 'No data' });
    }

    const response = await base44.asServiceRole.functions.invoke('ntaUnifiedIntake', {
      submission_type: submission.submission_type || 'website_form',
      offer_type: submission.offer_type || 'consultation',
      mapping_confidence: 'fallback',
      mapping_notes: 'Legacy handleFormSubmission routed to canonical office intake',
      detected_route: submission.source_page || '',
      detected_component: 'handleFormSubmission',
      source_system: 'website',
      source_page: submission.source_page || '',
      source_url: submission.source_url || submission.source_page || '',
      name: submission.name || '',
      business_name: submission.business_name || submission.name || '',
      email: submission.email || '',
      phone: submission.phone || '',
      website: submission.website || '',
      city: submission.city || '',
      state: submission.state || '',
      notes: submission.notes || '',
      raw_payload: submission,
    });
    const data = response?.data ?? response;
    return Response.json({ success: true, canonical: data });
  } catch (error) {
    const status = error?.response?.status || 500;
    const detail = error?.response?.data || { error: error?.message || 'Canonical intake failed' };
    console.error('[handleFormSubmission] Canonical office intake failed:', detail);
    return Response.json(detail, { status });
  }
});
