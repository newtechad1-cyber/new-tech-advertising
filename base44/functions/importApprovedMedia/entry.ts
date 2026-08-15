import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const ALLOWED_MIME = {
  image: new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp']),
  video: new Set(['video/mp4', 'video/quicktime', 'video/webm'])
};
const MAX_BYTES = { image: 25 * 1024 * 1024, video: 500 * 1024 * 1024 };

function reply(body: unknown, status = 200) { return Response.json(body, { status }); }

function eventId(body: any): string | null {
  const event = body?.event;
  if (!event || !['create', 'update'].includes(event.type)) return null;
  if (event.entity_name !== 'MediaImportRequest') return null;
  return typeof event.entity_id === 'string' && event.entity_id ? event.entity_id : null;
}

function isTrustedHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === 'base44.app' ||
    host.endsWith('.oaiusercontent.com') ||
    /^oaisdmntpr[^.]*\.blob\.core\.windows\.net$/.test(host) ||
    /^oaisdmntpr[^.]*\.s3\.[a-z0-9-]+\.amazonaws\.com$/.test(host);
}

function trustedHttpsUrl(value: unknown): URL | null {
  try {
    const url = new URL(String(value || ''));
    return url.protocol === 'https:' && isTrustedHost(url.hostname) ? url : null;
  } catch { return null; }
}

function extensionFor(type: string) {
  const map: Record<string, string> = {
    'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/webp': 'webp',
    'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/webm': 'webm'
  };
  return map[type] || 'bin';
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return reply({ error: 'METHOD_NOT_ALLOWED' }, 405);
  const base44 = createClientFromRequest(req);
  let body: any;
  try { body = await req.json(); } catch { return reply({ error: 'INVALID_PAYLOAD' }, 400); }

  const requestId = eventId(body);
  if (!requestId) return reply({ success: true, skipped: true, reason: 'not_media_import_event' });

  const item = await base44.asServiceRole.entities.MediaImportRequest.get(requestId);
  if (!item) return reply({ error: 'IMPORT_REQUEST_NOT_FOUND' }, 404);
  if (!item.approved || !['queued', 'awaiting_approval'].includes(item.status)) {
    return reply({ success: true, skipped: true, reason: item.status === 'ready' ? 'already_ready' : 'not_approved_or_not_queued' });
  }

  const source = trustedHttpsUrl(item.source_url);
  if (!source) {
    await base44.asServiceRole.entities.MediaImportRequest.update(requestId, {
      status: 'failed', error_message: 'Source must be an approved ChatGPT or Base44 HTTPS storage URL.', processed_at: new Date().toISOString()
    });
    return reply({ error: 'UNTRUSTED_SOURCE_URL' }, 400);
  }

  await base44.asServiceRole.entities.MediaImportRequest.update(requestId, { status: 'processing', error_message: null });

  try {
    const response = await fetch(source, { redirect: 'follow' });
    if (!response.ok) throw new Error('Source download failed with HTTP ' + response.status);
    const finalUrl = trustedHttpsUrl(response.url);
    if (!finalUrl) throw new Error('Source redirected outside approved storage');

    const contentType = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (!ALLOWED_MIME[item.asset_type]?.has(contentType)) {
      throw new Error('Unsupported ' + item.asset_type + ' format: ' + (contentType || 'unknown'));
    }
    const limit = MAX_BYTES[item.asset_type];
    const declaredSize = Number(response.headers.get('content-length') || 0);
    if (declaredSize && declaredSize > limit) throw new Error('File exceeds the import size limit');

    const bytes = new Uint8Array(await response.arrayBuffer());
    if (!bytes.length) throw new Error('Source returned an empty file');
    if (bytes.length > limit) throw new Error('File exceeds the import size limit');

    const safeName = String(item.name || 'approved-media').replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 100);
    const file = new File([bytes], safeName + '.' + extensionFor(contentType), { type: contentType });
    const uploaded = await base44.asServiceRole.integrations.Core.UploadFile({ file });
    if (!uploaded?.file_url) throw new Error('Base44 storage did not return a public URL');

    const asset = await base44.asServiceRole.entities.MediaAsset.create({
      name: item.name, url: uploaded.file_url, asset_type: item.asset_type,
      description: item.description || '',
      tags: Array.from(new Set([...(item.tags || []), 'approved-import', item.source_system || 'chatgpt'])),
      used_for: item.used_for || [],
      client_id: item.client_id || '', brand_name: item.brand_name || '',
      metricool_brand_id: item.metricool_brand_id || '',
      approval_status: 'approved', approved_by: item.approved_by || '',
      approved_at: item.approved_at || new Date().toISOString(),
      source_type: item.source_system || 'chatgpt', source_reference: item.source_url
    });

    await base44.asServiceRole.entities.MediaImportRequest.update(requestId, {
      status: 'ready', media_asset_id: asset.id, permanent_url: uploaded.file_url,
      error_message: null, processed_at: new Date().toISOString()
    });
    return reply({ success: true, request_id: requestId, media_asset_id: asset.id, permanent_url: uploaded.file_url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Media import failed';
    await base44.asServiceRole.entities.MediaImportRequest.update(requestId, {
      status: 'failed', error_message: message, processed_at: new Date().toISOString()
    });
    return reply({ error: 'MEDIA_IMPORT_FAILED', message }, 500);
  }
});