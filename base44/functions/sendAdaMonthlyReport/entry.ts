import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

function isAdminUser(user) {
  const adminEmails = String('' || '')
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
    const lead_id = String(body?.lead_id || '').trim();
    const new_issues_count = Number(body?.new_issues_count || 0);
    const high_priority_count = Number(body?.high_priority_count || 0);
    const top_recommendation = String(body?.top_recommendation || 'All systems looking good').slice(0, 2000);

    if (!/^[A-Za-z0-9_-]{1,128}$/.test(lead_id)) {
      return Response.json({ error: 'Invalid lead_id' }, { status: 400 });
    }
    if (!Number.isFinite(new_issues_count) || !Number.isFinite(high_priority_count)) {
      return Response.json({ error: 'Invalid issue counts' }, { status: 400 });
    }

    const leads = await base44.asServiceRole.entities.AdaLead.filter({ id: lead_id });
    if (leads.length === 0) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    const lead = leads[0];
    const firstName = lead.full_name.split(' ')[0];

    // Send email
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'Rick - New Tech Advertising',
      to: lead.email,
      subject: 'Your ADA monitoring update is ready',
      body: `Hi ${firstName},

Your monthly monitoring report is ready for ${lead.business_name}.

Highlights:
• New issues detected: ${new_issues_count || 0}
• High priority items: ${high_priority_count || 0}
• Recommendations: ${top_recommendation || 'All systems looking good'}

${(new_issues_count > 0 || high_priority_count > 0) ? 'Reply if you want us to implement fixes this month.' : 'Your site is maintaining good accessibility standards.'}

— Rick
New Tech Advertising
641-420-8816
rick@newtechadvertising.com`
    });

    return Response.json({ success: true, message: 'Monthly report sent' });

  } catch (error) {
    console.error('Send monthly report error:', error);
    return Response.json({ error: 'Unable to send monthly report' }, { status: 500 });
  }
});