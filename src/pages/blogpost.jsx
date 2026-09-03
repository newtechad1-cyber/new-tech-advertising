import React from 'react';

/**
 * Lowercase legacy-route indexing shield for /blogpost.
 *
 * The public router retains the visitor-facing legacy redirect. This file
 * registers the exact historically indexed spelling with Base44 so its
 * page-level noindex policy reaches the server response before JavaScript.
 */
export default function LegacyIndexingShield() {
  return null;
}
