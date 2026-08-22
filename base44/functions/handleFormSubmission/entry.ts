/**
 * Legacy form handler retained as a compatibility endpoint.
 * Prospect creation is delegated to the canonical office intake bridge.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    const trustedService = user?.role === 'admin' || user?.is_service === true;

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!trustedService) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const submission = body?.data || {};
    if (!submission || Array.isArray(submission) || typeof submission !== 'object') {
      return Response.json({ error: 'Invalid submission' }, { status: 400 });
    }
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
