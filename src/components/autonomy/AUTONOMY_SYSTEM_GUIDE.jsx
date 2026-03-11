# NTA Autonomous Growth System

## System Overview

An AI-directed operational growth engine that detects opportunities, selects optimal growth strategies, autonomously launches approved actions, and monitors impact across client retention, publishing cadence, sales momentum, onboarding velocity, reseller expansion, and automation stabilization.

**Core Design Principle:** Autonomous execution within governance guardrails

---

## CORE ENTITIES (5)

### 1. AutonomousOpportunity
Captures growth opportunities detected by intelligence layer

**Key Fields:**
- `opportunity_type` - 10 types (retention, publishing, deal, onboarding, expansion, etc.)
- `opportunity_score` - 0-100 value potential
- `urgency_level` - critical/high/medium/low
- `recommended_strategy` - strategy_key to execute
- `status` - detected → action_launched → completed
- `governance_status` - approved/pending/blocked/auto_executed

**Triggers:**
- From IntelligenceScore when score crosses thresholds
- From IntelligenceInsight when category = growth_opportunity
- From pattern detection in operational signals

**File:** `entities/AutonomousOpportunity.json`

---

### 2. AutonomousGrowthAction
Represents an autonomous action being executed

**Key Fields:**
- `action_type` - 10 types (launch_campaign, send_outreach, etc.)
- `strategy_key` - reference to strategy being executed
- `execution_mode` - autonomous/semi_autonomous/manual
- `execution_status` - pending → in_progress → completed
- `risk_level` - low/medium/high/critical
- `expected_impact` - human description

**Lifecycle:**
1. Created when opportunity approved
2. Governance check applied
3. Executed if approved + safeguards satisfied
4. Impact measured post-execution

**File:** `entities/AutonomousGrowthAction.json`

---

### 3. AutonomousStrategyDefinition
Master strategy registry with governance rules

**Key Fields:**
- `strategy_key` - unique identifier (e.g., 'visibility_boost_v1')
- `strategy_category` - retention/acceleration/expansion/stabilization/optimization/engagement
- `autonomy_level` - fully_autonomous/semi_autonomous/approval_required/high_risk_approval
- `trigger_conditions_json` - {signal_type, operator, threshold, duration}
- `allowed_contexts_json` - array of contexts where strategy applies
- `cooldown_rules_json` - {cooldown_minutes, duplicate_window_seconds}
- `max_frequency_rules_json` - {max_per_day, max_per_week, max_per_month}
- `tenant_safe` - boolean: respects tenant boundaries?
- `rollback_capable` - can action be reversed?

**Built-in Strategies:**
1. **visibility_boost_campaign_v1** - Publishing acceleration via content distribution
2. **retention_stabilizer_v1** - Client reactivation via outreach + support
3. **deal_momentum_accelerator_v1** - Sales pipeline acceleration via follow-ups
4. **onboarding_fast_track_v1** - Speed up client launch via priority support
5. **reseller_growth_activation_v1** - Expand reseller client base
6. More to be seeded as needed

**File:** `entities/AutonomousStrategyDefinition.json`

---

### 4. AutonomousImpactSnapshot
Tracks impact of executed actions

**Key Fields:**
- `strategy_key` - which strategy was executed
- `action_id` - reference to action
- `impact_metric` - what was measured (client_retention_score, publishing_cadence, etc.)
- `baseline_value` - value before action
- `post_action_value` - value after action
- `impact_percentage` - % change
- `impact_trend` - improving/neutral/declining
- `measurement_window_days` - days after action before measurement

**Use Cases:**
- Measure client retention lift 7 days post-outreach
- Track publishing increase 14 days post-campaign-launch
- Monitor deal close rate post-followup

**File:** `entities/AutonomousImpactSnapshot.json`

---

### 5. AutonomousGovernanceLog
Audit trail of all governance decisions

**Key Fields:**
- `action_id` - action being decided
- `governance_decision` - approved/blocked/auto_executed/escalated/override
- `blocked_reason` - if blocked, why?
- `blocked_by_rule` - which safeguard triggered
- `tenant_isolation_verified` - boolean
- `cooldown_checked` - boolean
- `frequency_checked` - boolean
- `override_role` - role that overrode decision
- `override_note` - reason for override

