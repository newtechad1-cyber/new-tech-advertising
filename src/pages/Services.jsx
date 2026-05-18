import React, { useEffect } from 'react';
import { createPageUrl } from '@/utils';
import SEOHead from '@/components/shared/SEOHead';

// Canonical: /services → SocialMediaManagement (services hub)
export default function Services() {
  useEffect(() => {
    window.location.replace(createPageUrl('SocialMediaManagement'));
  }, []);
  return (
    <SEOHead 
      title="AI Marketing Services for Small Business | New Tech Advertising"
      description="AI-driven marketing services: AI search optimization (AISO), social media management, Google Business Profile, website rebuilds & video production. North Iowa & beyond."
    />
  );
}