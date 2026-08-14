import { createClient, createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const OFFICE_APP_ID = '6a7215451eb90dc843a94546';

function value(input, length = 500) {
  return String(input || '').trim().slice(0, length);
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function uniqueTags(tags) {
  return [...new Set((Array.isArray(tags) ? tags : []).map((tag) => value(tag, 80)).filter(Boolean))];
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return Response.json({ error: 'Method not allowed.' }, { status: 405 });
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const email = value(payload.email, 320).toLowerCase();
    const name = value(payload.name, 200);
    const businessName = value(payload.business_name, 300);
    const publicationTitle = value(payload.publication_title, 300);
    const publicationTag = value(payload.publication_tag, 100);
    const deliveryUrl = value(payload.delivery_url, 1500);
    if (!validEmail(email) || !publicationTitle || !publicationTag) {
      return Response.json({ error: 'A valid email address and publication details are required.' }, { status: 400 });
    }

    const [firstName, ...remaining] = name.split(/\s+/).filter(Boolean);
    const existing = await base44.asServiceRole.entities.Subscriber.filter({ email });
    const current = existing?.[0];
    const subscriberData = {
      email, first_name: firstName || current?.first_name || '', last_name: remaining.join(' ') || current?.last_name || '',
      business_name: businessName || current?.business_name || '',
      tags: uniqueTags([...(current?.tags || []), 'nta-publications', publicationTag, ...(payload.tags || [])]),
      source: value(payload.source, 200) || current?.source || 'nta_publication_signup',
      status: 'active', consent_status: 'confirmed', consent_date: new Date().toISOString().slice(0, 10),
      consent_method: 'website_form',
      consent_context: value(payload.consent_context, 1000) || current?.consent_context || `Requested ${publicationTitle} from the NTA website.`,
    };
    const subscriber = current
      ? await base44.asServiceRole.entities.Subscriber.update(current.id, subscriberData)
      : await base44.asServiceRole.entities.Subscriber.create(subscriberData);

    const deliveryRequest = payload.create_delivery_request !== false && deliveryUrl
      ? await base44.asServiceRole.entities.PublicationDeliveryRequest.create({
          subscriber_id: subscriber.id, publication_title: publicationTitle, status: 'pending',
          delivery_url: deliveryUrl, attempt_count: 0,
        })
      : null;

    try {
      const office = createClient({ appId: OFFICE_APP_ID });
      await office.functions.invoke('trackBookEvent', {
        book_key: publicationTag,
        event_type: 'access_request',
      });
    } catch (trackingError) {
      console.warn('[publicationSignup] Book access event could not be recorded:', trackingError);
    }

    return Response.json({ success: true, subscriber_id: subscriber.id, delivery_request_id: deliveryRequest?.id || null });
  } catch (error) {
    console.error('[publicationSignup]', error);
    return Response.json({ error: 'Unable to save the publication request.' }, { status: 500 });
  }
});