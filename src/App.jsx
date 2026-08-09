import React, { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { queryClientInstance } from '@/lib/query-client';
import { pagesConfig } from './pages.config';
import { PUBLIC_ROUTE_ALIASES } from '@/config/publicRoutes';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { NTADataProvider } from '@/lib/NTADataContext';
import { ExperienceProvider } from '@/lib/ExperienceLayer';
import { PUBLIC_PAGE_KEYS } from '@/config/routeGovernance';

const { Pages, Layout, mainPage } = pagesConfig;
const PublicPages = Object.fromEntries(
  Object.entries(Pages).filter(([pageKey]) => PUBLIC_PAGE_KEYS.has(pageKey))
);
const mainPageKey = mainPage ?? Object.keys(PublicPages)[0];
const MainPage = mainPageKey ? PublicPages[mainPageKey] : null;

const LayoutWrapper = ({ children, currentPageName }) =>
  Layout ? <Layout currentPageName={currentPageName}>{children}</Layout> : <>{children}</>;

function CoreHubRedirect() {
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
    window.location.replace('https://app.newtechadvertising.com/Login');

    return () => {
      if (previousRobotsContent === null || previousRobotsContent === undefined) {
        robotsMeta.remove();
      } else {
        robotsMeta.setAttribute('content', previousRobotsContent);
      }
      document.title = previousTitle;
    };
  }, []);

  return null;
}

function PublicRoutes() {
  return (
    <Routes>
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
      <Route path="/Login" element={<CoreHubRedirect />} />
      <Route path="/login" element={<CoreHubRedirect />} />
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
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <NTADataProvider>
          <Router>
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
