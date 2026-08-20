import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

function isAdminUser(user) {
  const adminEmails = String(Deno.env.get('ADMIN_EMAILS') || '')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(
    user &&
    (user.role === 'admin' || adminEmails.includes(String(user.email || '').toLowerCase()))
  );
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAdminUser(user)) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const requestBody = await req.json().catch(() => ({}));
    const request_id = String(requestBody?.request_id || '').trim();
    const delivery_url = String(requestBody?.delivery_url || '').trim().slice(0, 2000);

    if (!/^[A-Za-z0-9_-]{1,128}$/.test(request_id)) {
      return Response.json({ error: 'Invalid request_id' }, { status: 400 });
    }

    let parsedDeliveryUrl;
    try {
      parsedDeliveryUrl = new URL(delivery_url);
    } catch {
      return Response.json({ error: 'Invalid delivery_url' }, { status: 400 });
    }
    if (parsedDeliveryUrl.protocol !== 'https:' || parsedDeliveryUrl.username || parsedDeliveryUrl.password) {
      return Response.json({ error: 'Invalid delivery_url' }, { status: 400 });
    }

    const requests = await base44.asServiceRole.entities.PublicationDeliveryRequest.filter({ id: request_id });
    if (requests.length === 0) {
      return Response.json({ error: 'PublicationDeliveryRequest not found' }, { status: 404 });
    }

    const deliveryRequest = requests[0];
    if (deliveryRequest.status === 'sent') {
      return Response.json({ status: 'ignored', reason: 'Already sent' });
    }

    const subscribers = await base44.asServiceRole.entities.Subscriber.filter({ id: deliveryRequest.subscriber_id });
    if (subscribers.length === 0) {
      return Response.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    const subscriber = subscribers[0];
    if (subscriber.status !== 'active' || subscriber.consent_status !== 'confirmed') {
      return Response.json({ status: 'ignored', reason: 'Subscriber is not active or consent is not confirmed' });
    }

    const subject = `Your copy of ${deliveryRequest.publication_title}`;
    const emailBody = `Hi ${subscriber.first_name || 'there'},

Here is your requested copy of ${deliveryRequest.publication_title}.
You can download or view it here:
${delivery_url}

If you have any questions, please contact us at info@newtechadvertising.com.

Best regards,
New Tech Advertising`;

    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: subscriber.email,
        subject: subject,
        body: emailBody,
        from_name: 'New Tech Advertising Publications'
      });

      await base44.asServiceRole.entities.PublicationDeliveryRequest.update(request_id, {
        status: 'sent',
        sent_date: new Date().toISOString(),
        delivery_url: delivery_url,
        attempt_count: (deliveryRequest.attempt_count || 0) + 1
      });

      return Response.json({ status: 'success' });
    } catch (emailError) {
      const errMsg = emailError instanceof Error ? emailError.message : String(emailError);
      
      await base44.asServiceRole.entities.PublicationDeliveryRequest.update(request_id, {
        status: 'failed',
        delivery_url: delivery_url,
        attempt_count: (deliveryRequest.attempt_count || 0) + 1,
        error_details: errMsg
      });
      
      return Response.json({ error: 'Email delivery failed' }, { status: 500 });
    }

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('[sendPublicationDeliveryEmail] Error:', errMsg);
    return Response.json({ error: 'Unable to deliver publication email' }, { status: 500 });
  }
});