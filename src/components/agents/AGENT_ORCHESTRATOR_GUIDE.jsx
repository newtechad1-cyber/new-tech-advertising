# NTA AI Agent Workforce Orchestrator

## Overview

The Agent Workforce Orchestrator is a centralized system for managing AI agents, tasks, workflows, and automation across the entire NTA platform. It functions as an operating system for coordinating intelligent work across:

- Agency operations
- Reseller operations  
- Client fulfillment
- Publishing
- Onboarding
- Reporting
- School media
- Vertical systems

## Core Architecture

### Entities

#### AgentDefinition
Defines an available agent with:
- `agent_key`: Unique identifier
- `agent_name`: Display name
- `agent_category`: Category (Content Creation, Video Processing, Publishing, Reporting, Sales, Onboarding, Client Success, Reseller Operations, School Media, System Maintenance)
- `active`: Agent availability
- `tenant_scope`: Data isolation (agency, reseller, client, school, universal)
- `supported_contexts_json`: Contexts this agent operates in
- `supported_task_types_json`: Task types it handles
- `max_concurrency`: Max concurrent executions
- `retry_policy_json`: Retry configuration
- `escalation_policy_json`: Escalation rules
- `permissions_required_json`: Required permissions
- `input_schema_json` / `output_schema_json`: Data contracts

#### AgentTask
Individual units of work:
- `task_type`: Type of work
- `task_status`: pending, queued, running, completed, failed, blocked, escalated, cancelled
- `priority`: low, normal, high, critical
- `context_type`: agency, reseller, client, school, vertical
- `agent_key`: Assigned agent
- `payload_json`: Input data
- `result_json`: Output data
- `retry_count` / `max_retries`: Retry tracking
- `error_message`: Failure details
- `blocked_reason`: Why task is blocked
- `related_entity_type` / `related_entity_id`: What this task operates on

#### AgentWorkflow
Multi-step automation sequences:
- `workflow_key`: Unique identifier
- `workflow_name`: Display name
- `trigger_type`: manual, scheduled, event-based, api-triggered
- `step_definition_json`: Ordered steps with dependencies
- `context_scope`: Scope of operation
- Each step references an agent and depends on previous steps

#### AgentWorkflowRun
Instance of a workflow execution:
- `workflow_key`: Which workflow
- `run_status`: pending, running, completed, failed, cancelled
- `current_step`: Progress tracking
- `total_steps`: Total steps
- `related_entity_type` / `related_entity_id`: What triggered this run

#### AgentTaskLog
Complete audit trail of task execution:
- `task_id`: Which task
- `log_type`: created, assigned, started, completed, failed, retried, escalated, resolved, cancelled
- `log_message`: Human-readable
- `log_details`: JSON details

#### AgentHealthSnapshot
Agent performance metrics:
- `agent_key`: Which agent
- `queued_count`: Tasks in queue
- `running_count`: Currently executing
- `completed_count`: Completed today
- `failed_count`: Failed today
- `blocked_count`: Currently blocked
- `avg_completion_time`: Performance metric
- `health_status`: healthy, degraded, unhealthy, offline

#### AgentEscalation
Tasks requiring human intervention:
- `task_id`: Which task
- `escalation_type`: Failure reason
- `escalation_reason`: Detailed explanation
- `assigned_to_role`: admin, manager, ops_team, engineering
- `status`: open, in_progress, resolved, dismissed

## Command Center

### /adminagents

**Main AI Workforce Command Center** with:

**KPI Cards:**
- Active Agents (number of enabled agents)
- Tasks Running (currently executing)
- Tasks Queued (waiting for execution)
- Failures Today (failed tasks)
- Blocked Tasks (waiting for dependencies)
- Open Escalations (human review needed)
- Workflows Completed Today (automation success)

**Tabs:**
1. **Overview**: Agent and task health summary
2. **Agent Registry**: All agents grouped by category with health status
3. **Running Tasks**: Real-time task execution
4. **Queued Tasks**: Pending work
5. **Escalations**: Tasks needing human attention

### /adminagents/workflows

**Workflow Registry** showing all registered automation sequences:

**View:**
- Workflow name, category, status
- Step visualization
- Trigger type
- Supported contexts
- Last run and success rate

**Baseline Workflows:**
1. **Video Production**: Transcribe → Captions → Branding → Render
2. **Content Publishing**: Publish to platforms (Facebook, Instagram, YouTube, TikTok)
3. **Performance Reporting**: Generate and deliver client reports
4. **Client Onboarding**: Portal activation → Branding → Connections → Launch
5. **Reseller Onboarding**: Account setup → Branding → Domain → Go Live
6. **School Media Processing**: Upload → Process → Publish

### /adminagents/recovery

**Task Recovery & Escalation Center** for managing failed work:

**Sections:**
- Failed Tasks: Tasks that exceeded retries
- Blocked Tasks: Waiting on dependencies or permissions
- Escalations: Open issues assigned to roles

**Actions:**
- Retry failed task
- Escalate to role
- Resolve escalation
- View related record
- View full task log

