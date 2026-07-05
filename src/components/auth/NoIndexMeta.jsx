import { useEffect } from 'react';

/**
 * Injects a <meta name="robots" content="noindex,nofollow" /> tag into <head>.
 * Automatically cleans up on unmount so public pages aren't affected.
 */
export default function NoIndexMeta() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);

    // Also override any existing robots meta that says "index, follow"
    const existing = document.head.querySelector('meta[name="robots"]');
    if (existing && existing !== meta) {
      existing.setAttribute('content', 'noindex, nofollow');
    }

    return () => {
      if (document.head.contains(meta)) {
        document.head.removeChild(meta);
      }
    };
  }, []);

  return null;
}
