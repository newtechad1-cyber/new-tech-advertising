# School Lead Finder & Outreach Engine - Complete System

## OVERVIEW
Complete statewide school prospecting and outreach system for the School TV platform. Manage leads from initial research through customer acquisition, with integrated email templates and pipeline visualization.

---

## ENTITIES CREATED

### 1. SchoolLeads
Master record for each school prospect.

**Fields:**
- `school_name` - School name
- `district_name` - District name
- `school_type` - public | charter | private | independent
- `city`, `state` - Location
- `website` - School website URL
- `contact_name` - Primary contact name
- `contact_title` - principal | superintendent | av_director | tech_director | marketing_director | other
- `contact_email` - Contact email
- `contact_phone` - Contact phone
- `student_population` - Number of students
- `lead_source` - inbound | manual_research | referral | district_list | conference | social_media | other
- `outreach_status` - **new** → **contacted** → **replied** → **demo_scheduled** → **demo_completed** → **pilot** → **won/lost**
- `outreach_stage` - Numeric stage (0-5)
- `notes` - Internal notes
- `last_contact_date` - When we last reached out
- `next_followup_date` - When to follow up
- `demo_booked` - Boolean
- `demo_date` - Scheduled demo date/time
- `pilot_interest` - Boolean
- `client_status` - prospect | trial | customer | lost

**Status Flow:**
```
new → researched → ready_for_outreach → contacted → opened → replied → demo_scheduled → demo_completed → pilot → won
                                                                                                           ↓
                                                                                                         lost
```

### 2. SchoolOutreachCampaigns
Reusable email campaign templates.

**Fields:**
- `name` - Campaign name (e.g., "Spring 2026 California Schools")
- `campaign_type` - email_sequence | cold_outreach | warm_introduction | follow_up | pilot_recruitment
- `target_region` - Geographic region (e.g., CA, TX, NY)
- `audience_type` - all_schools | high_schools | middle_schools | districts | charter_schools
- `message_1` - First email template (intro)
- `message_2` - Second email template (follow-up)
- `message_3` - Third email template (final check-in)
- `active` - Boolean
- `created_date` - Timestamp

**Template Variables:**
- `[SCHOOL_NAME]` - School name
- `[CONTACT_NAME]` - Contact first name
- `[DISTRICT_NAME]` - District name

All templates automatically link to:
- `/schooltv-deal-room` - Decision-maker landing page
- `/demo-school-channel` - Live demo school example

### 3. SchoolOutreachActivity
Audit trail of all outreach interactions.

**Fields:**
- `school_lead_id` - Reference to SchoolLeads
- `campaign_id` - Reference to SchoolOutreachCampaigns (optional)
- `activity_type` - email_sent | email_opened | link_clicked | reply_received | call_made | demo_scheduled | demo_completed | note_added | manual_contact
- `activity_date` - When activity occurred
- `subject` - Email subject or activity title
- `message` - Email body or activity details
- `response_status` - sent | opened | clicked | replied | bounced | pending
- `notes` - Additional notes

---

## PAGES CREATED

### 1. AdminSchoolLeads (`/admin-school-leads`)
Master list of all school leads with filtering and search.

**Features:**
- Quick search by school name, contact, email
- Filter by city, district, status
- Inline status badges with color coding
- Stats cards (Total, Contacted, Demos Booked, Customers)
- Click through to lead detail page
- Links to campaigns and pipeline views

**Use Case:** Sales team dashboard to track all prospects

### 2. AdminSchoolLeadDetail (`/admin-school-lead-detail?id=...`)
Single lead detail view with full context and action buttons.

**Sections:**
- School header with status badge
- Quick stats (type, location, size, lead source)
- Primary contact info (name, title, email, phone, website)
- Timeline (last contact, next followup, demo date)
- Outreach history (all activities for this lead)
- Quick action buttons:
  - Mark Contacted
  - Mark Replied
  - Schedule Demo
  - Mark Pilot
  - Mark Won
  - Mark Lost
- Add note section

**Use Case:** Sales rep working a specific lead

### 3. AdminSchoolOutreach (`/admin-school-outreach`)
Campaign management and email template library.

