import { useEffect } from 'react';

/**
 * Applies white label branding overrides to the document when a branding config is present.
 * Call this at the top of client portal pages.
 * Usage: useResellerBranding(branding)
 */
export default function useResellerBranding(branding) {
  useEffect(() => {
    if (!branding || !branding.active) return;

    const root = document.documentElement;

    if (branding.primary_color) {
      root.style.setProperty('--brand-primary', branding.primary_color);
    }
    if (branding.secondary_color) {
      root.style.setProperty('--brand-secondary', branding.secondary_color);
    }
    if (branding.background_color) {
      document.body.style.backgroundColor = branding.background_color;
    }

    // Inject custom CSS if present
    let customStyleEl = document.getElementById('wl-custom-css');
    if (branding.custom_css) {
      if (!customStyleEl) {
        customStyleEl = document.createElement('style');
        customStyleEl.id = 'wl-custom-css';
        document.head.appendChild(customStyleEl);
      }
      customStyleEl.textContent = branding.custom_css;
    }

    // Update page title
    if (branding.brand_name) {
      document.title = branding.brand_name;
    }

    return () => {
      // Cleanup on unmount
      root.style.removeProperty('--brand-primary');
      root.style.removeProperty('--brand-secondary');
      document.body.style.removeProperty('backgroundColor');
      if (customStyleEl) customStyleEl.textContent = '';
    };
  }, [branding]);
}