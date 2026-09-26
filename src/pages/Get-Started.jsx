import { Navigate, useLocation } from 'react-router-dom';

// Retired intake form. Keep old client-side links headed to the current conversation flow.
export default function GetStarted() {
  const { search, hash } = useLocation();
  return <Navigate to={{ pathname: '/start', search, hash }} replace />;
}
