import { createClientFromRequest } from 'npm:@base44/sdk@0.8.39';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const event = body.event;
    
    // Ignore bot messages
    if (!event || event.bot_id || event.subtype === 'bot_message') {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    if (event.type === 'message' && event.text) {
      const text = event.text;
      
      // Use LLM to determine if the message is creating or updating a task
      const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `A user posted a message in the content channel: "${text}".
Determine if they want to create a new task or update an existing one (e.g., mark as done).
Return JSON with:
- action: "create" or "update"
- title: the task title to create or search for
- status: "todo", "in_progress", or "done"
- description: details of the task
`,
        response_json_schema: {
          type: "object",
          properties: {
            action: { type: "string", enum: ["create", "update"] },
            title: { type: "string" },
            status: { type: "string", enum: ["todo", "in_progress", "done", "cancelled"] },
            description: { type: "string" }
          },
          required: ["action", "title", "status", "description"]
        }
      });

      if (result.action === "update") {
        // Find existing task
        const tasks = await base44.asServiceRole.entities.NTATask.filter({
          title: { $regex: result.title, $options: "i" }
        });
        if (tasks.length > 0) {
          await base44.asServiceRole.entities.NTATask.update(tasks[0].id, {
            status: result.status,
            description: result.description || tasks[0].description
          });
        }
      } else {
        await base44.asServiceRole.entities.NTATask.create({
          title: result.title || text.substring(0, 50),
          description: result.description || text,
          task_type: "content",
          status: result.status || "todo",
          source_system: "slack"
        });
      }
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});