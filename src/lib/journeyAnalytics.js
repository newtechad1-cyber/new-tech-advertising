import { base44 } from '@/api/base44Client';

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
  };

  // Measurement must never interrupt the customer journey.
  base44.functions.invoke('trackJourneyEvent', payload).catch((error) => {
    console.warn('[journeyAnalytics] Event not recorded:', error?.message || error);
  });

  if (typeof globalThis.gtag === 'function') {
    globalThis.gtag('event', eventName, {
      page_path: payload.route,
      journey_step: payload.step,
      journey_source: payload.source,
    });
  }
}
