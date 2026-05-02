import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const body = await req.json();

  // Handle entity automation trigger payload
  const assetId = body?.event?.entity_id || body?.asset_id;
  const action = body?.action; // 'approve' | 'reject' | 'request_changes' — for manual calls

  if (!assetId) return Response.json({ error: 'asset_id required' }, { status: 400 });

  const assets = await base44.asServiceRole.entities.ContentAsset.filter({ id: assetId });
  const asset = assets[0];
  if (!asset) return Response.json({ error: 'Asset not found' }, { status: 404 });

  // If triggered by entity automation (status changed to ready), set approval_status to pending
  if (!action) {
    await base44.asServiceRole.entities.ContentAsset.update(assetId, {
      approval_status: 'pending',
    });
    return Response.json({ success: true, message: 'Asset queued for approval' });
  }

  // Manual action: approve
  if (action === 'approve') {
    await base44.asServiceRole.entities.ContentAsset.update(assetId, {
      approval_status: 'approved',
      status: 'scheduled',
    });

    // Create a SocialPost queue item if it's a social post type
    if (asset.asset_type === 'social_post' && asset.client_id) {
      await base44.asServiceRole.entities.SocialPost.create({
        client_id: asset.client_id,
        campaign_id: asset.campaign_id || '',
        platform: asset.platform || 'facebook',
        post_text: asset.content,
        status: 'scheduled',
        approval_status: 'approved',
        scheduled_date: asset.scheduled_date || null,
      });
    }

    return Response.json({ success: true, action: 'approved', message: 'Asset approved and moved to social queue' });
  }

  // Manual action: reject
  if (action === 'reject') {
    const feedback = body?.feedback || '';
    await base44.asServiceRole.entities.ContentAsset.update(assetId, {
      approval_status: 'rejected',
      status: 'draft',
      notes: `REJECTED: ${feedback}\n\n${asset.notes || ''}`.trim(),
    });
    return Response.json({ success: true, action: 'rejected', message: 'Asset rejected and returned to draft' });
  }

  // Manual action: request_changes
  if (action === 'request_changes') {
    const feedback = body?.feedback || '';
    await base44.asServiceRole.entities.ContentAsset.update(assetId, {
      approval_status: 'pending',
      status: 'draft',
      notes: `REVISION REQUESTED: ${feedback}\n\n${asset.notes || ''}`.trim(),
    });
    return Response.json({ success: true, action: 'revision_requested', message: 'Revision requested — asset returned to draft' });
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 });
});