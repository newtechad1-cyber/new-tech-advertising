# Agent Orchestrator - Complete Schema Reference

## Entity: AgentDefinition

Defines available agents in the system.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| agent_key | string | Unique identifier (e.g., `videoTranscriptAgent`) |
| agent_name | string | Display name |
| agent_category | enum | Category for grouping |
| description | string | Agent capabilities |
| active | boolean | Is agent accepting tasks |
| tenant_scope | enum | Data isolation (agency/reseller/client/school/universal) |
| supported_contexts_json | string | JSON array of context types |
| supported_task_types_json | string | JSON array of task types |
| max_concurrency | number | Max concurrent executions |
| retry_policy_json | string | JSON: `{max_retries, backoff_ms, backoff_multiplier}` |
| escalation_policy_json | string | JSON: `{failure_threshold, escalate_to_role, timeout_minutes}` |
| permissions_required_json | string | JSON array of required permissions |
| input_schema_json | string | JSON schema for validation |
| output_schema_json | string | JSON schema for output |
| created_at | date-time | Auto-set |
| updated_at | date-time | Auto-set |

### Categories

- Content Creation
- Video Processing
- Publishing
- Reporting
- Sales
- Onboarding
- Client Success
- Reseller Operations
- School Media
- System Maintenance

---

## Entity: AgentTask

Individual units of work assigned to agents.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| task_type | string | Type of work (e.g., `transcribe_video`) |
| task_title | string | Human-readable title |
| task_description | string | Detailed description |
| agent_key | string | Reference to AgentDefinition |
| task_status | enum | pending, queued, running, completed, failed, blocked, escalated, cancelled |
| priority | enum | low, normal, high, critical |
| queue_name | string | Which queue this belongs to |
| context_type | enum | agency, reseller, client, school, vertical |
| reseller_id | string | Reseller scope (if applicable) |
| client_id | string | Client scope (if applicable) |
| school_id | string | School scope (if applicable) |
| vertical_type | string | Vertical type (if applicable) |
| related_entity_type | string | What entity this operates on |
| related_entity_id | string | ID of related entity |
| payload_json | string | Input data for agent |
| result_json | string | Result returned by agent |
| error_message | string | Error details if failed |
| retry_count | number | Current retry count |
| max_retries | number | Max retries allowed |
| scheduled_for | date-time | When to execute (if delayed) |
| started_at | date-time | When execution started |
| completed_at | date-time | When execution finished |
| blocked_reason | string | Why task is blocked |
| created_by | string | Email of creator |
| assigned_by_orchestrator | boolean | Assigned by orchestrator |
| active | boolean | Is task active |
| created_at | date-time | Auto-set |
| updated_at | date-time | Auto-set |

### Status Flow

```
pending → queued → running → completed
                  → failed → [retry] pending
                  → failed → [max retries] escalated
                  → blocked → escalated
```

---

## Entity: AgentWorkflow

Multi-step automation sequences.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| workflow_key | string | Unique identifier |
| workflow_name | string | Display name |
| workflow_category | enum | Content Creation, Publishing, Reporting, Onboarding, Client Success, System Automation |
| trigger_type | enum | manual, scheduled, event-based, api-triggered |
| active | boolean | Is workflow enabled |
| context_scope | enum | agency, reseller, client, school, universal |
| step_definition_json | string | JSON array of steps with dependencies |
| description | string | Workflow purpose |
| created_at | date-time | Auto-set |
| updated_at | date-time | Auto-set |

### Step Definition Structure

```json
[
  {
    "step": 1,
    "agent_key": "agent1",
    "name": "Step Name",
    "depends_on": []
  },
  {
    "step": 2,
    "agent_key": "agent2",
    "name": "Next Step",
    "depends_on": [1]
  }
]
```

---

## Entity: AgentWorkflowRun

Instance of workflow execution.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| workflow_key | string | Which workflow |
| run_status | enum | pending, running, completed, failed, cancelled |
| trigger_source | string | What triggered this run |
| context_type | enum | agency, reseller, client, school, vertical |
| reseller_id | string | Reseller scope (if applicable) |
| client_id | string | Client scope (if applicable) |
| related_entity_type | string | Entity type this operates on |
| related_entity_id | string | ID of related entity |
| current_step | number | Current step (0-based) |
| total_steps | number | Total steps |
| started_at | date-time | When run started |
| completed_at | date-time | When run finished |
| error_message | string | Error if failed |
| result_summary | string | Summary of result |
| created_at | date-time | Auto-set |
| updated_at | date-time | Auto-set |

---

## Entity: AgentTaskLog

Complete audit trail of task execution.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| task_id | string | Reference to AgentTask |
| agent_key | string | Agent that performed action |
| log_type | enum | created, assigned, started, completed, failed, retried, escalated, resolved, cancelled |
| log_message | string | Human-readable message |
| log_details | string | JSON with detailed info |
| created_at | date-time | Auto-set |

### Log Sequence Example

