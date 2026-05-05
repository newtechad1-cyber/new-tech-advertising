import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const base44 = createClientFromRequest(req);

    const messageIds = body.data?.new_message_ids ?? [];
    if (messageIds.length === 0) {
      return Response.json({ skipped: true, reason: 'no new messages' });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // Load all leads with emails for matching
    const leads = await base44.asServiceRole.entities.SalesLead.list('-created_date', 1000);
    const emailToLead = {};
    for (const lead of leads) {
      if (lead.email) {
        emailToLead[lead.email.toLowerCase().trim()] = lead;
      }
    }

    let matched = 0;

    for (const messageId of messageIds) {
      const res = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
        { headers: authHeader }
      );
      if (!res.ok) continue;
      const message = await res.json();

      // Extract headers
      const headers = message.payload?.headers ?? [];
      const getHeader = (name) =>
        headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value ?? '';

      const from = getHeader('From');
      const subject = getHeader('Subject');
      const date = getHeader('Date');

      // Extract sender email from "Name <email>" or plain "email"
      const emailMatch = from.match(/<([^>]+)>/) || from.match(/([^\s]+@[^\s]+)/);
      const senderEmail = emailMatch ? emailMatch[1].toLowerCase().trim() : null;
      if (!senderEmail) continue;

      const lead = emailToLead[senderEmail];
      if (!lead) continue;

      // Extract plain text body
      let bodyText = '';
      const parts = message.payload?.parts ?? [];
      const findText = (partsList) => {
        for (const part of partsList) {
          if (part.mimeType === 'text/plain' && part.body?.data) {
            return atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
          }
          if (part.parts) {
            const found = findText(part.parts);
            if (found) return found;
          }
        }
        return '';
      };

      if (parts.length > 0) {
        bodyText = findText(parts);
      } else if (message.payload?.body?.data) {
        bodyText = atob(message.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      }

      // Truncate to avoid oversized notes
      const snippet = bodyText.trim().slice(0, 500);
      const ts = new Date(date || Date.now()).toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
      });
      const noteEntry = `[${ts}][email_reply] 📧 Gmail reply — Subject: "${subject}"\n${snippet}`;

      const existing = lead.notes || '';
      const updatedNotes = existing ? `${noteEntry}\n\n${existing}` : noteEntry;
      const today = new Date().toISOString().split('T')[0];

      await base44.asServiceRole.entities.SalesLead.update(lead.id, {
        notes: updatedNotes,
        reply_received: true,
        reply_date: today,
        last_contacted: today,
        status: lead.status === 'new' || lead.status === 'contacted' ? 'replied' : lead.status,
      });

      matched++;
    }

    return Response.json({ success: true, messagesChecked: messageIds.length, leadsUpdated: matched });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});