**Decision Types:**
1. **approved** - passed all checks, ready to execute
2. **blocked** - failed safety check, not executing
3. **auto_executed** - autonomy level allowed immediate execution
4. **requires_approval** - needs manual approval
5. **escalated** - escalated to admin review
6. **override** - admin overrode decision

**File:** `entities/AutonomousGovernanceLog.json`

---

## DASHBOARDS (5)

### 1. Autonomous Growth Command Center
**Path:** `/adminautonomy`
**File:** `pages/AdminAutonomy.js`

**KPI Cards (6):**
- Opportunities Detected (purple)
- Actions Executed (green)
- Avg Impact Score (blue)
- Risk-Blocked Actions (red)
- Retention Stabilizations (cyan)
- Governance Score (indigo)

**Tabs:**
- Opportunities (6 top) - sorted by urgency
- Active Actions (5) - currently in progress
- Impact Results (5) - recent improving impacts
- Governance Blocks (5) - safety decisions

**Quick Links:** Opportunity Explorer, Strategy Registry, Impact Analytics, Governance Log

---

### 2. Opportunity Explorer
**Path:** `/adminautonomy/opportunities`
**File:** `pages/AdminAutonomyOpportunities.js`

**Features:**
- Searchable opportunity list
- Filter by type (10 types)
- Status badges (detected, launched, completed, blocked)
- Opportunity score display
- Recommended strategy with confidence
- Execute button for each

**Sorting:** Default by score (highest first)

---

### 3. Strategy Registry
**Path:** `/adminautonomy/strategies`
**File:** `pages/AdminAutonomyStrategies.js`

**Features:**
- Searchable strategy directory
- Autonomy level badges (fully/semi/approval/high-risk)
- Category display
- Description and trigger conditions
- Safety features checklist
- Allowed contexts
- Active/inactive status
- Version display

---

### 4. Impact Analytics
**Path:** `/adminautonomy/impact`
**File:** `pages/AdminAutonomyImpact.js`

**Features:**
- Impact metric cards (Improving, Neutral, Declining, Avg %)
- Search by metric or strategy
- Grouped by strategy
- Tabs: All, Improving, Declining
- Trend indicators (↑ ↓)
- Baseline → Post-Action display
- Measurement window

---

### 5. Governance Log
**Path:** `/adminautonomy/governance`
**File:** `pages/AdminAutonomyGovernance.js`

**Features:**
- Stats cards (6 decision types)
- Searchable decision log
- Color-coded decisions
- Decision reason + block reason
- Triggered rule display
- Verification check indicators (✓)
- Override information
- Timestamp for each decision

---

## GOVERNANCE SAFEGUARDS

### 1. Autonomy Level Control
```javascript
// Strategy definition controls execution mode
"autonomy_level": "fully_autonomous"  // no approval needed
"autonomy_level": "semi_autonomous"   // can execute, needs logged
"autonomy_level": "approval_required"  // must wait for approval
"autonomy_level": "high_risk_approval" // admin approval only
```

### 2. Tenant Boundary Enforcement
```javascript
// Ensure action can't cross tenant lines
IF (context_type != allowed_contexts)
  THEN governance_decision = "blocked"
  THEN blocked_reason = "Tenant boundary violation"
```

### 3. Cooldown Protection
```javascript
// Prevent execution spam
IF (time_since_last_execution < cooldown_minutes)
  THEN governance_decision = "blocked"
  THEN blocked_reason = "Cooldown period not satisfied"
```

### 4. Frequency Limits
```javascript
// Prevent overload
IF (executions_today >= max_per_day OR
    executions_this_week >= max_per_week)
  THEN governance_decision = "blocked"
  THEN blocked_reason = "Frequency limit exceeded"
```

### 5. Risk Assessment
```javascript
// Evaluate risk level
IF (action.risk_level == "critical" AND
    approval_required == true)
  THEN governance_decision = "requires_approval"
```

### 6. Explainability Logging
```javascript
// Every decision logged with context
AutonomousGovernanceLog {
  action_id,
  governance_decision,
  decision_reason,
  tenant_isolation_verified: true,
  cooldown_checked: true,
  frequency_checked: true,
  created_at
}
```

