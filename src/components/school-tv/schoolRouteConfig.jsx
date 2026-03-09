/**
 * School Story Lab Route Configuration
 * Canonical route map for multi-school SaaS architecture
 * Used by routing utilities and navigation components
 */

export const SCHOOL_ROUTES = {
  // Public routes - school slug required
  public: {
    root: (schoolSlug) => `/schools/${schoolSlug}`,
    home: (schoolSlug) => `/schools/${schoolSlug}/home`,
    
    // Yearbook
    yearbook: {
      root: (schoolSlug) => `/schools/${schoolSlug}/yearbook`,
      season: (schoolSlug, seasonSlug) => `/schools/${schoolSlug}/yearbook/season/${seasonSlug}`,
      category: (schoolSlug, categorySlug) => `/schools/${schoolSlug}/yearbook/category/${categorySlug}`,
      story: (schoolSlug, storySlug) => `/schools/${schoolSlug}/yearbook/story/${storySlug}`,
      gallery: (schoolSlug, gallerySlug) => `/schools/${schoolSlug}/yearbook/gallery/${gallerySlug}`,
    },
    
    // TV/Video Library
    tv: {
      root: (schoolSlug) => `/schools/${schoolSlug}/tv`,
      watch: (schoolSlug, videoSlug) => `/schools/${schoolSlug}/tv/watch/${videoSlug}`,
      category: (schoolSlug, categorySlug) => `/schools/${schoolSlug}/tv/category/${categorySlug}`,
      tag: (schoolSlug, tagSlug) => `/schools/${schoolSlug}/tv/tag/${tagSlug}`,
    },
    
    // Stories
    stories: {
      root: (schoolSlug) => `/schools/${schoolSlug}/stories`,
      detail: (schoolSlug, storySlug) => `/schools/${schoolSlug}/stories/${storySlug}`,
      category: (schoolSlug, categorySlug) => `/schools/${schoolSlug}/stories/category/${categorySlug}`,
    },
    
    // Events
    events: {
      root: (schoolSlug) => `/schools/${schoolSlug}/events`,
      detail: (schoolSlug, eventSlug) => `/schools/${schoolSlug}/events/${eventSlug}`,
    },
    
    // Spotlights
    spotlights: {
      root: (schoolSlug) => `/schools/${schoolSlug}/spotlights`,
      detail: (schoolSlug, spotlightSlug) => `/schools/${schoolSlug}/spotlights/${spotlightSlug}`,
    },
    
    // Submissions
    submit: {
      root: (schoolSlug) => `/schools/${schoolSlug}/submit`,
      video: (schoolSlug) => `/schools/${schoolSlug}/submit/video`,
      photo: (schoolSlug) => `/schools/${schoolSlug}/submit/photo`,
      story: (schoolSlug) => `/schools/${schoolSlug}/submit/story`,
      event: (schoolSlug) => `/schools/${schoolSlug}/submit/event`,
    },
    
    // About
    about: (schoolSlug) => `/schools/${schoolSlug}/about`,
  },

  // Contributor/Student app routes
  app: {
    contributor: {
      root: (schoolSlug) => `/school-app/${schoolSlug}/contributor`,
      submissions: (schoolSlug) => `/school-app/${schoolSlug}/contributor/submissions`,
      submissionDetail: (schoolSlug, submissionId) => `/school-app/${schoolSlug}/contributor/submissions/${submissionId}`,
    },
    
    aiLab: {
      root: (schoolSlug) => `/school-app/${schoolSlug}/ai-lab`,
      prompts: (schoolSlug) => `/school-app/${schoolSlug}/ai-lab/prompts`,
      articles: (schoolSlug) => `/school-app/${schoolSlug}/ai-lab/articles`,
      captions: (schoolSlug) => `/school-app/${schoolSlug}/ai-lab/captions`,
      interviews: (schoolSlug) => `/school-app/${schoolSlug}/ai-lab/interviews`,
      scripts: (schoolSlug) => `/school-app/${schoolSlug}/ai-lab/scripts`,
      ethics: (schoolSlug) => `/school-app/${schoolSlug}/ai-lab/ethics`,
    },
  },

  // Admin routes
  admin: {
    root: (schoolSlug) => `/admin/schools/${schoolSlug}`,
    dashboard: (schoolSlug) => `/admin/schools/${schoolSlug}/dashboard`,
    
    // Content Intake
    submissions: {
      list: (schoolSlug) => `/admin/schools/${schoolSlug}/submissions`,
      detail: (schoolSlug, submissionId) => `/admin/schools/${schoolSlug}/submissions/${submissionId}`,
    },
    
    // Production
    projects: {
      list: (schoolSlug) => `/admin/schools/${schoolSlug}/projects`,
      create: (schoolSlug) => `/admin/schools/${schoolSlug}/projects/new`,
      detail: (schoolSlug, projectId) => `/admin/schools/${schoolSlug}/projects/${projectId}`,
    },
    
    renderQueue: {
      list: (schoolSlug) => `/admin/schools/${schoolSlug}/render-queue`,
      detail: (schoolSlug, renderJobId) => `/admin/schools/${schoolSlug}/render-queue/${renderJobId}`,
    },
    
    libraries: {
      video: (schoolSlug) => `/admin/schools/${schoolSlug}/video-library`,
      story: {
        list: (schoolSlug) => `/admin/schools/${schoolSlug}/story-library`,
        detail: (schoolSlug, storyId) => `/admin/schools/${schoolSlug}/story-library/${storyId}`,
      },
    },
    
    // Content Management
    yearbook: {
      root: (schoolSlug) => `/admin/schools/${schoolSlug}/yearbook`,
      seasons: {
        list: (schoolSlug) => `/admin/schools/${schoolSlug}/yearbook/seasons`,
        detail: (schoolSlug, seasonId) => `/admin/schools/${schoolSlug}/yearbook/seasons/${seasonId}`,
      },
      pages: {
        list: (schoolSlug) => `/admin/schools/${schoolSlug}/yearbook/pages`,
        detail: (schoolSlug, pageId) => `/admin/schools/${schoolSlug}/yearbook/pages/${pageId}`,
      },
    },
    
    events: {
      list: (schoolSlug) => `/admin/schools/${schoolSlug}/events`,
      detail: (schoolSlug, eventId) => `/admin/schools/${schoolSlug}/events/${eventId}`,
    },
    
    spotlights: {
      list: (schoolSlug) => `/admin/schools/${schoolSlug}/spotlights`,
      detail: (schoolSlug, spotlightId) => `/admin/schools/${schoolSlug}/spotlights/${spotlightId}`,
    },
    
    // AI Tools
    aiLab: {
      root: (schoolSlug) => `/admin/schools/${schoolSlug}/ai-lab`,
      prompts: (schoolSlug) => `/admin/schools/${schoolSlug}/ai-lab/prompts`,
      templates: (schoolSlug) => `/admin/schools/${schoolSlug}/ai-lab/templates`,
      activity: (schoolSlug) => `/admin/schools/${schoolSlug}/ai-lab/activity`,
    },
    
    // Analytics
    analytics: (schoolSlug) => `/admin/schools/${schoolSlug}/analytics`,
    
    // Administration
    users: {
      list: (schoolSlug) => `/admin/schools/${schoolSlug}/users`,
      detail: (schoolSlug, userId) => `/admin/schools/${schoolSlug}/users/${userId}`,
    },
    
    roles: (schoolSlug) => `/admin/schools/${schoolSlug}/roles`,
    
    branding: (schoolSlug) => `/admin/schools/${schoolSlug}/branding`,
    
    settings: {
      root: (schoolSlug) => `/admin/schools/${schoolSlug}/settings`,
      permissions: (schoolSlug) => `/admin/schools/${schoolSlug}/settings/permissions`,
      publishing: (schoolSlug) => `/admin/schools/${schoolSlug}/settings/publishing`,
    },
  },
};

