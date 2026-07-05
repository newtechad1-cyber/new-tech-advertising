# E-005 Editorial Dashboard

**Type:** Admin Dashboard
**Status:** Built — Awaiting deployment

## Purpose

Command center to manage the entire NTA publishing operation from one screen.

## Dashboard Widgets

| Widget | Purpose |
|--------|---------|
| Stat Cards (6) | Drafts, Scheduled, Published, Total Articles, YouTube entries, Active Channels |
| One-Click Publish | Publish queued articles to all scheduled channels with one button |
| Drafts Queue | Articles in Draft status |
| Newsletter Queue | Email channel targets (scheduled/adapted) |
| YouTube Queue | YouTube channel targets |
| Social Queue | Facebook + LinkedIn + X + GBP targets combined |
| Learning Center Queue | LearningCenter channel targets |
| Recently Published | Published articles with channel count |
| Mini Calendar | Upcoming scheduled publishes by date |
| Monthly Themes | Bar chart of content themes across articles |
| Top Performing | Articles ranked by impressions |
| Most Read | Articles ranked by clicks |
| Most Shared | Articles ranked by reactions |
| Most Viewed Videos | YouTube entries ranked by views |
| Search Queries | Placeholder for GSC integration |
| Publishing Velocity | This week / this month / all time counts |

## Files

```
src/components/publishing-engine/EditorialWidgets.jsx (new)
src/pages/EditorialDashboard.jsx                     (new)
src/App.jsx                                          (modified)
```

## Access

Admin only — `/EditorialDashboard` (covered by `Editorial` → not matching prefix, relies on `classifyRoute` default admin detection via AdminGuard in the page itself).
