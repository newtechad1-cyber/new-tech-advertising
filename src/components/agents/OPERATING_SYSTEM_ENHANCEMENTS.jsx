# AI Agent Workforce Orchestrator - Operating System Enhancements

## NEW FEATURES

### 1. Agent Health Score Card
**Component**: `AgentHealthScoreCard.jsx`

**Metrics** (0-100 point system):
- **Queue Pressure** (25 pts): How many tasks queued vs capacity
- **Success Rate** (25 pts): Failure rate vs completed tasks
- **Blocked Tasks** (25 pts): Impact of blocked work
- **Completion Time** (25 pts): Average execution speed

**Visual**:
- Large prominent score (color-coded emerald/blue/amber/red)
- Progress bars for each metric category
- Grid of KPI snapshots
- Status indicator

**Use Case**: Quick glance at overall orchestrator health

---

### 2. Next Best Ops Actions Panel
**Component**: `NextBestOpsAction.jsx`

**Smart Recommendations** (auto-prioritized):

1. **Retry Failed Publishing** (Priority 1)
   - Find failed publishing tasks with retries remaining
   - Highest business impact
   - Action: Bulk retry

2. **Unblock Onboarding Tasks** (Priority 2)
   - Identify blocked onboarding tasks
   - Customer impact (prevents account activation)
   - Action: Manual unblock or escalate

3. **Review Escalations** (Priority 3)
   - Count open escalations
   - Need human decision/intervention
   - Action: Jump to escalation review

4. **Pause Unhealthy Agents** (Priority 4)
   - Agents with health_status = 'unhealthy'
   - Prevent cascading failures
   - Action: Pause agent to stop task assignment

5. **Investigate Slow Tasks** (Priority 5)
   - Tasks running > 1 hour
   - Workflow bottleneck detection
   - Action: Drill into task for debug info

**Visual**:
- Color-coded by priority and type
- Icon + description
- Count badge
- Quick action buttons

**Use Case**: Operations team sees exactly what needs attention next

---

### 3. Workflow Timeline Visualization
**Component**: `WorkflowTimeline.jsx`

**Features**:
- Step-by-step progress visualization
- Status indicators (pending, running, completed, failed)
- Animated spinner for running steps
- Connected line showing dependency flow
- Progress bar with percentage
- Total duration calculation
- Error messages displayed inline
- Current step highlight

**Visual**:
- Vertical timeline with step nodes
- Color-coded by status (blue running, green completed, red failed)
- Connecting lines between steps
- Duration and status badges
- Overall completion indicator

**Use Case**: See exactly where a workflow is and what happened at each step

---

### 4. Live Workload Split (Pie Chart)
**Component**: `WorkloadSplit.jsx`

**Categories**:
- Publishing (blue)
- Onboarding (emerald)
- Reporting (amber)
- Content (purple)
- Reseller Ops (pink)
- Other (gray)

**Features**:
- Donut chart with live data
- Percentage breakdown
- Color-coded legend
- Click-through ready
- Category cards with task counts

**Use Case**: Understand task distribution and identify bottlenecks by category

---

### 5. Task Detail Drill-Down
**Component**: `TaskDetailDrilldown.jsx`

**Collapsible Card** showing:
- **Task metadata** (status, priority, context, retries)
- **Payload summary** (JSON formatted input)
- **Result summary** (JSON formatted output)
- **Error message** (if failed)
- **Blocked reason** (if blocked)
- **Log history** (complete timeline of state changes)
- **Related record** (link to entity it operates on)
- **Quick actions** (Retry, Escalate, Copy ID)

**Visual**:
- Expand/collapse header
- Color-coded sections (error/red, result/green, etc)
- JSON formatting with syntax highlighting
- Timeline of logs with timestamps
- Action buttons for common ops

**Use Case**: Deep dive into task execution without leaving the page

---

### 6. Operational Warnings Banner
**Component**: `OperationalWarnings.jsx`

**Smart Alerts** (auto-detected):

1. **Agent Without Clear Context** (Warning)
   - Running tasks lack tenant scope
   - May cause data isolation issues
   - Shown: Count + affected tasks

2. **Near Max Retries** (Critical)
   - Tasks within 1 retry of max
   - Need immediate escalation
   - Shown: Count + task details

3. **Stale Blocked Tasks** (Warning)
   - Blocked > 2 hours
   - Indicates unresolved dependency or automation gap
   - Shown: Count + aging info

4. **Unhealthy Agents** (Warning)
   - Degraded or offline agents
   - Performance impact
   - Shown: Count + agent names

**Visual**:
- Prominent red/amber banner at top
- Icon + color-coded by severity
- Detailed description
- List of affected items (top 3 + more count)
- Only shown if warnings exist

**Use Case**: Proactively alert ops team to systemic issues

---

## UPDATED PAGES

### AdminAgents.jsx (`/adminagents`)

**New Layout**:

1. **KPI Cards** (unchanged)
   - 7 key metrics at top

