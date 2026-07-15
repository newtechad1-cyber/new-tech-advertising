import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { platform, message, image_url } = await req.json();

    // Try getting the Platform OAuth connector first
    let PAGE_ACCESS_TOKEN = null;
    let pageData = { name: "Facebook Page" };
    let PAGE_ID = Deno.env.get('META_PAGE_ID') || await req.json().then(b => b.page_id).catch(()=>null);
    
    try {
      const fbConn = await base44.asServiceRole.connectors.getConnection('facebook_pages');
      if (fbConn && fbConn.accessToken) {
        // Fetch the page access token
        const pagesRes = await fetch("https://graph.facebook.com/v25.0/me/accounts?fields=id,name,access_token", {
          headers: { "Authorization": `Bearer ${fbConn.accessToken}` }
        });
        const accountsData = await pagesRes.json();
        const page = accountsData?.data?.find(p => p.id === PAGE_ID) || accountsData?.data?.[0];
        if (page) {
          PAGE_ACCESS_TOKEN = page.access_token;
          PAGE_ID = page.id;
          pageData.name = page.name;
        }
      }
    } catch(e) {
      console.warn("Failed to use facebook_pages connector:", e.message);
    }
    
    // Fallback to legacy env vars
    if (!PAGE_ACCESS_TOKEN) {
      const USER_ACCESS_TOKEN = Deno.env.get('META_USER_ACCESS_TOKEN');
      PAGE_ID = Deno.env.get('META_PAGE_ID');

      if (!USER_ACCESS_TOKEN) return Response.json({ error: 'META_USER_ACCESS_TOKEN is not set and facebook_pages connector not authorized' }, { status: 500 });
      if (!PAGE_ID) return Response.json({ error: 'META_PAGE_ID is not set' }, { status: 500 });

      // Exchange user token for the page token of the specific page
      const pagesRes = await fetch(
        `https://graph.facebook.com/v19.0/${PAGE_ID}?fields=access_token,name&access_token=${USER_ACCESS_TOKEN}`
      );
      pageData = await pagesRes.json();

      if (pageData.error) {
        return Response.json({ error: `Could not get page token: ${pageData.error.message}` }, { status: 400 });
      }

      PAGE_ACCESS_TOKEN = pageData.access_token;
    }

    if (!PAGE_ACCESS_TOKEN) {
      return Response.json({ error: 'Could not retrieve page access token. Make sure your user token has manage_pages or pages_manage_posts permission and you manage this page.' }, { status: 400 });
    }

    if (platform === 'facebook') {
      let endpoint, body;

      if (image_url) {
        endpoint = `https://graph.facebook.com/v19.0/${PAGE_ID}/photos`;
        body = new URLSearchParams({
          url: image_url,
          caption: message,
          access_token: PAGE_ACCESS_TOKEN,
        });
      } else {
        endpoint = `https://graph.facebook.com/v19.0/${PAGE_ID}/feed`;
        body = new URLSearchParams({
          message,
          access_token: PAGE_ACCESS_TOKEN,
        });
      }

      const res = await fetch(endpoint, { method: 'POST', body });
      const data = await res.json();
      if (data.error) return Response.json({ error: data.error.message }, { status: 400 });
      return Response.json({ success: true, post_id: data.id || data.post_id, page_name: pageData.name });
    }

    if (platform === 'instagram') {
      const INSTAGRAM_ACCOUNT_ID = Deno.env.get('META_INSTAGRAM_ACCOUNT_ID');
      if (!image_url) return Response.json({ error: 'Instagram requires an image URL' }, { status: 400 });

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