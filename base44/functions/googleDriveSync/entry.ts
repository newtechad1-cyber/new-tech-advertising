import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

function isTrustedInternalUser(user) {
  return Boolean(user && (user.is_service === true || user.role === 'admin'));
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isTrustedInternalUser(user)) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    let body = {};
    try { body = await req.json(); } catch (_) {}

    // Google Drive sends notification metadata as headers. The body fallback
    // keeps trusted internal invocations compatible.
    const state = req.headers.get('x-goog-resource-state') || body.data?._provider_meta?.['x-goog-resource-state'];
    if (state === 'sync') return Response.json({ status: 'sync_ack' });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    const existing = await base44.asServiceRole.entities.SyncState.list();
    let syncRecord = existing.length > 0 ? existing[0] : null;

    if (!syncRecord) {
      const tokenRes = await fetch(
        'https://www.googleapis.com/drive/v3/changes/startPageToken',
        { headers: authHeader }
      );
      if (!tokenRes.ok) {
          throw new Error('Failed to fetch start page token');
      }
      const { startPageToken } = await tokenRes.json();
      await base44.asServiceRole.entities.SyncState.create({ page_token: startPageToken });
      return Response.json({ status: 'initialized' });
    }

    const baseUrl = `https://www.googleapis.com/drive/v3/changes?fields=changes(file(id,name,mimeType)),newStartPageToken,nextPageToken`;
    let changesUrl = baseUrl + `&pageToken=${syncRecord.page_token}`;
    const allChanges = [];
    let newPageToken = null;

    while (changesUrl) {
      const changesRes = await fetch(changesUrl, { headers: authHeader });
      if (!changesRes.ok) return Response.json({ status: 'api_error' }, { status: 500 });
      const page = await changesRes.json();
      allChanges.push(...(page.changes || []));
      if (page.newStartPageToken) newPageToken = page.newStartPageToken;
      changesUrl = page.nextPageToken ? baseUrl + `&pageToken=${page.nextPageToken}` : null;
    }

    // Process allChanges (changed files)
    console.log(`Received ${allChanges.length} changes from Google Drive.`);
    for (const change of allChanges) {
        if (change.file) {
            console.log(`Changed file: ${change.file.name} (${change.file.id})`);
            await base44.asServiceRole.entities.SystemLog.create({
                event_type: "drive_file_changed",
                status: "success",
                message: `File changed: ${change.file.name}`,
                payload_snapshot: JSON.stringify(change.file)
            });
        }
    }

    if (newPageToken) {
      await base44.asServiceRole.entities.SyncState.update(syncRecord.id, { page_token: newPageToken });
    }
    
    return Response.json({ status: 'success', changesProcessed: allChanges.length });
  } catch (error) {
    console.error("Google Drive Sync Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});