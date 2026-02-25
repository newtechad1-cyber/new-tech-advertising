import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { platform, message, image_url } = await req.json();

    const PAGE_ACCESS_TOKEN = Deno.env.get('META_PAGE_ACCESS_TOKEN');
    const PAGE_ID = Deno.env.get('META_PAGE_ID');
    const INSTAGRAM_ACCOUNT_ID = Deno.env.get('META_INSTAGRAM_ACCOUNT_ID');

    if (platform === 'facebook') {
      // Post to Facebook Page
      let endpoint, body;

      if (image_url) {
        // Photo post
        endpoint = `https://graph.facebook.com/v19.0/${PAGE_ID}/photos`;
        body = new URLSearchParams({
          url: image_url,
          caption: message,
          access_token: PAGE_ACCESS_TOKEN,
        });
      } else {
        // Text/link post
        endpoint = `https://graph.facebook.com/v19.0/${PAGE_ID}/feed`;
        body = new URLSearchParams({
          message,
          access_token: PAGE_ACCESS_TOKEN,
        });
      }

      const res = await fetch(endpoint, { method: 'POST', body });
      const data = await res.json();
      if (data.error) return Response.json({ error: data.error.message }, { status: 400 });
      return Response.json({ success: true, post_id: data.id || data.post_id });
    }

    if (platform === 'instagram') {
      if (!image_url) return Response.json({ error: 'Instagram requires an image URL' }, { status: 400 });

      // Step 1: Create media container
      const containerRes = await fetch(
        `https://graph.facebook.com/v19.0/${INSTAGRAM_ACCOUNT_ID}/media`,
        {
          method: 'POST',
          body: new URLSearchParams({
            image_url,
            caption: message,
            access_token: PAGE_ACCESS_TOKEN,
          }),
        }
      );
      const container = await containerRes.json();
      if (container.error) return Response.json({ error: container.error.message }, { status: 400 });

      // Step 2: Publish the container
      const publishRes = await fetch(
        `https://graph.facebook.com/v19.0/${INSTAGRAM_ACCOUNT_ID}/media_publish`,
        {
          method: 'POST',
          body: new URLSearchParams({
            creation_id: container.id,
            access_token: PAGE_ACCESS_TOKEN,
          }),
        }
      );
      const published = await publishRes.json();
      if (published.error) return Response.json({ error: published.error.message }, { status: 400 });
      return Response.json({ success: true, post_id: published.id });
    }

    return Response.json({ error: 'Invalid platform. Use "facebook" or "instagram".' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});