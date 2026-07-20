
import { base44 } from '@base44/sdk';

export default async function(req, res) {
  // Only internal workflows (e.g. from automations or internal services via signed requests) should call this.
  // For Base44, we can verify that this request came from a trusted context.
  // Base44 internal calls typically bypass public HTTP or we can enforce an internal API key.
  // Let's require a shared secret passed in headers or body to prove it's an internal call.
  
  const authHeader = req.headers.get?.('authorization') || req.headers.authorization;
  const internalSecret = Deno.env.get('AGENT_WEBHOOK_KEY'); // Reuse an internal secret for service-to-service auth
  
  if (!internalSecret || authHeader !== `Bearer ${internalSecret}`) {
    // Alternatively, if there's no reliable internal header, we can just block direct public calls 
    // but the prompt says "Require an authenticated internal workflow or an authorized NTA administrator."
    // Let's assume an admin token is provided, or internal secret.
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') {
      if (!internalSecret || authHeader !== `Bearer ${internalSecret}`) {
        return res.status(403).json({ error: 'Forbidden. Internal or admin use only.' });
      }
    }
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { session_id, provider, operation, model_or_service, input_units, output_units, audio_seconds, approximate_cost_usd, completion_outcome } = req.body;
  
  if (!session_id) return res.status(400).json({ error: 'Missing session_id' });

  const now = new Date().toISOString();
  
  const usage = await base44.asServiceRole.entities.DiscoveryUsageCost.create({
    session_id,
    occurred_at: now,
    provider: String(provider),
    operation,
    model_or_service: String(model_or_service),
    input_units: Number(input_units) || 0,
    output_units: Number(output_units) || 0,
    audio_seconds: Number(audio_seconds) || 0,
    approximate_cost_usd: Number(approximate_cost_usd),
    completion_outcome
  });

  return res.json(usage);
}
