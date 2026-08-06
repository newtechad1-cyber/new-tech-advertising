import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const event = payload.event || {};
    const currentDate = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });

    // A chat start without contact information is not a prospect. Do not
    // create an anonymous CRM row; the visitor becomes a prospect only when
    // they submit contact details through the canonical intake flow.
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'info@newtechadvertising.com',
      subject: 'Someone is chatting with your Growth Guide',
      body: `A visitor started a conversation with the NTA Growth Guide.\n\nTime: ${currentDate}\nPage: Website\nConversation ID: ${event.conversation_id || 'N/A'}\n\nNo CRM prospect was created because the visitor has not supplied contact information yet.`,
    });

    return Response.json({ success: true, accepted: false, reason: 'contact_details_required' });
  } catch (error) {
    console.error('Error in chatbot lead capture:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
