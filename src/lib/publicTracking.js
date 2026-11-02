import { base44 } from '@/api/base44Client';
import { captureVisitorAttribution, isPublicTrackingHost, safePublicPageUrl, safeReferrerOrigin } from '@/lib/visitorAttribution';

let lastNavigationKey = null;
let previousPageUrl = '';
const BOOKING_URL = 'https://calendar.app.google/p6ieYanvwhixXxZ67';

function googleEvent(eventName, properties) {
  try {
    if (typeof globalThis.gtag !== 'function') return false;
    Promise.resolve(globalThis.gtag('event', eventName, properties)).catch(() => {});
    return true;
  } catch {
    return false;
  }
}

// RouteMeta owns GA4 page views; journey page_view records remain internal.
// The GA4 stream's enhanced history-pageview setting must also be off.
export function trackPublicPageView({ navigationKey, pathname, title, noIndex = false }) {
  captureVisitorAttribution();
  if (noIndex || !isPublicTrackingHost()) return false;
  const pageUrl = safePublicPageUrl();
  const key = navigationKey || pageUrl;
  if (!pageUrl || key === lastNavigationKey) return false;
  const tracked = googleEvent('page_view', {
    page_title: title,
    page_location: pageUrl,
    page_referrer: previousPageUrl || safeReferrerOrigin(globalThis.document?.referrer),
    page_path: pathname,
    site_surface: 'public',
  });
  if (tracked) {
    lastNavigationKey = key;
    previousPageUrl = pageUrl;
  }
  return tracked;
}

export function contactIntentFromHref(href) {
  const value = typeof href === 'string' ? href.trim() : '';
  if (/^tel:/i.test(value)) return { eventName: 'contact_click', contact_method: 'phone' };
  if (/^sms:/i.test(value)) return { eventName: 'contact_click', contact_method: 'sms' };
  if (/^mailto:/i.test(value)) return { eventName: 'contact_click', contact_method: 'email' };
  try {
    const url = new URL(value, globalThis.location?.href);
    if (url.origin + url.pathname === BOOKING_URL) {
      return { eventName: 'booking_click', booking_provider: 'google_calendar' };
    }
  } catch { /* Not a measurable destination. */ }
  return null;
}

// Measure only the kind of contact action. Never transmit the recipient,
// message body, email subject, link text or full destination URL.
export function installPublicIntentTracking(doc = globalThis.document) {
  if (!doc?.addEventListener) return () => {};
  const onClick = event => {
    if (!isPublicTrackingHost() || event.defaultPrevented || event.isTrusted === false ||
        (event.button != null && ![0, 1].includes(event.button))) return;
    const target = event.target?.closest ? event.target : event.target?.parentElement;
    const link = target?.closest?.('a[href]');
    if (!link) return;
    const intent = contactIntentFromHref(link.getAttribute('href'));
    if (!intent) return;
    const { eventName, ...details } = intent;
    const properties = {
      ...details,
      interaction: 'intent',
      page_path: globalThis.location?.pathname || '/',
      page_location: safePublicPageUrl(),
      site_surface: 'public',
    };
    try {
      Promise.resolve(base44.analytics.track({ eventName, properties })).catch(() => {});
    } catch { /* Independent destinations must never interrupt navigation. */ }
    googleEvent(eventName, properties);
  };
  doc.addEventListener('click', onClick);
  doc.addEventListener('auxclick', onClick);
  return () => {
    doc.removeEventListener('click', onClick);
    doc.removeEventListener('auxclick', onClick);
  };
}
