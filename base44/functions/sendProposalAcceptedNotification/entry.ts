import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { proposal_title, signer_name, company_name } = await req.json();

    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'NTA — Proposal Accepted',
      to: 'info@newtechadvertising.com',
      subject: `Proposal Accepted: ${proposal_title || 'Untitled'}`,
      body: `Proposal "${proposal_title || ''}" has been accepted.\nSigned by: ${signer_name || 'Unknown'}\nCompany: ${company_name || 'N/A'}\nDate: ${new Date().toLocaleDateString()}`,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('[sendProposalAcceptedNotification] Error:', error?.message || error);
    return Response.json({ error: 'Notification failed' }, { status: 500 });
  }
});