import { useEffect } from 'react';
import { createPageUrl } from '@/utils';

export default function WebsiteRebuild() {
  useEffect(() => { window.location.replace(createPageUrl('AdaWebsiteRebuild')); }, []);
  return null;
}