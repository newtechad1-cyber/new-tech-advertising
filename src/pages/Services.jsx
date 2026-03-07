import React, { useEffect } from 'react';
import { createPageUrl } from '@/utils';

// Canonical: /services → SocialMediaManagement (services hub)
export default function Services() {
  useEffect(() => {
    window.location.replace(createPageUrl('SocialMediaManagement'));
  }, []);
  return null;
}