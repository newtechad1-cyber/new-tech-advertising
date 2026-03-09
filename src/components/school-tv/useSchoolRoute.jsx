import { useParams, useLocation } from 'react-router-dom';
import { SCHOOL_ROUTES } from './schoolRouteConfig';

/**
 * Custom hook for accessing school route information
 * Automatically extracts schoolSlug and provides route builders
 */
export function useSchoolRoute() {
  const params = useParams();
  const location = useLocation();

  const schoolSlug = params.schoolSlug || '';

  return {
    // Current parameters
    schoolSlug,

    // Route builders (public)
    publicRoutes: {
      home: () => SCHOOL_ROUTES.public.home(schoolSlug),
      yearbook: (seasonSlug) =>
        seasonSlug
          ? SCHOOL_ROUTES.public.yearbook.season(schoolSlug, seasonSlug)
          : SCHOOL_ROUTES.public.yearbook.root(schoolSlug),
      tv: (videoSlug) =>
        videoSlug
          ? SCHOOL_ROUTES.public.tv.watch(schoolSlug, videoSlug)
          : SCHOOL_ROUTES.public.tv.root(schoolSlug),
      stories: (storySlug) =>
        storySlug
          ? SCHOOL_ROUTES.public.stories.detail(schoolSlug, storySlug)
          : SCHOOL_ROUTES.public.stories.root(schoolSlug),
      events: (eventSlug) =>
        eventSlug
          ? SCHOOL_ROUTES.public.events.detail(schoolSlug, eventSlug)
          : SCHOOL_ROUTES.public.events.root(schoolSlug),
      spotlights: (spotlightSlug) =>
        spotlightSlug
          ? SCHOOL_ROUTES.public.spotlights.detail(schoolSlug, spotlightSlug)
          : SCHOOL_ROUTES.public.spotlights.root(schoolSlug),
      submit: {
        root: () => SCHOOL_ROUTES.public.submit.root(schoolSlug),
        video: () => SCHOOL_ROUTES.public.submit.video(schoolSlug),
        photo: () => SCHOOL_ROUTES.public.submit.photo(schoolSlug),
        story: () => SCHOOL_ROUTES.public.submit.story(schoolSlug),
        event: () => SCHOOL_ROUTES.public.submit.event(schoolSlug),
      },
      about: () => SCHOOL_ROUTES.public.about(schoolSlug),
    },

    // Route builders (app/contributor)
    appRoutes: {
      contributor: {
        root: () => SCHOOL_ROUTES.app.contributor.root(schoolSlug),
        submissions: () => SCHOOL_ROUTES.app.contributor.submissions(schoolSlug),
        submissionDetail: (submissionId) =>
          SCHOOL_ROUTES.app.contributor.submissionDetail(schoolSlug, submissionId),
      },
      aiLab: {
        root: () => SCHOOL_ROUTES.app.aiLab.root(schoolSlug),
        prompts: () => SCHOOL_ROUTES.app.aiLab.prompts(schoolSlug),
        articles: () => SCHOOL_ROUTES.app.aiLab.articles(schoolSlug),
        captions: () => SCHOOL_ROUTES.app.aiLab.captions(schoolSlug),
        interviews: () => SCHOOL_ROUTES.app.aiLab.interviews(schoolSlug),
        scripts: () => SCHOOL_ROUTES.app.aiLab.scripts(schoolSlug),
        ethics: () => SCHOOL_ROUTES.app.aiLab.ethics(schoolSlug),
      },
    },

    // Route builders (admin)
    adminRoutes: {
      dashboard: () => SCHOOL_ROUTES.admin.dashboard(schoolSlug),
      submissions: (submissionId) =>
        submissionId
          ? SCHOOL_ROUTES.admin.submissions.detail(schoolSlug, submissionId)
          : SCHOOL_ROUTES.admin.submissions.list(schoolSlug),
      projects: (projectId) =>
        projectId
          ? SCHOOL_ROUTES.admin.projects.detail(schoolSlug, projectId)
          : SCHOOL_ROUTES.admin.projects.list(schoolSlug),
      renderQueue: (renderJobId) =>
        renderJobId
          ? SCHOOL_ROUTES.admin.renderQueue.detail(schoolSlug, renderJobId)
          : SCHOOL_ROUTES.admin.renderQueue.list(schoolSlug),
      videoLibrary: () => SCHOOL_ROUTES.admin.libraries.video(schoolSlug),
      storyLibrary: (storyId) =>
        storyId
          ? SCHOOL_ROUTES.admin.libraries.story.detail(schoolSlug, storyId)
          : SCHOOL_ROUTES.admin.libraries.story.list(schoolSlug),
      yearbook: {
        root: () => SCHOOL_ROUTES.admin.yearbook.root(schoolSlug),
        seasons: (seasonId) =>
          seasonId
            ? SCHOOL_ROUTES.admin.yearbook.seasons.detail(schoolSlug, seasonId)
            : SCHOOL_ROUTES.admin.yearbook.seasons.list(schoolSlug),
        pages: (pageId) =>
          pageId
            ? SCHOOL_ROUTES.admin.yearbook.pages.detail(schoolSlug, pageId)
            : SCHOOL_ROUTES.admin.yearbook.pages.list(schoolSlug),
      },
      events: (eventId) =>
        eventId
          ? SCHOOL_ROUTES.admin.events.detail(schoolSlug, eventId)
          : SCHOOL_ROUTES.admin.events.list(schoolSlug),
      spotlights: (spotlightId) =>
        spotlightId
          ? SCHOOL_ROUTES.admin.spotlights.detail(schoolSlug, spotlightId)
          : SCHOOL_ROUTES.admin.spotlights.list(schoolSlug),
      aiLab: {
        root: () => SCHOOL_ROUTES.admin.aiLab.root(schoolSlug),
        prompts: () => SCHOOL_ROUTES.admin.aiLab.prompts(schoolSlug),
        templates: () => SCHOOL_ROUTES.admin.aiLab.templates(schoolSlug),
        activity: () => SCHOOL_ROUTES.admin.aiLab.activity(schoolSlug),
      },
      analytics: () => SCHOOL_ROUTES.admin.analytics(schoolSlug),
      users: (userId) =>
        userId
          ? SCHOOL_ROUTES.admin.users.detail(schoolSlug, userId)
          : SCHOOL_ROUTES.admin.users.list(schoolSlug),
      roles: () => SCHOOL_ROUTES.admin.roles(schoolSlug),
      branding: () => SCHOOL_ROUTES.admin.branding(schoolSlug),
      settings: {
        root: () => SCHOOL_ROUTES.admin.settings.root(schoolSlug),
        permissions: () => SCHOOL_ROUTES.admin.settings.permissions(schoolSlug),
        publishing: () => SCHOOL_ROUTES.admin.settings.publishing(schoolSlug),
      },
    },

    // Current location info
    currentPath: location.pathname,
    isAdmin: location.pathname.includes('/admin/schools/'),
    isApp: location.pathname.includes('/school-app/'),
    isPublic: location.pathname.startsWith('/schools/') && !location.pathname.includes('/admin'),
  };
}