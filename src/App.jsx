// Public production entry point: the private app remains at app.newtechadvertising.com.
import React, { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { queryClientInstance } from '@/lib/query-client';
import { pagesConfig } from './pages.config';
import { PUBLIC_ROUTE_ALIASES } from '@/config/publicRoutes';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { NTADataProvider } from '@/lib/NTADataContext';
import { ExperienceProvider } from '@/lib/ExperienceLayer';
import RouteMeta from '@/components/shared/RouteMeta';

const { Pages, Layout, mainPage } = pagesConfig;
// pages.config.js is intentionally public-only. Keeping this as a direct
// reference makes the public/private boundary fail closed if a private page
// is accidentally added to the registry later.
const PublicPages = Pages;
const mainPageKey = mainPage ?? Object.keys(PublicPages)[0];
const MainPage = mainPageKey ? PublicPages[mainPageKey] : null;

const LayoutWrapper = ({ children, currentPageName }) =>
  Layout ? <Layout currentPageName={currentPageName}>{children}</Layout> : <>{children}</>;

function CoreHubRedirect({ destination = '/Login' }) {
  useEffect(() => {
    const existingRobotsMeta = document.querySelector('meta[name="robots"]');
    const previousRobotsContent = existingRobotsMeta?.getAttribute('content');
    const previousTitle = document.title;
    const robotsMeta = existingRobotsMeta || document.createElement('meta');

    if (!existingRobotsMeta) {
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }

    robotsMeta.setAttribute('content', 'noindex, nofollow');
    document.title = 'Redirecting to NTA';
    window.location.replace('https://app.newtechadvertising.com' + destination);

    return () => {
      if (previousRobotsContent === null || previousRobotsContent === undefined) {
        robotsMeta.remove();
      } else {
        robotsMeta.setAttribute('content', previousRobotsContent);
      }
      document.title = previousTitle;
    };
  }, [destination]);

  return null;
}

// Legacy private pages used PascalCase URLs before the public/private split.
// They are not registered here and must never fall through to a public 404 or
// a public page. Send only these known private families to the private app.
const LEGACY_PRIVATE_PAGE_PREFIXES = [
  'admin', 'agency', 'client', 'portal', 'ops', 'sales', 'reseller',
  'dashboard', 'crm', 'lead', 'content', 'publishing', 'proposal', 'sitemap',
  'setting', 'businessintel', 'businessprofile', 'inteladmin',
  'industryintel', 'localmarketintel', 'locationpage', 'opportunitysignal',
  'performancesignal', 'programmatic', 'scheduledqueue', 'socialaccounts',
  'weeklyplan', 'websitevideo', 'workflowmap', 'youtube', 'founderscorecard',
  'aiworkforce', 'aioperations', 'agentarchitecture', 'marketingplan',
  'chatwidget', 'operationshub', 'ntacommand', 'ntaoperator', 'ntasales',
  'ntadashboard', 'ntadeal', 'ntaonboarding', 'ntachannel', 'ntareseller',
  'ntaaiforce', 'ntaacquisition', 'ntasubmissions', 'ntacompany',
  'ntaopportunit', 'ntaclient', 'ntaproject', 'ntacampaign', 'ntatask',
  'ntaactivity', 'ntasystem', 'ntamigration', 'schoolstudentdashboard',
  'schoolstudentprofile', 'schoolstudentupload',
];

function isLegacyPrivatePageKey(value) {
  const normalized = String(value || '').toLowerCase();
  return LEGACY_PRIVATE_PAGE_PREFIXES.some(prefix => normalized.startsWith(prefix));
}

function LegacyPrivateRouteRedirect() {
  const { pathname } = useLocation();
  const firstSegment = pathname.split('/').filter(Boolean)[0] || '';
  return isLegacyPrivatePageKey(firstSegment) ? <CoreHubRedirect /> : <PageNotFound />;
}

const LEGACY_PUBLIC_REDIRECTS = {
  '/home': '/',
  '/Home': '/',
  '/HomePage': '/',
  '/index.html': '/',
  '/About': '/about',
  '/Services': '/services',
  '/Contact': '/contact',
  '/Pricing': '/pricing',
  '/PrivacyPolicy': '/privacy-policy',
  '/privacypolicy': '/privacy-policy',
  '/TermsOfService': '/terms-of-service',
  '/termsofservice': '/terms-of-service',
  '/Free-Audit': '/free-audit',
  // The former blog is retired. Keep old visitors on the current lesson library.
  '/Blog': '/knowledge',
  '/blog': '/knowledge',
  '/BlogPost': '/knowledge',
  '/blogpost': '/knowledge',
  '/insights': '/knowledge',
  '/Insights': '/knowledge',
  '/blog/*': '/knowledge',
  '/Blog/*': '/knowledge',
  '/blogpost/*': '/knowledge',
  '/BlogPost/*': '/knowledge',
  '/insights/*': '/knowledge',
  '/Insights/*': '/knowledge',
  '/Book-Call': '/book-call',
  '/BookCall': '/book-call',
  '/AiSeo': '/ai-seo',
  '/AiSocialMedia': '/ai-social-media',
  '/AiWebsites': '/ai-websites',
  '/AiAdvertising': '/ai-advertising',
  '/aiadvertising': '/ai-advertising',
  '/AiVideos': '/ai-videos',
  '/LocalLeadSystems': '/local-lead-systems',
  '/LocalVisibility': '/local-visibility',
  '/NtaJournal': '/journal',
  '/JournalLanding': '/journal',
  '/GrowthShow': '/growth-show',
  '/HelpAndSupport': '/help-and-support',
  '/MarketingPlanGenerator': '/marketing-plan-generator',
  '/SocialMediaManagement': '/services/social-media-management',
  '/socialmediamanagement': '/services/social-media-management',
  '/LearningCenter': '/learning-center',
  '/KnowledgeLibrary': '/knowledge',
  '/KnowledgePrompts': '/knowledge/prompts',
  '/AIHumanityCollection': '/knowledge/ai-humanity',
  '/OurStory': '/our-story',
  '/OurWork': '/our-work',
  '/PracticalAI': '/practical-ai-for-small-business',
  '/WhyNTA': '/why-nta',
  '/IWasEarlyAgain': '/i-was-early-again',
  '/aipolicy': '/ai-policy',
  '/CaseStudies': '/case-studies',
  '/ContractorMarketingNorthIowa': '/contractor-marketing-north-iowa',
  '/SmallBusinessMarketingNorthIowa': '/small-business-marketing-north-iowa',
  // Consolidate the former public duplicate under the canonical service URL.
  '/website-rebuilds': '/services/website-rebuilds',
  // The former Business Journey is now part of the canonical client process.
  '/business-journey': '/work-with-nta',
  '/BusinessJourney': '/work-with-nta',
};

function PublicRoutes() {
  return (
    <Routes>
      {Object.entries(LEGACY_PUBLIC_REDIRECTS).map(([from, to]) => (
        <Route key={`legacy-public:${from}`} path={from} caseSensitive element={<Navigate to={to} replace />} />
      ))}
      <Route
        path="/"
        element={
          <LayoutWrapper currentPageName={mainPageKey}>
            {MainPage ? <MainPage /> : <PageNotFound />}
          </LayoutWrapper>
        }
      />
      {Object.entries(PublicPages)
        .filter(([pageKey]) => pageKey !== mainPageKey)
        .map(([pageKey, Page]) => (
          <Route
            key={pageKey}
            path={`/${pageKey}`}
            element={
              <LayoutWrapper currentPageName={pageKey}>
                <Page />
              </LayoutWrapper>
            }
          />
        ))}
      {PUBLIC_ROUTE_ALIASES.map(({ path, Page }) => (
        <Route
          key={`public-alias:${path}`}
          path={path}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="/admin/meshy" element={<CoreHubRedirect destination="/admin/meshy" />} />
      <Route path="/Login" element={<CoreHubRedirect />} />
      <Route path="/login" element={<CoreHubRedirect />} />
      <Route path="/partner-portal/*" element={<CoreHubRedirect />} />
      <Route path="/partner-quick-start/*" element={<CoreHubRedirect />} />
      <Route path="/progress" element={<CoreHubRedirect />} />
      <Route path="/my-growth-journey" element={<CoreHubRedirect />} />
      <Route path="/my-growth-workspace" element={<CoreHubRedirect />} />
      <Route path="/business-profile" element={<CoreHubRedirect />} />
      <Route path="/support" element={<CoreHubRedirect />} />
      <Route path="/admin-center/*" element={<CoreHubRedirect />} />
      <Route path="/admin-dashboard/*" element={<CoreHubRedirect />} />
      <Route path="/client-dashboard/*" element={<CoreHubRedirect />} />
      <Route path="/nta/data-hub/*" element={<CoreHubRedirect />} />
      <Route path="/portal/*" element={<CoreHubRedirect />} />
      <Route path="/agency/*" element={<CoreHubRedirect />} />
      <Route path="/admin/*" element={<CoreHubRedirect />} />
      <Route path="/client/*" element={<CoreHubRedirect />} />
      <Route path="/ops/*" element={<CoreHubRedirect />} />
      <Route path="/sales/*" element={<CoreHubRedirect />} />
      <Route path="/reseller/*" element={<CoreHubRedirect />} />
      <Route path="/dashboard/*" element={<CoreHubRedirect />} />
      <Route path="/crm/*" element={<CoreHubRedirect />} />
      <Route path="/leads/*" element={<CoreHubRedirect />} />
      <Route path="/content-command/*" element={<CoreHubRedirect />} />
      <Route path="/content-center/*" element={<CoreHubRedirect />} />
      <Route path="/billing/*" element={<CoreHubRedirect />} />
      <Route path="/settings/*" element={<CoreHubRedirect />} />
      <Route path="/workspace/*" element={<CoreHubRedirect />} />
      <Route path="/executive-dashboard/*" element={<CoreHubRedirect />} />
      <Route path="/nta/*" element={<CoreHubRedirect />} />
      <Route path="*" element={<LegacyPrivateRouteRedirect />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <NTADataProvider>
          <Router>
            <RouteMeta />
            <ExperienceProvider>
              <PublicRoutes />
            </ExperienceProvider>
          </Router>
          <Toaster />
        </NTADataProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
