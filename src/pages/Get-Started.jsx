import { Navigate } from 'react-router-dom';

// Retired intake form. Keep old client-side links headed to the current conversation flow.
export default function GetStarted() {
  return <Navigate to="/start" replace />;
}
