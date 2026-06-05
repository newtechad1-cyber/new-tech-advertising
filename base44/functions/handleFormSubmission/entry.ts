import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const payload = await req.json();
        
        const submission = payload.data;
        if (!submission) {
             return Response.json({ success: true, message: 'No data' });
        }

        const name = submission.name || '';
        const nameParts = name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // 1. Create SalesLead
        await base44.asServiceRole.entities.SalesLead.create({
            first_name: firstName,
            last_name: lastName,
            business_name: submission.business_name || name || 'Unknown Business',
            email: submission.email || '',
            phone: submission.phone || '',
            lead_source: 'website',
            status: 'new',
            opportunity_notes: `Form Submission: ${submission.submission_type || 'Website Form'}\nSource: ${submission.source_page || 'Unknown'}\nNotes: ${submission.notes || ''}`
        });

        // 2. Send Internal Notification Email
        await base44.asServiceRole.integrations.Core.SendEmail({
            to: 'info@newtechadvertising.com',
            subject: `🎯 New Lead: ${name} — ${submission.submission_type || 'Website Form'}`,
            body: `New form submission received!\n\nName: ${name}\nEmail: ${submission.email}\nPhone: ${submission.phone}\nBusiness: ${submission.business_name || 'N/A'}\nForm: ${submission.submission_type || 'Website Form'}\nSource: ${submission.source_page || 'Website Form'}\nNotes:\n${submission.notes || 'None'}`
        });

        // 3. Send Thank You Email to Submitter
        if (submission.email) {
            await base44.asServiceRole.integrations.Core.SendEmail({
                to: submission.email,
                from_name: 'Rick Hesse',
                subject: `Thanks for reaching out, ${firstName || name}!`,
                body: `Hi ${firstName || name},\n\nThanks for reaching out to New Tech Advertising! We received your submission and I'll be in touch shortly.\n\nIn the meantime, here are a couple ways to keep moving:\n\n📅 Book a free strategy call:\nhttps://calendar.app.google/p6ieYanvwhixXxZ67\n\n📱 Call or text me directly:\n641-420-8816\n\n📚 Browse our Learning Center:\nhttps://newtechadvertising.com/learning-center\n\nI help local businesses in Mason City, Rochester, Austin, and Albert Lea get found online and run smarter. Looking forward to connecting.\n\nRick Hesse\nNew Tech Advertising\nnewtechadvertising.com`
            });
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error handling form submission:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});