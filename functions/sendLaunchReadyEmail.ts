import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { entity_id } = await req.json();

    // Fetch the proposal
    const proposal = await base44.asServiceRole.entities.RebuildProposal.get(entity_id);

    if (!proposal) {
      return Response.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Only send email if status is ready_for_launch
    if (proposal.status !== 'ready_for_launch') {
      return Response.json({ message: 'Status not ready_for_launch, skipping email' });
    }

    // Check if client email exists
    if (!proposal.client_email) {
      return Response.json({ error: 'No client email found' }, { status: 400 });
    }

    // Send the email
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: proposal.client_email,
      subject: 'Your website is ready to launch',
      body: `
Hello ${proposal.client_name},

Your new website is complete and ready to go live.

To launch, please complete the final payment using the secure link below:

${proposal.final_payment_link || 'https://buy.stripe.com/14A28sbM64KI9DPdltfMA09'}

Final Payment Amount: $${proposal.final_amount || 500}

If you have any questions, please don't hesitate to reach out.

Best regards,
New Tech Advertising Team
      `
    });

    return Response.json({ 
      success: true, 
      message: 'Launch ready email sent',
      sent_to: proposal.client_email 
    });
  } catch (error) {
    console.error('Error sending launch ready email:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});