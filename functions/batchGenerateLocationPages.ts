import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const payload = await req.json();
    const { services, cities, limit } = payload;

    if (!services || !Array.isArray(services) || services.length === 0) {
      return Response.json({ error: 'services array required' }, { status: 400 });
    }

    // Load top 100 cities data if not provided
    let cityList = cities || [];
    if (!cities) {
      try {
        const response = await fetch('file:///lib/top-100-cities.json');
        const data = await response.json();
        cityList = data.slice(0, 100);
      } catch (err) {
        console.error('[batchGenerateLocationPages] Error loading cities:', err);
        return Response.json({ error: 'Unable to load cities data' }, { status: 500 });
      }
    }

    // Limit processing
    const maxPages = limit || 10;
    const pagesToGenerate = [];

    // Generate list of pages to create
    for (const service of services) {
      for (const city of cityList) {
        if (pagesToGenerate.length >= maxPages) break;

        // Check if page already exists
        const existing = await base44.entities.LocationPage.filter({
          service_slug: service,
          city: city.city,
          state: city.state,
        });

        if (existing.length === 0) {
          pagesToGenerate.push({
            service_slug: service,
            city: city.city,
            state: city.state,
            state_code: city.state_code,
          });
        }
      }
      if (pagesToGenerate.length >= maxPages) break;
    }

    // Generate pages
    const results = [];
    for (const pageData of pagesToGenerate) {
      try {
        const result = await base44.functions.invoke('generateLocationPage', pageData);
        results.push({
          status: 'success',
          ...result.data,
        });
      } catch (err) {
        results.push({
          status: 'error',
          service_slug: pageData.service_slug,
          city: pageData.city,
          error: err.message,
        });
      }
      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return Response.json({
      success: true,
      pages_generated: results.filter((r) => r.status === 'success').length,
      pages_failed: results.filter((r) => r.status === 'error').length,
      total_requested: pagesToGenerate.length,
      results,
    });
  } catch (error) {
    console.error('[batchGenerateLocationPages] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});