```
created    - Task created
assigned   - Task assigned to queue
started    - Agent started execution
completed  - Task completed successfully

OR

created    - Task created
assigned   - Task assigned to queue
started    - Agent started execution
failed     - Task failed
retried    - Retrying (attempt 1 of 3)
started    - Agent restarted
failed     - Task failed again
retried    - Retrying (attempt 2 of 3)
started    - Agent restarted
failed     - Task failed again (max retries exceeded)
escalated  - Task escalated to human
resolved   - Admin resolved
```

---

## Entity: AgentHealthSnapshot

Agent performance metrics snapshot.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| agent_key | string | Which agent |
| snapshot_time | date-time | When snapshot taken |
| queued_count | number | Tasks in queue |
| running_count | number | Currently executing |
| completed_count | number | Completed in period |
| failed_count | number | Failed in period |
| blocked_count | number | Currently blocked |
| avg_completion_time | number | Avg time in seconds |
| health_status | enum | healthy, degraded, unhealthy, offline |
| created_at | date-time | Auto-set |

### Health Determination

```
failures > 5          → unhealthy
failures 2-5          → degraded
failures <= 1         → healthy
not_responding        → offline
```

---

## Entity: AgentEscalation

Tasks requiring human intervention.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| task_id | string | Reference to AgentTask |
| escalation_type | enum | task_failed, max_retries_exceeded, timeout, blocked_dependency, permission_denied, manual_escalation |
| escalation_reason | string | Detailed reason |
| assigned_to_role | enum | admin, manager, ops_team, engineering |
| status | enum | open, in_progress, resolved, dismissed |
| created_at | date-time | Auto-set |
| resolved_at | date-time | When resolved |

### Escalation Triggers

- **max_retries_exceeded**: Task failed after all retries
- **timeout**: Task exceeded time limit
- **blocked_dependency**: Waiting on external dependency
- **permission_denied**: Insufficient permissions
- **task_failed**: Unexpected failure
- **manual_escalation**: Admin escalated manually

---

## Complete Task Lifecycle Example

### Task Data

```javascript
{
  "task_type": "transcribe_video",
  "task_title": "Transcribe client video #123",
  "agent_key": "videoTranscriptAgent",
  "context_type": "client",
  "client_id": "client_abc",
  "related_entity_type": "VideoRequest",
  "related_entity_id": "video_req_123",
  "priority": "high",
  "max_retries": 3,
  "payload_json": "{\"video_url\": \"https://...\", \"format\": \"mp4\"}"
}
```

### State Transitions

1. **Created** (pending)
   - Task record created
   - Log entry: `created`

2. **Queued**
   - Assigned to agent queue
   - Log entry: `assigned`

3. **Running**
   - Agent executor picks up
   - Log entry: `started`

4. **Completed** (Success Path)
   - Agent finishes successfully
   - Result captured in `result_json`
   - Log entry: `completed`
   - Workflow can advance

5. **Failed** (Failure Path)
   - Agent encounters error
   - Error captured in `error_message`
   - Log entry: `failed`
   - Check `retry_count < max_retries`

6. **Retrying**
   - Increment `retry_count`
   - Reset `task_status` to `pending`
   - Apply backoff delay
   - Log entry: `retried`
   - Return to step 2

7. **Escalated**
   - Max retries exceeded
   - Create `AgentEscalation` record
   - Set `task_status` to `escalated`
   - Log entry: `escalated`
   - Route to recovery center

---

## Context Scope Rules

| Task Context | Agent Scope | Allowed? |
|--------------|-------------|----------|
| agency | universal | ✅ |
| agency | agency | ✅ |
| agency | reseller | ❌ |
| reseller | universal | ✅ |
| reseller | reseller | ✅ |
| reseller | agency | ❌ |
| client | universal | ✅ |
| client | client | ✅ |
| client | agency | ❌ |
| client | reseller | ❌ |

---

## API Function Reference

### agentOrchestrator

All actions return response objects with task/workflow/snapshot data.

```javascript
// Create task
{ action: 'createTask', taskData: {...} }
→ { task: {...} }

// Assign task
{ action: 'assignTask', taskId: '...' }
→ { task: {...} }

// Complete task
{ action: 'completeTask', taskId: '...', result: {...} }
→ { task: {...} }

// Fail task (with retry/escalate decision)
{ action: 'failTask', taskId: '...', error: '...' }
→ { task: {...}, action: 'retry' | 'escalate', [escalation] }

// Block task
{ action: 'blockTask', taskId: '...', reason: '...' }
→ { task: {...} }

// Start workflow
{ action: 'startWorkflow', workflowData: {...} }
→ { run: {...} }

// Advance workflow step
{ action: 'nextWorkflowStep', runId: '...' }
→ { run: {...} }

// Check health
{ action: 'healthCheck', agentKey: '...' }
→ { snapshot: {...} }
```

---

**Last Updated**: 2026-03-11  
**Version**: 1.0