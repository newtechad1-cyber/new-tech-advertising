# NTA Reporting + Client Communication Engine

## Overview
Complete system for converting platform activity and analytics into client-facing communications, reports, and admin outreach tools.

---

## Entities Created

### ClientCommunicationLog
Tracks all client communications with rich metadata for tracking, segmentation, and history.

**Key Fields:**
- `communicationId` — Unique identifier
- `organizationId` — Client organization
- `userId` — Recipient user
- `communicationType` — Type: weekly_summary, monthly_report, milestone, inactivity_nudge, billing_warning, upgrade_recommendation, account_review, success_highlight
- `triggerSource` — What triggered: scheduled, activity_event, growth_threshold, inactivity_detected, billing_event, upgrade_readiness, anniversary, manual_trigger
- `channel` — Delivery: email, in_app, sms, dashboard_widget, draft
- `subject` — Email/notification subject
- `summaryText` — Brief preview (50-100 chars)
- `fullContent` — Complete HTML/markdown
- `relatedMetricSnapshotId` — Link to GrowthMetricsSnapshot
- `relatedCampaignId` — Link to Campaign
- `status` — Delivery status: draft, scheduled, sent, opened, clicked, bounced, failed
- `sentAt` — When sent
- `metadata` — JSON with additional context

---

## Report Generation Logic
**File:** `components/communication/reportGenerationEngine.js`

### 1. Weekly Summary Generator
**Function:** `generateWeeklySummary(organizationId, metricsSnapshot, activityData)`

**Input:**
- Content published count
- Videos created
- Leads logged
- Post engagement signals
- Completed automation jobs

**Output:** Business-focused narrative sections
- "This Week's Activity" — Publishing output
- "Inbound Momentum" — Lead captures
- "What's Performing" — Top engagement signal
- "Low Activity Alert" (if quiet week)
- Quick stats summary

**Language:** Plain English, activity-focused, attribution-aware ("Your team published...", "You captured...")

---

### 2. Monthly Report Generator
**Function:** `generateMonthlyReport(organizationId, snapshot, monthlyData)`

**Input:**
- GrowthMetricsSnapshot (growth score, momentum, revenue, readiness)
- Monthly activity data (content, videos, campaigns, leads, revenue)
- Onboarding progress

**Output Sections:**
1. **Executive Summary**
   - Growth score & trend direction (early stage → accelerating)
   - Momentum score
   - Key metric (revenue or growth in progress)

2. **What We Built**
   - Content published
   - Videos created
   - Pages generated
   - Campaigns executed

3. **What Improved**
   - Growth score improvement
   - Momentum acceleration
   - Content consistency narrative

4. **Leads and Revenue**
   - Lead captures
   - Deals closed
   - Attributed revenue
   - Business impact narrative

5. **Recommendations**
   - Dynamic based on performance:
     - If content < 4/month: Increase frequency
     - If leads = 0: Add lead capture
     - If growth < 50: Expand strategy
     - If readiness > 70: Upgrade offer

6. **Upgrade Opportunity**
   - Shows only if readiness score > 65
   - Next plan recommendation

**Language:** Growth-focused narrative explaining metrics in business context.

---

### 3. Milestone Message Generator
**Function:** `generateMilestoneMessage(organizationId, milestoneType, data)`

**Milestone Types:**
- `first_content` → "Your First Content is Live!"
- `first_lead` → "Your First Lead!"
- `revenue_milestone` → Dollar amount celebration
- `anniversary` → Month check-in with growth recap

---

### 4. Inactivity Nudge Generator
**Function:** `generateInactivityNudge(organizationId, daysSinceActivity, lastActivity)`

**Logic:**
- No nudge if < 7 days active
- Mild messaging if 7-30 days
- Urgent if > 30 days

**Output:** Subject + CTA to resume publishing

---

### 5. Upgrade Recommendation Generator
**Function:** `generateUpgradeRecommendation(snapshot, currentPlan)`

**Logic:**
- Only shows if `upgradeReadinessScore > 65`
- Recommends next plan in progression:
  - DIY → Guided Growth
  - Guided Growth → Done For You
  - Done For You → Premium

---

## Client-Facing Pages

### 1. ClientMonthlyGrowthReport (`/client/monthly-growth-report`)
**File:** `pages/ClientMonthlyGrowthReport.jsx`

**Features:**
- Executive summary KPI cards (growth, momentum, revenue, ROI)
- Tabbed interface:
  - **Summary** — Overall trajectory + highlights
  - **What We Built** — Content, videos, pages grid
  - **Business Impact** — Leads, deals, revenue, ROI explanation
  - **What's Next** — Dynamic recommendations
- Upgrade opportunity (if qualified)
- Communication history (recent reports/summaries)
- Export PDF button (placeholder)

**Data Sources:**
- Latest GrowthMetricsSnapshot
- ClientCommunicationLog history
- Organization profile

---

### 2. ClientCommunicationSummaryPanel (Dashboard Widget)
**File:** `components/client-dashboard/ClientCommunicationSummaryPanel.jsx`

**Purpose:** Quick access to latest communications on client dashboard

