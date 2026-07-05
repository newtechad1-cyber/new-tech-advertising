import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import NoIndexMeta from './NoIndexMeta';

const ADMIN_EMAILS = ['info@newtechadvertising.com', 'newtechad1@gmail.com'];

function isAdminUser(user) {
  return user?.role === 'admin' || ADMIN_EMAILS.includes(user?.email?.toLowerCase());
}

function isOpsUser(user) {
  return user?.role === 'ops' || isAdminUser(user);
}

const Spinner = () => (
  <div className="p-8 flex justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
  </div>
);

/**
 * AdminGuard — requires admin role. Redirects unauthenticated to /Login,
 * unauthorized to /client-dashboard. Adds noindex meta.
 */
export function AdminGuard({ children }) {
  const { user, isLoadingAuth } = useAuth();

  if (isLoadingAuth) return <Spinner />;
  if (!user) return <Navigate to="/Login" replace />;
  if (!isAdminUser(user)) return <Navigate to="/client-dashboard" replace />;

  return (
    <>
      <NoIndexMeta />
      {children}
    </>
  );
}

/**
 * OpsGuard — requires ops or admin role.
 */
export function OpsGuard({ children }) {
  const { user, isLoadingAuth } = useAuth();

  if (isLoadingAuth) return <Spinner />;
  if (!user) return <Navigate to="/Login" replace />;
  if (!isOpsUser(user)) return <Navigate to="/client-dashboard" replace />;

  return (
    <>
      <NoIndexMeta />
      {children}
    </>
  );
}

/**
 * ClientGuard — requires any authenticated user (clients + admins).
 * Admins can "View as" client.
 */
export function ClientGuard({ children }) {
  const { user, isLoadingAuth } = useAuth();

  if (isLoadingAuth) return <Spinner />;
  if (!user) return <Navigate to="/Login" replace />;

  return (
    <>
      <NoIndexMeta />
      {children}
    </>
  );
}

/**
 * AuthGuard — requires any authenticated user. No role check.
 */
export function AuthGuard({ children }) {
  const { user, isLoadingAuth } = useAuth();

  if (isLoadingAuth) return <Spinner />;
  if (!user) return <Navigate to="/Login" replace />;

  return (
    <>
      <NoIndexMeta />
      {children}
    </>
  );
}