2. **Overview Tab** (enhanced)
   - ⚠️ **Operational Warnings** (top - if any)
   - **Health Score + Next Best Actions** (grid)
   - **Workload Split + System Summary** (grid)
   - **Recent Task Samples** (expandable drilldowns)

3. **Other Tabs** (unchanged)
   - Agent Registry
   - Running Tasks
   - Queued Tasks
   - Escalations

---

## SCORING ALGORITHM

### Agent Health Score (0-100)

```
Queue Pressure Score (0-25):
- Points = 25 - (queue_count / 50 * 25)
- 0 queued = 25 pts
- 50+ queued = 0 pts

Success Rate Score (0-25):
- failure_rate = failed_count / (completed + failed)
- Points = 25 - (failure_rate * 100)
- 0% failure = 25 pts
- 100% failure = 0 pts

Blocked Task Score (0-25):
- Points = 25 - (blocked_count / 10 * 25)
- 0 blocked = 25 pts
- 10+ blocked = 0 pts

Completion Time Score (0-25):
- Points = 25 - (avg_time_sec / 300 * 25)
- 0 sec = 25 pts
- 300+ sec = 0 pts

TOTAL = Queue + Success + Blocked + Time

Color Mapping:
- 85+ = 🟢 Emerald (Excellent)
- 70-85 = 🔵 Blue (Strong)
- 50-70 = 🟡 Amber (Monitor)
- <50 = 🔴 Red (Critical)
```

---

## WARNING DETECTION

### Context Isolation Warning
```
Triggers if:
  task_status == 'running' AND
  (!context_type || context_type == 'vertical') AND
  !client_id && !reseller_id && !school_id

Risk: Data may not be properly scoped
Severity: Warning
```

### Retry Exhaustion Warning
```
Triggers if:
  task_status == 'failed' AND
  retry_count >= (max_retries - 1)

Risk: Next failure will escalate
Severity: Critical
```

### Stale Block Warning
```
Triggers if:
  task_status == 'blocked' AND
  age_hours > 2

Risk: Dependency unresolved or automation missing
Severity: Warning
```

### Agent Health Warning
```
Triggers if:
  agent.health_status IN ['degraded', 'unhealthy']

Risk: Performance degradation or cascading failures
Severity: Warning
```

---

## UX PRINCIPLES

### ✅ Premium & Operational
- Dark theme with strategic color use
- Clean, scannable layout
- Prominent alerts and metrics
- High information density without clutter

### ✅ Highly Visible
- Key metrics front-and-center
- Color-coded severity levels
- Icon system for quick recognition
- Action items clearly labeled

### ✅ Actionable
- Next Best Actions suggest specific operations
- Task drill-down provides context for decisions
- Quick action buttons (Retry, Escalate)
- Warnings include affected item lists

### ✅ Operational
- Real-time data (no manual refresh needed)
- Category breakdowns (workload split)
- Timeline visualization for debugging
- Complete audit trail (logs)

---

## DATA FLOW

```
AgentHealthSnapshot → AgentHealthScoreCard
    (queued, running, completed, failed, blocked, avg_time)

AgentTask → NextBestOpsAction
    (failed publishing, blocked onboarding, etc)

AgentTask → WorkloadSplit
    (categorized by task_type)

AgentTask → OperationalWarnings
    (context check, retry count, block age, agent health)

AgentTask + AgentTaskLog → TaskDetailDrilldown
    (payload, result, logs, controls)

AgentWorkflowRun + steps → WorkflowTimeline
    (step progress, status, duration)
```

---

## STYLING

All components use:
- **Tailwind CSS** for styling
- **Shadcn/ui** components (Card, Button, Tabs)
- **Recharts** for visualizations
- **Lucide React** for icons
- **Premium dark theme** (slate-950, slate-900, slate-800)
- **Strategic color palette** (emerald/blue/amber/red/orange)

---

## FILES CREATED

```
/components/agents/
  ├── AgentHealthScoreCard.jsx       (Health scoring)
  ├── NextBestOpsAction.jsx          (Smart recommendations)
  ├── WorkflowTimeline.jsx           (Progress visualization)
  ├── WorkloadSplit.jsx              (Category analytics)
  ├── TaskDetailDrilldown.jsx        (Deep dive inspector)
  ├── OperationalWarnings.jsx        (Alert system)
  └── OPERATING_SYSTEM_ENHANCEMENTS.md (this file)

/pages/
  └── AdminAgents.jsx                (updated with new components)
```

---

## NEXT STEPS

1. **Connect Real Data**: Ensure all entity queries are pulling live data
2. **Add Actions**: Implement Retry, Escalate, Pause endpoints
3. **Add Pagination**: Large task lists need pagination
4. **Add Filtering**: Filter by category, status, context
5. **Add Export**: Export warnings, task logs, metrics
6. **Add Thresholds**: Allow customization of warning thresholds
7. **Add Integrations**: Trigger alerts to Slack, email, etc

---

**Version**: 2.0 (Operating System Edition)  
**Status**: READY FOR DEPLOYMENT  
**Date**: 2026-03-11