import React, { useEffect } from 'react';
import { createPageUrl } from '@/utils';

// Canonical: /admin → AdminDashboard
export default function Admin() {
  useEffect(() => {
    window.location.replace(createPageUrl('AdminDashboard'));
  }, []);
  return null;
}