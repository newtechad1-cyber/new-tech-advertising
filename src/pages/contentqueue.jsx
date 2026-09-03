import React from 'react';

/**
 * Lowercase legacy-route indexing shield.
 *
 * The public router deliberately handles /contentqueue as a retired private
 * route and sends a browser visitor to the private application. This file
 * exists so Base44 registers that exact, historically indexed URL as a page
 * and can apply its platform noindex policy before client-side JavaScript runs.
 */
export default function ContentQueueLegacyIndexingShield() {
  return null;
}
