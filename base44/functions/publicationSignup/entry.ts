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
    const currentTags = uniqueTags(current?.tags || []);
    const isUnsubscribed = ['unsubscribed', 'revoked', 'inactive'].includes(String(current?.status || '').toLowerCase())
      || String(current?.consent_status || '').toLowerCase() === 'revoked';
    const legacyJournalTags = ['newsletter', 'nta-newsletter'];
    const alreadyHasJournalSubscription = publicationTag === 'nta-journal'
      && currentTags.some((tag) => tag === publicationTag || legacyJournalTags.includes(tag));
    const alreadySubscribed = current
      && (alreadyHasJournalSubscription || currentTags.includes(publicationTag))
      && !isUnsubscribed;

    if (alreadySubscribed) {
      // Upgrade a legacy newsletter record to the canonical Journal tag when
      // the person confirms the current consent checkbox, then show the
      // duplicate notice instead of creating another subscription.
      let duplicateJournalSyncStatus = null;
      if (alreadyHasJournalSubscription && publicationTag === 'nta-journal') {
        try {
          await base44.asServiceRole.entities.Subscriber.update(current.id, {
            tags: uniqueTags([...currentTags, 'nta-publications', 'nta-journal']),
            status: 'active',
            consent_status: 'confirmed',
            consent_date: new Date().toISOString().slice(0, 10),
            consent_method: 'website_form',
            consent_context: value(payload.consent_context, 1000) || current.consent_context || 'Confirmed The NTA Journal subscription from the NTA website.',
          });
        } catch (legacyUpgradeError) {
          console.warn('[publicationSignup] Legacy newsletter record upgrade failed:', legacyUpgradeError.message);
        }
      }

      if (publicationTag === 'nta-journal') {
        try {
          const sync = await base44.asServiceRole.functions.invoke('syncJournalSubscriber', { email });
          duplicateJournalSyncStatus = sync?.data?.status || sync?.status || 'requested';
        } catch (syncError) {
          duplicateJournalSyncStatus = 'needs_attention';
          console.warn('[publicationSignup] Existing Journal subscriber sync needs attention:', syncError);
        }
      }

      return Response.json({
        success: false,
        status: 'already_subscribed',
        error: 'This email is already subscribed to ' + publicationTitle + '.',
        journal_sync_status: duplicateJournalSyncStatus,
      }, { status: 409 });
    }

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

    let journalSyncStatus = null;
    if (publicationTag === 'nta-journal') {
      try {
        const sync = await base44.asServiceRole.functions.invoke('syncJournalSubscriber', { email });
        journalSyncStatus = sync?.data?.status || sync?.status || 'requested';
      } catch (syncError) {
        journalSyncStatus = 'needs_attention';
        console.warn('[publicationSignup] Journal subscriber saved; Brevo sync needs attention:', syncError);
      }
    }

    try {
      const office = createClient({ appId: OFFICE_APP_ID });
      await office.functions.invoke('trackBookEvent', {
        book_key: publicationTag,
        event_type: 'access_request',
      });
    } catch (trackingError) {
      console.warn('[publicationSignup] Book access event could not be recorded:', trackingError);
    }

    return Response.json({ success: true, subscriber_id: subscriber.id, delivery_request_id: deliveryRequest?.id || null, journal_sync_status: journalSyncStatus });
  } catch (error) {
    console.error('[publicationSignup]', error);
    return Response.json({ error: 'Unable to save the publication request.' }, { status: 500 });
  }
});