import React, { useEffect } from 'react';
import { createPageUrl } from '@/utils';

// Canonical: /pricing → Home (pricing section on homepage)
export default function Pricing() {
  useEffect(() => {
    window.location.replace(createPageUrl('Home') + '#pricing');
  }, []);
  return null;
}