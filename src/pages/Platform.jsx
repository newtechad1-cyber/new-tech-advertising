import React, { useEffect } from 'react';
import { createPageUrl } from '@/utils';

// Canonical: /platform → AiMarketingPlatform
export default function Platform() {
  useEffect(() => {
    window.location.replace(createPageUrl('AiMarketingPlatform'));
  }, []);
  return null;
}