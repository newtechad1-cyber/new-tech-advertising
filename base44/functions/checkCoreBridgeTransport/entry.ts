import { createClient } from 'npm:@base44/sdk@0.8.48';
// Temporary, read-only transport diagnostic. No input forwarding, entity access or email.
const EXPIRES_AT = 1789496671545;
Deno.serve(async (req) => {
  if (Date.now() > EXPIRES_AT) return new Response(null, { status: 410 });
  if (req.method !== 'POST') return new Response(null, { status: 405 });
  const raw = await req.text();
  if (raw !== '{"connection_check":true}') return new Response(null, { status: 400 });
  const secret = String(Deno.env.get('NTA_CORE_BRIDGE_SECRET') || '').trim();
  if (secret.length < 32) return Response.json({ public_configured: false }, { status: 503 });
  const nonce = crypto.randomUUID();
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key,
    new TextEncoder().encode('nta-readonly-transport-diagnostic-v1\n' + nonce)));
  const proof = Array.from(signature, x => x.toString(16).padStart(2, '0')).join('');
  try {
    const core = createClient({ appId: '6a7215451eb90dc843a94546',
      headers: { 'x-nta-core-bridge-secret': secret } });
    const result = await core.functions.invoke('checkCoreBridgeTransport', { nonce, proof });
    const safe = result.data;
    return Response.json({
      public_configured: true, core_status: result.status,
      core_configured: safe?.configured === true,
      header_received: safe?.header_received === true,
      header_matches: safe?.header_matches === true,
      saved_secrets_match: safe?.body_proof_matches === true,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return Response.json({ public_configured: true,
      core_status: Number(error?.response?.status || 0) }, { status: 502 });
  }
});
