import { createClientFromRequest } from 'npm:@base44/sdk@0.8.39';
import Stripe from 'npm:stripe';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { auditId, returnUrl } = body;

    if (!auditId) {
      return Response.json({ error: "Missing auditId" }, { status: 400 });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1TtaOoGjzSQJmBIKNRCU71GG',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${new URL(returnUrl).origin}/diy-checkout-success?session_id={CHECKOUT_SESSION_ID}&audit_id=${auditId}`,
      cancel_url: `${new URL(returnUrl).origin}/?canceled=true`,
      metadata: {
        base44_app_id: Deno.env.get("BASE44_APP_ID"),
        audit_id: auditId
      }
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});