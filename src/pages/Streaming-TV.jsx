import React, { useEffect } from 'react';

export default function StreamingTVPretty() {
  useEffect(() => {
    window.location.href = '/streamingtv';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-600">Loading…</p>
    </div>
  );
}