/**
 * Admin sidebar navigation structure
 * Organized by section for multi-school admin portal
 */
export const ADMIN_SIDEBAR_STRUCTURE = [
  {
    section: 'Overview',
    items: [
      { label: 'Dashboard', routeKey: 'dashboard', icon: 'LayoutDashboard' },
      { label: 'Analytics', routeKey: 'analytics', icon: 'BarChart3' },
    ],
  },
  {
    section: 'Content Intake',
    items: [
      { label: 'Submissions', routeKey: 'submissions.list', icon: 'Upload' },
    ],
  },
  {
    section: 'Production',
    items: [
      { label: 'Projects', routeKey: 'projects.list', icon: 'Film' },
      { label: 'Render Queue', routeKey: 'renderQueue.list', icon: 'Zap' },
      { label: 'Video Library', routeKey: 'libraries.video', icon: 'Video' },
      { label: 'Story Library', routeKey: 'libraries.story.list', icon: 'BookOpen' },
      { label: 'Yearbook', routeKey: 'yearbook.root', icon: 'Calendar' },
    ],
  },
  {
    section: 'Content Management',
    items: [
      { label: 'Events', routeKey: 'events.list', icon: 'Clock' },
      { label: 'Spotlights', routeKey: 'spotlights.list', icon: 'Star' },
    ],
  },
  {
    section: 'AI Tools',
    items: [
      { label: 'AI Lab', routeKey: 'aiLab.root', icon: 'Sparkles' },
      { label: 'Prompts', routeKey: 'aiLab.prompts', icon: 'MessageSquare' },
      { label: 'Templates', routeKey: 'aiLab.templates', icon: 'Layout' },
      { label: 'Activity', routeKey: 'aiLab.activity', icon: 'Activity' },
    ],
  },
  {
    section: 'Administration',
    items: [
      { label: 'Users', routeKey: 'users.list', icon: 'Users' },
      { label: 'Roles', routeKey: 'roles', icon: 'Shield' },
      { label: 'Branding', routeKey: 'branding', icon: 'Palette' },
      { label: 'Settings', routeKey: 'settings.root', icon: 'Settings' },
    ],
  },
];

/**
 * Get route path from route key
 * @param {string} routeKey - Key from ADMIN_SIDEBAR_STRUCTURE (e.g., 'dashboard', 'submissions.list')
 * @param {string} schoolSlug - School slug parameter
 * @returns {string} Full route path
 */
export function getAdminRoute(routeKey, schoolSlug) {
  const keys = routeKey.split('.');
  let route = SCHOOL_ROUTES.admin;

  for (const key of keys) {
    route = route[key];
    if (typeof route === 'function') {
      return route(schoolSlug);
    }
  }

  return route;
}

/**
 * Parse route parameters from URL
 * @param {string} url - Current URL
 * @returns {object} Parsed parameters
 */
export function parseSchoolRoute(url) {
  const patterns = [
    { regex: /^\/schools\/([^/]+)/, key: 'schoolSlug' },
    { regex: /^\/school-app\/([^/]+)/, key: 'schoolSlug' },
    { regex: /^\/admin\/schools\/([^/]+)/, key: 'schoolSlug' },
  ];

  const result = {};
  for (const { regex, key } of patterns) {
    const match = url.match(regex);
    if (match) {
      result[key] = match[1];
      break;
    }
  }

  return result;
}