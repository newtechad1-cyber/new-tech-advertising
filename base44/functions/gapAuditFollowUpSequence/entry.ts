import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Find leads
        const allLeads = await base44.asServiceRole.entities.SalesLead.list();
        const activeLeads = allLeads.filter(l => l.status !== 'closed_won' && l.status !== 'closed_lost' && l.audit_sent_date && l.email);

        const now = new Date();

        for (const lead of activeLeads) {
            if (lead.followup3_sent) continue;

            const auditDate = new Date(lead.audit_sent_date);
            const diffTime = Math.abs(now - auditDate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            let shouldUpdate = false;
            let emailSubject = '';
            let emailBody = '';
            const firstName = lead.first_name || lead.contact_name || 'there';
            const businessName = lead.business_name || 'your business';

            if (diffDays >= 14 && !lead.followup3_sent) {
                emailSubject = `Quick question about ${businessName}`;
                emailBody = `Hi ${firstName},\n\nI wanted to follow up one more time on your marketing audit. I know running a business keeps you busy, so I'll keep it short:\n\nAre you still interested in improving your online presence, or is now not the right time?\n\nEither answer is totally fine — I just don't want to keep emailing if it's not helpful.\n\nIf you ever want to revisit it, your audit stays valid and I'm always here: 641-420-8816.\n\nRick Hesse\nNew Tech Advertising`;
                lead.followup3_sent = true;
                lead.followup3_date = now.toISOString().split('T')[0];
                shouldUpdate = true;
            } 
            else if (diffDays >= 7 && !lead.followup2_sent) {
                emailSubject = `What businesses like yours are fixing first`;
                emailBody = `Hi ${firstName},\n\nI've done dozens of marketing audits for local businesses in the Mason City area, and there's a clear pattern — the ones that grow fastest always start with the same 2 things:\n\n1. Getting found on Google (and now AI search like ChatGPT)\n2. Making sure their website converts visitors into calls\n\nYour audit showed some specific opportunities in both areas. If you're curious what a quick win would look like for ${businessName}, I can show you in 15 minutes:\n\n→ https://calendar.app.google/p6ieYanvwhixXxZ67\n\nNo commitment, no contract. Just a look at what's possible.\n\nRick Hesse\nNew Tech Advertising\n641-420-8816`;
                lead.followup2_sent = true;
                lead.followup2_date = now.toISOString().split('T')[0];
                shouldUpdate = true;
            }
            else if (diffDays >= 2 && !lead.followup1_sent) {
                emailSubject = `Did you get a chance to look at your audit?`;
                emailBody = `Hi ${firstName},\n\nJust checking in — I sent over your free marketing gap audit a couple days ago and wanted to make sure it landed in your inbox (not spam!).\n\nIf you have questions about any of the scores or recommendations, I'm happy to walk through it with you. No pitch, no pressure — just helping you understand where your business stands online.\n\n→ Book a 15-minute call: https://calendar.app.google/p6ieYanvwhixXxZ67\n\nOr reply to this email — I read every one.\n\nRick Hesse\nNew Tech Advertising\n641-420-8816`;
                lead.followup1_sent = true;
                lead.followup1_date = now.toISOString().split('T')[0];
                shouldUpdate = true;
            }

            if (shouldUpdate) {
                await base44.asServiceRole.integrations.Core.SendEmail({
                    to: lead.email,
                    from_name: 'Rick Hesse',
                    subject: emailSubject,
                    body: emailBody
                });

                await base44.asServiceRole.entities.SalesLead.update(lead.id, {
                    followup1_sent: lead.followup1_sent,
                    followup1_date: lead.followup1_date,
                    followup2_sent: lead.followup2_sent,
                    followup2_date: lead.followup2_date,
                    followup3_sent: lead.followup3_sent,
                    followup3_date: lead.followup3_date,
                });
            }
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error in gap audit follow up sequence:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});