# Client Onboarding Workroom System — Complete Implementation

## ENTITIES CREATED

### 1. OnboardingWorkrooms
- **Purpose:** Main container for each client's onboarding process
- **Key Fields:**
  - `company_id` (required) — Link to Companies
  - `proposal_id` (optional) — Link to Proposals
  - `assigned_admin_user_id` (required) — Admin owner
  - `onboarding_type` (enum) — streaming_tv, website_rebuild, local_seo, video_marketing, social_media, ada_rebuild, general_marketing
  - `status` (enum) — not_started, waiting_on_client, in_progress, review, ready_to_launch, launched, paused
  - `progress_percent` (0-100) — Auto-calculated
  - `kickoff_call_date`, `launch_target_date` — Scheduling fields
  - `notes` — Internal coordination notes

### 2. OnboardingTasks
- **Purpose:** Granular checklist items for clients and admins
- **Key Fields:**
  - `workroom_id` (required) — Parent workroom
  - `visible_to_client` (boolean) — Show/hide from client view
  - `task_type` (enum) — intake_form, asset_upload, kickoff_call, content_approval, etc.
  - `status` (enum) — pending, in_progress, submitted, approved, completed, blocked
  - `required_for_launch` (boolean) — Blocks launch readiness if incomplete
  - `due_date`, `completed_date` — Timeline tracking
  - `priority` (enum) — low, medium, high, urgent

### 3. OnboardingAssets
- **Purpose:** File uploads and asset collection
- **Key Fields:**
  - `asset_type` (enum) — logo, brand_colors, website_copy, service_list, service_area, photos, videos, etc.
  - `status` (enum) — missing, submitted, approved, needs_revision
  - `file_url` — For uploaded files
  - `text_value` — For text submissions (JSON, color codes, etc.)
  - `visible_to_client` (boolean) — Show in client upload section

### 4. OnboardingForms
- **Purpose:** Structured questionnaires and intake forms
- **Key Fields:**
  - `form_type` (enum) — business_intake, brand_questionnaire, website_content_intake, streaming_tv_intake, etc.
  - `form_schema` (JSON) — Form definition with fields, validation, etc.
  - `response_data` (JSON) — Client's submitted answers
  - `status` (enum) — draft, sent, submitted, reviewed, approved
  - `visible_to_client` (boolean) — Show form to client

---

## ROUTES & PAGES

### Admin Routes
- **`/admin/onboarding`** → `AdminOnboarding.js` — List all workrooms with filtering
- **`/admin/onboarding/:workroom_id`** → `AdminOnboardingDetail.js` — Detailed workroom management

### Client Routes
- **`/client/onboarding`** → `ClientOnboarding.js` — Client-facing progress view and task/form completion

---

## AUTOMATION TRIGGERS

### 1. Auto-Create Workroom on Proposal Acceptance
**Trigger:** Proposal status changes to `accepted` or `won`
**Function:** `createOnboardingWorkroom`
**Action:**
- Creates OnboardingWorkrooms record
- Auto-populates tasks from service type template
- Creates initial asset placeholders (logo, service_list, service_area)
- Creates starter form based on service type
- Creates admin task: "Begin client onboarding"
- Creates admin notification (high priority)

**Templates by Service Type:**
- **streaming_tv:** Campaign intake, logo upload, service area, offer details, creative approval, kickoff, ad setup, script approval, launch
- **website_rebuild:** Website intake, logo upload, service pages, target cities, domain access, analytics setup, content approval, accessibility review, launch
- **social_media:** Brand questionnaire, logo upload, services/offers, social account connect, kickoff, content batch approval
- **local_seo:** Business intake, logo upload, service areas, Google Business access, analytics setup, kickoff, content approval
- **ada_rebuild:** Website audit, domain access, brand guidelines, accessibility review plan, kickoff, content migration, compliance review
- **video_marketing:** Video brief, brand assets, script provision, draft review, final approval
- **general_marketing:** Business intake, brand assets, kickoff, initial plan approval

### 2. Onboarding Monitor (Scheduled Every 4 Hours)
**Function:** `onboardingMonitor`
**Actions:**
- **Stalled Detection:** Alerts if workroom not_started for 3+ days
- **Overdue Tasks:** Alerts if visible client tasks past due date
- **Auto-Create Review Tasks:** When client submits task, creates admin review task
- **Duplicate Prevention:** Checks for existing unread/snoozed alerts before creating

### 3. Progress Calculation (On-Demand)
**Function:** `updateOnboardingProgress`
**Calculates:**
- `progress_percent` based on:
  - Required tasks completed
  - Critical assets approved (logo, service_list, service_area)
  - Forms submitted