**Features:**
- Campaign overview cards with toggle to view templates
- Stats: Active campaigns, Contacted, Replied, Demos Booked
- Email templates displayed by campaign
- Recent outreach activity feed (last 10)
- Links to Leads list, Pipeline, and Deal Room

**Use Case:** Campaign manager reviewing messaging and performance

### 4. AdminSchoolPipeline (`/admin-school-pipeline`)
Visual pipeline view by stage with Kanban-style layout.

**Stages:**
```
New Leads → Contacted → Replied → Demo Scheduled → Pilot → Won
                                                      ↓
                                                    Lost
```

**Features:**
- Each stage is a column with scrollable card list
- Each card shows school name, city, demo status
- Click card to open lead detail
- Stats: Total leads, conversion rate, customers
- Lost column at bottom

**Use Case:** Sales leadership reviewing progress

---

## BACKEND FUNCTIONS

### 1. generateSchoolLeadOutreachEmail()
**Purpose:** Generate personalized outreach email for a lead at a specific stage.

**Parameters:**
```javascript
{
  school_lead_id: "...",    // Required: ID of the lead
  stage: "intro",           // Required: intro | followup | final_checkin
  school_name: "...",       // Optional: override school name
  contact_name: "...",      // Optional: override contact name
  demo_url: "..."           // Optional: custom demo URL
}
```

**Returns:**
```javascript
{
  school_name: "Lincoln High School",
  contact_name: "Maria Garcia",
  stage: "intro",
  subject: "Transform Lincoln High School with Student-Created TV",
  body: "Hi Maria Garcia,\n\nI wanted to reach out...",
  preview: "Hi Maria Garcia,\nI wanted to reach out because..."
}
```

**Email Stages:**

**INTRO:** Hook and introduce platform
- Links to `/schooltv-deal-room` and `/demo-school-channel`
- Emphasizes student creation and school control
- Asks for 15-minute call

**FOLLOWUP:** Acknowledge busy season, highlight value
- References budget planning timing
- Mentions engagement and community benefits
- Repeats CTA for demo

**FINAL_CHECKIN:** Last attempt with urgency
- "One final time this month"
- Emphasizes decision timeline
- Offers flexibility

### 2. createSchoolLeadFollowup()
**Purpose:** Schedule next outreach step and create activity record.

**Parameters:**
```javascript
{
  school_lead_id: "...",           // Required
  days_until_followup: 7,          // Required: number of days
  activity_type: "email_sent",     // Optional: type of activity
  activity_note: "Sent intro..."   // Optional: activity details
}
```

**Returns:**
```javascript
{
  success: true,
  school_lead_id: "...",
  next_followup_date: "2026-03-17T00:00:00Z",
  days_until_followup: 7,
  message: "Followup scheduled for 3/17/2026 (7 days)"
}
```

### 3. schoolLeadResearchHelper()
**Purpose:** Generate lead research summary with recommendations.

**Parameters:**
```javascript
{
  school_lead_id: "..."  // Required
}
```

**Returns:**
```javascript
{
  school_name: "Lincoln High School",
  district: "San Francisco Unified",
  location: "San Francisco, CA",
  size: 1200,
  size_category: "Medium",
  contact: {
    name: "Maria Garcia",
    title: "principal",
    email: "mgarcia@sfusd.edu",
    phone: "..."
  },
  status: {
    outreach: "new",
    client: "prospect",
    demo_booked: false,
    pilot_interest: false
  },
  timeline: {
    last_contact: "Never",
    next_followup: "Not scheduled",
    days_until_followup: null
  },
  activity_count: 0,
  activities: [],
  recommended_next_step: "Send intro email about platform",
  talking_points: [
    "Budget considerations",
    "Scalable platform for large schools",
    "Strengthens school community and pride",
    "Students get real production experience",
    "School maintains full moderation control"
  ]
}
```

### 4. seedSchoolLeads() (EXECUTED)
**Purpose:** One-time function to populate sample leads for testing/demo.

**Admin-Only:** Yes
**Status:** ✅ **EXECUTED** - 8 leads + 1 campaign seeded

