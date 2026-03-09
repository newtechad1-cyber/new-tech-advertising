# School Story Lab Route Integration Guide

## Overview

Canonical route configuration for multi-school SaaS architecture. Normalizes all school-related routes into consistent, scalable patterns.

## Files

### 1. `schoolRouteConfig.js`
Central route configuration with three route groups:
- **`SCHOOL_ROUTES.public`** - Public-facing pages
- **`SCHOOL_ROUTES.app`** - Contributor/student application
- **`SCHOOL_ROUTES.admin`** - Admin portal
- **`ADMIN_SIDEBAR_STRUCTURE`** - Navigation organization
- **`getAdminRoute()`** - Route lookup helper
- **`parseSchoolRoute()`** - URL parameter extraction

### 2. `SchoolAdminNav.jsx`
Admin sidebar navigation component:
- Organized into 5 sections
- Collapsible section headers
- Icon support via Lucide
- Active route highlighting
- Responsive styling

### 3. `useSchoolRoute.js`
Custom React hook for route access:
- Auto-extracts `schoolSlug` from URL params
- Provides route builders (public, app, admin)
- Tracks current location/context
- No manual slug passing needed

## Usage

### In Admin Pages

```jsx
import { useSchoolRoute } from '@/components/school-tv/useSchoolRoute';
import SchoolAdminNav from '@/components/school-tv/SchoolAdminNav';

export default function AdminDashboard() {
  const { schoolSlug, adminRoutes, currentPath } = useSchoolRoute();

  return (
    <div className="flex">
      <SchoolAdminNav schoolSlug={schoolSlug} currentPath={currentPath} />
      
      <div className="flex-1 p-8">
        <h1>Dashboard for {schoolSlug}</h1>
        
        {/* Navigate using adminRoutes */}
        <Link to={adminRoutes.submissions()}>View Submissions</Link>
        <Link to={adminRoutes.projects()}>View Projects</Link>
        <Link to={adminRoutes.renderQueue()}>Render Queue</Link>
      </div>
    </div>
  );
}
```

### In Public Pages

```jsx
import { useSchoolRoute } from '@/components/school-tv/useSchoolRoute';

export default function SchoolHome() {
  const { schoolSlug, publicRoutes } = useSchoolRoute();

  return (
    <div>
      <Link to={publicRoutes.tv()}>Watch Videos</Link>
      <Link to={publicRoutes.yearbook()}>View Yearbook</Link>
      <Link to={publicRoutes.stories()}>Read Stories</Link>
      <Link to={publicRoutes.submit.video()}>Submit Video</Link>
    </div>
  );
}
```

### Direct Route Access

```jsx
import { SCHOOL_ROUTES } from '@/components/school-tv/schoolRouteConfig';

const dashboardRoute = SCHOOL_ROUTES.admin.dashboard('bulldog-high');
// → /admin/schools/bulldog-high/dashboard

const videoRoute = SCHOOL_ROUTES.public.tv.watch('bulldog-high', 'game-highlights-2026');
// → /schools/bulldog-high/tv/watch/game-highlights-2026
```

## Route Structure

### Public Routes (`/schools/:schoolSlug`)

**Overview**
- `/schools/:schoolSlug` - Root
- `/schools/:schoolSlug/home` - Home
- `/schools/:schoolSlug/about` - About page

**Content Discovery**
- `/schools/:schoolSlug/tv` - Video library
- `/schools/:schoolSlug/tv/watch/:videoSlug` - Watch video
- `/schools/:schoolSlug/tv/category/:categorySlug` - Videos by category
- `/schools/:schoolSlug/tv/tag/:tagSlug` - Videos by tag

**Yearbook**
- `/schools/:schoolSlug/yearbook` - Main yearbook
- `/schools/:schoolSlug/yearbook/season/:seasonSlug` - Season view
- `/schools/:schoolSlug/yearbook/category/:categorySlug` - Category view
- `/schools/:schoolSlug/yearbook/story/:storySlug` - Story detail
- `/schools/:schoolSlug/yearbook/gallery/:gallerySlug` - Gallery view

**User-Generated Content**
- `/schools/:schoolSlug/stories` - Story directory
- `/schools/:schoolSlug/stories/:storySlug` - Story detail
- `/schools/:schoolSlug/stories/category/:categorySlug` - Stories by category
- `/schools/:schoolSlug/events` - Events directory
- `/schools/:schoolSlug/events/:eventSlug` - Event detail
- `/schools/:schoolSlug/spotlights` - Spotlights directory
- `/schools/:schoolSlug/spotlights/:spotlightSlug` - Spotlight detail

**Submissions**
- `/schools/:schoolSlug/submit` - Submit home
- `/schools/:schoolSlug/submit/video` - Submit video
- `/schools/:schoolSlug/submit/photo` - Submit photos
- `/schools/:schoolSlug/submit/story` - Submit story
- `/schools/:schoolSlug/submit/event` - Submit event

### App Routes (`/school-app/:schoolSlug`)

**Contributor Portal**
- `/school-app/:schoolSlug/contributor` - Dashboard
- `/school-app/:schoolSlug/contributor/submissions` - My submissions
- `/school-app/:schoolSlug/contributor/submissions/:id` - Submission detail

