import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RebuildIntakePretty() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/rebuildintake', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-600">Loading…</p>
    </div>
  );
}