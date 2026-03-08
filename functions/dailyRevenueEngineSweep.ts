import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Daily Revenue Engine Sweep
 * Runs autonomous revenue engine, advances sequences, refreshes forecasts
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Run autonomous revenue engine
    const engineResult = await base44.functions.invoke('runAutonomousRevenueEngine', {
      scope_type: 'platform'
    });

    // Advance sequence steps
    const sequences = await base44.asServiceRole.entities.RevenueSequences.filter({
      status: 'active',
      auto_run_enabled: true
    });

    let stepsAdvanced = 0;
    for (const seq of sequences) {
      const steps = await base44.asServiceRole.entities.RevenueSequenceSteps.filter({
        revenue_sequence_id: seq.id
      });

      if (steps.length === 0) continue;

      // Get current step
      const currentStep = steps[seq.current_step_index];
      if (!currentStep) continue;

      // Check if step is ready (due date passed)
      const today = new Date();
      const createdDate = new Date(seq.created_date);
      const daysSinceStart = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));

      if (currentStep.due_offset_days && daysSinceStart >= currentStep.due_offset_days) {
        // Mark as executed if not human approval required
        if (!currentStep.requires_human_approval && currentStep.action_status === 'pending') {
          await base44.asServiceRole.entities.RevenueSequenceSteps.update(currentStep.id, {
            action_status: 'executed',
            executed_date: new Date().toISOString()
          });

          // Advance sequence
          const nextIdx = seq.current_step_index + 1;
          if (nextIdx < seq.step_count) {
            await base44.asServiceRole.entities.RevenueSequences.update(seq.id, {
              current_step_index: nextIdx,
              next_step_date: calculateNextStepDate(steps[nextIdx])
            });
            stepsAdvanced++;
          } else {
            // Sequence complete
            await base44.asServiceRole.entities.RevenueSequences.update(seq.id, {
              status: 'completed'
            });
          }
        }
      }
    }

    // Generate revenue forecasts
    const forecastResult = await generateRevenueForecasts(base44);

    return Response.json({
      status: 'success',
      engine_run: engineResult,
      steps_advanced: stepsAdvanced,
      forecasts_generated: forecastResult,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function generateRevenueForecasts(base44) {
  try {
    // Get active opportunities
    const opps = await base44.asServiceRole.entities.RevenueOpportunities.filter({
      status: { $nin: ['won', 'lost', 'dismissed'] }
    });

    const now = new Date();

    // 30-day forecast
    const forecast30End = new Date();
    forecast30End.setDate(forecast30End.getDate() + 30);

    const opps30 = opps.filter(o => {
      const actionDate = new Date(o.next_action_date);
      return actionDate <= forecast30End;
    });

    const value30 = opps30.reduce((sum, o) => sum + (o.estimated_value || 0) * (o.probability_score / 100), 0);

    await base44.asServiceRole.entities.RevenueForecasts.create({
      forecast_label: `30-Day Forecast - ${now.toLocaleDateString()}`,
      forecast_type: '30_day',
      period_start: now.toISOString().split('T')[0],
      period_end: forecast30End.toISOString().split('T')[0],
      estimated_pipeline_value: opps30.reduce((sum, o) => sum + (o.estimated_value || 0), 0),
      estimated_renewal_value: opps30.filter(o => o.opportunity_type === 'renewal').reduce((sum, o) => sum + (o.estimated_value || 0), 0),
      estimated_upsell_value: opps30.filter(o => o.opportunity_type === 'upsell').reduce((sum, o) => sum + (o.estimated_value || 0), 0),
      estimated_conversion_value: Math.round(value30),
      confidence_summary: `Based on ${opps30.length} active opportunities with avg probability ${Math.round(opps30.reduce((s, o) => s + o.probability_score, 0) / opps30.length)}%`
    });

    // 60-day forecast
    const forecast60End = new Date();
    forecast60End.setDate(forecast60End.getDate() + 60);

    const opps60 = opps.filter(o => {
      const actionDate = new Date(o.next_action_date);
      return actionDate <= forecast60End;
    });

    const value60 = opps60.reduce((sum, o) => sum + (o.estimated_value || 0) * (o.probability_score / 100), 0);

    await base44.asServiceRole.entities.RevenueForecasts.create({
      forecast_label: `60-Day Forecast - ${now.toLocaleDateString()}`,
      forecast_type: '60_day',
      period_start: now.toISOString().split('T')[0],
      period_end: forecast60End.toISOString().split('T')[0],
      estimated_pipeline_value: opps60.reduce((sum, o) => sum + (o.estimated_value || 0), 0),
      estimated_renewal_value: opps60.filter(o => o.opportunity_type === 'renewal').reduce((sum, o) => sum + (o.estimated_value || 0), 0),
      estimated_upsell_value: opps60.filter(o => o.opportunity_type === 'upsell').reduce((sum, o) => sum + (o.estimated_value || 0), 0),
      estimated_conversion_value: Math.round(value60),
      confidence_summary: `Based on ${opps60.length} active opportunities`
    });

    // 90-day forecast
    const forecast90End = new Date();
    forecast90End.setDate(forecast90End.getDate() + 90);

    const opps90 = opps.filter(o => {
      const actionDate = new Date(o.next_action_date);
      return actionDate <= forecast90End;
    });

    const value90 = opps90.reduce((sum, o) => sum + (o.estimated_value || 0) * (o.probability_score / 100), 0);

    await base44.asServiceRole.entities.RevenueForecasts.create({
      forecast_label: `90-Day Forecast - ${now.toLocaleDateString()}`,
      forecast_type: '90_day',
      period_start: now.toISOString().split('T')[0],
      period_end: forecast90End.toISOString().split('T')[0],
      estimated_pipeline_value: opps90.reduce((sum, o) => sum + (o.estimated_value || 0), 0),
      estimated_renewal_value: opps90.filter(o => o.opportunity_type === 'renewal').reduce((sum, o) => sum + (o.estimated_value || 0), 0),
      estimated_upsell_value: opps90.filter(o => o.opportunity_type === 'upsell').reduce((sum, o) => sum + (o.estimated_value || 0), 0),
      estimated_conversion_value: Math.round(value90),
      confidence_summary: `Based on ${opps90.length} active opportunities`
    });

    return true;
  } catch (error) {
    console.error('Forecast generation error:', error);
    return false;
  }
}

function calculateNextStepDate(step) {
  if (!step.due_offset_days) return null;
  const date = new Date();
  date.setDate(date.getDate() + step.due_offset_days);
  return date.toISOString().split('T')[0];
}