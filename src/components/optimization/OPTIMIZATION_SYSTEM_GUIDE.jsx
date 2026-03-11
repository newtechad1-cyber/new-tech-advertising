# NTA Self-Optimizing Platform Layer

## System Overview

A controlled self-optimization system that continuously observes platform outcomes, detects optimization opportunities, runs safe experiments, measures results, and promotes proven improvements over time. Operates with strict governance, approval thresholds, rollback safety, and explainability.

**Core Design Principle:** Continuous improvement with safety guardrails

---

## CORE ENTITIES (8)

### 1. OptimizationCandidate
Represents detected optimization opportunities

**Key Fields:**
- `candidate_key` - unique identifier
- `optimization_category` - 8 categories
- `context_type` - global/agency/reseller/client/school
- `target_system` - system being optimized
- `target_config_key` - specific config to change
- `current_value` - current setting
- `proposed_value` - suggested new setting
- `reason_detected` - why opportunity exists
- `confidence_score` - 0-100 likelihood of improvement
- `risk_level` - low/medium/high/critical
- `status` - detected → approved → experiment_running → adopted

---

### 2. OptimizationExperiment
A/B test or controlled rollout

**Key Fields:**
- `experiment_key` - unique identifier
- `optimization_category` - which category
- `strategy_type` - a_b_test/canary_rollout/full_rollout/scheduled/segment
- `baseline_config_json` - control configuration
- `test_config_json` - treatment configuration
- `context_scope_json` - where experiment runs
- `approval_required` - boolean
- `execution_mode` - auto/semi_auto/manual
- `start_date`, `end_date` - timing
- `status` - planned → running → completed/rolled_back

---

### 3. OptimizationOutcome
Results from an experiment

**Key Fields:**
- `experiment_key` - which experiment
- `metric_name` - what was measured
- `baseline_value` - control group value
- `observed_value` - treatment group value
- `delta_value` - difference
- `outcome_direction` - positive/neutral/negative
- `confidence_level` - statistical confidence 0-100
- `measured_at` - when measured

---

### 4. OptimizationRecommendation
Actionable recommendation to user

**Key Fields:**
- `recommendation_key` - unique id
- `related_candidate_key` - parent candidate
- `target_role` - who should see this
- `recommendation_text` - what to do
- `suggested_action` - specific action
- `expected_benefit` - impact description
- `urgency` - immediate/high/medium/low

---

### 5. OptimizationPolicy
Governance rules for a category

**Key Fields:**
- `policy_key` - unique identifier
- `optimization_category` - which category
- `allowed_auto_apply` - recommend_only/low_risk_auto_apply/approval_required/protected_never_auto
- `max_change_frequency` - e.g., "once_per_week"
- `approval_threshold` - confidence % for approval
- `rollback_rules_json` - {auto_rollback_if_negative, rollback_window_hours}
- `protected_targets_json` - config keys that are protected

---

### 6. OptimizationAuditLog
Complete audit trail

**Key Fields:**
- `action_type` - 8 action types
- `old_value_json` - previous value
- `new_value_json` - new value
- `action_status` - success/failed/pending/rolled_back
- `changed_by` - who/what made change
- `change_source` - auto/manual/approval/rollback

---

### 7. OptimizationHealthSnapshot
System health metrics

**Key Fields:**
- `snapshot_time` - when taken
- `optimization_category` - which category
- `active_candidates` - count of detected opportunities
- `running_experiments` - experiments in progress
- `successful_optimizations` - adopted improvements
- `failed_optimizations` - failed attempts
- `rollback_count` - automatic rollbacks triggered
- `health_score` - 0-100 overall health

---

## OPTIMIZATION CATEGORIES (8)

1. **Publishing Performance** - Timing, cadence, distribution optimization
2. **Client Engagement** - Activity, interaction frequency optimization
3. **Sales Conversion** - Pipeline velocity, win rate optimization
4. **Onboarding Efficiency** - Launch speed, setup completion optimization
5. **Automation Reliability** - Failure rate, success rate optimization
6. **Reseller Growth** - Client expansion, revenue per reseller optimization
7. **Reporting Effectiveness** - Report generation, delivery timing optimization
8. **Workflow Throughput** - Task completion, queue management optimization

---

## INITIAL OPTIMIZATION LOOPS (5)

