import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const base44 = createClientFromRequest(req);
    
    // Webhook metadata
    const state = body.data?._provider_meta?.['x-goog-resource-state'];
    if (state === 'sync') return Response.json({ status: 'sync_ack' });

    // Connect to Google Drive using the service role connection
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // Use a specific SyncState record for this integration to avoid conflicts
    const existing = await base44.asServiceRole.entities.SyncState.filter({ description: 'Growth Guide Drive Watch' });
    let syncRecord = existing.length > 0 ? existing[0] : null;

    if (!syncRecord) {
      // First run: Get a start page token
      const tokenRes = await fetch(
        'https://www.googleapis.com/drive/v3/changes/startPageToken',
        { headers: authHeader }
      );
      if (!tokenRes.ok) throw new Error('Failed to fetch start page token');
      
      const { startPageToken } = await tokenRes.json();
      await base44.asServiceRole.entities.SyncState.create({ 
        page_token: startPageToken,
        description: 'Growth Guide Drive Watch' 
      });
      return Response.json({ status: 'initialized' });
    }

    // Fetch all pages of changes (requesting 'parents' field to filter by folder)
    const baseUrl = `https://www.googleapis.com/drive/v3/changes?fields=changes(file(id,name,mimeType,parents)),newStartPageToken,nextPageToken`;
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

    // TODO: Define your target Folder ID here, or fetch from an App Settings entity
    const TARGET_FOLDER_ID = null; // e.g., "1A2B3C4D5E6F..."

    console.log(`Received ${allChanges.length} changes from Google Drive.`);
    
    for (const change of allChanges) {
        if (change.file && !change.removed) {
            const file = change.file;
            
            // If target folder is set, process only files in that folder
            if (TARGET_FOLDER_ID && file.parents && file.parents.includes(TARGET_FOLDER_ID)) {
                console.log(`Growth Guide document updated: ${file.name} (${file.id})`);
                
                await base44.asServiceRole.entities.SystemLog.create({
                    event_type: "growth_guide_document_detected",
                    status: "success",
                    message: `New or updated Growth Guide document detected: ${file.name}`,
                    payload_snapshot: JSON.stringify(file)
                });

                // Add logic here to download the file content or process it
                // e.g., fetch content using Google Drive API and pass to Growth Guide endpoints
            } else if (!TARGET_FOLDER_ID) {
                // If no folder configured, just log the change
                console.log(`File changed: ${file.name} (Configure TARGET_FOLDER_ID to process Growth Guide docs)`);
            }
        }
    }

    // Save the new page token AFTER successful processing
    if (newPageToken) {
      await base44.asServiceRole.entities.SyncState.update(syncRecord.id, { page_token: newPageToken });
    }
    
    return Response.json({ status: 'success', changesProcessed: allChanges.length });
  } catch (error) {
    console.error("Growth Guide Drive Watch Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});