## API / Backend Function

### agentOrchestrator Function

Central routing function for task and workflow management:

```
POST /api/functions/agentOrchestrator

Actions:
- createTask: Create new task (auto-routed to agent queue)
- assignTask: Move to queued status
- completeTask: Mark completed with result
- failTask: Handle failure, retry or escalate
- blockTask: Pause task, mark reason
- startWorkflow: Initiate workflow run
- nextWorkflowStep: Advance to next step
- healthCheck: Get agent health snapshot
```

## Agent Registry

### 10 Agent Categories

1. **Content Creation** (copywriting, ideation, planning)
2. **Video Processing** (transcription, captions, branding, rendering)
3. **Publishing** (social posting, scheduling, distribution)
4. **Reporting** (metrics aggregation, narrative generation, email delivery)
5. **Sales** (prospect outreach, deal tracking, follow-ups)
6. **Onboarding** (client/reseller setup, training, activation)
7. **Client Success** (health monitoring, recommendations, support)
8. **Reseller Operations** (partner management, scaling)
9. **School Media** (video processing, publishing)
10. **System Maintenance** (cleanup, backups, health checks)

### Baseline Agents

**Video Processing:**
- `videoTranscriptAgent`: Generates transcripts from video
- `videoCaptionAgent`: Creates captions from transcripts
- `videoBrandingAgent`: Applies logos and branding
- `videoRenderAgent`: Renders final video output

**Publishing:**
- `publishingAgent`: Publishes to social platforms

**Reporting:**
- `reportGeneratorAgent`: Creates performance reports

**Onboarding:**
- `clientOnboardingAgent`: Client setup automation
- `resellerOnboardingAgent`: Reseller setup automation

**School:**
- `schoolMediaAgent`: School media processing

## Orchestration Rules

1. **Task Routing**: Requests automatically route to correct agent based on `task_type` and `context_type`
2. **Sequential Execution**: Workflow steps execute in order; dependent steps wait for parents to complete
3. **Retry Logic**: Failed tasks retry up to `max_retries` with exponential backoff
4. **Escalation**: When retries exhausted or blocked, escalate to assigned role
5. **Context Isolation**: Agents cannot access data outside their `tenant_scope`
6. **Workflow Branching**: Workflows can create child tasks across multiple agents

## Data Integration

All data is real (no mock data):
- Agents from `AgentDefinition` entity
- Tasks from `AgentTask` entity
- Workflows from `AgentWorkflow` entity
- Health from `AgentHealthSnapshot` entity
- Logs from `AgentTaskLog` entity
- Escalations from `AgentEscalation` entity

## Usage Examples

### Create a Task
```javascript
const task = await base44.functions.invoke('agentOrchestrator', {
  action: 'createTask',
  taskData: {
    task_type: 'transcribe_video',
    task_title: 'Transcribe client video',
    agent_key: 'videoTranscriptAgent',
    context_type: 'client',
    client_id: 'client_123',
    related_entity_type: 'VideoRequest',
    related_entity_id: 'video_456',
    payload_json: JSON.stringify({ video_url: '...' }),
    priority: 'high',
  }
});
```

### Start a Workflow
```javascript
const run = await base44.functions.invoke('agentOrchestrator', {
  action: 'startWorkflow',
  workflowData: {
    workflow_key: 'videoProductionWorkflow',
    context_type: 'client',
    client_id: 'client_123',
    related_entity_type: 'VideoRequest',
    related_entity_id: 'video_456',
  }
});
```

### Check Agent Health
```javascript
const health = await base44.functions.invoke('agentOrchestrator', {
  action: 'healthCheck',
  agentKey: 'videoTranscriptAgent'
});
```

## Seeding Workflows

To populate baseline agents and workflows:

```javascript
await base44.functions.invoke('seedAgentWorkflows', {});
```

This creates all 9 baseline agents and 6 baseline workflows.

## UX / Design

- **Premium Admin Styling**: Dark theme, clean cards, color-coded status
- **High Visibility**: KPIs prominent, status clear at a glance
- **Low Confusion**: Grouped by category, clear status indicators
- **Powerful but Usable**: Single-click actions (Pause, Resume, Retry, Escalate, View)
- **Real-Time**: Task queues update live
- **Context Aware**: All operations scoped to tenant context

## Routes

- `/adminagents` - Main Command Center
- `/adminagents/workflows` - Workflow Registry
- `/adminagents/recovery` - Recovery & Escalation Center

## Next Steps

1. **Seed baseline workflows**: Run `seedAgentWorkflows` function
2. **Connect to existing automation**: Hook workflows to event triggers (entity create/update)
3. **Build agent backends**: Implement actual agent functions (transcription, branding, publishing)
4. **Monitor health**: Check agent health snapshots regularly
5. **Handle escalations**: Set up role assignments and notification flows
6. **Scale**: Add more agents as needed in each category

---

**Last Updated**: 2026-03-11  
**Version**: 1.0 (Production)