### 1. Publishing Timing Optimizer
**Category:** Publishing Performance
**Detects:** Low-performing publish windows
**Recommends:** Alternative publish timing
**Metrics:** Engagement rate, reach, click-through rate
**Experiment Type:** A/B test (same content, different times)
**Example:** Test 8am vs 10am publish for optimal engagement

---

### 2. Approval Reminder Optimizer
**Category:** Workflow Throughput
**Detects:** Slow approval response times
**Recommends:** Reminder timing/frequency tuning
**Metrics:** Approval time, escalation rate
**Experiment Type:** Segment test (different reminder schedules)
**Example:** Test daily vs twice-daily reminders for speed

---

### 3. Onboarding Sequence Optimizer
**Category:** Onboarding Efficiency
**Detects:** Onboarding stalls/bottlenecks
**Recommends:** Safer sequence improvements
**Metrics:** Time to launch, completion rate
**Experiment Type:** Canary rollout (test with subset)
**Example:** Test reordering steps to reduce drop-off

---

### 4. Sales Follow-Up Optimizer
**Category:** Sales Conversion
**Detects:** Stalled proposals/deals
**Recommends:** Follow-up timing/approach adjustments
**Metrics:** Deal stage movement, close rate
**Experiment Type:** A/B test (timing variations)
**Example:** Test follow-up timing to improve close rate

---

### 5. Agent Retry Optimizer
**Category:** Automation Reliability
**Detects:** Inefficient retry patterns or loops
**Recommends:** Retry interval, backoff strategy tuning
**Metrics:** Success rate, error rate, time to resolution
**Experiment Type:** Scheduled test (gradual rollout)
**Example:** Test exponential vs linear backoff strategy

---

## GOVERNANCE SAFEGUARDS

### 1. Autonomy Levels
```
recommend_only
  → Only show recommendation, never apply
  → Use for: high-risk systems

low_risk_auto_apply
  → Can auto-apply if confidence > threshold
  → Use for: low-impact, well-tested scenarios

approval_required
  → Must wait for human approval
  → Use for: medium-risk, significant impact

protected_never_auto
  → Critical systems, manual only always
  → Use for: high-risk, irreversible changes
```

### 2. Confidence Thresholds
```
Apply Only If:
- confidence_score >= approval_threshold (per policy)
- risk_level compatible with autonomy level
- all safety checks passed
```

### 3. Rollback Triggers
```
Auto-rollback if:
- outcome_direction = "negative"
- metric shows degradation > X%
- user reports issue
- manual override requested
```

### 4. Frequency Limits
```
Enforce max_change_frequency per policy:
- once_per_day
- once_per_week
- once_per_month
PREVENT: optimization storms
```

### 5. Protected Targets
```
protected_targets_json = ["critical_config_1", "critical_config_2"]
ENFORCE: These can NEVER be auto-applied
REQUIRE: Always manual approval
```

### 6. Tenant Isolation
```
ENFORCE: Optimization respects context_type
PREVENT: Cross-tenant optimizations
SCOPED: By reseller_id / client_id when applicable
```

---

## DASHBOARDS (5)

### 1. Command Center (`/adminoptimization`)
**File:** `pages/AdminOptimization.js`

**KPI Cards (6):**
- Optimization Candidates (purple)
- Running Experiments (blue)
- Improvements Adopted (green)
- Rollbacks Triggered (red)
- High-Risk Suggestions (orange)
- Optimization Health Score (indigo)

**Tabs:**
- Top Candidates (6 highest confidence)
- Active Experiments (5 running)
- Recent Wins (5 positive outcomes)
- Failures & Rollbacks (5 failed)
- Recommendations (5 pending)

---

### 2. Candidate Explorer (`/adminoptimization/candidates`)
**File:** `pages/AdminOptimizationCandidates.js`

**Features:**
- Searchable candidate list
- Filter by category (8 categories)
- Status overview cards
- Risk level badges
- Current vs. proposed value display
- Run Experiment button

---

### 3. Experiment Registry (`/adminoptimization/experiments`)
**File:** `pages/AdminOptimizationExperiments.js`

**Features:**
- Status overview cards
- Searchable experiments
- Strategy type badges
- Timeline display
- Play/Pause controls
- Status indicators

---

### 4. Outcome Analytics (`/adminoptimization/outcomes`)
**File:** `pages/AdminOptimizationOutcomes.js`