---

## INITIAL STRATEGIES (5)

### 1. Visibility Boost Campaign
**Key:** `visibility_boost_campaign_v1`
**Category:** Acceleration
**Trigger:** Publishing cadence < 2/month + client engagement > 50
**Action:** Launch multi-channel content distribution campaign
**Autonomy:** Semi-autonomous (needs approval)
**Expected Impact:** +30% publishing cadence in 14 days
**Tenant Safe:** Yes
**Cooldown:** 7 days

---

### 2. Retention Stabilizer
**Key:** `retention_stabilizer_v1`
**Category:** Retention
**Trigger:** Client retention risk < 40 + login frequency declining
**Action:** Send personalized outreach + schedule QBR
**Autonomy:** Semi-autonomous
**Expected Impact:** +25 points retention score in 21 days
**Tenant Safe:** Yes
**Cooldown:** 14 days

---

### 3. Deal Momentum Accelerator
**Key:** `deal_momentum_accelerator_v1`
**Category:** Acceleration
**Trigger:** Deal stalled > 2 weeks + engagement high
**Action:** Trigger automated follow-up + escalate to AE
**Autonomy:** Fully-autonomous (for engagement > 70)
**Expected Impact:** Close deal in 14 days
**Tenant Safe:** Yes
**Cooldown:** 3 days

---

### 4. Onboarding Fast-Track
**Key:** `onboarding_fast_track_v1`
**Category:** Acceleration
**Trigger:** Onboarding duration > 2x benchmark
**Action:** Assign dedicated onboarding specialist + priority support
**Autonomy:** Semi-autonomous
**Expected Impact:** -50% time to launch
**Tenant Safe:** Yes
**Cooldown:** 30 days

---

### 5. Reseller Growth Activation
**Key:** `reseller_growth_activation_v1`
**Category:** Expansion
**Trigger:** Reseller growth potential > 75 + clients ready to expand
**Action:** Send growth pitch + schedule expansion QBR
**Autonomy:** Semi-autonomous
**Expected Impact:** +2 new client expansions in 30 days
**Tenant Safe:** Yes
**Cooldown:** 21 days

---

## EXECUTION FLOW

### Step 1: Opportunity Detection
```
IntelligenceScore/Insight triggers → Create AutonomousOpportunity
Priority level set based on score/impact potential
Status: "detected"
```

### Step 2: Strategy Selection
```
AutonomousOpportunity.recommended_strategy matches
Autonomy level evaluated
Strategy trigger conditions verified
```

### Step 3: Governance Decision
```
Check 1: Context/Tenant boundaries
Check 2: Cooldown rules
Check 3: Frequency limits
Check 4: Risk level assessment
Result: Create AutonomousGovernanceLog
Decision: approved/blocked/auto_executed/requires_approval
```

### Step 4: Execution (if approved)
```
Create AutonomousGrowthAction
Set execution_status: "pending"
Execute action via function/automation
Set execution_status: "in_progress"
Update executed_at timestamp
```

### Step 5: Impact Measurement
```
Define measurement window (7/14/21 days)
Schedule impact measurement job
Capture baseline vs. post-action metrics
Create AutonomousImpactSnapshot
Calculate impact_percentage + trend
Display in Impact Analytics dashboard
```

---

## EXPLAINABILITY ARCHITECTURE

### Opportunity Detection Explainability
```json
{
  "opportunity_type": "client_retention",
  "detected_reason": "Client ABC login frequency dropped 60% in last 2 weeks + publishing cadence at 0.5/month",
  "recommended_strategy": "retention_stabilizer_v1",
  "strategy_confidence": 87,
  "contributing_signals": [
    {"signal": "login_frequency", "value": 0.5, "weight": 0.4},
    {"signal": "publishing_cadence", "value": 0.5, "weight": 0.3},
    {"signal": "report_engagement", "value": 20, "weight": 0.3}
  ]
}
```