- Auto-updates workroom `status` to `waiting_on_client` if client work pending
- Auto-updates to `review` if all requirements met
- Auto-resolves alerts when ready for launch

---

## COMPONENTS & UI

### Admin Interface
**AdminOnboarding.js** — List view with:
- Filters: all, not_started, waiting_on_client, in_progress, review, ready_to_launch, launched
- Columns: company, type, status, progress bar, kickoff date, launch target, actions
- Quick actions: Open, Mark Ready, Pause
- Status badge with color coding

**AdminOnboardingDetail.js** — Detail view with:
- **Overview Section:** Workroom title, type, status, progress, dates
- **Client Tasks Section:** Visible tasks with status badges and due dates
- **Internal Tasks Section:** Admin-only tasks with status dropdowns
- **Assets Section:** Current asset status (missing/submitted/approved)
- **Forms Section:** Form submission status
- **Notes Section:** Internal coordination notes editor
- **Blockers Sidebar:** Shows launch blockers (missing critical assets, blocked tasks)
- **Next Actions Sidebar:** Summary of what's pending for admin and client
- **Quick Actions:** Schedule kickoff, message client, request asset

### Client Interface
**ClientOnboarding.js** — Clean, guided experience:
- **Hero Section:** Welcome message + progress percentage
- **Progress Bar:** Visual progress with completion %; "X of Y tasks complete"
- **Next Step Card:** Highlighted pending task with due date and description
- **Tasks Section:** All visible tasks with completion checkmarks, organized by status
- **Files/Assets Section:** Drag-drop upload areas for each asset type
- **Forms Section:** Form completion buttons (Start, Continue, Submitted)
- **Kickoff Section:** Shows scheduled call date or prompt to request
- **Support Section:** Message/call buttons for client questions

### Command Center Widget
**OnboardingMetrics.js** — Dashboard tiles showing:
- Active onboardings (count)
- Waiting on client (count)
- Ready to launch (count)
- Stalled (count)
- Each links to filtered AdminOnboarding view

**ClientOnboardingWidget.js** — Client dashboard widget:
- Shows active workroom progress
- Displays next pending task
- Link to `/client/onboarding` for full view

---

## INTEGRATION POINTS

### With Proposal System
- `createOnboardingWorkroom` called on proposal acceptance (integrated in `proposalActions.js`)
- Workroom linked to proposal_id for traceability
- Service type inherited from proposal.service_type

### With Sales Tasks
- "Begin client onboarding" task created on acceptance
- Review tasks auto-created when client submits
- Task completion tracked in onboarding progress

### With Notifications
- Admin alerts on workroom creation (high priority)
- Stalled workroom alerts (3+ days no progress)
- Overdue task alerts
- Submitted form/asset notifications
- All respect duplicate prevention rules

### With Company/Client Data
- Workroom links to company_id and client_account_id
- Client sees only their own workroom
- Admin sees all workrooms assigned to them

### With Admin Navigation
- Added "Onboarding" link to AdminNav → AdminOnboarding page
- Appears between "Pipeline" and "Tasks" in Operations section

### With Client Dashboard
- ClientOnboardingWidget integrates into client dashboard
- Shows progress and next step
- Direct link to `/client/onboarding`

---

## TASK CREATION & STATUS FLOW

### On Proposal Acceptance:
1. Workroom created in `not_started` status
2. Tasks created based on service type template
3. Each task starts as `pending`
4. Admin can manually set to `in_progress` or `blocked`
5. Client marks as `submitted` when complete
6. Admin reviews and marks `approved` or `completed`

### Client Task Status Transitions:
```
pending → in_progress → submitted → approved/completed
         ↓
       blocked (if stuck)
```

### Progress Calculation:
- **Required Tasks Only:** Only tasks with `required_for_launch: true` count toward progress
- **Formula:** (completed_required_tasks + approved_critical_assets + submitted_forms) / (required_tasks + critical_assets + has_forms)
- **Status Auto-Updates:**
  - If client tasks pending → `waiting_on_client`
  - If all required items done → `review`

---

## ASSET COLLECTION WORKFLOW

### Missing Assets Identified:
- Logo, service_list, service_area marked as `missing` on workroom creation
- Displayed to client in upload section
- Admin can mark as `approved` after review

### Client Upload Flow:
1. Client uploads file or submits text value
2. Asset status → `submitted`
3. Admin reviews in AdminOnboardingDetail
4. Admin approves → `approved` (counts toward progress)
5. If revision needed → `needs_revision` (client re-uploads)

### Critical Assets Block Launch:
- Missing critical assets (logo, service_list, service_area) prevent `ready_to_launch` status
- Shown in admin "Blockers" section with alert icon

