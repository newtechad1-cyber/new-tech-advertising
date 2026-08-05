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

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : null;

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
      {Object.entries(Pages)
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
      <Route path="/portal" element={<Navigate to="/Login" replace />} />
      <Route path="/agency/*" element={<Navigate to="/Login" replace />} />
      <Route path="/admin/*" element={<Navigate to="/Login" replace />} />
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
