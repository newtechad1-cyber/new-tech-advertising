import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const {
      industry,
      current_marketing,
      time_available,
      primary_goal,
      budget_comfort,
      recommended_plan,
      user_email,
      source_url
    } = body;

    // Create PricingWizardLead record
    const wizardLead = await base44.asServiceRole.entities.PricingWizardLead.create({
      industry,
      current_marketing,
      time_available,
      primary_goal,
      budget_comfort,
      recommended_plan,
      user_email,
      completed_at: new Date().toISOString(),
      source_url
    });

    // Create a corresponding Lead record
    const name = user_email ? user_email.split('@')[0] : 'Anonymous Wizard User';
    
    await base44.asServiceRole.entities.Lead.create({
      name,
      email: user_email || '',
      service_needed: recommended_plan,
      source_page: source_url || '/find-your-plan',
      source_campaign: 'pricing_wizard',
      status: 'new',
      notes: `Pricing Wizard Results:
- Industry: ${industry}
- Current Marketing: ${current_marketing}
- Time Available: ${time_available}
- Primary Goal: ${primary_goal}
- Budget Comfort: ${budget_comfort}
- Recommended Plan: ${recommended_plan}
`
    });

    await base44.asServiceRole.entities.SystemLog.create({
      event_type: 'Pricing Wizard Completion',
      status: 'success',
      source_system: 'website',
      source_route: '/find-your-plan',
      workflow_type: 'intake',
      message: `Pricing Wizard completed by ${user_email || 'anonymous'}. Recommended: ${recommended_plan}`,
      payload_snapshot: JSON.stringify(body)
    });

    return Response.json({ success: true, id: wizardLead.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});