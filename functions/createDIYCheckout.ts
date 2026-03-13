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

    // Check if user already has active DIY subscription
    const existingSubs = await base44.entities.DIYSubscription.filter(
      { user_email: user.email, status: 'active' }
    );

    if (existingSubs.length > 0) {
      return Response.json({
        error: 'You already have an active DIY subscription',
      }, { status: 400 });
    }

    // Create Stripe customer
    const stripeResponse = await fetch('https://api.stripe.com/v1/customers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: user.email,
        name: user.full_name || 'DIY Customer',
        metadata: JSON.stringify({
          app_user_email: user.email,
          app_user_id: user.id,
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
                  name: 'NTA DIY Growth System',
                  description: 'AI-powered marketing tools and automation',
                  metadata: {
                    plan_type: 'diy_growth_system',
                  },
                },
                recurring: {
                  interval: 'month',
                  interval_count: 1,
                },
                unit_amount: 9900, // $99.00
              },
              quantity: 1,
            },
          ]),
          success_url: `${APP_URL}/client/diy-onboarding?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${APP_URL}/nta/diy-growth-system`,
        }),
      }
    );

    const session = await checkoutResponse.json();

    if (!session.url) {
      throw new Error('Failed to create checkout session');
    }

    // Store initial subscription record with pending status
    const subscription = await base44.entities.DIYSubscription.create({
      user_email: user.email,
      stripe_customer_id: customer.id,
      stripe_subscription_id: '',
      status: 'pending',
      plan_type: 'diy_growth_system',
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