---

## ALERTS & NOTIFICATIONS

### Created Automatically:
| Alert Type | Trigger | Priority | Auto-Resolved |
|---|---|---|---|
| `onboarding_created` | Workroom created | High | Manual |
| `onboarding_stalled` | Not started for 3+ days | High | When started |
| `task_overdue` | Client task past due | High | When completed |
| `client_submission` | Task/form/asset submitted | Medium | Manual |

### Manual Alerts by Admin:
- "Client requested revision" (if asset needs_revision)
- "Ready for kickoff call" (if scheduled)
- "Launch ready pending admin sign-off" (status: review)

---

## LAUNCH READINESS CHECK

**Workroom can be marked `ready_to_launch` only if:**
- ✅ All required tasks completed or approved
- ✅ All critical assets approved
- ✅ All required forms submitted
- ✅ Kickoff call scheduled (if required by service type)
- ✅ No blocked items

**Launch Readiness Logic:**
1. Admin clicks "Mark Ready" button on AdminOnboardingDetail
2. System validates all conditions
3. If any blocker exists → shows which one(s) must be resolved
4. If all clear → status → `ready_to_launch`
5. Admin can now proceed to service delivery/project setup

---

## PROGRESS CALCULATION LOGIC

```javascript
const requiredTasks = tasks.filter(t => t.required_for_launch);
const completedRequired = requiredTasks.filter(t => ['completed', 'approved'].includes(t.status));
const criticalAssets = assets.filter(a => ['logo', 'service_list', 'service_area'].includes(a.asset_type));
const approvedCritical = criticalAssets.filter(a => a.status === 'approved');
const submittedForms = forms.filter(f => ['submitted', 'approved'].includes(f.status));

const totalItems = requiredTasks.length + criticalAssets.length + (forms.length > 0 ? 1 : 0);
const completedItems = completedRequired.length + approvedCritical.length + (submittedForms.length > 0 ? 1 : 0);
const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
```

---

## CLIENT EXPERIENCE PRINCIPLES

✅ **Simple:** Only show what client needs to do next
✅ **Guided:** Clear steps, not a confusing project mgmt tool
✅ **Progress Visible:** Progress bar + completion count
✅ **Reassuring:** "We know what to do next" feeling
✅ **Mobile-Friendly:** Full responsive design
✅ **Private:** No admin tasks, sales notes, or pipeline info visible
✅ **Actionable:** Clear buttons (Upload, Start Form, Request Call)

---

## ADMIN EXPERIENCE PRINCIPLES

✅ **Full Control:** See all client tasks, assets, forms, and internal work
✅ **Organized:** Grouped sections for tasks, assets, forms
✅ **Proactive:** Alerts for stalled progress and overdue items
✅ **Transparent:** Blocker visibility prevents surprises
✅ **Efficient:** Quick status updates, bulk actions, filtering
✅ **Audit Trail:** Timeline of events, submission dates, approvals

---

## DATA FLOW DIAGRAM

```
Proposal Accepted
    ↓
createOnboardingWorkroom triggered
    ↓
Create OnboardingWorkroom + Tasks + Assets + Forms
    ↓
Admin Onboarding Dashboard (AdminOnboarding.js)
    ↓
Admin Opens Detail View (AdminOnboardingDetail.js)
    ↓
├─ Assign/Review Tasks
├─ Approve Assets
├─ Check Forms
└─ Set Kickoff Date
    ↓
Client Sees Tasks in ClientOnboarding.js
    ↓
├─ Completes Tasks → submitted
├─ Uploads Assets → submitted
└─ Fills Forms → submitted
    ↓
onboardingMonitor (every 4h)
    ↓
├─ Creates review tasks for submissions
├─ Alerts on stalled/overdue
└─ Auto-updates progress
    ↓
Admin Approves Submissions
    ↓
updateOnboardingProgress recalculates
    ↓
Progress % updates, status auto-transitions
    ↓
Admin Marks ready_to_launch
    ↓
Project moved to service delivery/execution
```

---

## NEXT PHASES (FUTURE)

- **Form Builder UI:** Drag-drop form designer in AdminOnboardingDetail
- **Kickoff Calendar Integration:** Schedule calls via Google Calendar connector
- **Email Notifications:** Send form/asset requests to clients via email
- **Template Library:** Reusable forms and task templates
- **Bulk Actions:** Create workrooms from multiple proposals at once
- **Client Portal Auth:** SSO login for larger clients
- **Activity Feed:** Timeline view of all onboarding events
- **Export/Archive:** Save completed onboardings with all artifacts