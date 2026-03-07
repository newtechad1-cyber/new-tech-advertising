import React, { useEffect } from 'react';
import { createPageUrl } from '@/utils';

// Canonical: /onboarding → ClientOnboarding
export default function Onboarding() {
  useEffect(() => {
    window.location.replace(createPageUrl('ClientOnboarding'));
  }, []);
  return null;
}