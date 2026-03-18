import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { url } = body;
  if (!url) return Response.json({ error: 'Missing url' }, { status: 400 });

  const response = await fetch(url);
  if (!response.ok) return Response.json({ error: 'Failed to fetch image' }, { status: 500 });

  const buffer = await response.arrayBuffer();
  const contentType = response.headers.get('content-type') || 'image/png';

  return new Response(buffer, {
    headers: {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
    }
  });
});