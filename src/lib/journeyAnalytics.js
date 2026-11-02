import { base44 } from '@/api/base44Client';
import { isPublicTrackingHost, publicMeasurementContext, safeCampaignValue } from '@/lib/visitorAttribution';

function getJourneySessionId() {
  try {
    const key = 'nta_journey_session_id';
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    const created = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(key, created);
    return created;
  } catch {
    return '';
  }
}

export function trackJourneyEvent(eventName, details = {}) {
  const payload = {
    event_name: eventName,
    route: details.route || globalThis.location?.pathname || '',
    step: details.step || '',
    source: details.source || '',
    session_id: getJourneySessionId(),
    site_surface: 'public',
  };

  // Measurement must never interrupt the customer journey.
  try {
    Promise.resolve(base44.analytics.track({ eventName, properties: payload })).catch(() => {});
  } catch (error) {
    console.warn('[journeyAnalytics] Event not recorded:', error?.message || error);
  }

  // RouteMeta is the sole GA4 page_view owner. Keep these internal journey
  // records without counting the homepage and recruiting route a second time.
  if (eventName !== 'page_view' && isPublicTrackingHost() && typeof globalThis.gtag === 'function') {
    try {
      Promise.resolve(globalThis.gtag('event', eventName, {
        ...publicMeasurementContext(),
        page_path: payload.route,
        journey_step: safeCampaignValue(payload.step),
        journey_source: safeCampaignValue(payload.source),
        site_surface: payload.site_surface,
      })).catch(() => {});
    } catch { /* Google measurement must not interrupt the visitor either. */ }
  }
}
