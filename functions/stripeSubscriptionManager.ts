import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), { apiVersion: '2024-12-18.acacia' });

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { action, ...params } = await req.json();

    // --- CREATE CUSTOMER + SUBSCRIPTION ---
    if (action === 'create_subscription') {
      const { company_id, company_name, email, stripe_price_id, plan_id, plan_name, monthly_amount } = params;

      // 1. Create or retrieve Stripe customer
      let stripeCustomer;
      const existing = await base44.asServiceRole.entities.BillingCustomers.filter({ company_id });
      
      if (existing.length > 0 && existing[0].stripe_customer_id) {
        stripeCustomer = await stripe.customers.retrieve(existing[0].stripe_customer_id);
      } else {
        stripeCustomer = await stripe.customers.create({ email, name: company_name, metadata: { company_id } });
      }

      // 2. Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomer.id,
        items: [{ price: stripe_price_id }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: { company_id, plan_id: plan_id || '', plan_name: plan_name || '' }
      });

      // 3. Upsert BillingCustomer record
      const billingData = {
        company_id,
        company_name,
        email,
        stripe_customer_id: stripeCustomer.id,
        stripe_subscription_id: subscription.id,
        plan_id: plan_id || '',
        plan_name: plan_name || '',
        billing_status: subscription.status,
        monthly_amount: monthly_amount || 0,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString().split('T')[0],
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString().split('T')[0],
        failed_payment_count: 0,
        cancel_at_period_end: false
      };

      let billingCustomer;
      if (existing.length > 0) {
        billingCustomer = await base44.asServiceRole.entities.BillingCustomers.update(existing[0].id, billingData);
      } else {
        billingCustomer = await base44.asServiceRole.entities.BillingCustomers.create(billingData);
      }

      // Return client_secret for frontend payment confirmation
      const clientSecret = subscription.latest_invoice?.payment_intent?.client_secret;
      return Response.json({ success: true, subscription_id: subscription.id, client_secret: clientSecret, billing_customer: billingCustomer });
    }

    // --- CANCEL SUBSCRIPTION ---
    if (action === 'cancel_subscription') {
      const { billing_customer_id, at_period_end = true } = params;
      const [bc] = await base44.asServiceRole.entities.BillingCustomers.filter({ id: billing_customer_id });
      if (!bc) return Response.json({ error: 'Billing customer not found' }, { status: 404 });

      await stripe.subscriptions.update(bc.stripe_subscription_id, { cancel_at_period_end: at_period_end });
      await base44.asServiceRole.entities.BillingCustomers.update(bc.id, { cancel_at_period_end: true });

      return Response.json({ success: true });
    }

    // --- GET INVOICES FROM STRIPE ---
    if (action === 'sync_invoices') {
      const { billing_customer_id } = params;
      const [bc] = await base44.asServiceRole.entities.BillingCustomers.filter({ id: billing_customer_id });
      if (!bc) return Response.json({ error: 'Not found' }, { status: 404 });

      const invoices = await stripe.invoices.list({ customer: bc.stripe_customer_id, limit: 20 });

      for (const inv of invoices.data) {
        const existing = await base44.asServiceRole.entities.BillingInvoices.filter({ stripe_invoice_id: inv.id });
        const data = {
          billing_customer_id: bc.id,
          company_id: bc.company_id || '',
          stripe_invoice_id: inv.id,
          stripe_subscription_id: bc.stripe_subscription_id,
          amount: inv.amount_paid / 100,
          currency: inv.currency,
          status: inv.status,
          invoice_date: new Date(inv.created * 1000).toISOString().split('T')[0],
          due_date: inv.due_date ? new Date(inv.due_date * 1000).toISOString().split('T')[0] : '',
          paid_at: inv.status_transitions?.paid_at ? new Date(inv.status_transitions.paid_at * 1000).toISOString().split('T')[0] : '',
          invoice_pdf_url: inv.invoice_pdf || '',
          hosted_invoice_url: inv.hosted_invoice_url || '',
          description: inv.description || ''
        };
        if (existing.length > 0) {
          await base44.asServiceRole.entities.BillingInvoices.update(existing[0].id, data);
        } else {
          await base44.asServiceRole.entities.BillingInvoices.create(data);
        }
      }

      return Response.json({ success: true, count: invoices.data.length });
    }

    // --- GET PAYMENT METHOD ---
    if (action === 'get_payment_method') {
      const { stripe_customer_id } = params;
      const customer = await stripe.customers.retrieve(stripe_customer_id, { expand: ['default_source'] });
      const paymentMethods = await stripe.paymentMethods.list({ customer: stripe_customer_id, type: 'card' });
      return Response.json({ payment_methods: paymentMethods.data });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    console.error('stripeSubscriptionManager error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});