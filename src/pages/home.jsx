import React from 'react';

/**
 * Lowercase legacy-route indexing shield for /home.
 *
 * The public router redirects this historic duplicate to the root homepage.
 * Registering the lowercase spelling lets Base44 return noindex first.
 */
export default function LegacyHomeIndexingShield() {
  return null;
}
