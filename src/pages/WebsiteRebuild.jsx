import { useEffect } from 'react';
import { createPageUrl } from '@/utils';
// Canonical: WebsiteRebuild → Website-Rebuild
export default function WebsiteRebuild() {
  useEffect(() => { window.location.replace(createPageUrl('Website-Rebuild')); }, []);
  return null;
}