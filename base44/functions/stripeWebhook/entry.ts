import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), { apiVersion: '2024-12-18.acacia' });

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const obj = event.data.object;

    // ── SUBSCRIPTION UPDATED ──────────────────────────────────────
    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
      const sub = obj;
      const customers = await base44.asServiceRole.entities.BillingCustomers.filter({ stripe_subscription_id: sub.id });
      if (customers.length > 0) {
        await base44.asServiceRole.entities.BillingCustomers.update(customers[0].id, {
          billing_status: sub.status,
          current_period_start: new Date(sub.current_period_start * 1000).toISOString().split('T')[0],
          current_period_end: new Date(sub.current_period_end * 1000).toISOString().split('T')[0],
          cancel_at_period_end: sub.cancel_at_period_end
        });
      }
    }

    // ── SUBSCRIPTION DELETED / CANCELLED ─────────────────────────
    if (event.type === 'customer.subscription.deleted') {
      const sub = obj;
      const customers = await base44.asServiceRole.entities.BillingCustomers.filter({ stripe_subscription_id: sub.id });
      if (customers.length > 0) {
        await base44.asServiceRole.entities.BillingCustomers.update(customers[0].id, { billing_status: 'cancelled' });
      }
    }

    // ── INVOICE PAID ──────────────────────────────────────────────
    if (event.type === 'invoice.paid') {
      const inv = obj;
      const customers = await base44.asServiceRole.entities.BillingCustomers.filter({ stripe_customer_id: inv.customer });
      const bc = customers[0];

      if (bc) {
        // Reset failed payment count on successful payment
        await base44.asServiceRole.entities.BillingCustomers.update(bc.id, {
          billing_status: 'active',
          failed_payment_count: 0,
          last_payment_failed_at: null
        });

        // Upsert invoice record
        const existing = await base44.asServiceRole.entities.BillingInvoices.filter({ stripe_invoice_id: inv.id });
        const invData = {
          billing_customer_id: bc.id,
          company_id: bc.company_id || '',
          stripe_invoice_id: inv.id,
          stripe_subscription_id: bc.stripe_subscription_id,
          amount: inv.amount_paid / 100,
          currency: inv.currency,
          status: 'paid',
          invoice_date: new Date(inv.created * 1000).toISOString().split('T')[0],
          paid_at: new Date().toISOString().split('T')[0],
          invoice_pdf_url: inv.invoice_pdf || '',
          hosted_invoice_url: inv.hosted_invoice_url || '',
          description: inv.description || `Invoice ${inv.number}`
        };
        if (existing.length > 0) {
          await base44.asServiceRole.entities.BillingInvoices.update(existing[0].id, invData);
        } else {
          await base44.asServiceRole.entities.BillingInvoices.create(invData);
        }

        // Auto-create FinanceTransaction for revenue
        await base44.asServiceRole.entities.FinanceTransactions.create({
          type: 'revenue',
          amount: inv.amount_paid / 100,
          category: 'subscription',
          company_id: bc.company_id || '',
          billing_customer_id: bc.id,
          stripe_invoice_id: inv.id,
          date: new Date(inv.created * 1000).toISOString().split('T')[0],
          notes: `Stripe invoice ${inv.number || inv.id}`,
          source: 'stripe_auto'
        });
      }
    }

    // ── INVOICE PAYMENT FAILED ────────────────────────────────────
    if (event.type === 'invoice.payment_failed') {
      const inv = obj;
      const customers = await base44.asServiceRole.entities.BillingCustomers.filter({ stripe_customer_id: inv.customer });
      const bc = customers[0];

      if (bc) {
        const newFailCount = (bc.failed_payment_count || 0) + 1;
        const shouldSuspend = newFailCount >= 3;

        await base44.asServiceRole.entities.BillingCustomers.update(bc.id, {
          billing_status: shouldSuspend ? 'suspended' : 'past_due',
          failed_payment_count: newFailCount,
          last_payment_failed_at: new Date().toISOString()
        });

        // If suspended, update related company status too
        if (shouldSuspend && bc.company_id) {
          const companies = await base44.asServiceRole.entities.Companies.filter({ id: bc.company_id });
          if (companies.length > 0) {
            await base44.asServiceRole.entities.Companies.update(bc.company_id, { status: 'suspended' });
          }
          console.log(`[stripeWebhook] Suspended company ${bc.company_id} after ${newFailCount} failed payments`);
        }

        // Upsert failed invoice
        const existing = await base44.asServiceRole.entities.BillingInvoices.filter({ stripe_invoice_id: inv.id });
        const invData = {
          billing_customer_id: bc.id,
          company_id: bc.company_id || '',
          stripe_invoice_id: inv.id,
          stripe_subscription_id: bc.stripe_subscription_id,
          amount: inv.amount_due / 100,
          currency: inv.currency,
          status: 'open',
          invoice_date: new Date(inv.created * 1000).toISOString().split('T')[0],
          invoice_pdf_url: inv.invoice_pdf || '',
          hosted_invoice_url: inv.hosted_invoice_url || ''
        };
        if (existing.length > 0) {
          await base44.asServiceRole.entities.BillingInvoices.update(existing[0].id, invData);
        } else {
          await base44.asServiceRole.entities.BillingInvoices.create(invData);
        }
      }
    }

    // ── LEGACY: checkout.session.completed (existing ADA flow) ────
    if (event.type === 'checkout.session.completed') {
      const session = obj;
      const leadId = session.metadata?.lead_id;
      const packageName = session.metadata?.package;

      if (leadId) {
        await base44.asServiceRole.entities.AdaLead.update(leadId, { status: 'paid' });
        await base44.asServiceRole.entities.LeadActivity.create({
          lead_id: leadId,
          activity_type: 'payment_attempted',
          details: `Payment successful - Checkout session ${session.id}`,
          metadata: { checkout_session_id: session.id, customer_id: session.customer, subscription_id: session.subscription }
        });

        const leads = await base44.asServiceRole.entities.AdaLead.filter({ id: leadId });
        const lead = leads[0];
        if (lead) {
          await base44.asServiceRole.functions.invoke('adaWebhookHandler', {
            event: 'payment_success', lead_id: leadId,
            checkout_session_id: session.id, customer_id: session.customer,
            subscription_id: session.subscription, package: packageName,
            contact: { name: lead.full_name, email: lead.email, phone: lead.phone, business: lead.business_name },
            pricing: { setup_price: lead.setup_price, monthly_price: lead.monthly_price },
            stripe_data: { amount_total: session.amount_total / 100, currency: session.currency }
          });
        }
      }
    }

    return Response.json({ received: true });

  } catch (error) {
    console.error('Stripe webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});