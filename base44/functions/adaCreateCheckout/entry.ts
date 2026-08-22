import { createClientFromRequest } from 'npm:@base44/sdk@0.8.39';
import Stripe from 'npm:stripe';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin' && user.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const leadId = String(body?.lead_id || '').trim();
    const paymentPlan = String(body?.payment_plan || '').trim();

    if (!/^[A-Za-z0-9_-]{1,128}$/.test(leadId)) {
      return Response.json({ error: 'Invalid lead_id' }, { status: 400 });
    }
    if (!['full', 'split'].includes(paymentPlan)) {
      return Response.json({ error: 'Invalid payment plan' }, { status: 400 });
    }

    // This legacy checkout can only be initiated by NTA staff or a trusted
    // server workflow. Public quote links no longer expose a lead ID as a
    // payment authority.
    const leads = await base44.asServiceRole.entities.AdaLead.filter({ id: leadId });
    const lead = leads[0];

    if (!lead) {
      return Response.json({ error: 'Quote not found' }, { status: 404 });
    }

    const setupPrice = calculateAuthoritativeSetupPrice(lead);
    if (!Number.isFinite(setupPrice) || setupPrice <= 0) {
      return Response.json({ error: 'Quote is not ready for checkout' }, { status: 409 });
    }

    const secretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!secretKey) {
      return Response.json({ error: 'Stripe is not configured' }, { status: 503 });
    }

    const stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });
    const unitAmount = paymentPlan === 'split'
      ? Math.round(setupPrice * 100 * 0.5)
      : Math.round(setupPrice * 100);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: paymentPlan === 'split'
              ? 'ADA Compliance – Split Payment (50%)'
              : 'ADA Compliance – Full Payment',
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      }],
      success_url: 'https://newtechadvertising.com/ada/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://newtechadvertising.com/ada/cancel',
      metadata: {
        lead_id: leadId,
        payment_plan: paymentPlan,
        authenticated_user_id: user?.id || '',
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('ADA checkout error:', error);
    return Response.json({ error: 'Unable to create ADA checkout' }, { status: 500 });
  }
});

function calculateAuthoritativeSetupPrice(lead) {
  const packageName = String(lead?.package || '');
  if (!['Starter', 'Growth', 'Authority'].includes(packageName)) return 0;

  const nonprofit = Boolean(lead.nonprofit);
  const baseSetup = nonprofit
    ? (packageName === 'Starter' ? 500 : packageName === 'Growth' ? 900 : 1750)
    : (packageName === 'Starter' ? 750 : packageName === 'Growth' ? 1250 : 2500);

  const bounds = nonprofit
    ? {
        Starter: [500, 1000],
        Growth: [900, 900],
        Authority: [1750, 1750],
      }[packageName]
    : {
        Starter: [750, 1500],
        Growth: [1250, 2500],
        Authority: [2500, 5000],
      }[packageName];

  let setupPrice = baseSetup;
  const pages = String(lead.approximate_pages || '');
  const siteType = String(lead.site_type || '').toLowerCase();
  const locations = String(lead.number_of_locations || '');
  const industry = String(lead.industry || '').toLowerCase();
  const city = String(lead.city || '').toLowerCase();

  if (pages === '16-30') setupPrice += 250;
  if (pages === '31+') setupPrice += 500;
  if (siteType === 'ecommerce' || siteType === 'booking') setupPrice += 750;
  if (['healthcare', 'finance', 'education', 'government'].some(term => industry.includes(term))) {
    setupPrice += 500;
  }
  if (locations === '2-3') setupPrice += 150;
  if (locations === '4-10') setupPrice += 300;
  if (locations === '11+') setupPrice += 500;

  const multiplier = (
    city.includes('des moines') ||
    city.includes('cedar rapids') ||
    city.includes('minneapolis')
  )
    ? 1.6
    : (
      city.includes('iowa city') ||
      city.includes('waterloo') ||
      city.includes('rochester')
    )
      ? 1.25
      : 1.0;

  return Math.max(bounds[0], Math.min(bounds[1], Math.round(setupPrice * multiplier)));
}
