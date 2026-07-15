import { createClientFromRequest } from 'npm:@base44/sdk@0.8.39';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    
    const { event, data, changed_fields, old_data } = body;
    
    if (!data || !changed_fields || changed_fields.length === 0) {
      return Response.json({ message: "No data or changes to report." });
    }

    // Identify what specifically changed for a better message
    let changesText = changed_fields.map(field => {
      const oldVal = old_data && old_data[field] ? old_data[field] : 'none';
      const newVal = data[field] ? data[field] : 'none';
      return `• *${field}:* ${oldVal} ➔ ${newVal}`;
    }).join('\n');

    const messageText = `📝 *Task Updated:* ${data.title}\n${changesText}`;

    // Get Slack OAuth Token
    const { accessToken } = await base44.asServiceRole.connectors.getConnection("slack");

    // Post to the #nta-content channel
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        channel: "C0BE4BF0DBR",
        text: messageText
      })
    });

    const slackData = await response.json();
    
    if (!slackData.ok) {
      console.error("Slack error:", slackData.error);
      return Response.json({ error: slackData.error }, { status: 500 });
    }

    return Response.json({ success: true, slackData });
  } catch (error) {
    console.error("Function error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});