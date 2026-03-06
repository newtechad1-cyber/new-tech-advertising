import React, { useEffect } from 'react';
import { createPageUrl } from '@/utils';

export default function AdaComplianceLegacy() {
  useEffect(() => {
    window.location.replace(createPageUrl('AdaWebsiteLawsuitPrevention'));
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-600">Redirecting…</p>
    </div>
  );
}