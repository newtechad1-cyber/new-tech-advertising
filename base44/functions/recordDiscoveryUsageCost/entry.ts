
import { base44 } from '@base44/sdk';

export default async function(req, res) {
  const { session_id, operation, provider, model_or_service, approximate_cost_usd, completion_outcome, input_units = 0, output_units = 0 } = req.body;
  
  const now = new Date().toISOString();

  const cost = await base44.asServiceRole.entities.DiscoveryUsageCost.create({
    session_id,
    occurred_at: now,
    operation,
    provider,
    model_or_service,
    approximate_cost_usd,
    completion_outcome,
    input_units,
    output_units
  });

  return res.json(cost);
}
  