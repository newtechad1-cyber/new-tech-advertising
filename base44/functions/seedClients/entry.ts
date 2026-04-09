import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const existing = await base44.asServiceRole.entities.Clients.list('-created_date', 5);
    if (existing.length > 0) {
      return Response.json({ message: 'Clients already exist, seed skipped.', count: existing.length });
    }

    const samples = [
      {
        business_name: 'Mason City HVAC Pro',
        slug: 'mason-city-hvac-pro',
        website: 'https://example-hvac.com',
        city: 'Mason City', state: 'IA',
        primary_contact: 'Tom Richards',
        email: 'tom@mchvac.com', phone: '641-555-0101',
        core_services: 'HVAC repair, AC installation, furnace maintenance, air quality',
        target_keywords: 'hvac repair mason city ia, ac installation north iowa, furnace repair cerro gordo county',
        brand_voice: 'Friendly, trustworthy, locally rooted. Speaks like a neighbor, not a corporation.',
        posting_channels: ['facebook', 'gbp', 'website'],
        status: 'active_client', archived: false,
      },
      {
        business_name: 'Rochester Roofing & Siding',
        slug: 'rochester-roofing-siding',
        website: 'https://example-roofing.com',
        city: 'Rochester', state: 'MN',
        primary_contact: 'Sarah Olson',
        email: 'sarah@rrsiding.com', phone: '507-555-0202',
        core_services: 'Roof replacement, siding installation, gutters, storm damage repair',
        target_keywords: 'roof replacement rochester mn, siding contractor rochester, storm damage roofing',
        brand_voice: 'Professional, reliable, safety-focused. Emphasizes craftsmanship and warranties.',
        posting_channels: ['facebook', 'linkedin', 'gbp'],
        status: 'active_client', archived: false,
      },
      {
        business_name: 'Albert Lea Dental Care',
        slug: 'albert-lea-dental-care',
        website: 'https://example-dental.com',
        city: 'Albert Lea', state: 'MN',
        primary_contact: 'Dr. Kim Park',
        email: 'info@aldental.com', phone: '507-555-0303',
        core_services: 'Family dentistry, cosmetic dentistry, teeth whitening, implants',
        target_keywords: 'dentist albert lea mn, family dentist south minnesota, cosmetic dentistry',
        brand_voice: 'Warm, welcoming, health-focused. Reassures anxious patients. Approachable and expert.',
        posting_channels: ['facebook', 'gbp', 'email'],
        status: 'active_client', archived: false,
      },
    ];

    const created = [];
    for (const c of samples) {
      const r = await base44.asServiceRole.entities.Clients.create(c);
      created.push(r);
    }

    return Response.json({ seeded: created.length, clients: created.map(c => c.business_name) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});