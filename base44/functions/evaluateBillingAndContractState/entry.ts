import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Evaluate Billing & Contract State
 * Inspects contract, subscription, entitlements, and usage to determine commercial intelligence
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { company_id } = body;

    // Get contract and subscription state
    const contract = await getActiveContract(base44, company_id);
    const subscription = contract ? await getSubscription(base44, contract.id) : null;
    const plan = contract?.plan_id ? await getPlan(base44, contract.plan_id) : null;
    const entitlements = plan ? await getPlanEntitlements(base44, plan.id) : [];
    const usage = await getUsageMeters(base44, company_id, contract?.id);
    const lineItems = contract ? await getLineItems(base44, contract.id) : [];
    const billingEvents = contract ? await getBillingEvents(base44, company_id, contract.id) : [];

    // Evaluate contract intelligence
    const intelligence = {
      company_id,
      has_active_contract: !!contract,
      contract_state: null,
      subscription_health: null,
      entitlement_analysis: null,
      billing_risk: null,
      renewal_intelligence: null,
      expansion_opportunities: null,
      recommendations: [],
      timestamp: new Date().toISOString()
    };

    if (!contract) {
      intelligence.contract_state = {
        status: 'no_contract',
        message: 'No active contract found'
      };
      return Response.json(intelligence);
    }

    // 1. Contract State
    intelligence.contract_state = evaluateContractState(contract);

    // 2. Subscription Health
    if (subscription) {
      intelligence.subscription_health = evaluateSubscriptionHealth(subscription);
    }

    // 3. Entitlement Analysis
    if (entitlements.length > 0) {
      intelligence.entitlement_analysis = evaluateEntitlements(entitlements, usage);
    }

    // 4. Billing Risk
    intelligence.billing_risk = evaluateBillingRisk(subscription, billingEvents);

    // 5. Renewal Intelligence
    intelligence.renewal_intelligence = evaluateRenewalIntelligence(contract, billingEvents);

    // 6. Expansion Opportunities
    intelligence.expansion_opportunities = evaluateExpansionOpportunities(
      contract,
      entitlements,
      usage,
      plan
    );

    // 7. Generate recommendations
    intelligence.recommendations = generateRecommendations(intelligence, contract, subscription);

    // Persist critical intelligence to events and recommendations
    await persistIntelligence(base44, intelligence, contract);

    return Response.json(intelligence);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// DATA RETRIEVAL
// ═══════════════════════════════════════════════════════════════════════════════

async function getActiveContract(base44, company_id) {
  try {
    const contracts = await base44.asServiceRole.entities.Contracts.filter({
      company_id,
      status: { $in: ['active', 'expiring', 'paused'] }
    });
    return contracts.length > 0 ? contracts[0] : null;
  } catch (error) {
    return null;
  }
}

async function getSubscription(base44, contract_id) {
  try {
    const subs = await base44.asServiceRole.entities.Subscriptions.filter({
      contract_id,
      active: true
    });
    return subs.length > 0 ? subs[0] : null;
  } catch (error) {
    return null;
  }
}

async function getPlan(base44, plan_id) {
  try {
    const plans = await base44.asServiceRole.entities.Plans.filter({ id: plan_id });
    return plans.length > 0 ? plans[0] : null;
  } catch (error) {
    return null;
  }
}

async function getPlanEntitlements(base44, plan_id) {
  try {
    return await base44.asServiceRole.entities.PlanEntitlements.filter({
      plan_id,
      active: true
    });
  } catch (error) {
    return [];
  }
}

async function getUsageMeters(base44, company_id, contract_id) {
  try {
    const query = { company_id };
    if (contract_id) query.contract_id = contract_id;
    
    // Get current month usage
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    return await base44.asServiceRole.entities.UsageMeters.filter(query).then(meters =>
      meters.filter(m => new Date(m.period_start) >= firstDay)
    );
  } catch (error) {
    return [];
  }
}

