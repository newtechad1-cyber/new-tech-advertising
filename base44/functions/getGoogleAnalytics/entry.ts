import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Read-only reporting. Credentials stay in Base44 server secrets.
const REPORT_VERSION = 2;
const ALLOWED_DAYS = [7, 28, 30, 90];
const AI_SOURCE_PATTERN = '((www\\.)?(chatgpt\\.com|chat\\.openai\\.com|perplexity\\.ai|gemini\\.google\\.com|copilot\\.microsoft\\.com|claude\\.ai)|chatgpt|perplexity|gemini|copilot|claude)';

class ReportError extends Error {
  code: string;
  action: string;
  httpStatus: number;
  providerStatus?: number;
  constructor(code, message, action, httpStatus = 502, providerStatus?) {
    super(message);
    this.code = code;
    this.action = action;
    this.httpStatus = httpStatus;
    this.providerStatus = providerStatus;
  }
}

function json(data, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}

function safeError(error) {
  if (error instanceof ReportError) return {
    code: error.code, message: error.message, action: error.action,
    ...(error.providerStatus ? { providerStatus: error.providerStatus } : {}),
  };
  return {
    code: 'REPORT_UNAVAILABLE',
    message: 'The Google Analytics report could not be retrieved.',
    action: 'Try Refresh. If the problem continues, check the existing server reporting connection.',
  };
}

async function googleJson(url, options = {}) {
  let response;
  try {
    response = await fetch(url, { ...options, signal: AbortSignal.timeout(20000) });
  } catch {
    throw new ReportError('GOOGLE_UNREACHABLE', 'Google Analytics did not respond.', 'Try Refresh in a moment.');
  }
  let data;
  try { data = await response.json(); } catch {
    throw new ReportError('GOOGLE_RESPONSE_INVALID', 'Google returned an unreadable response.', 'Try Refresh in a moment.', 502, response.status);
  }
  if (!response.ok || data?.error) {
    const status = response.status;
    if (status === 401 || status === 403) throw new ReportError(
      'GOOGLE_ACCESS_NEEDED', 'The reporting connection could not read this Analytics property.',
      'Verify that the existing service account has Viewer access to the configured GA4 property and that the Analytics Data API is enabled.', 502, status,
    );
    if (status === 429) throw new ReportError('GOOGLE_LIMIT_REACHED', 'Google temporarily limited this report.', 'Wait a few minutes, then select Refresh.', 503, status);
    throw new ReportError('GOOGLE_REPORT_FAILED', 'Google could not complete this report.', 'Check the existing reporting configuration or try Refresh later.', 502, status);
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new ReportError('GOOGLE_RESPONSE_INVALID', 'Google returned an unexpected report.', 'Try Refresh or check the reporting connection.');
  return data;
}

async function getReadToken() {
  const raw = Deno.env.get('GA_SERVICE_ACCOUNT_JSON');
  if (!raw) throw new ReportError('CONFIGURATION_MISSING', 'The server reporting connection is not configured.', 'Restore the existing Google service account in the server configuration. No new account is needed.', 503);
  let account;
  try { account = JSON.parse(raw); } catch {
    throw new ReportError('CONFIGURATION_INVALID', 'The server reporting configuration needs attention.', 'Have an administrator verify the existing Google service-account configuration.', 503);
  }
  if (account.type !== 'service_account' || typeof account.client_email !== 'string' || typeof account.private_key !== 'string' || !account.private_key.startsWith('-----BEGIN PRIVATE KEY-----')) {
    throw new ReportError('CONFIGURATION_INVALID', 'The server reporting configuration needs attention.', 'Have an administrator verify the existing Google service-account configuration.', 503);
  }
  try {
    const encode = value => btoa(JSON.stringify(value)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const now = Math.floor(Date.now() / 1000);
    const input = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({
      iss: account.client_email, scope: 'https://www.googleapis.com/auth/analytics.readonly',
      aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
    })}`;
    const body = account.private_key.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, '');
    const key = await crypto.subtle.importKey('pkcs8', Uint8Array.from(atob(body), c => c.charCodeAt(0)), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
    const signed = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(input));
    const signature = btoa(String.fromCharCode(...new Uint8Array(signed))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const data = await googleJson('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${input}.${signature}` }).toString(),
    });
    if (typeof data.access_token !== 'string' || !data.access_token) throw new ReportError('GOOGLE_ACCESS_NEEDED', 'Google did not authorize the reporting connection.', 'Check the existing service-account configuration.', 502);
    return data.access_token;
  } catch (error) {
    if (error instanceof ReportError) throw error;
    throw new ReportError('CONFIGURATION_INVALID', 'The server reporting configuration needs attention.', 'Have an administrator verify the existing Google service-account configuration.', 503);
  }
}

