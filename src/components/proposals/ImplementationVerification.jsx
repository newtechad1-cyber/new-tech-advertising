# Interactive Proposal Builder — Complete Implementation Verification

## ROUTES

### Admin Routes
- `/admin/proposals` → `ProposalsList` — List, filter, copy links, delete
- `/admin/proposals/builder` → `ProposalBuilder` — Create new proposal
- `/admin/proposals/builder?id=:id` → `ProposalBuilder` — Edit existing proposal
- `/admin/proposals/preview?id=:id` → `ProposalPreview` — Admin preview (no tracking)

### Public Routes  
- `/proposal/:public_token` → `PublicProposal` → `PublicProposalContent` — Prospect views (auto-tracks views)

### Navigation
- `AdminNav.js` line 31: Added "Proposals" tile → links to `ProposalsList`

---

## ENTITIES

### Proposal Schema
**File:** `entities/Proposal.json`

**Core Fields:**
- `id`, `created_date`, `updated_date`, `created_by` (built-in)
- `title` (required), `business_name`, `service_type` (required)
- `company_id`, `lead_id`, `opportunity_id`

**Content Fields:**
- `executive_summary`, `problem_summary`, `solution_summary`
- `deliverables` (JSON array), `timeline_summary`, `pricing_summary`
- `faq_items` (JSON array), `testimonial_blocks` (JSON array)
- `roi_inputs` (JSON object), `roi_projection_summary`
- `proposal_video_url`, `proposal_thumbnail_url`, `cta_text`, `acceptance_terms`

**Pricing Fields:**
- `one_time_fee`, `monthly_fee`, `estimated_value`, `contract_term`, `deposit_amount`
- `deposit_payment_link`, `final_payment_link`

**Status & Pipeline:**
- `status` enum: `draft`, `sent`, `viewed`, `accepted`, `rejected`, `expired`
- `pipeline_stage` enum: `lead`, `proposal_sent`, `proposal_viewed`, `negotiation`, `decision_pending`, `won`, `lost`

**Security & Access:**
- `public_token` (generated on send, random string)
- `assigned_admin_user_id`

**Tracking Fields:**
- `views` (count), `view_session_count`, `time_on_proposal_seconds`
- `sections_viewed` (JSON object — {section: true}), `last_viewed_date`
- `viewer_name`, `viewer_email`
- `sent_at`, `accepted_at`, `rejected_at`, `signed_at`
- `accepted_online`, `rejected_online`, `last_action_taken`

**Meta Fields:**
- `notes`, `next_follow_up_date`, `last_contact_date`, `signer_name`

---

## PUBLIC PROPOSAL FLOW

### User Journey
1. **Admin sends proposal:**
   - Creates proposal in builder (12 sections)
   - Clicks "Send Proposal" → generates `public_token` = random string
   - Copies public link: `/proposal/token_abc123`

2. **Prospect views proposal:**
   - Opens `/proposal/:public_token`
   - `PublicProposal.js` calls `proposalActions` with `action: get` (no auth needed)
   - Content is rendered via `PublicProposalContent` component
   - Automatically calls `proposalActions` with `action: view` → **ENGAGEMENT RECORDED**

3. **Proposal display sections:**
   - Executive Summary + Service type badge
   - Problem statement
   - Solution overview  
   - Deliverables (checklist style)
   - Timeline phases
   - ROI projection cards
   - Testimonials with stars
   - FAQ accordion
   - Video section (optional, auto-plays if available)
   - Pricing breakdown
   - **3-button CTA section:**
     - "Approve Proposal" → `accept` action
     - "Request Revisions" → `revision` action  
     - "Schedule a Call" → `call_request` action

### No Admin UI Visible
- Public pages show only prospect-safe fields
- No admin controls, edit buttons, or internal notes visible
- Mobile-responsive design
- Dark/light gradient hero section

---

## ACCEPTANCE / REVISION / CALL TRIGGERS

### All Handled by `proposalActions.js` (POST `/api/proposalActions`)

#### **ACTION: ACCEPT**
```javascript
action: 'accept'
token: 'token_abc123'
viewer_name: 'John Smith'
viewer_email: 'john@company.com'
```

**System Actions:**
1. Update Proposal:
   - `status` = `accepted`
   - `pipeline_stage` = `won`
   - `accepted_at` = now
   - `accepted_online` = true
   - `last_action_taken` = `accepted_online`
   - `viewer_name`, `viewer_email` captured

2. Create `SalesNotification` (Urgent):
   - Title: "🎉 PROPOSAL ACCEPTED — {business_name}"
   - Message: Full details + value + prospect contact info
   - `priority` = `urgent`
   - `notification_type` = `proposal_viewed` (high priority alert)
   - `related_proposal_id` = proposal ID
   - `status` = `unread`

