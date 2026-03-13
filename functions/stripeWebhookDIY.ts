import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');

async function verifyStripeSignature(req) {
  const signature = req.headers.get('stripe-signature');
  if (!signature) return null;

  try {
    const body = await req.text();
    
    // For Deno with Web Crypto API
    const encoder = new TextEncoder();
    const algorithm = { name: 'HMAC', hash: 'SHA-256' };
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(STRIPE_WEBHOOK_SECRET),
      algorithm,
      false,
      ['sign']
    );

    const signatureParts = signature.split(',');
    const timestamp = signatureParts[0].split('=')[1];
    const receivedSignature = signatureParts[1].split('=')[1];

    const signedContent = `${timestamp}.${body}`;
    const computedSignature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(signedContent)
    );

    const computedHex = Array.from(new Uint8Array(computedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return computedHex === receivedSignature ? JSON.parse(body) : null;
  } catch (error) {
    console.error('Signature verification error:', error);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const event = await verifyStripeSignature(req);

    if (!event) {
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const base44 = createClientFromRequest(req);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Get customer email
        const customerResponse = await fetch(
          `https://api.stripe.com/v1/customers/${session.customer}`,
          {
            headers: {
              'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
            },
          }
        );
        const customer = await customerResponse.json();

        // Update DIY subscription with Stripe subscription ID
        const subs = await base44.entities.DIYSubscription.filter({
          user_email: customer.email,
          status: 'pending',
        });

        if (subs.length > 0) {
          await base44.entities.DIYSubscription.update(subs[0].id, {
            stripe_subscription_id: session.subscription,
            status: 'active',
          });
        }

        return Response.json({ received: true });
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;

        // Update status
        const subs = await base44.entities.DIYSubscription.filter({
          stripe_subscription_id: subscription.id,
        });

        if (subs.length > 0) {
          const newStatus = subscription.status === 'active' ? 'active' : 
                           subscription.status === 'past_due' ? 'past_due' : 
                           'paused';

          await base44.entities.DIYSubscription.update(subs[0].id, {
            status: newStatus,
          });
        }

        return Response.json({ received: true });
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        // Cancel DIY subscription
        const subs = await base44.entities.DIYSubscription.filter({
          stripe_subscription_id: subscription.id,
        });

        if (subs.length > 0) {
          await base44.entities.DIYSubscription.update(subs[0].id, {
            status: 'cancelled',
          });
        }

        return Response.json({ received: true });
      }

      default:
        return Response.json({ received: true });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});