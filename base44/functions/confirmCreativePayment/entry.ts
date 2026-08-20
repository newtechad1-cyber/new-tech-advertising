import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

function isAdminUser(user) {
  const adminEmails = String(Deno.env.get('ADMIN_EMAILS') || '')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(
    user &&
    (user.role === 'admin' || adminEmails.includes(String(user.email || '').toLowerCase()))
  );
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAdminUser(user)) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const proposal_id = String(body?.proposal_id || '').trim();

    if (!/^[A-Za-z0-9_-]{1,128}$/.test(proposal_id)) {
      return Response.json({ error: 'Invalid proposal_id' }, { status: 400 });
    }

    // This is an administrative confirmation endpoint. Public callers cannot
    // mark a proposal paid from a query string or client-controlled payload.
    const proposals = await base44.asServiceRole.entities.Proposal.filter({ id: proposal_id });
    
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
      details: 'Payment confirmation failed'
    }, { status: 500 });
  }
});