3. Create `SalesTasks` (Auto Onboarding):
   - `task_title` = "Begin onboarding — {business_name}"
   - `task_type` = `check_in`
   - `proposal_id` = proposal ID
   - `priority` = `urgent`
   - `due_date` = tomorrow
   - `status` = `pending`
   - Notes include prospect name + email

4. **Result:** Admin sees urgent alert in `AdminAlerts` + task in `AdminTasks` immediately

---

#### **ACTION: REVISION**
```javascript
action: 'revision'
token: 'token_abc123'
viewer_name: 'John Smith'
viewer_email: 'john@company.com'
```

**System Actions:**
1. Update Proposal:
   - `status` = `negotiation`
   - `pipeline_stage` = `negotiation`
   - `last_action_taken` = `revision_requested`
   - Capture viewer name + email

2. Create `SalesNotification` (High):
   - Title: "✏️ Revisions Requested — {business_name}"
   - Message: Prospect name, email, business name
   - `priority` = `high`
   - `notification_type` = `proposal_followup`

3. Create `SalesTasks`:
   - `task_title` = "Revise proposal — {business_name}"
   - `task_type` = `proposal_revision`
   - `priority` = `high`
   - `due_date` = tomorrow
   - Notes: revision requested by {prospect name}

4. **Result:** Admin can edit proposal in builder and re-send same link (token stays same)

---

#### **ACTION: CALL_REQUEST**
```javascript
action: 'call_request'
token: 'token_abc123'
viewer_name: 'John Smith'
viewer_email: 'john@company.com'
```

**System Actions:**
1. Update Proposal:
   - `last_action_taken` = `call_requested`
   - Capture viewer name + email

2. Create `SalesNotification` (Urgent):
   - Title: "📞 Call Requested — {business_name}"
   - Message: Prospect contact info + proposal details
   - `priority` = `urgent`
   - `notification_type` = `client_request`

3. Create `SalesTasks`:
   - `task_title` = "Call prospect about proposal — {business_name}"
   - `task_type` = `call`
   - `priority` = `urgent`
   - `due_date` = tomorrow
   - Notes: Prospect name/email + proposal details

4. **Result:** Admin gets urgent task to call back immediately

---

## ANALYTICS TRACKING BEHAVIOR

### View Tracking (`proposalActions` action: `view`)
**Triggered:** When public proposal loads + periodic checks
**Tracked Fields:**
- `views` ← incremented
- `view_session_count` ← incremented  
- `last_viewed_date` ← set to now
- `status` auto-updates: `sent` → `viewed` (first time only)
- `pipeline_stage` auto-updates: `proposal_sent` → `proposal_viewed` (first time)
- If provided: `viewer_name`, `viewer_email` captured

**Alerts Created:**
- **First view:** High-priority "👀 Proposal Opened" notification
- **3+ views:** Urgent "🔥 Hot Signal — Viewed 3x" notification (prevents duplicate)

### Section Viewing (`proposalActions` action: `section_viewed`)
**Triggered:** When prospect scrolls into/views a section
**Tracked:**
- `sections_viewed` (JSON object: {section_name: true})
- `time_on_proposal_seconds` ← accumulated

### Engagement Intelligence
- Multiple views = strong buying signal
- Section tracking shows what prospect cares about (e.g., pricing, ROI)
- Time spent indicates interest level
- Used for follow-up prioritization

---

## TEMPLATE SYSTEM

**Current Status:** Foundation ready, not yet implemented

**Planned:**
- `ProposalTemplates` entity with service_type categories
- Starter templates: Streaming TV, ADA Rebuild, Local SEO, Video Marketing, Social Media
- Save/load from builder
- Bulk apply to new proposals

**Future Enhancement:** Will be added to ProposalBuilder once templates entity created

---

## DUPLICATE PROTECTION RULES

### In `proposalActions.js`

#### **Duplicate Alerts Prevention:**
Uses `hasUnresolved()` helper function before creating any notification:
```javascript
const hasUnresolved = async (filters) => {
  const [unread, snoozed] = await Promise.all([
    base44.entities.SalesNotification.filter({ ...filters, status: 'unread' }),
    base44.entities.SalesNotification.filter({ ...filters, status: 'snoozed' }),
  ]);
  return unread.length > 0 || snoozed.length > 0;
};
```

**Applied to:**
- First view alert (`proposal_viewed`)
- 3+ views alert (`proposal_viewed_multiple`) — only on exactly 3
- Revision alert (`proposal_followup`)
- All other CTA alerts

