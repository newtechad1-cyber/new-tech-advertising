import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const { event, data, old_data } = payload;
    
    // Only handle create and update events
    if (event?.type !== 'create' && event?.type !== 'update') {
      return Response.json({ status: 'ignored', reason: 'Not a create or update event' });
    }

    const subscriber = data;
    if (!subscriber || !subscriber.tags || !Array.isArray(subscriber.tags)) {
      return Response.json({ status: 'ignored', reason: 'No tags available' });
    }

    // Identify newly added tags compared to old_data
    const oldTags = old_data?.tags || [];
    const newTags = subscriber.tags.filter(tag => !oldTags.includes(tag));

    if (newTags.length === 0) {
      return Response.json({ status: 'ignored', reason: 'No new tags added' });
    }

    const base44 = createClientFromRequest(req);

    // Prepare publications mapping
    const publications = {
      'better-business-book': {
        title: 'The Better Business Book',
        fileUrl: 'https://newtechadvertising.com/downloads/Better-Business-Book-Draft.pdf',
        downloadText: 'Download The Better Business Book',
      },
      'practical-ai': {
        title: 'Practical AI for Small Business',
        fileUrl: 'https://newtechadvertising.com/downloads/Practical-AI-Draft.pdf',
        downloadText: 'Download Practical AI',
      },
      'nta-journal': {
        title: 'The NTA Journal',
        fileUrl: null,
        downloadText: 'Read the latest issue online',
      }
    };

    const sentEmails = [];

    // Send emails for each newly requested publication
    for (const tag of newTags) {
      if (publications[tag]) {
        const pub = publications[tag];
        const firstName = subscriber.first_name || 'there';
        
        let bodyHtml = `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <p>Hi ${firstName},</p>
            <p>Thanks for requesting <strong>${pub.title}</strong>.</p>
        `;

        if (pub.fileUrl) {
          bodyHtml += `
            <p>You can access your copy directly via the link below:</p>
            <p>
              <a href="${pub.fileUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                ${pub.downloadText}
              </a>
            </p>
          `;
        } else {
          bodyHtml += `
            <p>We've added you to the list, and you'll receive the next edition as soon as it's published.</p>
          `;
        }

        bodyHtml += `
            <p>If you have any questions or want to discuss how to apply these concepts to your business, feel free to reply to this email.</p>
            <p>Best regards,<br>The NTA Team</p>
          </div>
        `;

        // We use SendEmail integration
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: subscriber.email,
          subject: `Your request: ${pub.title}`,
          body: bodyHtml,
          from_name: 'New Tech Advertising'
        });

        sentEmails.push(pub.title);
      }
    }

    return Response.json({ status: 'success', sent: sentEmails });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('[sendPublicationDeliveryEmail] Error:', errMsg);
    return Response.json({ error: errMsg }, { status: 500 });
  }
});