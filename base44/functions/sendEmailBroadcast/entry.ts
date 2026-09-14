import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin' && user.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { email_id } = await req.json();
    if (!email_id) return Response.json({ error: 'email_id is required' }, { status: 400 });

    const emails = await base44.asServiceRole.entities.EmailTemplate.filter({ id: email_id });
    const email = emails[0];
    if (!email) return Response.json({ error: 'Email template not found' }, { status: 404 });

    const subscribers = await base44.asServiceRole.entities.Subscriber.filter({ status: 'active' });

    let sent = 0;
    for (const sub of subscribers) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: sub.email,
          subject: email.subject,
          body: email.body,
        });
        sent++;
      } catch (subError) {
        console.warn(`[sendEmailBroadcast] Failed for ${sub.email}:`, subError?.message);
      }
    }

    await base44.asServiceRole.entities.EmailTemplate.update(email_id, { status: 'sent' });

    return Response.json({ success: true, sent, total: subscribers.length });
  } catch (error) {
    console.error('[sendEmailBroadcast] Error:', error?.message || error);
    return Response.json({ error: 'Broadcast failed' }, { status: 500 });
  }
});