import { useEffect } from 'react';
import { createPageUrl } from '@/utils';

export default function WebsiteRebuildLegacy() {
  useEffect(() => {
    window.location.replace(createPageUrl('AdaWebsiteRebuild'));
  }, []);
  return null;
}