import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2024-12-18.acacia'
});

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    // Verify webhook signature (async version for Deno)
    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const leadId = session.metadata.lead_id;
      const packageName = session.metadata.package;

      // Update lead status
      await base44.asServiceRole.entities.AdaLead.update(leadId, {
        status: 'paid'
      });

      // Track activity
      await base44.asServiceRole.entities.LeadActivity.create({
        lead_id: leadId,
        activity_type: 'payment_attempted',
        details: `Payment successful - Checkout session ${session.id}`,
        metadata: {
          checkout_session_id: session.id,
          customer_id: session.customer,
          subscription_id: session.subscription
        }
      });

      // Fetch lead details for webhook
      const leads = await base44.asServiceRole.entities.AdaLead.filter({ id: leadId });
      const lead = leads[0];

      // Emit payment success event
      await base44.asServiceRole.functions.invoke('adaWebhookHandler', {
        event: 'payment_success',
        lead_id: leadId,
        checkout_session_id: session.id,
        customer_id: session.customer,
        subscription_id: session.subscription,
        package: packageName,
        contact: {
          name: lead.full_name,
          email: lead.email,
          phone: lead.phone,
          business: lead.business_name
        },
        pricing: {
          setup_price: lead.setup_price,
          monthly_price: lead.monthly_price
        },
        stripe_data: {
          amount_total: session.amount_total / 100,
          currency: session.currency
        }
      });
    }

    return Response.json({ received: true });

  } catch (error) {
    console.error('Stripe webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});