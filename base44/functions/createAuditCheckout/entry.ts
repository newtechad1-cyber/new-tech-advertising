import { createClientFromRequest } from 'npm:@base44/sdk@0.8.39';
import Stripe from 'npm:stripe';

const CHECKOUT_PRICE_ID = 'price_1TtaOoGjzSQJmBIKNRCU71GG';
const PUBLIC_ORIGIN = 'https://newtechadvertising.com';

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
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAdminUser(user)) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const auditId = String(body?.auditId || '').trim();

    if (!/^[A-Za-z0-9_-]{1,128}$/.test(auditId)) {
      return Response.json({ error: 'Invalid auditId' }, { status: 400 });
    }

    const secretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!secretKey) {
      return Response.json({ error: 'Stripe is not configured' }, { status: 503 });
    }

    const stripe = new Stripe(secretKey);

    // Return URLs are fixed to NTA-owned paths. The caller cannot send a
    // checkout session to an arbitrary origin.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: CHECKOUT_PRICE_ID, quantity: 1 }],
      mode: 'payment',
      success_url: `${PUBLIC_ORIGIN}/diy-checkout-success?session_id={CHECKOUT_SESSION_ID}&audit_id=${encodeURIComponent(auditId)}`,
      cancel_url: `${PUBLIC_ORIGIN}/?canceled=true`,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID') || '',
        audit_id: auditId,
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return Response.json({ error: 'Unable to create checkout session' }, { status: 500 });
  }
});