**Created:**
- 8 sample California school leads across full pipeline
- 1 "Spring 2026 California Schools Campaign" with 3-email sequence

---

## SAMPLE DATA (SEEDED)

### 8 School Leads (All Stages)

| School | District | City | Stage | Contact | Status |
|--------|----------|------|-------|---------|--------|
| Lincoln HS | San Francisco USD | San Francisco | new | Principal | prospect |
| Washington HS | LA USD | Los Angeles | ready_for_outreach | Tech Dir | prospect |
| Jefferson Academy | Palo Alto USD | Palo Alto | contacted | Principal | prospect |
| Berkeley HS | Berkeley USD | Berkeley | replied | AV Dir | prospect |
| Rawhide HS | San Diego USD | San Diego | demo_scheduled | Marketing Dir | prospect |
| Clearwater Prep | Private | Pasadena | demo_completed | Principal | prospect |
| Oceanside HS | Oceanside USD | Oceanside | pilot | Principal | trial |
| Riverside Academy | Riverside USD | Riverside | won | Superintendent | customer |

### 1 Campaign: "Spring 2026 California Schools"

**Email 1 - Intro:**
```
Subject: Transform [SCHOOL] with Student-Created TV
Body: Introduction to platform, student content creation, links to deal room + demo
```

**Email 2 - Follow-up:**
```
Subject: [SCHOOL] + Student-Created Media = 👀
Body: Acknowledge busy season, emphasize budget planning timing, repeat CTA
```

**Email 3 - Final Check-in:**
```
Subject: Last chance to see School TV (this month)
Body: Final attempt, 15-minute offer, emphasize decision timeline
```

---

## OUTREACH WORKFLOW

### From Lead List to Customer

1. **View All Leads** → `/admin-school-leads`
   - See all 50+ leads across all stages
   - Filter by city, district, status
   - Quick search

2. **Select Lead to Work**
   - Click lead in list → `/admin-school-lead-detail?id=...`
   - View full contact and history
   - See recommended next action

3. **Generate Outreach Email**
   - Call `generateSchoolLeadOutreachEmail(lead_id, "intro")`
   - Copy email subject + body
   - Send from your email tool

4. **Log Activity & Schedule Followup**
   - Mark "Contacted" button
   - Automatically logs activity
   - Calls `createSchoolLeadFollowup()` with 7-day delay

5. **Receive Response**
   - Lead replies to email
   - Mark "Replied" status
   - Research conversation context

6. **Schedule Demo**
   - Click "Schedule Demo" button
   - Enter demo date
   - Automatically marks as demo_scheduled

7. **Run Demo**
   - Demo link: `/demo-school-channel` to show working example
   - Decision guide: `/schooltv-deal-room` for decision-makers
   - Walkthrough their needs

8. **Post-Demo Followup**
   - If interested: Mark "Pilot"
   - If not ready: Mark "Contacted" + "Final check-in" email
   - If won: Mark "Won" + update client_status

9. **Track in Pipeline**
   - View `/admin-school-pipeline` to see visual progress
   - Monitor conversion rate
   - Identify stalled leads needing attention

---

## DEAL ROOM INTEGRATION

The entire outreach system feeds into the Deal Room `/schooltv-deal-room`:

1. **Email links directly to deal room**
   - All outreach emails mention `/schooltv-deal-room`
   - Decision-makers land on comprehensive overview
   - See pricing, ROI, case studies, FAQs

2. **Demo school example**
   - From deal room → `/demo-school-channel`
   - Prospect sees working, live example
   - Reduces friction and builds confidence

3. **Call-to-action flow**
   - "Book a Demo" button → Calendly
   - Schedules appointment with sales team
   - CRM tracks back to SchoolLeads record

---

## KEY FEATURES

✅ **Full Pipeline Management**
- Track leads from prospect to customer
- Status and stage visibility
- Activity audit trail

✅ **Integrated Email Templates**
- 3-email sequence (intro, follow-up, final)
- Personalized with lead data
- Direct links to deal room + demo

✅ **Sales Team Tools**
- Quick search and filtering
- Recommended next actions
- One-click status updates

