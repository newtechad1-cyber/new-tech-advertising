import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Weekly auto-generate 10 blog articles rotating through service+industry combos
const ROTATION = [
  { service: 'streaming-tv', industry: 'HVAC', city: '' },
  { service: 'streaming-tv', industry: 'Restaurant', city: '' },
  { service: 'local-seo', industry: 'Plumbing', city: '' },
  { service: 'local-seo', industry: 'Dental', city: '' },
  { service: 'ada-rebuild', industry: '', city: '', topic_override: 'ADA Website Compliance Checklist for Small Business Owners ' + new Date().getFullYear() },
  { service: 'ai-social-media', industry: 'Restaurant', city: '' },
  { service: 'ai-social-media', industry: 'HVAC', city: '' },
  { service: 'video-marketing', industry: 'Roofing', city: '' },
  { service: 'small-business-marketing', industry: '', city: '', topic_override: 'Small Business Marketing Trends ' + new Date().getFullYear() },
  { service: 'streaming-tv', industry: 'Roofing', city: '' },
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Allow scheduled trigger (no user) or admin call
    let isAuthorized = false;
    try {
      const user = await base44.auth.me();
      isAuthorized = user?.role === 'admin';
    } catch {
      // Scheduled call — no user session
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const results = [];
    for (const topic of ROTATION) {
      try {
        const res = await base44.asServiceRole.functions.invoke('generateBlogArticle', topic);
        results.push({ ok: true, title: res?.title || 'generated' });
      } catch (err) {
        results.push({ ok: false, error: err.message });
      }
      // Throttle to avoid rate limits
      await new Promise(r => setTimeout(r, 2000));
    }

    const success = results.filter(r => r.ok).length;
    return Response.json({ success: true, generated: success, total: ROTATION.length, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});