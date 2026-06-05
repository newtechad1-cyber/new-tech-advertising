import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const payload = await req.json();
        
        const event = payload.event || {};
        const currentDate = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });

        // 1. Create SalesLead
        await base44.asServiceRole.entities.SalesLead.create({
            first_name: 'Chatbot',
            last_name: 'Visitor',
            business_name: 'Unknown Chatbot Visitor',
            lead_source: 'website',
            status: 'new',
            opportunity_notes: `Started conversation with Growth Guide on ${currentDate}. Conversation ID: ${event.conversation_id || 'N/A'}`
        });

        // 2. Send Notification Email
        await base44.asServiceRole.integrations.Core.SendEmail({
            to: 'info@newtechadvertising.com',
            subject: `🤖 Someone is chatting with your Growth Guide`,
            body: `Heads up — someone just started a conversation with your NTA Growth Guide chatbot.\n\nTime: ${currentDate}\nPage: Website\n\nCheck your Base44 Agents → Users tab to see the conversation.`
        });

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error in chatbot lead capture:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});