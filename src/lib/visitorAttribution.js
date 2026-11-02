const STORAGE_KEY = 'nta_public_attribution_v1';
const MAX_IDLE_MS = 30 * 60 * 1000;
const CAMPAIGN_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const PUBLIC_HOSTS = new Set(['newtechadvertising.com', 'www.newtechadvertising.com']);
let memoryAttribution = null;

export function isPublicTrackingHost() {
  return PUBLIC_HOSTS.has(globalThis.location?.hostname);
}

// Campaign names are labels, never email addresses, phone numbers, URLs or free text.
export function safeCampaignValue(value) {
  const label = typeof value === 'string' ? value.trim() : '';
  if (!/^[a-z0-9][a-z0-9._~-]{0,119}$/i.test(label)) return '';
  if (/^[\d.~-]+$/.test(label) && label.replace(/\D/g, '').length >= 9) return '';
  return label;
}

function safePath(value) {
  const path = String(value || '/').split(/[?#]/)[0].slice(0, 500);
  return path.startsWith('/') && !/@|%40|[\\\r\n]/i.test(path) ? path : '/';
}

function campaignFromUrl(url) {
  const campaign = {};
  for (const key of CAMPAIGN_KEYS) {
    const value = safeCampaignValue(url.searchParams.get(key));
    if (value) campaign[key] = value;
  }
  return campaign;
}

export function safeReferrerOrigin(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.origin : '';
  } catch {
    return '';
  }
}

export function safePublicPageUrl(value = globalThis.location?.href) {
  try {
    const url = new URL(value, 'https://newtechadvertising.com');
    if (!PUBLIC_HOSTS.has(url.hostname)) return '';
    const safe = new URL(safePath(url.pathname), url.origin);
    for (const [key, label] of Object.entries(campaignFromUrl(url))) safe.searchParams.set(key, label);
    return safe.toString();
  } catch {
    return '';
  }
}

function readStoredAttribution(now) {
  let stored = memoryAttribution;
  try {
    const raw = globalThis.sessionStorage?.getItem(STORAGE_KEY);
    if (raw) stored = JSON.parse(raw);
  } catch { /* A storage restriction must never interrupt the visitor. */ }
  if (!stored || stored.version !== 1 || !Number.isFinite(stored.updated_at) ||
      now - stored.updated_at > MAX_IDLE_MS || now < stored.updated_at) return null;
  const safe = {
    version: 1,
    captured_at: Number.isFinite(stored.captured_at) ? stored.captured_at : now,
    updated_at: stored.updated_at,
    landing_page: safePublicPageUrl(stored.landing_page).split('?')[0],
    referrer: safeReferrerOrigin(stored.referrer),
  };
  for (const key of CAMPAIGN_KEYS) {
    const label = safeCampaignValue(stored[key]);
    if (label) safe[key] = label;
  }
  return safe;
}

// Session-only, 30-minute idle expiry. No identity, cookies or cross-site identifier.
export function captureVisitorAttribution(now = Date.now()) {
  if (!isPublicTrackingHost()) return {};
  try {
    const url = new URL(globalThis.location.href);
    const previous = readStoredAttribution(now);
    const campaign = campaignFromUrl(url);
    const hasCampaign = Object.keys(campaign).length > 0;
    const referrer = safeReferrerOrigin(globalThis.document?.referrer);
    const externalReferrer = referrer && !PUBLIC_HOSTS.has(new URL(referrer).hostname) ? referrer : '';
    // A new explicitly tagged visit replaces the previous campaign as a unit;
    // untagged internal navigation keeps it instead of turning it into "direct".
    const next = !previous || hasCampaign ? {
      version: 1,
      captured_at: now,
      updated_at: now,
      landing_page: safePublicPageUrl(url.href).split('?')[0],
      referrer: externalReferrer,
      ...campaign,
    } : { ...previous, updated_at: now };
    memoryAttribution = next;
    try { globalThis.sessionStorage?.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* memory fallback */ }
    return { ...next };
  } catch {
    return {};
  }
}

export function withVisitorAttribution(payload = {}) {
  const attribution = captureVisitorAttribution();
  if (!attribution.version) return payload;
  const original = payload.raw_payload && typeof payload.raw_payload === 'object' && !Array.isArray(payload.raw_payload)
    ? payload.raw_payload : {};
  const metadata = { ...original };
  for (const key of CAMPAIGN_KEYS) {
    metadata[key] = safeCampaignValue(original[key]) || attribution[key] || '';
  }
  metadata.referrer = attribution.referrer || safeReferrerOrigin(original.referrer);
  metadata.landing_page = attribution.landing_page;
  metadata.attribution_captured_at = new Date(attribution.captured_at).toISOString();
  metadata.attribution_method = attribution.utm_source || attribution.utm_campaign
    ? 'tagged_visit' : attribution.referrer ? 'referral' : 'direct_or_unknown';
  return {
    ...payload,
    source_url: safePublicPageUrl(payload.source_url || globalThis.location?.href),
    source_campaign: safeCampaignValue(payload.source_campaign) || metadata.utm_campaign,
    raw_payload: metadata,
  };
}
