# NTA Intelligence Layer (Predictive Ops + AI Insights Engine)

## Architecture Overview

A comprehensive intelligence system that analyzes operational signals across the platform, generates predictive scores, strategic insights, and recommended actions to improve client retention, deal conversion, publishing effectiveness, onboarding speed, reseller growth, and automation reliability.

---

## CORE INTELLIGENCE ENTITIES

### 1. IntelligenceSignalSnapshot
**Purpose:** Captures raw operational signals from across the platform

**Fields:**
- `signal_type` (enum) - publishing_cadence, approval_delay, report_engagement, onboarding_duration, deal_stage_movement, automation_failure, connection_health, campaign_activity, login_frequency, content_quality, customer_activity, revenue_velocity
- `context_type` (enum) - global, agency, reseller, client, school
- `reseller_id` (string) - Reseller context
- `client_id` (string) - Client context
- `related_entity_type` (string) - Entity type involved
- `related_entity_id` (string) - Entity ID
- `signal_value` (number) - Raw signal value
- `signal_trend` (enum) - increasing, stable, decreasing
- `signal_period` (enum) - daily, weekly, monthly, quarterly
- `captured_at` (date-time) - Capture timestamp

**Use Case:** Store metric snapshots like "client logged in 3 times this week" or "automation failed 5 times last 24h"

**File:** `entities/IntelligenceSignalSnapshot.json`

---

### 2. IntelligenceScore
**Purpose:** Predictive scores calculated from signal inputs

**Fields:**
- `score_type` (enum) - client_retention_risk, deal_close_probability, publishing_momentum, automation_reliability, onboarding_velocity, reseller_growth_potential, operational_health, customer_satisfaction, content_performance, campaign_effectiveness
- `score_label` (string) - Human-readable label
- `context_type` (enum) - global, agency, reseller, client, school
- `reseller_id` (string) - Reseller context
- `client_id` (string) - Client context
- `related_entity_type` (string) - Entity type
- `related_entity_id` (string) - Entity ID
- `score_value` (number) - Score (typically 0-100)
- `confidence_level` (number) - Confidence (0-100)
- `trend_direction` (enum) - improving, stable, declining
- `contributing_factors_json` (string) - JSON: [{factor, weight, value}]
- `calculated_at` (date-time) - Calculation timestamp

**Use Case:** "Client retention risk is 35% (high risk), confidence 92%, trending down (improving)"

**File:** `entities/IntelligenceScore.json`

---

### 3. IntelligenceInsight
**Purpose:** Human-friendly insights generated from scores and signals

**Fields:**
- `insight_key` (string) - Unique identifier
- `insight_category` (enum) - retention_risk, growth_opportunity, operational_bottleneck, performance_trend, anomaly_detection, success_pattern, early_warning
- `context_type` (enum) - global, agency, reseller, client, school
- `reseller_id` (string) - Reseller context
- `client_id` (string) - Client context
- `priority_level` (enum) - critical, high, medium, low
- `headline` (string) - Short headline
- `narrative_text` (string) - Detailed explanation
- `recommended_action` (string) - What to do
- `related_entity_type` (string) - Entity involved
- `related_entity_id` (string) - Entity ID
- `contributing_signals_json` (string) - JSON: array of signals
- `status` (enum) - active, acknowledged, acted_upon, resolved
- `generated_at` (date-time) - Generation timestamp

**Use Case:** "Client ABC hasn't logged in for 2 weeks AND publishing has stopped. Retention risk is 32%. Recommend: schedule quarterly business review"

**File:** `entities/IntelligenceInsight.json`

---

### 4. IntelligenceRecommendation
**Purpose:** Actionable recommendations for platform users