async function getLineItems(base44, contract_id) {
  try {
    return await base44.asServiceRole.entities.ContractLineItems.filter({ contract_id });
  } catch (error) {
    return [];
  }
}

async function getBillingEvents(base44, company_id, contract_id) {
  try {
    const query = { company_id };
    if (contract_id) query.contract_id = contract_id;
    
    return await base44.asServiceRole.entities.BillingEvents.filter(query).then(events =>
      events.sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
    );
  } catch (error) {
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVALUATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function evaluateContractState(contract) {
  const now = new Date();
  const renewalDate = new Date(contract.renewal_date || contract.end_date);
  const daysUntilRenewal = Math.floor((renewalDate - now) / (1000 * 60 * 60 * 24));

  return {
    status: contract.status,
    contract_type: contract.contract_type,
    start_date: contract.start_date,
    renewal_date: contract.renewal_date || contract.end_date,
    days_until_renewal: daysUntilRenewal,
    renewal_urgency: daysUntilRenewal <= 30 ? 'critical' : daysUntilRenewal <= 60 ? 'high' : 'normal',
    auto_renew: contract.auto_renew,
    monthly_value: contract.monthly_value || 0,
    total_contract_value: contract.total_contract_value || 0
  };
}

function evaluateSubscriptionHealth(subscription) {
  return {
    status: subscription.subscription_status,
    billing_status: subscription.billing_status,
    current_period_start: subscription.current_period_start,
    current_period_end: subscription.current_period_end,
    next_invoice_date: subscription.next_invoice_date,
    recurring_amount: subscription.recurring_amount || 0,
    is_at_risk: ['past_due', 'error'].includes(subscription.billing_status),
    days_in_current_period: calculateDaysBetween(
      new Date(subscription.current_period_start),
      new Date(subscription.current_period_end)
    )
  };
}

function evaluateEntitlements(entitlements, usage) {
  const analysis = {
    entitlements: [],
    total_overage_value: 0,
    has_overages: false
  };

  for (const ent of entitlements) {
    const usageItem = usage.find(u => u.meter_type === ent.entitlement_type);
    const used = usageItem?.used_quantity || 0;
    const included = ent.included_quantity || 0;
    const overage = Math.max(0, used - included);

    analysis.entitlements.push({
      entitlement: ent.entitlement_name,
      type: ent.entitlement_type,
      included: included,
      used: used,
      overage: overage,
      overage_allowed: ent.overage_allowed,
      overage_value: overage * (ent.overage_rate || 0),
      at_capacity: used >= included * 0.8,
      exceeded: overage > 0
    });

    if (overage > 0) {
      analysis.has_overages = true;
      analysis.total_overage_value += overage * (ent.overage_rate || 0);
    }
  }

  return analysis;
}

function evaluateBillingRisk(subscription, billingEvents) {
  if (!subscription) {
    return { risk_level: 'unknown', is_at_risk: false };
  }

  const recent_failures = billingEvents.filter(e =>
    e.event_type === 'invoice_failed' &&
    daysAgo(new Date(e.event_date)) <= 30
  ).length;

  return {
    risk_level:
      subscription.billing_status === 'overdue' ? 'critical' :
      subscription.billing_status === 'error' || recent_failures > 1 ? 'high' :
      subscription.billing_status === 'pending' ? 'medium' :
      'low',
    is_at_risk: ['overdue', 'error', 'past_due'].includes(subscription.billing_status),
    recent_failures,
    billing_status: subscription.billing_status
  };
}

function evaluateRenewalIntelligence(contract, billingEvents) {
  const now = new Date();
  const renewalDate = new Date(contract.renewal_date || contract.end_date);
  const daysUntilRenewal = Math.floor((renewalDate - now) / (1000 * 60 * 60 * 24));

  const renewalEvent = billingEvents.find(e =>
    e.event_type === 'renewal_due' &&
    new Date(e.event_date) >= now
  );

  return {
    renewal_date: contract.renewal_date || contract.end_date,
    days_until_renewal: daysUntilRenewal,
    is_expiring: daysUntilRenewal <= 90,
    is_urgent: daysUntilRenewal <= 30,
    auto_renew: contract.auto_renew,
    renewal_due_event_exists: !!renewalEvent,
    expected_mrr: contract.monthly_value || 0
  };
}

function evaluateExpansionOpportunities(contract, entitlements, usage, plan) {
  const opportunities = [];

  // Overage-based expansion
  for (const ent of entitlements) {
    const usageItem = usage.find(u => u.meter_type === ent.entitlement_type);
    const used = usageItem?.used_quantity || 0;
    const included = ent.included_quantity || 0;

    if (used > included * 1.5) {
      opportunities.push({
        type: 'overage_trending',
        service: ent.entitlement_type,
        current_usage: used,
        included: included,
        recommendation: 'Upgrade plan to include more ' + ent.entitlement_type,
        potential_revenue: Math.round((used - included) * (ent.overage_rate || 0))
      });
    }
  }

  // Trial-based expansion
  if (contract.contract_type === 'trial') {
    opportunities.push({
      type: 'trial_conversion',
      recommendation: 'Trial ending soon - propose paid plan conversion',
      potential_revenue: contract.monthly_value || plan?.base_price || 0
    });
  }

  // Project-to-retainer
  if (contract.contract_type === 'project') {
    opportunities.push({
      type: 'project_to_retainer',
      recommendation: 'Project-based client - propose ongoing retainer',
      potential_revenue: (contract.monthly_value || plan?.base_price || 0) * 12
    });
  }

  return opportunities;
}

function generateRecommendations(intelligence, contract, subscription) {
  const recs = [];

  // Renewal urgency
  if (intelligence.renewal_intelligence?.is_urgent) {
    recs.push({
      type: 'renewal_urgency',
      priority: 'critical',
      message: `Contract renews in ${intelligence.renewal_intelligence.days_until_renewal} days`
    });
  } else if (intelligence.renewal_intelligence?.is_expiring) {
    recs.push({
      type: 'renewal_upcoming',
      priority: 'high',
      message: `Contract renews in ${intelligence.renewal_intelligence.days_until_renewal} days`
    });
  }

  // Billing risk
  if (intelligence.billing_risk?.is_at_risk) {
    recs.push({
      type: 'billing_risk',
      priority: 'critical',
      message: `Account is ${intelligence.billing_risk.billing_status}`
    });
  }

  // Entitlement overages
  if (intelligence.entitlement_analysis?.has_overages) {
    recs.push({
      type: 'overage_expansion',
      priority: 'high',
      message: `Account exceeding entitlements - potential overage revenue: $${intelligence.entitlement_analysis.total_overage_value}`
    });
  }

  // Expansion opportunities
  intelligence.expansion_opportunities?.forEach(opp => {
    recs.push({
      type: opp.type,
      priority: 'medium',
      message: opp.recommendation,
      potential_revenue: opp.potential_revenue
    });
  });

  return recs;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PERSISTENCE
// ═══════════════════════════════════════════════════════════════════════════════

async function persistIntelligence(base44, intelligence, contract) {
  try {
    // Create renewal_due event if needed
    if (intelligence.renewal_intelligence?.is_expiring && !intelligence.renewal_intelligence?.renewal_due_event_exists) {
      await base44.asServiceRole.entities.BillingEvents.create({
        company_id: intelligence.company_id,
        contract_id: contract.id,
        event_type: 'renewal_due',
        event_date: contract.renewal_date || contract.end_date,
        status: 'scheduled',
        summary: `Renewal due for contract: ${contract.contract_name}`
      });
    }

    // Mark contract as expiring if days are critical
    if (intelligence.contract_state?.renewal_urgency === 'critical' && contract.status !== 'expiring') {
      await base44.asServiceRole.entities.Contracts.update(contract.id, {
        status: 'expiring'
      });
    }
  } catch (error) {
    console.error('Error persisting intelligence:', error);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function calculateDaysBetween(d1, d2) {
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}

function daysAgo(date) {
  return Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
}