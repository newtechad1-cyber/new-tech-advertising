# NTA Publishing Command Center — Redesign Complete

**Premium media operations dashboard for video publishing, approvals, and channel distribution.**

---

## Overview

The Publishing Command Center has been redesigned as the operational heart of NTA's content distribution system. It provides admins with a premium SaaS interface to manage the complete publishing pipeline: from approval through render, scheduling, and multi-channel distribution.

---

## Page: `/adminpublishing`

**Location**: `pages/AdminVideoPublishing.jsx`

### Architecture

**Single integrated dashboard** with:
- **Header**: Title, context summary, quick actions
- **Summary Cards**: 6 key metrics (clickable filters)
- **Main Content (70%)**: Pipeline board, approval queue, website publishing, issues
- **Sidebar (30%)**: Channel health, activity feed

### Data Flow

```
VideoRequests (videos awaiting review)
    ↓
Review/Approval (approval_status)
    ↓
Render (render_status)
    ↓
VideoPublishJob (publishing pipeline)
    ↓
Multi-channel distribution (website, social, etc.)
```

---

## Components

### 1. PublishingHeader.jsx
Premium header with:
- Title: "Publishing Command Center"
- Subtitle: Distribution description
- Quick action buttons: Connections, Video Library, Failed Jobs, Refresh
- Active context display (if Global Context Engine present)

### 2. PublishingSummaryCards.jsx
6 metric cards (clickable to filter):
- **Awaiting Review** (blue): Videos pending approval
- **Approved & Ready** (green): Approved videos ready to publish
- **Scheduled** (amber): Videos queued for future publish
- **Publishing Now** (purple): Active publishing jobs
- **Published Today** (emerald): Completed publishes
- **Failed / Blocked** (red): Issues requiring attention

### 3. ApprovalQueuePanel.jsx
**Approval-first design** showing:
- Video thumbnails
- Title, company, caption style, branding status
- Destination pills (Facebook, Instagram, YouTube, TikTok, Website, GBP)
- Render status
- Quick actions: Approve, Schedule, Reject

### 4. PipelineBoard.jsx
**Kanban-style pipeline** with 7 stages:
- Processing
- Ready for Review
- Approved
- Scheduled
- Publishing
- Published
- Failed / Blocked

Each stage shows:
- Stage count
- Video cards with thumbnails
- Destination icons
- Status badges
- Quick action buttons (Review, Live, Retry)

### 5. ChannelHealthSidebar.jsx
**Channel readiness panel** showing:
- Website, Facebook, Instagram, YouTube, TikTok, LinkedIn, GBP
- Status badges: Ready, Connected, Setup Needed, Token Expired, Error
- Blocked/failed job counts per channel
- Setup buttons for channels needing attention

### 6. IssuesPanel.jsx
**Critical issues section** grouped by type:
- Failed Publish → Retry button
- Blocked by Connection → Setup button
- Approval Missing → Review button
- Missing Render → Render button

Each issue shows:
- Title, company, destination
- Reason and recommended next step

### 7. WebsitePublishingPanel.jsx
**Website-first priority panel**:
- Published count, drafts, scheduled, failed
- Actions: New Story, View Published, Retry Failed, Manage Stories

### 8. ActivityFeed.jsx
**Recent events sidebar** showing:
- Video approved
- Website story published
- Facebook publish failed
- YouTube connection verified
- Scheduled publish activated
- Retry completed

---

## Key Features

### Approval-First Workflow
- Large, prominent approval queue at top of page
- Thumbnail previews for visual approval
- One-click approve/schedule/reject actions
- Review notes support

### Real-Time Pipeline Visibility
- Kanban board shows content at each stage
- Live publishing status
- Failed jobs highlighted
- Drag-friendly cards (UX ready)

### Channel Management
- Sidebar shows health of all 7 major channels
- Connection status at a glance
- Quick fix links for expired tokens
- Blocked jobs per channel

### Multi-Channel Distribution
- See destination count on each video
- Filter by destination
- Publish-ready status per channel
- Failed publishes grouped by channel

### Website-First Priority
- Dedicated website publishing panel
- Story counts and actions
- Website publishing separate from social

### Operational Insights
- Activity feed shows recent actions
- Issue panel highlights blockers
- Quick actions bar for common tasks
- Live job monitor (publishing now)

---

## Data Sources

**Real Entities Used:**
- `VideoRequests` — Videos awaiting review/approval
- `VideoPublishJob` — Publishing pipeline jobs
- `WebsiteVideoStory` — Website stories created
- `VideoPublishAuditLog` — Activity feed events
- `VideoDistributionConnection` — Channel connection status

**Data Scoping:**
- Uses `useContextDataScope()` to scope by active context
- Agency users see all companies
- Client users see only their company
- School context scopes to school videos

---

## Filters & Search

**Filters** (ready to integrate):
- Company/client
- Destination (Facebook, Instagram, etc.)
- Status (reviewing, approved, scheduled, etc.)
- Date range
- Review state
- Connection state