**Fields:**
- `recommendation_type` (enum) - schedule_campaign, follow_up_deal, retry_publish, accelerate_onboarding, prioritize_opportunity, fix_automation, reactivate_client, scale_success, investigate_anomaly, optimize_resource
- `context_type` (enum) - global, agency, reseller, client, school
- `target_role` (string) - Role this targets (reseller_owner, client_approver, etc)
- `suggested_action` (string) - Specific action
- `urgency` (enum) - immediate, high, medium, low
- `impact_estimate` (string) - Estimated impact
- `confidence_score` (number) - Confidence (0-100)
- `related_entity_type` (string) - Entity type
- `related_entity_id` (string) - Entity ID
- `status` (enum) - pending, dismissed, in_progress, completed
- `created_at` (date-time) - Creation timestamp

**Use Case:** "Reseller XYZ has 5 deals stalled in negotiation. Recommend: schedule follow-up calls. Urgency: high. Confidence: 87%"

**File:** `entities/IntelligenceRecommendation.json`

---

### 5. IntelligenceModelConfig
**Purpose:** Configuration for predictive models

**Fields:**
- `model_key` (string) - Unique identifier (e.g., 'client_retention_model_v1')
- `model_name` (string) - Display name
- `model_description` (string) - What it predicts
- `score_type` (string) - Score type produced
- `signal_inputs_json` (string) - JSON: [{signal_type, weight, transform}]
- `weighting_rules_json` (string) - JSON: signal weights
- `threshold_rules_json` (string) - JSON: {critical_threshold, high_threshold, medium_threshold}
- `context_scope` (enum) - global, reseller, client
- `active` (boolean) - Is model active
- `version` (string) - Model version

**Use Case:** Define "client_retention_model_v1" as: 40% login_frequency + 30% publishing_cadence + 20% report_engagement + 10% approval_delays

**File:** `entities/IntelligenceModelConfig.json`

---

## INTELLIGENCE COMMAND CENTER

**Path:** `/adminintelligence`
**File:** `pages/AdminIntelligence.js`

Features:
- KPI cards with color-coded health metrics
- Top insights (5) prioritized by criticality
- Recommended actions (6) sorted by urgency
- Risk detection section
- Opportunity detection section
- Quick links to specialized views
- Period filter (daily/weekly/monthly)

**KPIs Displayed:**
- Clients At Risk (retention_risk < 40)
- Deals Likely to Close (deal_close_probability > 70)
- Publishing Momentum Score (0-100)
- Automation Health (0-100)
- Reseller Growth Signals (count)
- Immediate Actions (pending recommendations)

---

## SPECIALIZED INTELLIGENCE VIEWS

### 1. Client Intelligence
**Path:** `/adminintelligence/clients`
**File:** `pages/AdminIntelligenceClients.js`

Surfaces:
- Per-client retention risk scores
- Operational health metrics
- Critical insights count
- Searchable client directory
- Health bars and trend indicators

---

### 2. Sales Intelligence
**Path:** `/adminintelligence/sales`
**File:** `pages/AdminIntelligenceSales.js`

Surfaces:
- Deal close probability ranking
- Breakdown: Likely/Moderate/Uncertain
- Follow-up action recommendations
- Contributing factors for each deal
- Sales momentum indicators

---

### 3. Automation Intelligence
**Path:** `/adminintelligence/automation`
**File:** `pages/AdminIntelligenceAutomation.js`

Surfaces:
- Automation reliability scores
- Breakdown: Healthy/Caution/Critical
- Recent failure tracking
- Contributing signals
- Recommended fixes/retries

---

### 4. Reseller Intelligence
**Path:** `/adminintelligence/resellers`
**File:** `pages/AdminIntelligenceResellers.js`

Surfaces:
- Reseller growth potential scores
- Operational health rankings
- Growth opportunity count
- Insight summaries
- Performance trending

---

## SIGNAL SOURCES

System captures signals from:

1. **Publishing Cadence**
   - Frequency of content publishes
   - Trend: increasing/stable/decreasing

2. **Approval Delays**
   - Time between content submission and approval
   - Identifies bottlenecks

3. **Report Engagement**
   - Client opens of delivered reports
   - Indicates business value perception

