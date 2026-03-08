import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const payload = await req.json();
    const { message_id, task_type, custom_title } = payload;

    if (!message_id) {
      return Response.json({ error: 'Missing message_id' }, { status: 400 });
    }

    const message = await base44.asServiceRole.entities.Messages.get(message_id);
    const thread = await base44.asServiceRole.entities.MessageThreads.get(message.thread_id);

    if (!message || !thread) {
      return Response.json({ error: 'Message or thread not found' }, { status: 404 });
    }

    // Determine task type and priority based on message content if not specified
    let finalTaskType = task_type || determineTaskType(message, thread);
    let taskTitle = custom_title || generateTaskTitle(message, thread);
    let priority = determinePriority(thread);

    // Check for duplicate open task for this message
    const existingTask = await base44.asServiceRole.entities.SalesTasks.filter({
      company_id: message.company_id,
      task_type: finalTaskType,
      status: 'pending'
    }).then(list => list.find(t => 
      t.notes && t.notes.includes(`message_${message_id}`)
    ));

    if (existingTask) {
      return Response.json({
        success: false,
        message: 'Task for this message already exists',
        existing_task_id: existingTask.id
      }, { status: 409 });
    }

    // Create task
    const task = await base44.asServiceRole.entities.SalesTasks.create({
      company_id: message.company_id,
      task_title: taskTitle,
      task_type: finalTaskType,
      assigned_admin_user_id: thread.assigned_admin_user_id || user.id,
      due_date: addDays(new Date(), 1).toISOString().split('T')[0],
      priority,
      status: 'pending',
      notes: `Created from message. message_${message_id}`
    });

    // Update message to note task creation
    await base44.asServiceRole.entities.Messages.update(message_id, {
      related_task_id: task.id
    });

    return Response.json({
      success: true,
      task_id: task.id,
      task_type: finalTaskType,
      message: 'Task created from message'
    });

  } catch (error) {
    console.error('Error converting message to task:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function determineTaskType(message, thread) {
  const body = message.message_body.toLowerCase();

  if (message.message_type === 'approval_request' || body.includes('approve')) {
    return 'client_approval';
  }
  if (body.includes('edit') || body.includes('change') || body.includes('update')) {
    return 'revision';
  }
  if (body.includes('call') || body.includes('schedule')) {
    return 'call';
  }
  if (thread.thread_type === 'support' || thread.thread_type === 'change_request') {
    return 'email_followup';
  }
  
  return 'follow_up';
}

function generateTaskTitle(message, thread) {
  const prefix = thread.thread_type === 'support' ? 'Support: ' : '';
  return `${prefix}${message.subject || thread.title}`;
}

function determinePriority(thread) {
  if (thread.priority === 'urgent') return 'urgent';
  if (thread.priority === 'high') return 'high';
  return 'medium';
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}