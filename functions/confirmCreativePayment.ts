import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

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

    // Check if already paid
    if (proposal.creative_payment_status === 'paid') {
      return Response.json({ 
        confirmed: true,
        message: 'Payment already confirmed'
      });
    }

    // Check if payment is not required
    if (proposal.creative_payment_status === 'not_required') {
      return Response.json({ 
        confirmed: true,
        message: 'Payment not required'
      });
    }

    // Verify payment with Stripe if we have a payment link
    if (proposal.creative_payment_link) {
      // Extract checkout session ID from the payment link
      const sessionIdMatch = proposal.creative_payment_link.match(/checkout\/([^/?]+)/);
      
      if (sessionIdMatch) {
        const sessionId = sessionIdMatch[1];
        
        try {
          const session = await stripe.checkout.sessions.retrieve(sessionId);
          
          if (session.payment_status === 'paid') {
            // Update proposal to paid status
            await base44.asServiceRole.entities.Proposal.update(proposal_id, {
              creative_payment_status: 'paid',
              creative_paid_at: new Date().toISOString()
            });

            return Response.json({ 
              confirmed: true,
              message: 'Payment confirmed successfully'
            });
          }
        } catch (stripeError) {
          console.error('Stripe verification error:', stripeError);
        }
      }
    }

    // Payment not confirmed yet
    return Response.json({ 
      confirmed: false,
      message: 'Payment not yet confirmed'
    });

  } catch (error) {
    console.error('Error confirming payment:', error);
    return Response.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
});