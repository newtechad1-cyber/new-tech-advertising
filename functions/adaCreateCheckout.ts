import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2024-12-18.acacia'
});

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { lead_id } = await req.json();

    // Fetch lead
    const leads = await base44.asServiceRole.entities.AdaLead.filter({ id: lead_id });
    if (leads.length === 0) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    const lead = leads[0];
    const baseUrl = Deno.env.get('BASE_URL');

    let session;

    if (lead.package === 'Starter') {
      // One-time payment for Starter
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `ADA Starter Package - ${lead.business_name}`,
              description: 'One-time ADA compliance audit and remediation'
            },
            unit_amount: Math.round(lead.setup_price * 100) // Convert to cents
          },
          quantity: 1
        }],
        customer_email: lead.email,
        success_url: `${baseUrl}/ada/success?lead_id=${lead_id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/ada/quote?lead_id=${lead_id}`,
        metadata: {
          lead_id: lead_id,
          package: lead.package,
          business_name: lead.business_name
        }
      });
    } else {
      // Subscription for Growth/Authority
      session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `ADA ${lead.package} Package - ${lead.business_name}`,
              description: 'Monthly ADA compliance monitoring and support'
            },
            unit_amount: Math.round(lead.monthly_price * 100),
            recurring: { interval: 'month' }
          },
          quantity: 1
        }],
        subscription_data: {
          metadata: {
            lead_id: lead_id,
            package: lead.package
          },
          add_invoice_items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Setup Fee',
                description: 'One-time ADA compliance setup and remediation'
              },
              unit_amount: Math.round(lead.setup_price * 100)
            },
            quantity: 1
          }]
        },
        customer_email: lead.email,
        success_url: `${baseUrl}/ada/success?lead_id=${lead_id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/ada/quote?lead_id=${lead_id}`,
        metadata: {
          lead_id: lead_id,
          package: lead.package,
          business_name: lead.business_name
        }
      });
    }

    // Track activity
    await base44.asServiceRole.entities.LeadActivity.create({
      lead_id,
      activity_type: 'payment_attempted',
      details: `Stripe checkout session created: ${session.id}`,
      metadata: { checkout_session_id: session.id }
    });

    // Emit webhook event
    try {
      await base44.asServiceRole.functions.invoke('adaWebhookHandler', {
        event: 'checkout_session_created',
        lead_id: lead_id,
        checkout_session_id: session.id,
        package: lead.package,
        pricing: {
          setup_price: lead.setup_price,
          monthly_price: lead.monthly_price
        }
      });
    } catch (webhookError) {
      console.log('Webhook notification failed:', webhookError);
    }

    return Response.json({ 
      success: true, 
      checkout_url: session.url 
    });

  } catch (error) {
    console.error('Checkout creation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});