import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const TRUSTED_PUBLIC_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);
const REQUEST_WINDOW_MS = 15 * 60 * 1000;
const REQUEST_LIMIT = 24;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function isTrustedPublicOrigin(req: Request) {
  const rawOrigin = req.headers.get('origin') || req.headers.get('referer');
  if (!rawOrigin) return false;

  try {
    return TRUSTED_PUBLIC_ORIGINS.has(new URL(rawOrigin).origin);
  } catch {
    return false;
  }
}

function requestClientIdentity(req: Request) {
  return String(
    req.headers.get('cf-connecting-ip')
    || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown',
  ).slice(0, 128);
}

function isRateLimited(req: Request) {
  const now = Date.now();
  const key = requestClientIdentity(req);
  let bucket = requestBuckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + REQUEST_WINDOW_MS };
    requestBuckets.set(key, bucket);
  }

  if (bucket.count >= REQUEST_LIMIT) {
    return Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  }

  bucket.count += 1;
  return 0;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const publicBoundaryUser = await base44.auth.me().catch(() => null);
    const trustedPublicService = publicBoundaryUser?.role === 'admin' || publicBoundaryUser?.is_service === true;

    if (!trustedPublicService && !isTrustedPublicOrigin(req)) {
      return Response.json({ error: 'Untrusted request origin' }, { status: 403 });
    }

    if (!trustedPublicService) {
      const retryAfterSeconds = isRateLimited(req);
      if (retryAfterSeconds) {
        return Response.json(
          { error: 'Too many requests. Please try again shortly.' },
          { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
        );
      }
    }
    const body = await req.json();
    const { session_id, public_session_key, handoff_type, confirmed_summary_id, contact } = body;

    // 1. Inline Session Authentication
    if (!session_id || !public_session_key || typeof session_id !== 'string' || typeof public_session_key !== 'string') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let session;
    try {
      session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
    } catch (e) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session || session.public_session_key !== public_session_key) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (['deleted', 'expired', 'deletion_requested'].includes(session.status)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate Handoff Type
    const validHandoffTypes = ['schedule_growth_conversation', 'call_nta', 'request_callback', 'continue_by_email', 'receive_summary', 'save_and_return'];
    if (!validHandoffTypes.includes(handoff_type)) {
      return Response.json({ error: 'Invalid handoff type' }, { status: 400 });
    }

    const requiresSummary = ['schedule_growth_conversation', 'receive_summary'].includes(handoff_type);
    
    // 3. Validate Confirmed Summary (if required or provided)
    let validSummaryId = null;
    if (requiresSummary || confirmed_summary_id) {
      if (!confirmed_summary_id || typeof confirmed_summary_id !== 'string') {
        return Response.json({ error: 'Valid confirmed summary required for this handoff' }, { status: 400 });
      }
      
      let summary;
      try {
        summary = await base44.asServiceRole.entities.DiscoveryConfirmedSummary.get(confirmed_summary_id);
      } catch (e) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 }); // Generic error
      }
      
      if (!summary || summary.session_id !== session_id || summary.confirmation_state !== 'confirmed') {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
      validSummaryId = summary.id;
    }

    // 4. Validate Contact Info
    const requiresContact = ['request_callback', 'continue_by_email', 'receive_summary'].includes(handoff_type);
    if (requiresContact && (!contact || typeof contact !== 'object' || Array.isArray(contact))) {
      return Response.json({ error: 'Contact information required for this handoff' }, { status: 400 });
    }

    let pendingContactPreference = null;
    if (contact && typeof contact === 'object' && !Array.isArray(contact)) {
      const { preferred_channel, name, email, phone, best_time } = contact;
      
      const validChannels = ['phone', 'text_message', 'email', 'meeting'];
      if (!validChannels.includes(preferred_channel)) {
        return Response.json({ error: 'Invalid preferred channel' }, { status: 400 });
      }

      // Verify personal_follow_up consent exists and is granted
      const consents = await base44.asServiceRole.entities.DiscoveryConsent.filter({ session_id, consent_type: 'personal_follow_up' });
      const followUpConsent = consents[0];
      
      if (!followUpConsent || followUpConsent.state !== 'granted' || followUpConsent.affirmative_action !== true) {
        return Response.json({ error: 'Missing personal_follow_up consent' }, { status: 403 });
      }

      if (handoff_type === 'request_callback' && (typeof phone !== 'string' || !phone.trim())) {
        return Response.json({ error: 'Phone number required for callback requests' }, { status: 400 });
      }
      if (handoff_type === 'continue_by_email' && (typeof email !== 'string' || !email.trim())) {
        return Response.json({ error: 'Email address required for email handoffs' }, { status: 400 });
      }
      if (handoff_type === 'receive_summary' && (typeof email !== 'string' || !email.trim())) {
        return Response.json({ error: 'Email address required for summary delivery' }, { status: 400 });
      }

      // Sanitize and validate lengths
      if (email && (typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 255)) {
        return Response.json({ error: 'Invalid email' }, { status: 400 });
      }
      if (phone && (typeof phone !== 'string' || phone.length < 7 || phone.length > 20)) {
        return Response.json({ error: 'Invalid phone' }, { status: 400 });
      }
      if (name && (typeof name !== 'string' || name.length > 100)) {
        return Response.json({ error: 'Invalid name' }, { status: 400 });
      }
      if (best_time && (typeof best_time !== 'string' || best_time.length > 100)) {
        return Response.json({ error: 'Invalid best_time' }, { status: 400 });
      }
      
      pendingContactPreference = {
        session_id,
        preferred_channel,
        name: name ? name.trim() : undefined,
        email: email ? email.trim() : undefined,
        phone: phone ? phone.trim() : undefined,
        best_time: best_time ? best_time.trim() : undefined,
        follow_up_consent_id: followUpConsent.id
      };
    }

    // Return the existing canonical record for safe client retries.
    // Validation above still applies to every submitted request.
    const existingHandoffs = await base44.asServiceRole.entities.DiscoveryHandoff.filter({
      session_id,
      handoff_type
    });
    const existingHandoff = existingHandoffs.find((candidate) =>
      (candidate.confirmed_summary_id || null) === (validSummaryId || null)
    );

    if (existingHandoff) {
      return Response.json({
        id: existingHandoff.id,
        session_id: existingHandoff.session_id,
        handoff_type: existingHandoff.handoff_type,
        requested_at: existingHandoff.requested_at,
        rick_review_state: existingHandoff.rick_review_state,
        confirmed_summary_id: existingHandoff.confirmed_summary_id,
        contact_preference_id: existingHandoff.contact_preference_id
      });
    }

    let contactPrefId = null;
    if (pendingContactPreference) {
      const pref = await base44.asServiceRole.entities.DiscoveryContactPreference.create(pendingContactPreference);
      contactPrefId = pref.id;
    }

    const now = new Date().toISOString();
    
    // Server-side Rick Review State Logic
    const rick_review_state = requiresSummary ? 'needs_review' : 'not_requested';

    // 5. Create Canonical Handoff Record
    const handoff = await base44.asServiceRole.entities.DiscoveryHandoff.create({
      session_id,
      handoff_type,
      requested_at: now,
      rick_review_state,
      confirmed_summary_id: validSummaryId,
      contact_preference_id: contactPrefId
    });

    // 6. Update Parent Session
    await base44.asServiceRole.entities.DiscoverySession.update(session_id, {
      status: 'handoff_requested',
      last_activity_at: now
    });

    // 7. Create Audit Event
    await base44.asServiceRole.entities.DiscoveryAuditEvent.create({
      session_id,
      event_type: 'created',
      actor_type: 'owner',
      actor_id: session.anonymous_visitor_id || 'anonymous_owner',
      occurred_at: now,
      target_record_type: 'DiscoveryHandoff',
      target_record_id: handoff.id,
      reason: `Owner requested handoff: ${handoff_type}`,
      metadata: { handoff_type, rick_review_state }
    });

    // 8. Return Safe Fields Only
    return Response.json({
      id: handoff.id,
      session_id: handoff.session_id,
      handoff_type: handoff.handoff_type,
      requested_at: handoff.requested_at,
      rick_review_state: handoff.rick_review_state,
      confirmed_summary_id: handoff.confirmed_summary_id,
      contact_preference_id: handoff.contact_preference_id
    });

  } catch (error) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
});