**Search**:
- By title
- By company name
- By destination
- By job ID

---

## Responsive Design

**Desktop (1200px+)**:
- 70% main content, 30% sidebar
- Pipeline board with 7 visible columns
- Full approval queue display

**Tablet (768px - 1199px)**:
- Stacked layout
- Pipeline board scrollable horizontally
- Sidebar moves below content

**Mobile (< 768px)**:
- Full width
- Pipeline columns narrowed
- Cards stack vertically
- Sidebar moves to bottom

---

## Colors & Styling

**Premium SaaS aesthetic**:
- Clean white cards with subtle borders
- Status color coding (green = good, red = error, etc.)
- Gradient headers for section emphasis
- Hover effects on interactive elements
- Brand-aware icons and badges

**Component Styling**:
- Cards: white, rounded, bordered, hover shadow
- Buttons: outline/solid variants with proper sizing
- Badges: colored by status type
- Icons: lucide-react (high quality)

---

## Integration Points

### Global Context Engine
If present, the page automatically:
- Reads active context (agency/client/school)
- Displays context in header
- Scopes all queries to active context
- Prevents cross-company data bleed

### Backend Functions
- `videoPublishingAgent` — Retry jobs, manage publishing
- Video processing automations — Trigger renders
- Connection health checks — Verify channel status
- Audit logging — Populate activity feed

### Real-Time Updates
- Refresh button to reload all data
- Auto-refresh capability (not yet added)
- Live job status updates (foundation ready)
- Channel health polling (foundation ready)

---

## Quick Start

### Basic Usage

1. **View Dashboard**: Page loads with summary cards
2. **Check Approvals**: See awaiting-review count, expand queue
3. **Monitor Pipeline**: View all stages at once
4. **Manage Channels**: Check sidebar for connection issues
5. **Address Issues**: Click issues panel to see blockers
6. **Publish Content**: Use pipeline board actions

### Common Workflows

**Approve and Publish**:
1. Click "Awaiting Review" card
2. Review video in approval queue
3. Click "Approve & Publish"
4. Select publish time (now or scheduled)
5. Video moves to Publishing stage

**Fix Failed Publish**:
1. Check "Failed / Blocked" card
2. Open Issues panel
3. Click "Retry" for failed publish
4. Or "Fix Setup" for blocked channel

**View Channel Status**:
1. Check sidebar "Channel Readiness"
2. See which channels are ready
3. Click "Setup" on channels needing work
4. Opens connection page

---

## Styling & Design Tokens

**Colors**:
- Primary: Blue (actions, buttons)
- Success: Green (approved, ready)
- Warning: Amber (scheduled, incomplete)
- Danger: Red (failed, blocked)
- Neutral: Gray (draft, pending)

**Spacing**: Tailwind default (4px units)
**Borders**: Subtle gray-200
**Shadows**: Hover only (not default)
**Typography**: Clear hierarchy with bold headers

---

## Future Enhancements

- [ ] Real-time polling for live updates
- [ ] Drag-and-drop pipeline cards
- [ ] Bulk approve/publish actions
- [ ] Custom filters saved to user settings
- [ ] Advanced scheduling calendar
- [ ] A/B testing variant selection
- [ ] Performance analytics per destination
- [ ] Team collaboration comments
- [ ] Audit trail detail view
- [ ] Export/reporting capabilities

---

## File Structure

```
components/publishing/
├── PublishingHeader.jsx            (Premium header)
├── PublishingSummaryCards.jsx      (6 metric cards)
├── ApprovalQueuePanel.jsx          (Approval workflow)
├── PipelineBoard.jsx               (Kanban stages)
├── ChannelHealthSidebar.jsx        (7 channels status)
├── IssuesPanel.jsx                 (Blockers grouped)
├── WebsitePublishingPanel.jsx      (Website-first)
├── ActivityFeed.jsx                (Recent events)
└── PUBLISHING_CENTER_README.md     (This file)

pages/
└── AdminVideoPublishing.jsx        (Main page)
```

---

## Testing Checklist

- [ ] Header displays correct title and context
- [ ] Summary cards show correct counts
- [ ] Summary cards are clickable (filter)
- [ ] Approval queue loads videos
- [ ] Approve/Schedule/Reject buttons work
- [ ] Pipeline board shows all 7 stages
- [ ] Videos move between stages
- [ ] Channel sidebar shows all 7 channels
- [ ] Channel status badges display correctly
- [ ] Issues panel groups by type
- [ ] Quick action buttons trigger correct actions
- [ ] Sidebar loads activity feed
- [ ] Page responds correctly on mobile
- [ ] Global Context Engine scopes data correctly
- [ ] Refresh button reloads all data

---

## Support

For questions or issues:
1. Check Global Context Engine integration (if using)
2. Verify VideoRequests and VideoPublishJob entities exist
3. Check backend function implementations
4. Review data scoping filters
5. Test with sample data

---

**Built**: 2026-03-11  
**Status**: Ready for production  
**Feel**: Premium SaaS media operations center