import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PUBLICATION_CONTACT = 'info@newtechadvertising.com';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const base44 = createClientFromRequest(req);

  try {
    const { request_id, delivery_url } = await req.json();

    if (!request_id || !delivery_url) {
      return jsonResponse({ error: 'request_id and delivery_url are required' }, 400);
    }

    let request;
    try {
      request = await base44.asServiceRole.entities.PublicationDeliveryRequest.get(request_id);
    } catch (_error) {
      const matches = await base44.asServiceRole.entities.PublicationDeliveryRequest.filter({ id: request_id });
      request = Array.isArray(matches) ? matches[0] : null;
    }

    if (!request) {
      return jsonResponse({ error: 'Delivery request not found' }, 404);
    }

    if (request.status === 'sent') {
      return jsonResponse({ success: true, already_sent: true, request_id });
    }

    const subscriberMatches = request.subscriber_id
      ? await base44.asServiceRole.entities.Subscriber.filter({ id: request.subscriber_id })
      : await base44.asServiceRole.entities.Subscriber.filter({ email: request.email });
    const subscriber = Array.isArray(subscriberMatches) ? subscriberMatches[0] : null;

    if (!subscriber || subscriber.status !== 'active' || subscriber.consent_status !== 'confirmed') {
      await base44.asServiceRole.entities.PublicationDeliveryRequest.update(request.id, {
        status: 'failed',
        error_message: 'Subscriber is missing, inactive, or does not have confirmed consent.',
        delivery_attempts: (request.delivery_attempts || 0) + 1,
      });
      return jsonResponse({ error: 'Subscriber is not eligible for email delivery' }, 409);
    }

    const greeting = request.first_name ? `Hi ${request.first_name},` : 'Hello,';
    const body = `${greeting}\n\nThank you for requesting ${request.publication_title}.\n\nYou can access it here:\n${delivery_url}\n\nThis publication is part of New Tech Advertising's practical business education system. We focus on useful business principles first, technology second, and people always.\n\nQuestions or trouble opening the link? Reply to this email or contact ${PUBLICATION_CONTACT}.\n\nRick Hesse\nNew Tech Advertising\nYour Digital Growth Guide™\n\nYou received this because you requested ${request.publication_title} and agreed to receive related NTA publication updates.`;

    try {
      await base44.integrations.Core.SendEmail({
        from_name: 'New Tech Advertising Publications',
        to: request.email,
        subject: `Your copy of ${request.publication_title}`,
        body,
      });

      await base44.asServiceRole.entities.PublicationDeliveryRequest.update(request.id, {
        status: 'sent',
        sent_at: new Date().toISOString(),
        delivery_url,
        error_message: '',
        delivery_attempts: (request.delivery_attempts || 0) + 1,
      });

      return jsonResponse({ success: true, request_id: request.id });
    } catch (sendError) {
      await base44.asServiceRole.entities.PublicationDeliveryRequest.update(request.id, {
        status: 'failed',
        delivery_url,
        error_message: String(sendError?.message || sendError).slice(0, 1000),
        delivery_attempts: (request.delivery_attempts || 0) + 1,
      });
      throw sendError;
    }
  } catch (error) {
    console.error('[sendPublicationDelivery] failed', error);
    return jsonResponse({ error: 'Publication delivery failed' }, 500);
  }
});