function reportRows(data, dimensions, metrics) {
  const dimensionNames = (data.dimensionHeaders || []).map(h => h.name);
  const metricNames = (data.metricHeaders || []).map(h => h.name);
  if (dimensions.some(name => !dimensionNames.includes(name)) || metrics.some(name => !metricNames.includes(name)) || (data.rows !== undefined && !Array.isArray(data.rows))) {
    throw new ReportError('GOOGLE_RESPONSE_INVALID', 'Google returned an incomplete report.', 'Try Refresh or check the reporting connection.');
  }
  return (data.rows || []).map(row => {
    const result = {};
    for (const name of dimensions) {
      const value = row.dimensionValues?.[dimensionNames.indexOf(name)]?.value;
      if (typeof value !== 'string') throw new ReportError('GOOGLE_RESPONSE_INVALID', 'Google returned an incomplete report.', 'Try Refresh.');
      result[name] = value;
    }
    for (const name of metrics) {
      const value = row.metricValues?.[metricNames.indexOf(name)]?.value;
      const number = typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN;
      if (!Number.isFinite(number) || number < 0) throw new ReportError('GOOGLE_RESPONSE_INVALID', 'Google returned an invalid metric.', 'Try Refresh.');
      result[name] = number;
    }
    return result;
  });
}

function periodFor(days, timeZone) {
  if (!timeZone) return { days, startDate: null, endDate: null, timeZone: null, includesToday: false };
  try {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map(p => [p.type, p.value]));
    const today = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
    const date = offset => new Date(today - offset * 86400000).toISOString().slice(0, 10);
    return { days, startDate: date(days), endDate: date(1), timeZone, includesToday: false };
  } catch { return { days, startDate: null, endDate: null, timeZone: null, includesToday: false }; }
}

function sectionMeta(data, rows) {
  return {
    status: rows.length ? 'ready' : 'empty', rows,
    rowCount: Number.isFinite(data.rowCount) ? data.rowCount : rows.length,
    truncated: Number.isFinite(data.rowCount) && data.rowCount > rows.length,
    thresholded: Boolean(data.metadata?.subjectToThresholding),
    dataLossFromOtherRow: Boolean(data.metadata?.dataLossFromOtherRow),
    sampled: Boolean(data.metadata?.samplingMetadatas?.length),
  };
}

