import { useEffect } from 'react';
import { createPageUrl } from '@/utils';
// Canonical: StreamingTV → Streaming-TV
export default function StreamingTV() {
  useEffect(() => { window.location.replace(createPageUrl('Streaming-TV')); }, []);
  return null;
}