✅ **Leadership Visibility**
- Pipeline visualization
- Conversion rate tracking
- Campaign performance

✅ **Activity Logging**
- Auto-logged when status changes
- Manual notes capability
- Complete interaction history

✅ **Demo School Integration**
- Prospects see live working example
- `/demo-school-channel` links in emails
- Reduces sales friction

---

## USAGE EXAMPLES

### For Sales Rep:

```
1. Login → /admin-school-leads
2. Search "San Francisco" schools
3. Click "Lincoln High School"
4. See: Principal Maria Garcia, never contacted
5. Call generateSchoolLeadOutreachEmail("intro")
6. Copy email, send from Gmail
7. Click "Mark Contacted"
8. Automatically scheduled for 7-day followup
9. Continue to next lead
```

### For Campaign Manager:

```
1. View /admin-school-outreach
2. See "Spring 2026 Campaign" active
3. 15 leads contacted, 3 replied, 2 demos booked
4. Click "View Email Templates"
5. Review message_1, message_2, message_3
6. See recent activity feed
7. Identify high-response regions
8. Adjust messaging for low-response regions
```

### For Sales Manager:

```
1. View /admin-school-pipeline
2. See 8 leads in demo_scheduled
3. See 2 leads in pilot
4. See 1 customer (Riverside Academy)
5. Conversion rate: 12.5%
6. Click on any lead to review
7. Identify bottlenecks
8. Coach team on stalled leads
```

---

## BEST PRACTICES

### Email Outreach:
1. Personalize with research on school
2. Lead with student benefits, not features
3. Always mention demo school example
4. Include link to deal room
5. Propose specific time for demo (not open-ended)

### Lead Qualification:
1. Student population > 500 = better fit
2. Charter/private often faster decisions
3. Contact title matters:
   - Principal = final decision-maker
   - Tech Director = implementation champion
   - Marketing Director = growth opportunity
4. Budget season (Feb-April) best for outreach

### Activity Logging:
1. Log every interaction (email, call, demo)
2. Add notes about objections/interests
3. Schedule specific followup dates
4. Never skip the "next_followup_date" field

---

## API REFERENCE

### Test Functions from Dashboard:

**Seed Data (Admin):**
```bash
POST /functions/seedSchoolLeads
Body: {}
```

**Generate Email:**
```bash
POST /functions/generateSchoolLeadOutreachEmail
Body: {
  "school_lead_id": "69b0b08e191aa73d738f5e97",
  "stage": "intro"
}
```

**Schedule Followup:**
```bash
POST /functions/createSchoolLeadFollowup
Body: {
  "school_lead_id": "69b0b08e191aa73d738f5e97",
  "days_until_followup": 7,
  "activity_type": "email_sent"
}
```

**Research Lead:**
```bash
POST /functions/schoolLeadResearchHelper
Body: {
  "school_lead_id": "69b0b08e191aa73d738f5e97"
}
```

---

## ANALYTICS & REPORTING

### Built-in Metrics:
- Total leads by status
- Conversion rate (won / total)
- Demo booking rate
- Pilot acceptance rate
- Time to demo (days)
- Time to close (days)

### Recommended Dashboards:
1. **Rep Dashboard** - My leads by status
2. **Manager Dashboard** - Team pipeline
3. **Exec Dashboard** - Monthly conversion trends

---

## NEXT STEPS (OPTIONAL)

1. **Email Integration** - Auto-send templates via API
2. **Slack Alerts** - Notify on new replies
3. **AI Recommendation** - ML-suggest best next action
4. **Bulk Import** - Upload CSV of leads
5. **Email Tracking** - See opens and clicks
6. **Proposal Generation** - Auto-create custom proposals

---

## SUMMARY

Complete, production-ready school lead management system:
- ✅ 3 entities (SchoolLeads, Campaigns, Activity)
- ✅ 4 admin pages (List, Detail, Campaigns, Pipeline)
- ✅ 4 backend functions (Email, Followup, Research, Seed)
- ✅ 8 sample leads seeded across full pipeline
- ✅ 3-email campaign with deal room links
- ✅ Integrated with `/schooltv-deal-room` and demo

**Ready to start prospecting and booking demos!**