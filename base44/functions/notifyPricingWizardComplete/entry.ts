import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const authUser = await base44.auth.me().catch(() => null);
    if (!authUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (authUser.role !== 'admin' && authUser.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }
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

    // Route the completed wizard to the private office's canonical pipeline.
    const name = user_email ? user_email.split('@')[0] : 'Anonymous Wizard User';
    const intakeResponse = await base44.asServiceRole.functions.invoke('ntaUnifiedIntake', {
      submission_type: 'pricing_wizard',
      offer_type: 'consultation',
      mapping_confidence: 'hardcoded',
      mapping_notes: 'Pricing Wizard completion; recommended plan preserved in notes',
      detected_route: '/find-your-plan',
      detected_component: 'notifyPricingWizardComplete',
      source_system: 'website',
      source_page: source_url || '/find-your-plan',
      source_url: source_url || '/find-your-plan',
      name,
      email: user_email || '',
      notes: `Pricing Wizard Results:
- Industry: ${industry}
- Current Marketing: ${current_marketing}
- Time Available: ${time_available}
- Primary Goal: ${primary_goal}
- Budget Comfort: ${budget_comfort}
- Recommended Plan: ${recommended_plan}`,
      selected_package: recommended_plan || '',
      raw_payload: body,
    });
    const intakeResult = intakeResponse?.data ?? intakeResponse;

    await base44.asServiceRole.entities.SystemLog.create({
      event_type: 'Pricing Wizard Completion',
      status: 'success',
      source_system: 'website',
      source_route: '/find-your-plan',
      workflow_type: 'intake',
      message: `Pricing Wizard completed by ${user_email || 'anonymous'}. Recommended: ${recommended_plan}`,
      payload_snapshot: JSON.stringify(body)
    });

    return Response.json({
      success: true,
      id: wizardLead.id,
      submission_id: intakeResult?.submission_id || null,
      sales_lead_id: intakeResult?.sales_lead_id || null,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});