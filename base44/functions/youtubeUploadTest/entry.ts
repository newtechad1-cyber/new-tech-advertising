import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

async function refreshAccessToken(clientId, clientSecret, refreshToken) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`Token refresh failed: ${data.error} — ${data.error_description}`);
  }
  return {
    access_token: data.access_token,
    expires_at: data.expires_in
      ? new Date(Date.now() + Number(data.expires_in) * 1000).toISOString()
      : null,
  };
}

async function getUploadAccessToken(base44) {
  const accounts = await base44.asServiceRole.entities.SocialAccount.filter({ platform: 'youtube' });
  const account = accounts?.[0] || null;
  const connectionCandidates = await base44.asServiceRole.entities.ChannelConnection.filter({ provider: 'youtube' });
  const connection = connectionCandidates
    .filter(item => item.status !== 'disconnected')
    .sort((a, b) => (
      (b.is_default ? 100 : 0) - (a.is_default ? 100 : 0) ||
      new Date(b.updated_date || b.last_sync_at || 0).getTime() -
      new Date(a.updated_date || a.last_sync_at || 0).getTime()
    ))[0] || null;

  const metadata = account?.metadata || {};
  const directToken = metadata.access_token || connection?.access_token;
  const expiresAt = metadata.expires_at || connection?.expires_at;
  if (directToken && (!expiresAt || Date.parse(expiresAt) > Date.now() + 60_000)) {
    return directToken;
  }

  const refreshToken = metadata.refresh_token || connection?.refresh_token;
  if (!refreshToken) {
    throw new Error('No YouTube OAuth connection is available. Connect YouTube through Channel Connections first.');
  }

  const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
  const refreshed = await refreshAccessToken(clientId, clientSecret, refreshToken);

  if (connection) {
    await base44.asServiceRole.entities.ChannelConnection.update(connection.id, {
      access_token: refreshed.access_token,
      expires_at: refreshed.expires_at,
      status: 'ready',
      last_sync_at: new Date().toISOString(),
      error_message: null,
    });
  }

  if (account) {
    await base44.asServiceRole.entities.SocialAccount.update(account.id, {
      metadata: { ...metadata, access_token: refreshed.access_token, refresh_token: refreshToken, expires_at: refreshed.expires_at },
      status: 'ready',
      last_synced_at: new Date().toISOString(),
    });
  }

  return refreshed.access_token;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { video_url } = await req.json();
    if (!video_url) {
      return Response.json({ error: 'video_url is required' }, { status: 400 });
    }

    // Use the same OAuth connection that Channel Connections and YouTube Setup verify.
    const accessToken = await getUploadAccessToken(base44);
    console.log('[youtubeUploadTest] Got fresh access token');

    // Download the video from the provided URL
    console.log(`[youtubeUploadTest] Downloading video from: ${video_url}`);
    const videoRes = await fetch(video_url);
    if (!videoRes.ok) {
      throw new Error(`Failed to download video: ${videoRes.status} ${videoRes.statusText}`);
    }
    const videoBuffer = await videoRes.arrayBuffer();
    const videoBytes = new Uint8Array(videoBuffer);
    console.log(`[youtubeUploadTest] Downloaded ${videoBytes.length} bytes`);

    // Step 1: Initiate resumable upload
    const metadata = {
      snippet: {
        title: 'NTA Upload Test',
        description: 'OAuth + upload scope test',
      },
      status: {
        privacyStatus: 'unlisted',
      },
    };

    const initRes = await fetch(
      'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Upload-Content-Type': 'video/mp4',
          'X-Upload-Content-Length': videoBytes.length.toString(),
        },
        body: JSON.stringify(metadata),
      }
    );

    if (!initRes.ok) {
      const errText = await initRes.text();
      throw new Error(`Failed to initiate upload: ${initRes.status} — ${errText}`);
    }

    const uploadUrl = initRes.headers.get('Location');
    if (!uploadUrl) {
      throw new Error('No upload URL returned from YouTube');
    }
    console.log('[youtubeUploadTest] Got resumable upload URL');

    // Step 2: Upload the video bytes
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': videoBytes.length.toString(),
      },
      body: videoBytes,
    });

    const uploadData = await uploadRes.json();
    console.log('[youtubeUploadTest] Upload response:', JSON.stringify(uploadData));

    if (!uploadRes.ok || !uploadData.id) {
      throw new Error(`Upload failed: ${JSON.stringify(uploadData)}`);
    }

    const videoId = uploadData.id;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    console.log(`[youtubeUploadTest] Success — video_id=${videoId}`);
    return Response.json({ success: true, video_id: videoId, video_url: videoUrl });

  } catch (error) {
    console.error('[youtubeUploadTest] Error:', error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});