**Features:**
- Outcome metric cards (5)
- Grouped by experiment
- Tabs: All, Positive, Neutral, Negative
- Trend indicators (↑ ↓ -)
- Delta display
- Confidence levels

---

### 5. Policy Governance (`/adminoptimization/policies`)
**File:** `pages/AdminOptimizationPolicies.js`

**Features:**
- Policy summary cards
- Searchable policies
- Autonomy level badges
- Approval thresholds
- Rollback rules display
- Protected targets list
- Policy levels explanation

---

## EXECUTION FLOW

```
1. DETECT
   System observes performance metrics
   → OptimizationCandidate created
   → Confidence & risk assessed
   → Status: "detected"

2. RECOMMEND
   Candidate shown in candidate explorer
   → OptimizationRecommendation created
   → Target role identified
   → Urgency set

3. APPROVE (if required)
   Policy check:
     - autonomy_level compatible?
     - confidence >= approval_threshold?
     - protected target check
     - frequency check
   → Approval decision made or auto-applied

4. EXPERIMENT
   OptimizationExperiment created
   → strategy_type: a_b_test/canary/etc
   → baseline_config vs test_config
   → context_scope defined
   → start_date scheduled

5. MEASURE
   Experiment runs
   → Metrics captured at intervals
   → OptimizationOutcome created
   → Delta calculated
   → Trend assessed

6. EVALUATE
   Outcome direction assessed:
   - positive → candidate for adoption
   - neutral → monitor or reject
   - negative → rollback immediately

7. ADOPT or ROLLBACK
   If positive:
     → Apply broadly
     → OptimizationCandidate status: "adopted"
     → Log to OptimizationAuditLog
   
   If negative:
     → Rollback to baseline
     → OptimizationCandidate status: "rolled_back"
     → Trigger rollback alert

8. LEARN
   Successful optimizations can become:
     → Platform defaults
     → Vertical-specific presets
     → Reseller-recommended settings
```

---

## SAMPLE OPTIMIZATION SCENARIOS

### Scenario 1: Publishing Timing (Low Risk)
```
DETECT: Publishing at 2pm gets 30% fewer views than 8am
  → candidate_key: "pub_timing_2pm_shift"
  → confidence_score: 87
  → risk_level: "low"
  → proposed_value: "08:00"

POLICY: Publishing Performance
  → allowed_auto_apply: "low_risk_auto_apply"
  → approval_threshold: 75
  
DECISION: Auto-apply (87 >= 75)

EXPERIMENT: A/B test
  → baseline: publish at 2pm
  → test: publish at 8am
  → duration: 2 weeks
  
OUTCOME: 8am gets +32% engagement
  → outcome_direction: "positive"
  → confidence_level: 94
  
ADOPT: Roll out to all clients
```

---

### Scenario 2: Approval Reminder (Medium Risk)
```
DETECT: Approvals taking 3.2 days average, baseline is 1 day
  → candidate_key: "approval_reminder_spacing"
  → confidence_score: 78
  → risk_level: "medium"
  
POLICY: Workflow Throughput
  → allowed_auto_apply: "approval_required"
  
DECISION: Requires approval
  → Show in recommendation feed
  → Wait for user approval

EXPERIMENT (if approved): Segment test
  → 30% get daily reminders (treatment)
  → 70% get current schedule (control)
  → duration: 1 week
  
OUTCOME: Daily reminders → 1.8 days (improvement)
  → outcome_direction: "positive"
  → confidence_level: 82
  
ADOPT: Roll out to all users
```

---

### Scenario 3: Critical Config (Protected)
```
DETECT: Could optimize payment retry logic
  → candidate_key: "payment_retry_logic"
  → confidence_score: 92
  → risk_level: "critical"
  
POLICY: [Custom high-risk policy]
  → allowed_auto_apply: "protected_never_auto"
  → protected_targets: ["payment_retry_interval"]
  
DECISION: Manual only
  → Blocked from all automation
  → Recommend to admin only
  → Require explicit approval + review
  
OUTCOME: Admin reviews, decides to run limited canary
  → Then: Full rollout if successful
```

---

## MEASUREMENT FRAMEWORK

### Standard Measurement Windows
- **Immediate** - 1-3 days (quick metrics)
- **Short-term** - 7 days (user behavior)
- **Medium-term** - 14 days (system impact)
- **Long-term** - 30+ days (business impact)