**Display:**
- Latest weekly summary card
- Recent win/milestone card
- Next best move card
- Latest monthly report link

**Cards:** Color-coded, summary text preview + date

---

### 3. ClientReportArchive (Dashboard Component)
**File:** `components/client-dashboard/ClientReportArchive.jsx`

**Purpose:** Browse all past reports and communications

**Tabs:**
- All communications
- Reports (weekly summaries, monthly reports)
- Milestones (achievements, wins)

**Features:**
- Search by type
- Date filtering
- Download buttons
- Archive summary count

---

## Admin-Facing Pages

### AdminClientCommunications (`/admin/client-communications`)
**File:** `pages/AdminClientCommunications.jsx`

**KPI Cards:**
- Sent This Week
- Scheduled
- In Draft
- Failed
- Missing Updates (>30 days no contact)

**Tabs:**

#### 1. Recent Communications
- Last 10 communications across all clients
- Type badge, date, status
- Click to view full content
- Detail modal with metadata

#### 2. Missing Updates
- Clients with no communication > 30 days
- Days since last contact
- Last communication type
- Quick "Send Update" button

#### 3. At-Risk Accounts
- Multiple failed communications
- No opens on recent sends
- Count of failures
- "Investigate" button

#### 4. Quick Send Templates
- Inactivity nudge template
- Success highlight template
- Upgrade recommendation template
- Account review template
- One-click send to selected client

---

## Integration Points

### For ClientDashboard
Add these components to display communication summary:

```jsx
import ClientCommunicationSummaryPanel from '@/components/client-dashboard/ClientCommunicationSummaryPanel';
import ClientReportArchive from '@/components/client-dashboard/ClientReportArchive';

// In dashboard render:
<ClientCommunicationSummaryPanel organizationId={org.id} />
<ClientReportArchive organizationId={org.id} />
```

---

## Report Generation Workflow

### Weekly Summary (Scheduled)
1. **Trigger:** Every Monday 8am
2. **Data Collection:** Last 7 days activity from:
   - ActivityEvent log
   - ContentAsset published
   - AIJob completions
   - Lead captures
   - Post engagement metrics
3. **Generate:** `generateWeeklySummary()`
4. **Store:** ClientCommunicationLog with status='scheduled'
5. **Send:** Via email channel at 9am

### Monthly Report (Scheduled)
1. **Trigger:** First day of month 8am
2. **Data Collection:**
   - Latest GrowthMetricsSnapshot
   - Campaign metrics
   - Content output counts
   - Lead/deal tallies
   - Onboarding progress
3. **Generate:** `generateMonthlyReport()`
4. **Store:** ClientCommunicationLog
5. **Send:** Via email + in_app dashboard widget
6. **Persist:** Summary text for archive

### Milestone Messages (Event-Triggered)
1. **Trigger:** On events like first_content publish, first_lead logged, revenue_milestone
2. **Data:** Event metadata
3. **Generate:** `generateMilestoneMessage()`
4. **Store:** ClientCommunicationLog
5. **Send:** Immediate via in_app, optional email

### Inactivity Nudge (Daily Check)
1. **Trigger:** Daily at 9am
2. **Check:** Last content publish date for each org
3. **Generate:** `generateInactivityNudge()` if > 7 days
4. **Store:** ClientCommunicationLog with triggerSource='inactivity_detected'
5. **Send:** Email + in_app notification

### Upgrade Recommendation (Event + Threshold)
1. **Trigger:** When upgradeReadinessScore crosses 65 threshold
2. **Generate:** `generateUpgradeRecommendation()`
3. **Store:** ClientCommunicationLog
4. **Send:** Email + in_app banner

---

## Language & Tone Guidelines

### Client-Facing
✅ **DO:**
- Use "you" / "your" (second person)
- Focus on business outcomes
- Explain metrics in context
- Celebrate achievements
- Action-oriented recommendations

❌ **DON'T:**
- Be overly technical
- Ignore small wins
- Make vague claims
- Use "we did" instead of "your" narrative

### Examples
- **Instead of:** "Platform activity increased" 
- **Use:** "Your team published 5 posts and captured 3 leads"

- **Instead of:** "Growth metrics improved"
- **Use:** "Your growth score moved from 45 to 62, showing strong progress"

- **Instead of:** "Consider content expansion"
- **Use:** "Publishing weekly across 3 channels drives 2x more leads"

---

## Database Schema Notes

- ClientCommunicationLog should have indexes on:
  - (organizationId, sentAt) for history lookups
  - (organizationId, status) for filtering
  - (communicationType) for reporting

- Consider soft deletes or archival strategy for old records

---

## Future Enhancements

1. **SMS Channel** — Text notifications for urgent alerts
2. **Slack Integration** — Post summaries to Slack channels
3. **Calendar Export** — Add key dates to client calendar
4. **A/B Testing** — Test subject lines and content variants
5. **Personalization** — Template variables for team names, metrics
6. **Feedback Loop** — Track which reports drive action
7. **Scheduling** — Let clients customize report timing
8. **Batch Delivery** — Bundle weekly summaries into one email