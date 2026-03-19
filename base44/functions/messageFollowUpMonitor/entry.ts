import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Get all open threads
    const threads = await base44.asServiceRole.entities.MessageThreads.filter({
      status: { $in: ['waiting_on_admin', 'waiting_on_client', 'open'] }
    });

    const today = new Date();
    const alerts = [];
    const tasksCreated = [];

    for (const thread of threads) {
      // Get messages in thread
      const messages = await base44.asServiceRole.entities.Messages.filter({
        thread_id: thread.id
      });

      if (messages.length === 0) continue;

      const lastMessage = messages.sort((a, b) => 
        new Date(b.created_date) - new Date(a.created_date)
      )[0];

      const daysSinceLastMessage = Math.floor(
        (today - new Date(lastMessage.created_date)) / (1000 * 60 * 60 * 24)
      );

      // Check for threads waiting on admin too long
      if (thread.status === 'waiting_on_admin' && daysSinceLastMessage > 2) {
        const existingAlert = await checkExistingAlert(base44, thread.id, 'overdue_admin_response');
        if (!existingAlert) {
          alerts.push({
            type: 'overdue_admin_response',
            thread_id: thread.id,
            company_id: thread.company_id,
            message: `[${thread.thread_type}] "${thread.title}" - awaiting admin response for ${daysSinceLastMessage} days`,
            priority: daysSinceLastMessage > 5 ? 'urgent' : 'high'
          });
        }
      }

      // Check for threads waiting on client too long
      if (thread.status === 'waiting_on_client' && daysSinceLastMessage > 5) {
        const existingAlert = await checkExistingAlert(base44, thread.id, 'overdue_client_response');
        if (!existingAlert) {
          alerts.push({
            type: 'overdue_client_response',
            thread_id: thread.id,
            company_id: thread.company_id,
            message: `[${thread.thread_type}] "${thread.title}" - awaiting client response for ${daysSinceLastMessage} days`,
            priority: daysSinceLastMessage > 10 ? 'urgent' : 'high'
          });

          // Create follow-up reminder task
          const existingTask = await base44.asServiceRole.entities.SalesTasks.filter({
            company_id: thread.company_id,
            task_type: 'email_followup',
            status: 'pending'
          }).then(list => list.find(t => 
            t.notes && t.notes.includes(`thread_${thread.id}`)
          ));

          if (!existingTask) {
            const task = await base44.asServiceRole.entities.SalesTasks.create({
              company_id: thread.company_id,
              task_title: `Follow up on: ${thread.title}`,
              task_type: 'email_followup',
              assigned_admin_user_id: thread.assigned_admin_user_id || user.id,
              due_date: today.toISOString().split('T')[0],
              priority: 'high',
              status: 'pending',
              notes: `Follow up on message thread. thread_${thread.id}`
            });
            tasksCreated.push(task.id);
          }
        }
      }

      // Check for approval requests unanswered after X days
      const approvalRequest = messages.find(m => m.message_type === 'approval_request');
      if (approvalRequest && approvalRequest.response_due_date) {
        const dueDate = new Date(approvalRequest.response_due_date);
        const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        
        if (daysOverdue > 0) {
          const existingAlert = await checkExistingAlert(base44, thread.id, 'approval_overdue');
          if (!existingAlert) {
            alerts.push({
              type: 'approval_overdue',
              thread_id: thread.id,
              company_id: thread.company_id,
              message: `Approval request "${thread.title}" is ${daysOverdue} day(s) overdue`,
              priority: 'high'
            });
          }
        }
      }

      // Check for urgent threads not addressed
      if (thread.priority === 'urgent' && thread.status !== 'resolved') {
        const adminMessages = messages.filter(m => m.sender_type === 'admin');
        if (adminMessages.length === 0 && daysSinceLastMessage > 0) {
          const existingAlert = await checkExistingAlert(base44, thread.id, 'urgent_no_response');
          if (!existingAlert) {
            alerts.push({
              type: 'urgent_no_response',
              thread_id: thread.id,
              company_id: thread.company_id,
              message: `URGENT: "${thread.title}" - no admin response yet`,
              priority: 'urgent'
            });
          }
        }
      }
    }

    // Create SalesNotifications for alerts
    for (const alert of alerts) {
      await base44.asServiceRole.entities.SalesNotification.create({
        company_id: alert.company_id,
        notification_type: 'message_followup',
        priority: alert.priority,
        message: alert.message,
        related_thread_id: alert.thread_id,
        status: 'active',
        created_date: today.toISOString()
      });
    }

    return Response.json({
      success: true,
      alerts_created: alerts.length,
      tasks_created: tasksCreated.length,
      threads_checked: threads.length
    });

  } catch (error) {
    console.error('Error in message follow-up monitor:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function checkExistingAlert(base44, threadId, alertType) {
  const existingAlerts = await base44.asServiceRole.entities.SalesNotification.filter({
    related_thread_id: threadId,
    notification_type: alertType,
    status: 'active'
  });

  return existingAlerts.length > 0;
}