### Key Metrics by Category

**Publishing Performance:**
- Engagement rate, reach, click-through, shares

**Client Engagement:**
- Login frequency, action count, feature usage

**Sales Conversion:**
- Deal stage movement, close rate, cycle time

**Onboarding Efficiency:**
- Time to launch, completion rate, setup success

**Automation Reliability:**
- Success rate, failure rate, error rate

**Reseller Growth:**
- New client count, expansion deals, revenue per reseller

**Reporting Effectiveness:**
- Generation time, delivery success, user engagement

**Workflow Throughput:**
- Completion time, queue depth, escalation rate

---

## LEARNING & PROMOTION MODEL

### Successful Optimization Path
```
1. Candidate Detected
2. Experiment Runs → Positive Outcome
3. Adopted Broadly
4. Monitor for Stability
5. If Sustained Success:
   → Promote to Platform Default
   → Create Vertical Preset
   → Recommend to Other Resellers
```

### Promotion Requirements
- Minimum observation period (30+ days)
- No negative side-effects
- Confidence level >= 85%
- Applicable to multiple contexts

### Vertical Presets Example
```
publishing_category_presets = {
  ecommerce: {
    optimal_publish_time: "08:00 PST",
    publishing_frequency: "3x per week",
    content_types: ["product_showcase", "user_review"]
  },
  saas: {
    optimal_publish_time: "10:00 EST",
    publishing_frequency: "daily",
    content_types: ["technical_update", "thought_leadership"]
  }
}
```

---

## EXPLAINABILITY EXAMPLES

### Candidate Detection Explanation
```json
{
  "candidate_key": "approval_reminder_spacing_shift",
  "optimization_category": "workflow_throughput",
  "reason_detected": "Approval response time increased from 1.0 days to 3.2 days over last 30 days. Pattern correlates with reduced reminder frequency after config change on 2026-02-15",
  "confidence_score": 78,
  "current_value": "daily_at_9am",
  "proposed_value": "twice_daily_9am_and_3pm",
  "risk_level": "medium",
  "context": "global"
}
```

### Experiment Outcome Explanation
```json
{
  "experiment_key": "approval_reminder_2x_daily_test",
  "metric_name": "approval_response_time_hours",
  "baseline_value": 76.8,
  "observed_value": 43.2,
  "delta_value": -33.6,
  "outcome_direction": "positive",
  "confidence_level": 82,
  "sample_sizes": {
    "control": 1247,
    "treatment": 1253
  },
  "measurement_window_days": 7,
  "interpretation": "Twice-daily reminders reduced average approval time by 33.6 hours (43.8% improvement)"
}
```

### Governance Decision Explanation
```json
{
  "candidate_key": "pub_timing_shift",
  "governance_decision": "auto_apply",
  "reason": "Low-risk optimization with 87% confidence exceeds policy threshold of 75%",
  "policy_applied": "publishing_performance_policy",
  "checks": {
    "autonomy_level": "PASS - low_risk_auto_apply",
    "confidence": "PASS - 87 >= 75",
    "risk_level": "PASS - low risk permitted",
    "protected_target": "PASS - not protected",
    "frequency": "PASS - 30 days since last pub_timing change"
  }
}
```

---

## NEXT IMPLEMENTATION PHASES

### Phase 1: Candidate Detection (Week 1-2)
- [ ] Build performance metric collection
- [ ] Create candidate generation logic
- [ ] Implement confidence scoring

### Phase 2: Experiment Framework (Week 2-3)
- [ ] Build A/B test infrastructure
- [ ] Create canary rollout logic
- [ ] Implement experiment scheduling

### Phase 3: Policy Enforcement (Week 3-4)
- [ ] Implement approval workflows
- [ ] Add rollback triggers
- [ ] Enforce frequency limits

### Phase 4: Learning & Promotion (Week 4-5)
- [ ] Build success tracking
- [ ] Create preset generator
- [ ] Implement learning model

### Phase 5: Advanced Features (Week 5+)
- [ ] Real-time dashboards
- [ ] Anomaly detection
- [ ] Predictive optimization
- [ ] Multi-factor optimization

---

**Status:** Foundation Complete ✓
**Ready for:** Candidate detection automation, experiment framework, policy enforcement
**Estimated Full Build Time:** 4-5 weeks