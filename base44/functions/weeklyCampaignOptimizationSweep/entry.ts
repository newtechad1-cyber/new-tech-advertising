import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Get all active fulfillment workrooms (indicates active accounts)
    const activeWorkrooms = await base44.asServiceRole.entities.FulfillmentWorkrooms.filter({
      status: { $in: ['active', 'in_progress'] }
    });

    if (!activeWorkrooms || activeWorkrooms.length === 0) {
      return Response.json({
        success: true,
        message: 'No active workrooms found',
        accounts_analyzed: 0
      });
    }

    // Get unique company IDs
    const companyIds = [...new Set(activeWorkrooms.map(wr => wr.company_id))];

    console.log(`[OptimizationSweep] Analyzing ${companyIds.length} active accounts`);

    const analyzed = [];
    const errors = [];

    // Analyze each company
    for (const companyId of companyIds) {
      try {
        const response = await base44.asServiceRole.functions.invoke('analyzeCampaignOptimization', {
          company_id: companyId
        });

        if (response.data?.success) {
          analyzed.push({
            company_id: companyId,
            opportunities: response.data.opportunities_created,
            signals: response.data.signals_created
          });
        } else {
          errors.push({ company_id, error: response.data?.error });
        }
      } catch (error) {
        console.error(`Error analyzing ${companyId}:`, error);
        errors.push({ company_id, error: error.message });
      }
    }

    // Log summary
    const totalOpportunitiesCreated = analyzed.reduce((sum, a) => sum + a.opportunities, 0);
    const totalSignalsCreated = analyzed.reduce((sum, a) => sum + a.signals, 0);

    console.log(`[OptimizationSweep] Complete: ${analyzed.length} accounts, ${totalOpportunitiesCreated} opportunities, ${totalSignalsCreated} signals`);

    return Response.json({
      success: true,
      message: 'Weekly optimization sweep completed',
      accounts_analyzed: analyzed.length,
      total_opportunities_created: totalOpportunitiesCreated,
      total_signals_created: totalSignalsCreated,
      errors: errors.length > 0 ? errors : null
    });

  } catch (error) {
    console.error('Sweep error:', error);
    return Response.json({ error: error.message, success: false }, { status: 500 });
  }
});