import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
const APP_URL = Deno.env.get('APP_URL') || 'http://localhost:5173';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Self-service billing boundary: every privileged operation below is tied to
    // the authenticated caller's immutable Base44 user ID and email.
    const checkoutUserId = String(user.id || '').trim();
    const checkoutUserEmail = String(user.email || '').trim().toLowerCase();
    if (!checkoutUserId || !checkoutUserEmail) {
      return Response.json({ error: 'A signed-in account with an email is required.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const plan = typeof body.plan === 'string' ? body.plan : 'diy_social';

    const planPrices = {
      diy_social: { amount: 9700, name: 'DIY Social', label: 'DIY Social', monthly_price: 97 },
      diy_suite: { amount: 19700, name: 'DIY Marketing Suite', label: 'DIY Marketing Suite', monthly_price: 197 },
    };

    if (!Object.prototype.hasOwnProperty.call(planPrices, plan)) {
      return Response.json({ error: 'Invalid plan selection.' }, { status: 400 });
    }

    const selectedPlan = plan === 'diy_social' ? planPrices.diy_social : planPrices.diy_suite;
    const stripeIdempotencyBase = `diy-checkout:${checkoutUserId}:${plan}`;

    // Do not create duplicate paid checkout sessions for the same account.
    const existingSubs = await base44.asServiceRole.entities.DIYSubscription.filter(
      { user_email: checkoutUserEmail, status: { $in: ['active', 'pending'] } }
    );

    if (existingSubs.length > 0) {
      return Response.json({
        error: 'You already have an active DIY subscription or checkout in progress.',
      }, { status: 400 });
    }

    // Create Stripe customer
    const stripeResponse = await fetch('https://api.stripe.com/v1/customers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Idempotency-Key': `${stripeIdempotencyBase}:customer`,
      },
      body: new URLSearchParams({
        email: checkoutUserEmail,
        name: user.full_name || 'DIY Customer',
        metadata: JSON.stringify({
          app_user_email: checkoutUserEmail,
          app_user_id: checkoutUserId,
        }),
      }),
    });

    const customer = await stripeResponse.json();

    if (!customer.id) {
      throw new Error('Failed to create Stripe customer');
    }

    // Create checkout session
    const checkoutResponse = await fetch(
      'https://api.stripe.com/v1/checkout/sessions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Idempotency-Key': `${stripeIdempotencyBase}:session`,
        },
        body: new URLSearchParams({
          customer: customer.id,
          mode: 'subscription',
          payment_method_types: 'card',
          line_items: JSON.stringify([
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: selectedPlan.name,
                  description: 'AI-powered marketing tools and automation',
                  metadata: {
                    plan_type: plan,
                  },
                },
                recurring: {
                  interval: 'month',
                  interval_count: 1,
                },
                unit_amount: selectedPlan.amount,
              },
              quantity: 1,
            },
          ]),
          success_url: `${APP_URL}/client/diy-onboarding?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
          cancel_url: `${APP_URL}/nta/diy-growth-system`,
        }),
      }
    );

    const session = await checkoutResponse.json();

    if (!session.url) {
      throw new Error('Failed to create checkout session');
    }

    // Store initial subscription record with pending status
    const subscription = await base44.asServiceRole.entities.DIYSubscription.create({
      user_email: checkoutUserEmail,
      stripe_customer_id: customer.id,
      stripe_subscription_id: '',
      status: 'pending',
      plan_type: plan,
      current_plan: plan,
      monthly_price: selectedPlan.monthly_price,
      tier_label: selectedPlan.label,
      onboarding_completed: false,
      onboarding_step: 0,
    });

    return Response.json({
      stripe_url: session.url,
      subscription_id: subscription.id,
    });
  } catch (error) {
    console.error('Error creating checkout:', error);
    return Response.json(
      { error: error.message || 'Failed to create checkout' },
      { status: 500 }
    );
  }
});