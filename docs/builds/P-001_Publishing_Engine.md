# P-001 NTA Publishing Engine + Y-001 YouTube Knowledge Engine

**Release:** TBD
**Type:** Content Publishing System
**Status:** Built — Awaiting deployment

## Purpose

**Publishing Engine:** One article becomes every marketing asset. A complete content publishing pipeline with workflow management, multi-channel distribution, scheduling, and relationship tracking.

**YouTube Knowledge Engine:** Every journal entry automatically connects to YouTube with video metadata, scripts, playlists, and cross-links back to the Canon.

## What Was Built

### Entities (3 new)

| Entity | Purpose |
|--------|---------|
| `PublishingArticle` | Master source article — title, body, metadata, workflow status (Draft→Review→Approved→Queued→Published), channel selection, scheduling defaults |
| `PublishingTarget` | Per-channel derivative — adapted content, scheduling, platform status, engagement metrics. One per channel per article. |
| `YouTubeKnowledge` | YouTube-specific metadata — video title, description, transcript, tags, thumbnail, playlist, long-form script, Shorts script, cross-links to Journal/Services/Audits |

### Publishing Engine Components (6 new)

| Component | Path | Purpose |
|-----------|------|---------|
| `publishingData.js` | `src/components/publishing-engine/` | Channel configs (10 channels), workflow states, target states, status colors, scheduling helpers |
| `PipelineOverview.jsx` | `src/components/publishing-engine/` | Pipeline stats, workflow stage counts, channel health bars, recent activity feed |
| `ArticleList.jsx` | `src/components/publishing-engine/` | Filterable article list with channel status dots, search, status/type filters |
| `ArticleEditor.jsx` | `src/components/publishing-engine/` | Full article editor — content, metadata, themes, tags, channel selection, scheduling, CTA |
| `ChannelPanel.jsx` | `src/components/publishing-engine/` | Per-channel content adaptation, scheduling, status management. Expandable rows for all 10 channels. |
| `PublishingCalendar.jsx` | `src/components/publishing-engine/` | Calendar and list views of scheduled content across all channels |
| `WorkflowBar.jsx` | `src/components/publishing-engine/` | Visual workflow stepper + action buttons for state transitions |

### YouTube Knowledge Engine Components (1 new)

| Component | Path | Purpose |
|-----------|------|---------|
| `YouTubePanel.jsx` | `src/components/youtube-engine/` | Full YouTube management panel — metadata, scripts (long + Shorts), thumbnail, playlists, cross-links, transcript |

### Pages (2 new)

| Page | Route | Purpose |
|------|-------|---------|
| `PublishingEngine.jsx` | `/PublishingEngine` | Main dashboard — Pipeline, Articles, Schedule tabs |
| `PublishingArticleView.jsx` | `/PublishingArticleView?id=...` | Article detail — Content editor, Channels, YouTube, Workflow tabs |

## Workflow

```
Draft → Review → Approve → Queue → Publish
```

- **Draft:** Content is being written
- **Review:** Waiting for CEO review
- **Approved:** Ready to queue, auto-creates channel targets
- **Queued:** Scheduled for publishing across channels
- **Published:** Live across all selected channels
- **Archived:** Removed from active rotation

## Publishing Targets (10 Channels)

1. Website
2. Email Newsletter
3. Facebook
4. LinkedIn
5. X (Twitter)
6. Google Business Profile
7. YouTube
8. AI Learning Center
9. RSS Feed
10. Archive

Each channel target tracks: adapted content, scheduling, publish status, platform post ID, platform URL, engagement metrics, error handling.

## YouTube Playlists (8)

1. Start Here
2. NTA Journal
3. Marketing Lessons
4. AI Explained
5. Business Growth
6. Website Strategy
7. Local Business
8. Case Studies

## Default Schedule

- **Day:** Monday
- **Time:** 7:00 AM (America/Chicago)
- Future scheduling supported

## Files Changed

```
base44/entities/PublishingArticle.jsonc           (new)
base44/entities/PublishingTarget.jsonc             (new)
base44/entities/YouTubeKnowledge.jsonc             (new)
base44/entities/KnowledgeRelationship.jsonc        (modified — added 3 new types)
src/components/publishing-engine/publishingData.js (new)
src/components/publishing-engine/PipelineOverview.jsx (new)
src/components/publishing-engine/ArticleList.jsx   (new)
src/components/publishing-engine/ArticleEditor.jsx (new)
src/components/publishing-engine/ChannelPanel.jsx  (new)
src/components/publishing-engine/PublishingCalendar.jsx (new)
src/components/publishing-engine/WorkflowBar.jsx   (new)
src/components/youtube-engine/YouTubePanel.jsx     (new)
src/pages/PublishingEngine.jsx                     (new)
src/pages/PublishingArticleView.jsx                (new)
src/App.jsx                                        (modified — 2 lazy imports + 2 routes)
src/config/routeGovernance.js                      (modified — Publishing prefix → admin_only)
docs/builds/P-001_Publishing_Engine.md             (new — this file)
```

## Deployment

1. Rick deploys from Base44 dashboard
2. Access at `/PublishingEngine` (admin only)
3. Create entities in Base44 if not auto-created from JSONC definitions
