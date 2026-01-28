import React, { useEffect } from 'react';

export default function BookCall() {
  useEffect(() => {
    window.location.href = '/contact';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-600">Loading…</p>
    </div>
  );
}