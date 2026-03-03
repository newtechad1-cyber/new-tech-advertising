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
  return data.access_token;
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

    // Get stored YouTube connection
    const accounts = await base44.asServiceRole.entities.SocialAccount.filter({ platform: 'youtube' });
    if (!accounts || accounts.length === 0) {
      return Response.json({ error: 'No YouTube account connected. Please connect YouTube first.' }, { status: 400 });
    }
    const account = accounts[0];
    const meta = account.metadata || {};

    if (!meta.refresh_token) {
      return Response.json({ error: 'No refresh_token stored. Re-authenticate YouTube with offline access.' }, { status: 400 });
    }

    const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');

    // Get fresh access token
    const accessToken = await refreshAccessToken(clientId, clientSecret, meta.refresh_token);
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