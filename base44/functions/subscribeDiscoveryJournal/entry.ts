import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async req => {
  if (req.method !== 'POST') return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const base44 = createClientFromRequest(req);
    const { session_id, public_session_key, email, first_name } = await req.json();
    if (typeof session_id !== 'string' || typeof public_session_key !== 'string' || typeof email !== 'string') return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalizedEmail) || normalizedEmail.length > 255) return Response.json({ error: 'Invalid email' }, { status: 400 });
    if (first_name && (typeof first_name !== 'string' || first_name.length > 100)) return Response.json({ error: 'Invalid first name' }, { status: 400 });
    const session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
    if (!session || session.public_session_key !== public_session_key || (session.expires_at && new Date(session.expires_at) < new Date()) || ['deleted', 'expired', 'deletion_requested'].includes(session.status)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const consents = await base44.asServiceRole.entities.DiscoveryConsent.filter({ session_id, consent_type: 'journal' });
    const consent = consents[0];
    if (!consent || consent.state !== 'granted' || consent.affirmative_action !== true) return Response.json({ error: 'Missing Journal consent' }, { status: 403 });
    const existing = await base44.asServiceRole.entities.Subscriber.filter({ email: normalizedEmail });
    let subscriber = existing[0];
    const data = { email: normalizedEmail, first_name: first_name?.trim() || subscriber?.first_name, status: 'active', source: 'Growth Guide completion', consent_status: 'confirmed', consent_date: new Date().toISOString().slice(0, 10), consent_method: 'website_form', consent_context: `Optional Journal signup after Discovery session ${session_id}` };
    if (subscriber) { await base44.asServiceRole.entities.Subscriber.update(subscriber.id, data); subscriber = { ...subscriber, ...data }; }
    else subscriber = await base44.asServiceRole.entities.Subscriber.create(data);
    await base44.asServiceRole.entities.DiscoveryAuditEvent.create({ session_id, event_type: 'created', actor_type: 'owner', actor_id: session.anonymous_visitor_id || 'anonymous_owner', occurred_at: new Date().toISOString(), target_record_type: 'Subscriber', target_record_id: subscriber.id, reason: 'Owner optionally subscribed to the NTA Journal', metadata: { consent_id: consent.id } });
    return Response.json({ subscribed: true, subscriber_id: subscriber.id });
  } catch { return Response.json({ error: 'Unauthorized' }, { status: 401 }); }
});