**AI Lab**
- `/school-app/:schoolSlug/ai-lab` - AI Lab home
- `/school-app/:schoolSlug/ai-lab/prompts` - Prompt library
- `/school-app/:schoolSlug/ai-lab/articles` - Article generation
- `/school-app/:schoolSlug/ai-lab/captions` - Caption generation
- `/school-app/:schoolSlug/ai-lab/interviews` - Interview assistant
- `/school-app/:schoolSlug/ai-lab/scripts` - Script generation
- `/school-app/:schoolSlug/ai-lab/ethics` - Ethics & guidelines

### Admin Routes (`/admin/schools/:schoolSlug`)

**Overview (Section: Overview)**
- `/admin/schools/:schoolSlug/dashboard` - School dashboard
- `/admin/schools/:schoolSlug/analytics` - Analytics

**Content Intake (Section: Content Intake)**
- `/admin/schools/:schoolSlug/submissions` - All submissions
- `/admin/schools/:schoolSlug/submissions/:submissionId` - Review submission

**Production (Section: Production)**
- `/admin/schools/:schoolSlug/projects` - Projects list
- `/admin/schools/:schoolSlug/projects/new` - Create project
- `/admin/schools/:schoolSlug/projects/:projectId` - Project detail
- `/admin/schools/:schoolSlug/render-queue` - Render queue
- `/admin/schools/:schoolSlug/render-queue/:renderJobId` - Render job detail
- `/admin/schools/:schoolSlug/video-library` - Video library
- `/admin/schools/:schoolSlug/story-library` - Story library
- `/admin/schools/:schoolSlug/story-library/:storyId` - Story detail
- `/admin/schools/:schoolSlug/yearbook` - Yearbook root
- `/admin/schools/:schoolSlug/yearbook/seasons` - Seasons management
- `/admin/schools/:schoolSlug/yearbook/seasons/:seasonId` - Season detail
- `/admin/schools/:schoolSlug/yearbook/pages` - Pages management
- `/admin/schools/:schoolSlug/yearbook/pages/:pageId` - Page detail

**Content Management (Section: Content Management)**
- `/admin/schools/:schoolSlug/events` - Events management
- `/admin/schools/:schoolSlug/events/:eventId` - Event detail
- `/admin/schools/:schoolSlug/spotlights` - Spotlights management
- `/admin/schools/:schoolSlug/spotlights/:spotlightId` - Spotlight detail

**AI Tools (Section: AI Tools)**
- `/admin/schools/:schoolSlug/ai-lab` - AI Lab dashboard
- `/admin/schools/:schoolSlug/ai-lab/prompts` - Manage prompts
- `/admin/schools/:schoolSlug/ai-lab/templates` - Manage templates
- `/admin/schools/:schoolSlug/ai-lab/activity` - Activity log

**Administration (Section: Administration)**
- `/admin/schools/:schoolSlug/users` - Users management
- `/admin/schools/:schoolSlug/users/:userId` - User detail
- `/admin/schools/:schoolSlug/roles` - Roles & permissions
- `/admin/schools/:schoolSlug/branding` - Branding settings
- `/admin/schools/:schoolSlug/settings` - Settings root
- `/admin/schools/:schoolSlug/settings/permissions` - Permission settings
- `/admin/schools/:schoolSlug/settings/publishing` - Publishing settings

## Admin Sidebar Sections

```
Overview
├── Dashboard
└── Analytics

Content Intake
└── Submissions

Production
├── Projects
├── Render Queue
├── Video Library
├── Story Library
└── Yearbook

Content Management
├── Events
└── Spotlights

AI Tools
├── AI Lab
├── Prompts
├── Templates
└── Activity

Administration
├── Users
├── Roles
├── Branding
└── Settings
```

## Migration Guide

### Old Pages → New Routes

Existing admin pages should be refactored to:

1. **Use `useSchoolRoute()` hook** instead of manual params
2. **Import `SchoolAdminNav`** for consistent navigation
3. **Use `adminRoutes` helpers** for internal links
4. **Update route handlers** to match canonical paths

Example transformation:

```jsx
// OLD
export default function AdminSchoolSubmissions() {
  const { schoolId } = useParams();
  // ... manually construct routes
}

// NEW
import { useSchoolRoute } from '@/components/school-tv/useSchoolRoute';
import SchoolAdminNav from '@/components/school-tv/SchoolAdminNav';

export default function AdminSchoolSubmissions() {
  const { schoolSlug, adminRoutes, currentPath } = useSchoolRoute();
  
  return (
    <div className="flex">
      <SchoolAdminNav schoolSlug={schoolSlug} currentPath={currentPath} />
      <div className="flex-1">
        {/* Use adminRoutes for links */}
        <Link to={adminRoutes.projects()}>Go to Projects</Link>
      </div>
    </div>
  );
}
```

## Benefits

✅ **Consistency** - Single source of truth for all routes
✅ **Scalability** - Easy to add new routes or schools
✅ **Maintainability** - Centralized route definitions
✅ **Type Safety** - Intellisense for route builders
✅ **DRY** - No route strings hardcoded in pages
✅ **Multi-School Ready** - Automatic slug handling
✅ **Navigation** - Unified admin sidebar structure

## Future Enhancements

- Route guards (admin-only, contributor-only)
- Breadcrumb generation from route tree
- Route history/context for back buttons
- Permission-based route filtering
- Route analytics/tracking