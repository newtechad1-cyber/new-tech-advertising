import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), { apiVersion: '2024-12-18.acacia' });

const PLANS = [
  {
    plan_name: 'Starter',
    description: 'Everything a local business needs to automate marketing.',
    monthly_price: 197,
    billing_interval: 'monthly',
    features: '12 AI social posts/month,AI blog generator,Review monitoring,Basic analytics,Content calendar,3 social channels',
    display_order: 1,
  },
  {
    plan_name: 'Growth',
    description: 'More content, AI video creation, and SEO automation.',
    monthly_price: 297,
    billing_interval: 'monthly',
    features: '20 AI social posts/month,AI video creation,SEO automation,Full content calendar,Advanced analytics,7 social channels,Priority support',
    display_order: 2,
  },
  {
    plan_name: 'Pro',
    description: 'Full platform: AI video campaigns, reputation automation, advanced analytics.',
    monthly_price: 497,
    billing_interval: 'monthly',
    features: 'Everything in Growth,AI video campaigns,Reputation automation,Advanced analytics,Streaming TV ad scripts,Unlimited channels,Dedicated account manager',
    display_order: 3,
  },
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const results = [];

    for (const plan of PLANS) {
      // 1. Create Stripe product
      const stripeProduct = await stripe.products.create({
        name: `NTA ${plan.plan_name}`,
        description: plan.description,
        metadata: { plan_name: plan.plan_name }
      });

      // 2. Create Stripe price (monthly)
      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(plan.monthly_price * 100),
        currency: 'usd',
        recurring: { interval: 'month' },
        nickname: `${plan.plan_name} Monthly`,
      });

      // 3. Check if BillingPlans record exists already
      const existing = await base44.asServiceRole.entities.BillingPlans.filter({ plan_name: plan.plan_name });

      let billingPlan;
      if (existing.length > 0) {
        billingPlan = await base44.asServiceRole.entities.BillingPlans.update(existing[0].id, {
          stripe_price_id: stripePrice.id,
          stripe_product_id: stripeProduct.id,
          monthly_price: plan.monthly_price,
          features: plan.features,
          active: true,
          display_order: plan.display_order,
        });
      } else {
        billingPlan = await base44.asServiceRole.entities.BillingPlans.create({
          ...plan,
          stripe_price_id: stripePrice.id,
          stripe_product_id: stripeProduct.id,
          active: true,
        });
      }

      results.push({
        plan: plan.plan_name,
        stripe_product_id: stripeProduct.id,
        stripe_price_id: stripePrice.id,
        billing_plan_id: billingPlan.id,
      });
    }

    return Response.json({ success: true, plans: results });
  } catch (error) {
    console.error('syncBillingPlans error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});