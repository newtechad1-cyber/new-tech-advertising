import { useEffect } from 'react';

/**
 * Injects a <meta name="robots" content="noindex,nofollow" /> tag into <head>.
 * Automatically cleans up on unmount so public pages aren't affected.
 */
export default function NoIndexMeta() {
  useEffect(() => {
    let meta = document.head.querySelector('meta[name="robots"]');
    const created = !meta;

    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }

    const count = Number(meta.dataset.ntaNoindexGuardCount || 0);
    if (count === 0) {
      meta.dataset.ntaNoindexPreviousContent = meta.getAttribute('content') || '';
      meta.dataset.ntaNoindexCreated = created ? 'true' : 'false';
    }

    meta.dataset.ntaNoindexGuardCount = String(count + 1);
    meta.setAttribute('content', 'noindex, nofollow');

    return () => {
      if (!document.head.contains(meta)) return;

      const remaining = Math.max(
        0,
        Number(meta.dataset.ntaNoindexGuardCount || 1) - 1
      );

      if (remaining > 0) {
        meta.dataset.ntaNoindexGuardCount = String(remaining);
        return;
      }

      const wasCreated = meta.dataset.ntaNoindexCreated === 'true';
      const previousContent = meta.dataset.ntaNoindexPreviousContent;
      delete meta.dataset.ntaNoindexGuardCount;
      delete meta.dataset.ntaNoindexPreviousContent;
      delete meta.dataset.ntaNoindexCreated;

      if (wasCreated) {
        meta.remove();
      } else if (previousContent) {
        meta.setAttribute('content', previousContent);
      } else {
        meta.removeAttribute('content');
      }
    };
  }, []);

  return null;
}
