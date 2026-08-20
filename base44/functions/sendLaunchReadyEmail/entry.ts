import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

function isAdminUser(user) {
  const adminEmails = String(Deno.env.get('ADMIN_EMAILS') || '')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(
    user &&
    (user.is_service === true ||
      user.role === 'admin' ||
      adminEmails.includes(String(user.email || '').toLowerCase()))
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
    const entity_id = String(body?.entity_id || '').trim();
    const old_data = body?.old_data;
    const data = body?.data;

    if (!/^[A-Za-z0-9_-]{1,128}$/.test(entity_id)) {
      return Response.json({ error: 'Invalid entity_id' }, { status: 400 });
    }

    // Fetch the proposal
    const proposal = await base44.asServiceRole.entities.RebuildProposal.get(entity_id);

    if (!proposal) {
      return Response.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Only send email if status is ready_for_launch and wasn't already ready_for_launch
    if (proposal.status !== 'ready_for_launch') {
      return Response.json({ message: 'Status not ready_for_launch, skipping email' });
    }

    if (old_data && old_data.status === 'ready_for_launch') {
      return Response.json({ message: 'Status was already ready_for_launch, skipping email' });
    }

    // Check if client email exists
    if (!proposal.client_email) {
      return Response.json({ error: 'No client email found' }, { status: 400 });
    }

    // Send the email
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: proposal.client_email,
      subject: 'Your website is ready to launch',
      body: `Your new website is complete and ready to go live.

To launch, please complete the final payment using the secure link below.

https://buy.stripe.com/14A28sbM64KI9DPdltfMA09

Once payment is received, we'll publish the site immediately.

— New Tech Advertising`
    });

    return Response.json({ 
      success: true, 
      message: 'Launch ready email sent',
      sent_to: proposal.client_email 
    });
  } catch (error) {
    console.error('Error sending launch ready email:', error);
    return Response.json({ 
      error: 'Unable to send launch-ready notification'
    }, { status: 500 });
  }
});