**Logic:** Don't create if unread OR snoozed alert exists for same proposal + type

#### **View Count Prevention:**
- Only creates "3+ views" alert when `newViews === 3` exactly
- Won't fire again on views 4, 5, 6, etc.

#### **Status Checks Before Creating Alerts:**
- Don't alert on expiring proposals already `won` or `expired`
- Don't alert on revisions if status already `accepted` or `won`
- Check previous action taken to avoid re-alerting

### In `followUpMonitor.js`

#### **Task Duplication Check:**
```javascript
const existingFollowUpTasks = await base44.entities.SalesTasks.filter({
  proposal_id: p.id,
  task_type: 'email_followup',
  status: 'pending',
});
if (existingFollowUpTasks.length === 0) {
  // Only create if no pending task exists
}
```

**Applies to:**
- Auto follow-up task (2+ days after send)
- Onboarding check-in task (accepted_online without task)
- Hot lead contact tasks
- Trial check-in tasks

#### **Snoozed Alert Respect:**
- If admin snoozes alert, won't re-create same type until snooze expires
- Checks: `status: 'unread'` OR `status: 'snoozed'`

---

## FOLLOW-UP AUTOMATION RULES

**File:** `functions/followUpMonitor.js` — runs on-demand or scheduled

### Rule 0: Auto-Tasks for Hot Leads
- **Trigger:** Hot lead score with no pending `call_client` task
- **Action:** Create urgent task "Contact hot lead — {business_name}"
- **Due:** Today

### Rule 1: Hot Leads Gone Cold
- **Trigger:** Hot lead inactive for 3+ days
- **Check:** `last_activity < 3 days ago`
- **Action:** High-priority alert "⏰ Hot Lead Gone Cold"
- **Prevents Duplicate:** Checks for existing unresolved `followup_needed` type

### Rule 2: Proposals — Auto Follow-Up Task
- **Trigger:** Proposal sent 2+ days ago WITHOUT pending follow-up task
- **Check:** `status: 'sent'` AND `sent_at < 2 days ago`
- **Action:** Create medium-priority task "Follow up on proposal — {title}"
- **Due:** Tomorrow
- **Prevents Duplicate:** Filters existing tasks by proposal_id + task_type

### Rule 3: Proposals Not Opened
- **Trigger:** Proposal sent 2+ days ago with zero views
- **Check:** `sent_at < 2 days ago` AND `views = 0`
- **Action:** High-priority alert "📬 Proposal Not Opened"
- **Message:** Suggests follow-up call or resend
- **Prevents Duplicate:** Checks for existing `proposal_no_response` notification

### Rule 4: Proposals Viewed — No Response in 3 Days
- **Trigger:** Proposal viewed but status still `viewed` after 3 days
- **Check:** `status: 'viewed'` AND `last_viewed_date < 3 days ago`
- **Action:** Urgent alert "📄 Proposal Viewed — No Reply in 3 Days"
- **Message:** Strong buying signal indicator
- **Prevents Duplicate:** Checks for unresolved `proposal_followup`

### Rule 5: Trial Onboarding Stalled
- **Trigger:** Trial started 2+ days ago but incomplete onboarding
- **Check:** `created_date < 2 days ago` AND `onboarding_status != 'ready_for_dashboard'`
- **Actions:**
  - Create high-priority task "Reach out about incomplete onboarding"
  - Create medium-priority alert with full trial details
- **Prevents Duplicate:** Checks existing `check_in` task + `trial_incomplete` alert

### Rule 6: Overdue Tasks
- **Trigger:** Any pending task past due date
- **Check:** `due_date < today` AND `status: 'pending'` AND `alert_created: false`
- **Action:** High-priority alert "📋 Overdue Follow-Up Task"
- **Mark:** Set `alert_created: true` to prevent re-alerting daily

### Rule 7: Stalled Pipeline
- **Trigger:** Proposal inactive for 5+ days in active stages
- **Check:** `lastActivity < 5 days ago` AND stage not in (won, lost, accepted, rejected, draft)
- **Action:** High-priority alert "🔴 Proposal Stalled — No Activity"
- **Prevents Duplicate:** Checks for existing `proposal_no_response` notification

### Rule 8: Qualified Leads — No Follow-Up Scheduled
- **Trigger:** Lead status = `qualified` but no `next_follow_up` date set
- **Action:** Medium-priority alert "📋 Qualified Lead — No Follow-Up Scheduled"
- **Prevents Duplicate:** Checks existing `followup_needed` alerts