### Governance Decision Explainability
```json
{
  "governance_decision": "blocked",
  "blocked_reason": "Cooldown protection: strategy executed 3 days ago",
  "blocked_by_rule": "cooldown_rule_7_days",
  "check_results": {
    "tenant_isolation_verified": true,
    "cooldown_checked": true,
    "frequency_checked": true,
    "risk_assessment": "low"
  }
}
```

### Impact Explainability
```json
{
  "strategy_key": "retention_stabilizer_v1",
  "impact_metric": "client_retention_risk",
  "baseline_value": 35,
  "post_action_value": 62,
  "impact_percentage": "+77%",
  "measurement_window_days": 21,
  "impact_trend": "improving"
}
```

---

## RISK MITIGATION STRATEGIES

### High-Risk Actions
```
IF risk_level == "critical":
  THEN autonomy_level = "high_risk_approval" (always needs approval)
  THEN approval_role = "admin" (must be admin)
  THEN escalate = true (notify stakeholders)
```

### Tenant Isolation
```
ENFORCE: action.context_type matches allowed_contexts
ENFORCE: reseller_id/client_id scoping strict
PREVENT: cross-tenant action execution
```

### Rollback Capability
```
IF rollback_capable == true:
  STORE: rollback_parameters
  ENABLE: rollback option in governance log
  ALLOW: admin to reverse action if negative impact
```

### Frequency Capping
```
ENFORCE: max_per_day (prevent spam)
ENFORCE: max_per_week (prevent overload)
ENFORCE: max_per_month (prevent market saturation)
```

### Cooldown Enforcement
```
ENFORCE: cooldown_minutes between same-action executions
PREVENT: duplicate windows where duplicate actions blocked
REASON: avoid execution storms and adverse effects
```

---

## MEASUREMENT FRAMEWORK

### Standard Measurement Windows
- **Immediate Impact** - 1-3 days (e.g., deal close)
- **Short-term** - 7 days (e.g., publishing increase)
- **Medium-term** - 14 days (e.g., engagement lift)
- **Long-term** - 21-30 days (e.g., retention stabilization)

### Key Metrics to Measure
1. **Client Retention** - Risk score change
2. **Publishing** - Cadence increase
3. **Sales** - Deal stage movement, close rate
4. **Onboarding** - Time to launch reduction
5. **Reseller Growth** - Client expansion count
6. **Automation** - Failure rate reduction

### Success Criteria
```
success = (post_value - baseline) / baseline * 100
IF success >= expected_impact * 0.75 THEN "success"
IF success >= 0 THEN "positive"
IF success < 0 THEN "negative"
```

---

## NEXT IMPLEMENTATION PHASES

### Phase 1: Opportunity Detection Automation
- [ ] Create signal → opportunity conversion functions
- [ ] Implement automatic opportunity generation
- [ ] Build opportunity scoring engine

### Phase 2: Strategy Seeding
- [ ] Seed 5+ initial strategies
- [ ] Define trigger conditions for each
- [ ] Set autonomy levels + safeguard rules

### Phase 3: Action Execution Engine
- [ ] Build autonomous action execution
- [ ] Implement governance decision flow
- [ ] Add cooldown/frequency enforcement

### Phase 4: Impact Measurement
- [ ] Create impact measurement scheduler
- [ ] Build metrics collection functions
- [ ] Implement trend analysis

### Phase 5: Advanced Features
- [ ] AI-guided strategy selection
- [ ] Predictive impact forecasting
- [ ] Anomaly detection for failed actions
- [ ] Custom strategy creation UI
- [ ] Threshold auto-tuning

---

## ARCHITECTURE DIAGRAM

```
Intelligence Layer
    ↓ (detects opportunities)
AutonomousOpportunity (created)
    ↓ (strategy recommended)
AutonomousStrategyDefinition (matched)
    ↓ (governance checks)
AutonomousGovernanceLog (decision recorded)
    ↓ (if approved)
AutonomousGrowthAction (executed)
    ↓ (action runs)
Impact Measurement (scheduled)
    ↓ (results captured)
AutonomousImpactSnapshot (stored)
    ↓ (displayed in)
Dashboards (5): Command Center, Opportunities, Strategies, Impact, Governance
```

---

**System Status:** Foundation Complete ✓
**Ready for:** Opportunity detection automation, strategy seeding, action execution