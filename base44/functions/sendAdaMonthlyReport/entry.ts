import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { lead_id, new_issues_count, high_priority_count, top_recommendation } = await req.json();

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
    return Response.json({ error: error.message }, { status: 500 });
  }
});