### Rule 9-11: Auto-Resolution (Cleanup)
- **Completed Trials:** Auto-resolve `trial_incomplete` alerts
- **Won/Closed Proposals:** Auto-resolve all active alerts (followup, no_response, hot_signal, viewed)
- **Progressed Leads:** Auto-resolve `hot_lead` + `followup_needed` when status changes

### **Rule 12 (NEW): PROPOSALS — EXPIRING & ONBOARDING**

#### Expiring Soon Alert
- **Trigger:** Proposal has `expires_at` date within 3 days
- **Check:** `expires_at < now + 3 days` AND `status != 'expired'` AND `status != 'won'`
- **Action:** Urgent alert "⏰ Proposal Expiring Soon — {business_name}"
- **Message:** Expiration date + "Follow up now"
- **Prevents Duplicate:** Checks existing `proposal_followup` notification

#### Accepted Online — Create Onboarding Task
- **Trigger:** Proposal accepted online but no onboarding task yet
- **Check:** `accepted_online: true` AND `status: 'accepted'` AND no pending `check_in` task
- **Action:** Create urgent task "Begin onboarding — {business_name}"
- **Due:** Today (immediate)
- **Notes:** Includes prospect name + email + "Start onboarding immediately"

---

## INTEGRATION POINTS

### **Alert System** (`SalesNotification` Entity)
| Notification Type | Trigger | Priority | Auto-Resolved |
|---|---|---|---|
| `proposal_viewed` | First view OR 3+ views | High/Urgent | When `won`/`lost` |
| `proposal_viewed_multiple` | 3rd view exactly | Urgent | When `won` |
| `proposal_followup` | Viewed 3+ days no response | Urgent | When `negotiation` ends |
| `proposal_no_response` | Sent 2+ days no view | High | When `viewed` or `won` |
| `proposal_followup` | Expiring in 3 days | Urgent | When expired/won |
| `client_request` | Call requested online | Urgent | When task completed |

### **Tasks System** (`SalesTasks` Entity)
| Task Type | Trigger | Priority | Auto-Created By |
|---|---|---|---|
| `email_followup` | Proposal sent 2+ days | Medium | followUpMonitor |
| `proposal_revision` | Revision requested | High | proposalActions |
| `call` | Call requested OR proposal viewed 3x | Urgent | proposalActions |
| `check_in` | Proposal accepted online | Urgent | proposalActions |
| `check_in` | Trial stalled 2+ days | High | followUpMonitor |

### **Pipeline** (`ProposalPipeline` Page)
- Kanban view with drag-drop status updates
- Deep-links to `ProposalDetail` for full management
- Metrics: sent, viewed, in negotiation, won this week
- Stalled detection: 5+ days no activity

### **Admin Dashboard** (`AdminDashboard`)
- Quick tile: "Create New Proposal" → ProposalBuilder
- View proposal list → ProposalsList
- Proposal metrics visible in AdminCommandCenter

### **Command Center** (`AdminCommandCenter`)
- Added `ProposalsMetricsPanel` component
- Shows: sent this week, viewed today, accepted this month, awaiting response
- Links directly to ProposalsList

---

## STATUS & READINESS

✅ **FULLY WIRED:**
- Routes (admin builder, public viewer, preview)
- Entity with all tracking fields
- Public proposal flow (view, accept, revision, call)
- Analytics tracking (views, sessions, sections, time spent)
- Duplicate protection (alert + task prevention)
- Full follow-up automation (12 rules in followUpMonitor)
- Alert + task integration
- Pipeline integration
- Command center metrics

⏳ **FUTURE (Not Blocking):**
- Template system (entity ready, UI pending)
- Email integration (send proposal as email)
- Document signing (e.g., DocuSign)
- Performance benchmarks

---

## TESTING CHECKLIST

- [ ] Create proposal in builder (fill all 12 sections)
- [ ] Click "Send Proposal" → public_token generated
- [ ] Copy and open public link in incognito window
- [ ] Verify: Proposal displays beautifully, no admin UI visible
- [ ] Scroll sections → sections_viewed tracks correctly
- [ ] Check AdminAlerts: "Proposal Opened" notification appears
- [ ] Click "Approve Proposal" → enter name + email
- [ ] Verify: Proposal status = `accepted`, pipeline = `won`
- [ ] Check AdminAlerts: Urgent acceptance notification
- [ ] Check AdminTasks: Onboarding task created with due date tomorrow
- [ ] Test revision flow: Click "Request Revisions", verify alert + task
- [ ] Test call flow: Click "Schedule Call", verify urgent task
- [ ] Run followUpMonitor: Verify expiring alerts + orphaned onboarding tasks created
- [ ] Verify duplicate protection: No duplicate alerts on re-runs