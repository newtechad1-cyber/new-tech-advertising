import { createClient } from 'npm:@base44/sdk@0.8.48';

// Read-only readiness check. Input is never forwarded. These three receivers
// authenticate before their exact connection_check response and return before
// all entity access, LLM calls, notifications and email.
const CORE_APP_ID = '6a7215451eb90dc843a94546';
const RECEIVERS = ['ntaUnifiedIntake', 'submitRecruitingApplication', 'trackBookEvent'];
const ORIGINS = new Set([
  'https://newtechadvertising.com', 'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com', 'https://new-tech-advertising.base44.app',
]);
let cached = null;
let inFlight = null;

async function checkConnections() {
  const secret = String(Deno.env.get('NTA_CORE_BRIDGE_SECRET') || '').trim();
  if (secret.length < 32) return { connection_ready: false };
  const core = createClient({
    appId: CORE_APP_ID, headers: { 'x-nta-core-bridge-secret': secret },
  });
  const checks = await Promise.all(RECEIVERS.map(async (name) => {
    let timer;
    try {
      const response = await Promise.race([
        core.functions.invoke(name, { connection_check: true }),
        new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('timeout')), 10000); }),
      ]);
      const data = response?.data;
      return [name, data?.connection_ready === true && data?.function === name];
    } catch {
      return [name, false];
    } finally { clearTimeout(timer); }
  }));
  return {
    connection_ready: checks.every(([, ready]) => ready),
    connections: Object.fromEntries(checks),
  };
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response(null, { status: 405 });
  if (!ORIGINS.has(req.headers.get('origin') || '')) return new Response(null, { status: 403 });
  if (Number(req.headers.get('content-length') || 0) > 128) return new Response(null, { status: 413 });
  const raw = await req.text();
  if (raw.length > 128) return new Response(null, { status: 413 });
  let body;
  try { body = JSON.parse(raw); } catch { return new Response(null, { status: 400 }); }
  if (!body || Array.isArray(body) || Object.keys(body).length !== 1 || body.connection_check !== true)
    return new Response(null, { status: 400 });
  if (!cached || Date.now() >= cached.until) {
    if (!inFlight) {
      inFlight = checkConnections()
        .catch(() => ({ connection_ready: false }))
        .then(result => {
          cached = { result, until: Date.now() + (result.connection_ready ? 30000 : 5000) };
          return result;
        }).finally(() => { inFlight = null; });
    }
    await inFlight;
  }
  const result = cached.result;
  return Response.json(result, {
    status: result.connection_ready ? 200 : 503,
    headers: { 'Cache-Control': 'no-store' },
  });
});