Deno.serve(async (req) => {
  const checkedAt = new Date().toISOString();
  let propertyId = null;
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return json({ status: 'unavailable', summary: null, error: { code: 'SIGN_IN_REQUIRED', message: 'Sign in as an administrator to view Analytics.' } }, 401);
    if (user.role !== 'admin' || user.disabled === true || user.is_active === false) return json({ status: 'unavailable', summary: null, error: { code: 'ADMIN_REQUIRED', message: 'Administrator access is required.' } }, 403);
    if (req.method !== 'POST') return json({ status: 'unavailable', summary: null, error: { code: 'METHOD_NOT_ALLOWED', message: 'Use the reporting dashboard to request this report.' } }, 405);
    let input;
    try { input = await req.json(); } catch { return json({ status: 'unavailable', summary: null, error: { code: 'INVALID_REQUEST', message: 'The report request is invalid.' } }, 400); }
    const days = input?.days ?? 30;
    if (!ALLOWED_DAYS.includes(days)) return json({ status: 'unavailable', summary: null, error: { code: 'INVALID_PERIOD', message: 'Choose 7, 28, 30, or 90 days.' } }, 400);
    propertyId = Deno.env.get('GA_PROPERTY_ID') || null;
    if (!propertyId || !/^\d+$/.test(propertyId)) throw new ReportError('CONFIGURATION_MISSING', 'A valid GA4 property is not configured for this report.', 'Verify the existing server GA4 property setting.', 503);
    const token = await getReadToken();
    const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
    const dateRanges = [{ startDate: `${days}daysAgo`, endDate: 'yesterday' }];
    const runReport = async (dimensions, metrics, extra = {}) => {
      const data = await googleJson(url, {
        method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateRanges, dimensions: dimensions.map(name => ({ name })), metrics: metrics.map(name => ({ name })), ...extra }),
      });
      return { data, rows: reportRows(data, dimensions, metrics) };
    };
    // A dimensionless report provides Google's deduplicated period totals.
    const totalMetrics = ['screenPageViews', 'totalUsers', 'activeUsers', 'sessions', 'bounceRate', 'keyEvents'];
    const totals = await runReport([], totalMetrics);
    const period = periodFor(days, totals.data.metadata?.timeZone || null);
    const definitions = [
      ['daily', ['date'], ['screenPageViews', 'totalUsers', 'sessions', 'keyEvents'], { orderBys: [{ dimension: { dimensionName: 'date' } }], limit: '90' }],
      ['sources', ['sessionSourceMedium'], ['sessions', 'keyEvents'], { orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: '25' }],
      ['campaigns', ['sessionCampaignName', 'sessionSourceMedium'], ['sessions', 'keyEvents'], { orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: '25' }],
      ['events', ['eventName'], ['eventCount', 'keyEvents'], { orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }], limit: '100' }],
      ['aiReferrals', ['sessionSourceMedium'], ['sessions', 'keyEvents'], {
        dimensionFilter: { filter: { fieldName: 'sessionSource', stringFilter: { matchType: 'FULL_REGEXP', value: AI_SOURCE_PATTERN, caseSensitive: false } } },
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: '100',
      }],
    ];
    const results = await Promise.allSettled(definitions.map(async ([name, dimensions, metrics, extra]) => {
      const { data, rows } = await runReport(dimensions, metrics, extra);
      return [name, sectionMeta(data, rows)];
    }));
    const sections = {};
    results.forEach((result, index) => {
      const name = definitions[index][0];
      if (result.status === 'fulfilled') sections[name] = result.value[1];
      else sections[name] = { status: 'unavailable', rows: null, error: safeError(result.reason) };
    });
    const latestDate = sections.daily?.rows?.at(-1)?.date;
    const latestDataDate = /^\d{8}$/.test(latestDate || '') ? `${latestDate.slice(0, 4)}-${latestDate.slice(4, 6)}-${latestDate.slice(6, 8)}` : null;
    const row = totals.rows[0];
    const summary = row ? {
      pageViews: row.screenPageViews, totalUsers: row.totalUsers, uniqueVisitors: row.totalUsers,
      activeUsers: row.activeUsers, sessions: row.sessions, bounceRate: row.bounceRate * 100, keyEvents: row.keyEvents,
    } : null;
    const warnings = [];
    if (Object.values(sections).some(section => section.status === 'unavailable')) warnings.push('Some report sections could not be retrieved. Their missing values are not zero.');
    if (totals.data.metadata?.subjectToThresholding || Object.values(sections).some(section => section.thresholded)) warnings.push('Google applied privacy thresholds to part of this report.');
    if (totals.data.metadata?.samplingMetadatas?.length || Object.values(sections).some(section => section.sampled)) warnings.push('Google sampled part of this report.');
    if (totals.data.metadata?.dataLossFromOtherRow || Object.values(sections).some(section => section.dataLossFromOtherRow)) warnings.push('Google grouped some high-cardinality data into an Other row.');
    return json({
      reportVersion: REPORT_VERSION, status: !summary ? 'empty' : warnings.length ? 'partial' : 'ready',
      source: 'Google Analytics 4', propertyId, checkedAt, fetchedAt: new Date().toISOString(),
      period, latestDataDate, summary, sections, warnings,
      notes: [
        'Reports cover complete calendar days in the Analytics property time zone. Recent data can still be processing.',
        'Users are deduplicated by Google for the full period. Daily user counts must not be added to calculate period users.',
        'Key events reflect events marked important in GA4; an event count does not by itself confirm a lead or a sale.',
        'AI referrals include recognized sources only. They do not measure AI mentions, citations, or visits whose source is unavailable.',
      ],
    });
  } catch (error) {
    return json({ reportVersion: REPORT_VERSION, status: 'unavailable', source: 'Google Analytics 4', checkedAt, propertyId: /^\d+$/.test(propertyId || '') ? propertyId : null, summary: null, sections: null, error: safeError(error) }, error instanceof ReportError ? error.httpStatus : 502);
  }
});
