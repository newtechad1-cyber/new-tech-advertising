import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * initializeProgrammaticSEOQueue
 * Simplified version - cities hardcoded inline to avoid large arrays
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const payload = await req.json();
    const { reset_existing } = payload;

    if (reset_existing) {
      const existing = await base44.entities.PageGenerationQueue.filter({});
      for (const entry of existing) {
        await base44.entities.PageGenerationQueue.delete(entry.id);
      }
    }

    const SERVICES = ['ada-website-compliance', 'streaming-tv-advertising', 'small-business-marketing', 'hvac-marketing', 'plumbing-marketing'];

    // All 100 cities in single array
    const ALL_CITIES = [
      // Tier 1 - 25 cities
      { city: 'Chicago', state: 'Illinois', state_code: 'IL', tier: 'tier-1' },
      { city: 'Dallas', state: 'Texas', state_code: 'TX', tier: 'tier-1' },
      { city: 'Houston', state: 'Texas', state_code: 'TX', tier: 'tier-1' },
      { city: 'Phoenix', state: 'Arizona', state_code: 'AZ', tier: 'tier-1' },
      { city: 'Atlanta', state: 'Georgia', state_code: 'GA', tier: 'tier-1' },
      { city: 'Denver', state: 'Colorado', state_code: 'CO', tier: 'tier-1' },
      { city: 'Minneapolis', state: 'Minnesota', state_code: 'MN', tier: 'tier-1' },
      { city: 'Tampa', state: 'Florida', state_code: 'FL', tier: 'tier-1' },
      { city: 'Orlando', state: 'Florida', state_code: 'FL', tier: 'tier-1' },
      { city: 'Miami', state: 'Florida', state_code: 'FL', tier: 'tier-1' },
      { city: 'Nashville', state: 'Tennessee', state_code: 'TN', tier: 'tier-1' },
      { city: 'Charlotte', state: 'North Carolina', state_code: 'NC', tier: 'tier-1' },
      { city: 'Raleigh', state: 'North Carolina', state_code: 'NC', tier: 'tier-1' },
      { city: 'Austin', state: 'Texas', state_code: 'TX', tier: 'tier-1' },
      { city: 'San Antonio', state: 'Texas', state_code: 'TX', tier: 'tier-1' },
      { city: 'Columbus', state: 'Ohio', state_code: 'OH', tier: 'tier-1' },
      { city: 'Indianapolis', state: 'Indiana', state_code: 'IN', tier: 'tier-1' },
      { city: 'Kansas City', state: 'Missouri', state_code: 'MO', tier: 'tier-1' },
      { city: 'St. Louis', state: 'Missouri', state_code: 'MO', tier: 'tier-1' },
      { city: 'Cincinnati', state: 'Ohio', state_code: 'OH', tier: 'tier-1' },
      { city: 'Milwaukee', state: 'Wisconsin', state_code: 'WI', tier: 'tier-1' },
      { city: 'Cleveland', state: 'Ohio', state_code: 'OH', tier: 'tier-1' },
      { city: 'Pittsburgh', state: 'Pennsylvania', state_code: 'PA', tier: 'tier-1' },
      { city: 'Salt Lake City', state: 'Utah', state_code: 'UT', tier: 'tier-1' },
      { city: 'Las Vegas', state: 'Nevada', state_code: 'NV', tier: 'tier-1' },
      // Tier 2 - 35 cities
      { city: 'Omaha', state: 'Nebraska', state_code: 'NE', tier: 'tier-2' },
      { city: 'Des Moines', state: 'Iowa', state_code: 'IA', tier: 'tier-2' },
      { city: 'Sioux Falls', state: 'South Dakota', state_code: 'SD', tier: 'tier-2' },
      { city: 'Wichita', state: 'Kansas', state_code: 'KS', tier: 'tier-2' },
      { city: 'Tulsa', state: 'Oklahoma', state_code: 'OK', tier: 'tier-2' },
      { city: 'Oklahoma City', state: 'Oklahoma', state_code: 'OK', tier: 'tier-2' },
      { city: 'Albuquerque', state: 'New Mexico', state_code: 'NM', tier: 'tier-2' },
      { city: 'Boise', state: 'Idaho', state_code: 'ID', tier: 'tier-2' },
      { city: 'Spokane', state: 'Washington', state_code: 'WA', tier: 'tier-2' },
      { city: 'Tacoma', state: 'Washington', state_code: 'WA', tier: 'tier-2' },
      { city: 'Colorado Springs', state: 'Colorado', state_code: 'CO', tier: 'tier-2' },
      { city: 'Fort Collins', state: 'Colorado', state_code: 'CO', tier: 'tier-2' },
      { city: 'Grand Rapids', state: 'Michigan', state_code: 'MI', tier: 'tier-2' },
      { city: 'Lansing', state: 'Michigan', state_code: 'MI', tier: 'tier-2' },
      { city: 'Toledo', state: 'Ohio', state_code: 'OH', tier: 'tier-2' },
      { city: 'Dayton', state: 'Ohio', state_code: 'OH', tier: 'tier-2' },
      { city: 'Akron', state: 'Ohio', state_code: 'OH', tier: 'tier-2' },
      { city: 'Madison', state: 'Wisconsin', state_code: 'WI', tier: 'tier-2' },
      { city: 'Green Bay', state: 'Wisconsin', state_code: 'WI', tier: 'tier-2' },
      { city: 'Rochester', state: 'Minnesota', state_code: 'MN', tier: 'tier-2' },
      { city: 'Duluth', state: 'Minnesota', state_code: 'MN', tier: 'tier-2' },
      { city: 'Fargo', state: 'North Dakota', state_code: 'ND', tier: 'tier-2' },
      { city: 'Bismarck', state: 'North Dakota', state_code: 'ND', tier: 'tier-2' },
      { city: 'Lincoln', state: 'Nebraska', state_code: 'NE', tier: 'tier-2' },
      { city: 'Rapid City', state: 'South Dakota', state_code: 'SD', tier: 'tier-2' },
      { city: 'Billings', state: 'Montana', state_code: 'MT', tier: 'tier-2' },
      { city: 'Missoula', state: 'Montana', state_code: 'MT', tier: 'tier-2' },
      { city: 'Cheyenne', state: 'Wyoming', state_code: 'WY', tier: 'tier-2' },
      { city: 'Casper', state: 'Wyoming', state_code: 'WY', tier: 'tier-2' },
      { city: 'Anchorage', state: 'Alaska', state_code: 'AK', tier: 'tier-2' },
      { city: 'Juneau', state: 'Alaska', state_code: 'AK', tier: 'tier-2' },
      { city: 'Fairbanks', state: 'Alaska', state_code: 'AK', tier: 'tier-2' },
      { city: 'Santa Fe', state: 'New Mexico', state_code: 'NM', tier: 'tier-2' },
      { city: 'Reno', state: 'Nevada', state_code: 'NV', tier: 'tier-2' },
      { city: 'Provo', state: 'Utah', state_code: 'UT', tier: 'tier-2' },
      // Tier 3 - 40 cities
      { city: 'Fort Worth', state: 'Texas', state_code: 'TX', tier: 'tier-3' },
      { city: 'Arlington', state: 'Texas', state_code: 'TX', tier: 'tier-3' },
      { city: 'Plano', state: 'Texas', state_code: 'TX', tier: 'tier-3' },
      { city: 'Frisco', state: 'Texas', state_code: 'TX', tier: 'tier-3' },
      { city: 'Garland', state: 'Texas', state_code: 'TX', tier: 'tier-3' },
      { city: 'Irving', state: 'Texas', state_code: 'TX', tier: 'tier-3' },
      { city: 'Lubbock', state: 'Texas', state_code: 'TX', tier: 'tier-3' },
      { city: 'Amarillo', state: 'Texas', state_code: 'TX', tier: 'tier-3' },
      { city: 'Midland', state: 'Texas', state_code: 'TX', tier: 'tier-3' },
      { city: 'Odessa', state: 'Texas', state_code: 'TX', tier: 'tier-3' },
      { city: 'Corpus Christi', state: 'Texas', state_code: 'TX', tier: 'tier-3' },
      { city: 'El Paso', state: 'Texas', state_code: 'TX', tier: 'tier-3' },
      { city: 'Chattanooga', state: 'Tennessee', state_code: 'TN', tier: 'tier-3' },
      { city: 'Knoxville', state: 'Tennessee', state_code: 'TN', tier: 'tier-3' },
      { city: 'Birmingham', state: 'Alabama', state_code: 'AL', tier: 'tier-3' },
      { city: 'Montgomery', state: 'Alabama', state_code: 'AL', tier: 'tier-3' },
      { city: 'Huntsville', state: 'Alabama', state_code: 'AL', tier: 'tier-3' },
      { city: 'Jackson', state: 'Mississippi', state_code: 'MS', tier: 'tier-3' },
      { city: 'Baton Rouge', state: 'Louisiana', state_code: 'LA', tier: 'tier-3' },
      { city: 'Shreveport', state: 'Louisiana', state_code: 'LA', tier: 'tier-3' },
      { city: 'Little Rock', state: 'Arkansas', state_code: 'AR', tier: 'tier-3' },
      { city: 'Fayetteville', state: 'Arkansas', state_code: 'AR', tier: 'tier-3' },
      { city: 'Springfield', state: 'Missouri', state_code: 'MO', tier: 'tier-3' },
      { city: 'Columbia', state: 'Missouri', state_code: 'MO', tier: 'tier-3' },
      { city: 'Peoria', state: 'Illinois', state_code: 'IL', tier: 'tier-3' },
      { city: 'Rockford', state: 'Illinois', state_code: 'IL', tier: 'tier-3' },
      { city: 'Davenport', state: 'Iowa', state_code: 'IA', tier: 'tier-3' },
      { city: 'Cedar Rapids', state: 'Iowa', state_code: 'IA', tier: 'tier-3' },
      { city: 'Waterloo', state: 'Iowa', state_code: 'IA', tier: 'tier-3' },
      { city: 'Iowa City', state: 'Iowa', state_code: 'IA', tier: 'tier-3' },
      { city: 'Sioux City', state: 'Iowa', state_code: 'IA', tier: 'tier-3' },
      { city: 'Mankato', state: 'Minnesota', state_code: 'MN', tier: 'tier-3' },
      { city: 'St Cloud', state: 'Minnesota', state_code: 'MN', tier: 'tier-3' },
      { city: 'Eau Claire', state: 'Wisconsin', state_code: 'WI', tier: 'tier-3' },
      { city: 'La Crosse', state: 'Wisconsin', state_code: 'WI', tier: 'tier-3' },
      { city: 'Appleton', state: 'Wisconsin', state_code: 'WI', tier: 'tier-3' },
      { city: 'Kenosha', state: 'Wisconsin', state_code: 'WI', tier: 'tier-3' },
      { city: 'Racine', state: 'Wisconsin', state_code: 'WI', tier: 'tier-3' },
      { city: 'Youngstown', state: 'Ohio', state_code: 'OH', tier: 'tier-3' },
      { city: 'Erie', state: 'Pennsylvania', state_code: 'PA', tier: 'tier-3' }
    ];

    const queueEntries = ALL_CITIES.map((c, i) => ({
      city: c.city,
      state: c.state,
      state_code: c.state_code,
      tier: c.tier,
      services: SERVICES,
      priority_order: i
    }));

    await base44.entities.PageGenerationQueue.bulkCreate(queueEntries);

    return Response.json({
      success: true,
      total_entries: queueEntries.length,
      total_pages: queueEntries.length * SERVICES.length,
      message: 'Queue initialized successfully'
    });
  } catch (error) {
    console.error('[initializeProgrammaticSEOQueue]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});