4. **Onboarding Duration**
   - Time to launch from signup
   - Identifies slow onboarding

5. **Deal Stage Movement**
   - How quickly deals advance
   - Stalled deal detection

6. **Automation Failures**
   - Failed automation runs
   - Error rates and patterns

7. **Connection Health**
   - Social/publishing platform connection status
   - Integration reliability

8. **Campaign Activity**
   - Campaign creation and launch frequency
   - Resource utilization

9. **Login Frequency**
   - User access patterns
   - Engagement tracking

10. **Content Quality**
    - Performance of published content
    - Engagement metrics

11. **Customer Activity**
    - Overall platform activity levels
    - Usage patterns

12. **Revenue Velocity**
    - Deal progression speed
    - Revenue timeline

---

## PREDICTIVE MODELS

### Client Retention Risk Model
**Inputs:**
- Login frequency (40%)
- Publishing cadence (30%)
- Report engagement (20%)
- Approval delays (10%)

**Output:** Score 0-100 where <40 = at-risk

**Insight:** "Client hasn't logged in for 2 weeks and publishing has slowed. Recommend: outreach"

---

### Deal Close Probability Model
**Inputs:**
- Stage progression speed (50%)
- Engagement frequency (30%)
- Deal value trend (20%)

**Output:** Score 0-100 where >70 = likely to close

**Insight:** "Deal is moving fast and engagement is high. Expected close this month"

---

### Publishing Momentum Score
**Inputs:**
- Publishing frequency (40%)
- Approval speed (30%)
- Content performance (20%)
- Campaign activity (10%)

**Output:** Score 0-100 representing overall publishing health

**Insight:** "Publishing is steady but approvals are slowing. Team capacity issue?"

---

### Automation Reliability Model
**Inputs:**
- Failure rate (50%)
- Recovery time (30%)
- Configuration health (20%)

**Output:** Score 0-100 where >80 = healthy

**Insight:** "2 automations have high failure rates. Recommend: review configurations"

---

### Onboarding Velocity Model
**Inputs:**
- Time to first publish (60%)
- Task completion rate (25%)
- Support ticket volume (15%)

**Output:** Score representing speed relative to benchmark

**Insight:** "This client is taking 3x longer than average to launch. Needs support?"

---

### Reseller Growth Potential Model
**Inputs:**
- Client expansion signals (40%)
- Revenue velocity (30%)
- Automation adoption (20%)
- Feature usage (10%)

**Output:** Score 0-100 representing growth trajectory

**Insight:** "Reseller has 3 high-potential clients ready to expand. Recommend: sales outreach"

---

## INSIGHT GENERATION LOGIC

### Explicit Insight Rules

1. **Retention Risk Alert**
   ```
   IF (login_frequency < 3/month) 
      AND (publishing_cadence < 2/month)
      THEN priority = "high"
      THEN action = "Schedule quarterly business review"
   ```

2. **Deal Closing Alert**
   ```
   IF (deal_stage_movement > 2_stages/month) 
      AND (engagement_frequency > 5/week)
      THEN priority = "high"
      THEN action = "Follow up to close this month"
   ```

3. **Automation Failure Alert**
   ```
   IF (failure_rate > 10%) 
      THEN priority = "high"
      THEN action = "Review automation config and logs"
   ```

4. **Onboarding Bottleneck Alert**
   ```
   IF (onboarding_duration > 2x_benchmark)
      THEN priority = "medium"
      THEN action = "Offer setup support or training"
   ```

5. **Growth Opportunity Detection**
   ```
   IF (client_health > 75 AND client_engagement > average)
      THEN action = "Upsell/cross-sell conversation"
   ```

---

## RECOMMENDATION ENGINE

### Recommendation Types

1. **schedule_campaign**
   - Trigger: Publishing momentum > 70 + engagement high
   - Action: "Schedule 4-week campaign for Q2"

