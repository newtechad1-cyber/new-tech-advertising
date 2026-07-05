# J-001 NTA Journal

**Type:** Weekly Publication System
**Status:** Built — Awaiting deployment

## Purpose

Weekly publication documenting the public building of New Tech Advertising. The NTA Journal is Rick Hesse's "building in public" platform.

## Issue Structure

Every issue contains:
1. **From Rick's Desk** — Personal note from Rick (opening section)
2. **What We Built** — Technical/business progress this week
3. **What We Learned** — Insights, discoveries, pivots
4. **What It Means For Your Business** — Practical takeaway for the reader
5. **This Week's Challenge** — Challenge or question for the reader

## Entity

`JournalIssue` with fields:
- Issue Number, Volume, Title, Slug, Date
- All 5 sections (markdown)
- Summary, Featured Image, Category, Series, Tags
- Related: Articles, Videos, Learning Lessons, Services
- Cross-links: PublishingArticle, CanonEntry
- Newsletter: sent flag, subject, subscriber count
- Engagement: views, shares
- Status: Draft → Review → Approved → Scheduled → Published → Archived
- Schedule: date + time (default Monday 7:00 AM)
- CTA text + URL

## Categories (8)

Building NTA, AI & Technology, Business Growth, Client Stories,
Industry Insights, Founder Reflections, Marketing Strategy, Leadership

## Pages (2)

| Page | Route | Access |
|------|-------|--------|
| `JournalLanding.jsx` | `/journal` | Public |
| `JournalIssueView.jsx` | `/journal/:slug` | Public |

### Journal Landing (`/journal`)
- Hero with publication info (weekly, Monday 7AM)
- Search across all issues
- Category filter buttons
- Featured (latest) issue card
- Issue archive grid
- Subscribe CTA

### Issue View (`/journal/:slug`)
- Full issue header with metadata
- Table of contents
- All 5 sections with color-coded cards and icons
- Tags
- CTA block
- Previous/Next issue navigation
- Subscribe CTA

## Files

```
base44/entities/JournalIssue.jsonc        (new)
src/components/journal/journalData.js     (new)
src/pages/JournalLanding.jsx              (new)
src/pages/JournalIssueView.jsx            (new)
src/App.jsx                               (modified)
src/config/routeGovernance.js             (modified — public routes + page keys)
public/sitemap.xml                        (modified — /journal added)
base44/entities/KnowledgeRelationship.jsonc (modified — JournalIssue type)
```

## Default Schedule

- **Day:** Monday
- **Time:** 7:00 AM (America/Chicago)
- Newsletter integration ready (newsletter_sent, newsletter_subject fields)
- Publishing automation via PublishingArticle cross-link
