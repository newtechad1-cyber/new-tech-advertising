import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // We run as service role because this is a scheduled background sync, not an app-user action.
    // The workspace builder connected their Instagram Business account in SHARED mode.
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');
    
    if (!accessToken) {
      return Response.json({ error: 'Instagram connector not authorized' }, { status: 400 });
    }

    // Step 1: Get User ID. 
    // Per the connector guide: Pass access_token as query param, not Authorization header.
    const userRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
    const userData = await userRes.json();
    
    if (userData.error) {
       console.error("Instagram User fetch error:", userData.error);
       return Response.json({ error: 'Failed to fetch Instagram user' }, { status: 400 });
    }
    
    const instagramUserId = userData.id;

    // Step 2: Fetch recent media (posts)
    const mediaRes = await fetch(`https://graph.instagram.com/${instagramUserId}/media?fields=id,caption,media_type,media_url,permalink,timestamp,thumbnail_url&access_token=${accessToken}`);
    const mediaData = await mediaRes.json();

    if (mediaData.error) {
      console.error("Instagram Media fetch error:", mediaData.error);
      return Response.json({ error: 'Failed to fetch Instagram media' }, { status: 400 });
    }

    const posts = mediaData.data || [];
    
    // Step 3: Save to workspace database (SocialPost entity)
    const recordsToCreate = posts.map(post => ({
      platform: 'instagram',
      external_id: post.id,
      content: post.caption || '',
      media_url: post.media_url || post.thumbnail_url || '',
      post_url: post.permalink || '',
      posted_at: post.timestamp,
      status: 'published'
    }));

    // Insert only new posts. For simplicity, we just fetch existing ones to avoid duplicates.
    // In a real high-volume scenario, you'd check external_ids more efficiently.
    const existingPosts = await base44.asServiceRole.entities.SocialPost.filter({
      platform: 'instagram'
    });
    
    const existingIds = new Set(existingPosts.map(p => p.external_id));
    const newRecords = recordsToCreate.filter(r => !existingIds.has(r.external_id));

    if (newRecords.length > 0) {
      await base44.asServiceRole.entities.SocialPost.bulkCreate(newRecords);
    }

    return Response.json({ 
      success: true, 
      fetched: posts.length, 
      synced: newRecords.length 
    });

  } catch (error) {
    console.error("Instagram sync error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});