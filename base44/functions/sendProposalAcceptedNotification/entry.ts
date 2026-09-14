import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

const MAX_BODY_BYTES = 4_096;

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin' && user.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const declaredLength = Number(req.headers.get('content-length') || 0);
    if (declaredLength > MAX_BODY_BYTES) {
      return Response.json({ error: 'Request too large' }, { status: 413 });
    }

    const rawBody = await req.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return Response.json({ error: 'Request too large' }, { status: 413 });
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody || '{}');
    } catch {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }
    if (!payload || Array.isArray(payload) || typeof payload !== 'object') {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const proposalTitle = typeof payload.proposal_title === 'string'
      ? payload.proposal_title.trim().slice(0, 200)
      : 'Untitled';
    const signerName = typeof payload.signer_name === 'string'
      ? payload.signer_name.trim().slice(0, 160)
      : 'Unknown';
    const companyName = typeof payload.company_name === 'string'
      ? payload.company_name.trim().slice(0, 200)
      : 'N/A';

    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'NTA — Proposal Accepted',
      to: 'info@newtechadvertising.com',
      subject: `Proposal Accepted: ${proposalTitle || 'Untitled'}`,
      body: `Proposal "${proposalTitle}" has been accepted.\nSigned by: ${signerName}\nCompany: ${companyName}\nDate: ${new Date().toLocaleDateString()}`,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('[sendProposalAcceptedNotification] Error:', error?.message || error);
    return Response.json({ error: 'Notification failed' }, { status: 500 });
  }
});