import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const { proposal_id } = await req.json();

    if (!proposal_id) {
      return Response.json({ error: 'proposal_id is required' }, { status: 400 });
    }

    // Load the proposal
    const proposals = await base44.entities.Proposal.filter({ id: proposal_id });
    
    if (proposals.length === 0) {
      return Response.json({ error: 'Proposal not found' }, { status: 404 });
    }

    const proposal = proposals[0];

    // If existing_video, set status to not_required
    if (proposal.creative_option === 'existing_video') {
      await base44.asServiceRole.entities.Proposal.update(proposal_id, {
        creative_payment_status: 'not_required'
      });

      return Response.json({ 
        confirmed: true,
        message: 'Payment not required for existing video'
      });
    }

    // Otherwise, mark as paid
    await base44.asServiceRole.entities.Proposal.update(proposal_id, {
      creative_payment_status: 'paid',
      creative_paid_at: new Date().toISOString()
    });

    // Log activity
    await base44.asServiceRole.entities.ActivityLog.create({
      event_type: 'creative_paid',
      summary: 'Creative payment confirmed',
      metadata: {
        proposal_id: proposal_id,
        creative_option: proposal.creative_option,
        creative_fee: proposal.creative_fee
      },
      user_email: proposal.created_by || 'system'
    });

    return Response.json({ 
      confirmed: true,
      message: 'Payment confirmed successfully'
    });

  } catch (error) {
    console.error('Error confirming payment:', error);
    return Response.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
});