2. **follow_up_deal**
   - Trigger: Deal stalled > 3 weeks
   - Action: "Call prospect to unblock negotiation"

3. **retry_publish**
   - Trigger: Recent automation failure + retry < 3
   - Action: "Retry failed publish workflow"

4. **accelerate_onboarding**
   - Trigger: Onboarding duration > benchmark
   - Action: "Assign dedicated setup support"

5. **prioritize_opportunity**
   - Trigger: High-value client + growth signals
   - Action: "Schedule exec-level QBR"

6. **fix_automation**
   - Trigger: Automation reliability < 60
   - Action: "Audit and update automation configuration"

7. **reactivate_client**
   - Trigger: Retention risk < 30 + no engagement
   - Action: "Win-back campaign or outreach"

8. **scale_success**
   - Trigger: Client success pattern + expansion readiness
   - Action: "Offer expanded scope and features"

9. **investigate_anomaly**
   - Trigger: Unusual pattern in signals
   - Action: "Review activity logs and customer communications"

10. **optimize_resource**
    - Trigger: Reseller overloaded + efficiency low
    - Action: "Recommend automation or process improvement"

---

## ARCHITECTURE PATTERNS

### Signal Capture (Real-time)
```
Event occurs → Signal calculated → Stored in IntelligenceSignalSnapshot
```

### Scoring (Scheduled/Batch)
```
Load signals → Apply model weights → Calculate IntelligenceScore
Update trend direction → Store with confidence level
```

### Insight Generation (Post-Scoring)
```
Evaluate scores against thresholds → Generate IntelligenceInsight
Link contributing signals → Determine priority level
Suggest action → Store narrative
```

### Recommendation Generation (Continuous)
```
Monitor insight statuses → Identify action-ready insights
Generate IntelligenceRecommendation → Assign target role
Estimate urgency & impact → Store for display
```

---

## UX DESIGN PRINCIPLES

**Feel:** Strategic, calm, data-driven, forward-looking

**Visual Language:**
- Trend indicators (↑ improving, → stable, ↓ declining)
- Risk badges (critical=red, high=orange, medium=yellow, low=slate)
- Health bars with gradient coloring
- Narrative cards with supporting data
- Action CTAs aligned with urgency

**Color Scheme:**
- Critical/High Risk: Red-950 to Red-700
- Opportunities/Growth: Emerald-950 to Emerald-700
- Warnings/Caution: Yellow-950 to Yellow-700
- Info/Neutral: Slate-800 to Slate-700
- Success/Healthy: Emerald-950 to Emerald-700

---

## IMPLEMENTATION ROADMAP

### Phase 1: Signal Foundation
- [ ] Implement signal capture functions
- [ ] Create scheduled signal aggregation jobs
- [ ] Build signal storage layer

### Phase 2: Scoring Engine
- [ ] Implement model configurations
- [ ] Build scoring calculation functions
- [ ] Create model versioning system

### Phase 3: Insight Generation
- [ ] Implement insight rules engine
- [ ] Build threshold-based detection
- [ ] Create narrative generation templates

### Phase 4: Recommendations
- [ ] Implement recommendation engine
- [ ] Add target role routing
- [ ] Build action status tracking

### Phase 5: Dashboards
- [ ] Build intelligence command center (✓ done)
- [ ] Create specialized views (✓ done)
- [ ] Implement real-time updates

### Phase 6: Advanced Features
- [ ] Add AI-generated insight narratives
- [ ] Implement trend forecasting
- [ ] Build anomaly detection
- [ ] Add custom alert configuration

---

## NEXT STEPS

1. **Create signal capture automation** for each signal type
2. **Build model configuration seeders** for all 6+ predictive models
3. **Implement scoring scheduler** to run models on schedule
4. **Create insight generation functions** with rule engine
5. **Add recommendation system** with action tracking
6. **Integrate into existing user workflows** (alerts, notifications, API)
7. **Build admin configuration UI** for model weights and thresholds