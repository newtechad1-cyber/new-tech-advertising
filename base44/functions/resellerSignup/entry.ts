import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), { apiVersion: '2024-12-18.acacia' });

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { action, ...params } = await req.json();

    // ── TRACK CLICK ──────────────────────────────────────────────
    if (action === 'track_click') {
      const { link_code } = params;
      const links = await base44.asServiceRole.entities.ResellerSignupLinks.filter({ link_code, active: true });
      if (!links.length) return Response.json({ error: 'Invalid link' }, { status: 404 });
      const link = links[0];
      await base44.asServiceRole.entities.ResellerSignupLinks.update(link.id, { clicks: (link.clicks || 0) + 1 });
      // Return reseller and plan info for the signup page
      const resellers = await base44.asServiceRole.entities.ResellerAccounts.filter({ id: link.reseller_id });
      const branding = await base44.asServiceRole.entities.WhiteLabelBranding.filter({ reseller_id: link.reseller_id, active: true });
      return Response.json({
        link,
        reseller: resellers[0] || null,
        branding: branding[0] || null
      });
    }

    // ── COMPLETE SIGNUP ──────────────────────────────────────────
    if (action === 'complete_signup') {
      const { link_code, company_name, contact_name, email, phone } = params;

      // Validate link
      const links = await base44.asServiceRole.entities.ResellerSignupLinks.filter({ link_code, active: true });
      if (!links.length) return Response.json({ error: 'Invalid signup link' }, { status: 400 });
      const link = links[0];

      if (link.expires_at && new Date(link.expires_at) < new Date()) {
        return Response.json({ error: 'This signup link has expired' }, { status: 400 });
      }

      const resellers = await base44.asServiceRole.entities.ResellerAccounts.filter({ id: link.reseller_id });
      const reseller = resellers[0];
      if (!reseller) return Response.json({ error: 'Reseller not found' }, { status: 400 });

      // 1. Create Stripe customer
      const stripeCustomer = await stripe.customers.create({
        email,
        name: company_name,
        metadata: { reseller_id: reseller.id, reseller_name: reseller.reseller_name, link_code }
      });

      // 2. Create ResellerClient record
      const resellerClient = await base44.asServiceRole.entities.ResellerClients.create({
        reseller_id: reseller.id,
        client_name: company_name,
        client_email: email,
        status: 'trial',
        portal_access_enabled: true,
        branding_override_enabled: reseller.white_label_enabled || false,
        start_date: new Date().toISOString().split('T')[0]
      });

      // 3. Create BillingCustomer record
      const billingCustomer = await base44.asServiceRole.entities.BillingCustomers.create({
        company_name,
        email,
        stripe_customer_id: stripeCustomer.id,
        plan_name: link.plan_name || 'Standard',
        billing_status: 'incomplete',
        monthly_amount: 0,
        failed_payment_count: 0,
        cancel_at_period_end: false
      });

      // 4. Update link conversion count
      await base44.asServiceRole.entities.ResellerSignupLinks.update(link.id, {
        conversions: (link.conversions || 0) + 1
      });

      // 5. If a stripe_price_id exists on the link, create checkout session
      let checkoutUrl = null;
      if (link.stripe_price_id) {
        const session = await stripe.checkout.sessions.create({
          customer: stripeCustomer.id,
          mode: 'subscription',
          line_items: [{ price: link.stripe_price_id, quantity: 1 }],
          success_url: `${req.headers.get('origin') || 'https://app.base44.com'}/client/billing?signup=success`,
          cancel_url: `${req.headers.get('origin') || 'https://app.base44.com'}/signup?link=${link_code}`,
          metadata: { reseller_id: reseller.id, link_code, reseller_client_id: resellerClient.id }
        });
        checkoutUrl = session.url;
      }

      return Response.json({
        success: true,
        reseller_client_id: resellerClient.id,
        billing_customer_id: billingCustomer.id,
        stripe_customer_id: stripeCustomer.id,
        checkout_url: checkoutUrl
      });
    }

    // ── GENERATE LINK CODE ──────────────────────────────────────
    if (action === 'generate_code') {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let code = '';
      for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
      return Response.json({ code });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    console.error('resellerSignup error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});