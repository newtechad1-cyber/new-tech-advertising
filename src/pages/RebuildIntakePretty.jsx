import React, { useEffect } from 'react';
import { createPageUrl } from '@/utils';

export default function RebuildIntakePretty() {
  useEffect(() => {
    window.location.href = createPageUrl('Rebuild-Intake');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-600">Loading…</p>
    </div>
  );
}