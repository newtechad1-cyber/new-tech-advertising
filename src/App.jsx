import React, { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { queryClientInstance } from '@/lib/query-client';
import { pagesConfig } from './pages.config';
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
    window.location.replace('https://app.newtechadvertising.com/Login');
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
      <Route path="/Login" element={<CoreHubRedirect />} />
      <Route path="/login" element={<CoreHubRedirect />} />
      <Route path="/portal/*" element={<Navigate to="/Login" replace />} />
      <Route path="/agency/*" element={<Navigate to="/Login" replace />} />
      <Route path="/admin/*" element={<Navigate to="/Login" replace />} />
      <Route path="/client/*" element={<Navigate to="/Login" replace />} />
      <Route path="/ops/*" element={<Navigate to="/Login" replace />} />
      <Route path="/sales/*" element={<Navigate to="/Login" replace />} />
      <Route path="/reseller/*" element={<Navigate to="/Login" replace />} />
      <Route path="/dashboard/*" element={<Navigate to="/Login" replace />} />
      <Route path="/crm/*" element={<Navigate to="/Login" replace />} />
      <Route path="/leads/*" element={<Navigate to="/Login" replace />} />
      <Route path="/content-command/*" element={<Navigate to="/Login" replace />} />
      <Route path="/content-center/*" element={<Navigate to="/Login" replace />} />
      <Route path="/billing/*" element={<Navigate to="/Login" replace />} />
      <Route path="/settings/*" element={<Navigate to="/Login" replace />} />
      <Route path="/workspace/*" element={<Navigate to="/Login" replace />} />
      <Route path="/executive-dashboard/*" element={<Navigate to="/Login" replace />} />
      <Route path="/nta/*" element={<Navigate to="/Login" replace />} />
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
