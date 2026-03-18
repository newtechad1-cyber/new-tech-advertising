import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Agent Orchestrator - Core routing and task management
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const payload = await req.json();
    const { action, taskData, workflowData } = payload;

    // CREATE TASK - Route to appropriate agent queue
    if (action === 'createTask') {
      const task = await base44.entities.AgentTask.create({
        ...taskData,
        task_status: 'pending',
        created_by: user.email,
      });

      // Log task creation
      await base44.entities.AgentTaskLog.create({
        task_id: task.id,
        agent_key: taskData.agent_key,
        log_type: 'created',
        log_message: `Task created: ${taskData.task_title}`,
        log_details: JSON.stringify({ context: taskData.context_type, priority: taskData.priority }),
      });

      return Response.json({ task });
    }

    // ASSIGN TASK - Move to queued status
    if (action === 'assignTask') {
      const { taskId } = payload;
      const task = await base44.entities.AgentTask.update(taskId, {
        task_status: 'queued',
      });

      await base44.entities.AgentTaskLog.create({
        task_id: taskId,
        agent_key: task.agent_key,
        log_type: 'assigned',
        log_message: 'Task assigned to agent queue',
      });

      return Response.json({ task });
    }

    // COMPLETE TASK
    if (action === 'completeTask') {
      const { taskId, result } = payload;
      const task = await base44.entities.AgentTask.update(taskId, {
        task_status: 'completed',
        result_json: JSON.stringify(result),
        completed_at: new Date().toISOString(),
      });

      await base44.entities.AgentTaskLog.create({
        task_id: taskId,
        agent_key: task.agent_key,
        log_type: 'completed',
        log_message: 'Task completed successfully',
      });

      return Response.json({ task });
    }

    // FAIL TASK - Handle retries or escalation
    if (action === 'failTask') {
      const { taskId, error } = payload;
      const task = await base44.entities.AgentTask.read(taskId);

      if (task.retry_count < task.max_retries) {
        // Retry
        const updatedTask = await base44.entities.AgentTask.update(taskId, {
          task_status: 'pending',
          retry_count: task.retry_count + 1,
          error_message: error,
        });

        await base44.entities.AgentTaskLog.create({
          task_id: taskId,
          agent_key: task.agent_key,
          log_type: 'retried',
          log_message: `Task retry ${updatedTask.retry_count} of ${task.max_retries}`,
        });

        return Response.json({ task: updatedTask, action: 'retry' });
      } else {
        // Escalate
        const updatedTask = await base44.entities.AgentTask.update(taskId, {
          task_status: 'escalated',
          error_message: error,
        });

        const escalation = await base44.entities.AgentEscalation.create({
          task_id: taskId,
          escalation_type: 'max_retries_exceeded',
          escalation_reason: `Task failed after ${task.max_retries} retries: ${error}`,
          assigned_to_role: 'admin',
          status: 'open',
        });

        await base44.entities.AgentTaskLog.create({
          task_id: taskId,
          agent_key: task.agent_key,
          log_type: 'escalated',
          log_message: `Task escalated after max retries`,
        });

        return Response.json({ task: updatedTask, escalation, action: 'escalate' });
      }
    }

    // BLOCK TASK
    if (action === 'blockTask') {
      const { taskId, reason } = payload;
      const task = await base44.entities.AgentTask.update(taskId, {
        task_status: 'blocked',
        blocked_reason: reason,
      });

      await base44.entities.AgentTaskLog.create({
        task_id: taskId,
        agent_key: task.agent_key,
        log_type: 'escalated',
        log_message: `Task blocked: ${reason}`,
      });

      return Response.json({ task });
    }

    // CREATE WORKFLOW RUN
    if (action === 'startWorkflow') {
      const run = await base44.entities.AgentWorkflowRun.create({
        ...workflowData,
        run_status: 'pending',
        current_step: 0,
        started_at: new Date().toISOString(),
      });

      return Response.json({ run });
    }

    // ADVANCE WORKFLOW STEP
    if (action === 'nextWorkflowStep') {
      const { runId } = payload;
      const run = await base44.entities.AgentWorkflowRun.read(runId);
      
      const updatedRun = await base44.entities.AgentWorkflowRun.update(runId, {
        current_step: run.current_step + 1,
        run_status: run.current_step + 1 >= run.total_steps ? 'completed' : 'running',
        completed_at: run.current_step + 1 >= run.total_steps ? new Date().toISOString() : null,
      });

      return Response.json({ run: updatedRun });
    }

    // HEALTH CHECK
    if (action === 'healthCheck') {
      const { agentKey } = payload;
      
      const tasks = await base44.entities.AgentTask.filter(
        { agent_key: agentKey },
        null,
        100
      );

      const queued = tasks.filter(t => t.task_status === 'queued').length;
      const running = tasks.filter(t => t.task_status === 'running').length;
      const completed = tasks.filter(t => t.task_status === 'completed').length;
      const failed = tasks.filter(t => t.task_status === 'failed').length;
      const blocked = tasks.filter(t => t.task_status === 'blocked').length;

      const snapshot = await base44.entities.AgentHealthSnapshot.create({
        agent_key: agentKey,
        snapshot_time: new Date().toISOString(),
        queued_count: queued,
        running_count: running,
        completed_count: completed,
        failed_count: failed,
        blocked_count: blocked,
        health_status: failed > 5 ? 'unhealthy' : failed > 2 ? 'degraded' : 'healthy',
      });

      return Response.json({ snapshot });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});