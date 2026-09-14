import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin' && user.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { email, full_name } = await req.json();
    if (!email) return Response.json({ error: 'email is required' }, { status: 400 });

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: email,
      subject: `Welcome to NTA — Let's Get Your Dashboard Ready`,
      body: `Hi ${full_name || 'there'},\n\nWe noticed you recently signed up for a trial. Let's make sure your dashboard is fully set up!\n\nPlease reply to this email or book a call so we can get you started.\n\nBest,\nThe NTA Team`,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('[sendTrialWelcomeEmail] Error:', error?.message || error);
    return Response.json({ error: 'Email failed to send' }, { status: 500 });
  }
});