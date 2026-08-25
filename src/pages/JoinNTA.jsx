import { Navigate, useLocation } from 'react-router-dom';

/**
 * Legacy recruiting URL kept for existing links and previously shared materials.
 * The current public opportunity lives at /regional-account-manager.
 */
export default function JoinNTA() {
  const location = useLocation();
  return <Navigate to={`/regional-account-manager${location.search}`} replace />;
}
