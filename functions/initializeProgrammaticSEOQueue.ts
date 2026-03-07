import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * initializeProgrammaticSEOQueue
 * 
 * One-time setup function that:
 * 1. Creates PageGenerationQueue entries for all 100 cities
 * 2. Assigns priority order (0-499 for 500 pages)
 * 3. Orders by tier for smart rollout
 * 
 * Usage: Call once via admin dashboard
 * Then daily automation handles generation pacing (5-10 pages/day)
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

    // If reset_existing is true, clear old queue
    if (reset_existing) {
      const existing = await base44.entities.PageGenerationQueue.filter({});
      for (const entry of existing) {
        await base44.entities.PageGenerationQueue.delete(entry.id);
      }
      console.log('[initializeProgrammaticSEOQueue] Cleared existing queue');
    }

    // City data embedded
    const TIER_1_CITIES = [
      { "city": "Chicago", "state": "Illinois", "state_code": "IL" },
      { "city": "Dallas", "state": "Texas", "state_code": "TX" },
      { "city": "Houston", "state": "Texas", "state_code": "TX" },
      { "city": "Phoenix", "state": "Arizona", "state_code": "AZ" },
      { "city": "Atlanta", "state": "Georgia", "state_code": "GA" },
      { "city": "Denver", "state": "Colorado", "state_code": "CO" },
      { "city": "Minneapolis", "state": "Minnesota", "state_code": "MN" },
      { "city": "Tampa", "state": "Florida", "state_code": "FL" },
      { "city": "Orlando", "state": "Florida", "state_code": "FL" },
      { "city": "Miami", "state": "Florida", "state_code": "FL" },
      { "city": "Nashville", "state": "Tennessee", "state_code": "TN" },
      { "city": "Charlotte", "state": "North Carolina", "state_code": "NC" },
      { "city": "Raleigh", "state": "North Carolina", "state_code": "NC" },
      { "city": "Austin", "state": "Texas", "state_code": "TX" },
      { "city": "San Antonio", "state": "Texas", "state_code": "TX" },
      { "city": "Columbus", "state": "Ohio", "state_code": "OH" },
      { "city": "Indianapolis", "state": "Indiana", "state_code": "IN" },
      { "city": "Kansas City", "state": "Missouri", "state_code": "MO" },
      { "city": "St. Louis", "state": "Missouri", "state_code": "MO" },
      { "city": "Cincinnati", "state": "Ohio", "state_code": "OH" },
      { "city": "Milwaukee", "state": "Wisconsin", "state_code": "WI" },
      { "city": "Cleveland", "state": "Ohio", "state_code": "OH" },
      { "city": "Pittsburgh", "state": "Pennsylvania", "state_code": "PA" },
      { "city": "Salt Lake City", "state": "Utah", "state_code": "UT" },
      { "city": "Las Vegas", "state": "Nevada", "state_code": "NV" }
    ];

    const TIER_2_CITIES = [
      { "city": "Omaha", "state": "Nebraska", "state_code": "NE" },
      { "city": "Des Moines", "state": "Iowa", "state_code": "IA" },
      { "city": "Sioux Falls", "state": "South Dakota", "state_code": "SD" },
      { "city": "Wichita", "state": "Kansas", "state_code": "KS" },
      { "city": "Tulsa", "state": "Oklahoma", "state_code": "OK" },
      { "city": "Oklahoma City", "state": "Oklahoma", "state_code": "OK" },
      { "city": "Albuquerque", "state": "New Mexico", "state_code": "NM" },
      { "city": "Boise", "state": "Idaho", "state_code": "ID" },
      { "city": "Spokane", "state": "Washington", "state_code": "WA" },
      { "city": "Tacoma", "state": "Washington", "state_code": "WA" },
      { "city": "Colorado Springs", "state": "Colorado", "state_code": "CO" },
      { "city": "Fort Collins", "state": "Colorado", "state_code": "CO" },
      { "city": "Grand Rapids", "state": "Michigan", "state_code": "MI" },
      { "city": "Lansing", "state": "Michigan", "state_code": "MI" },
      { "city": "Toledo", "state": "Ohio", "state_code": "OH" },
      { "city": "Dayton", "state": "Ohio", "state_code": "OH" },
      { "city": "Akron", "state": "Ohio", "state_code": "OH" },
      { "city": "Madison", "state": "Wisconsin", "state_code": "WI" },
      { "city": "Green Bay", "state": "Wisconsin", "state_code": "WI" },
      { "city": "Rochester", "state": "Minnesota", "state_code": "MN" },
      { "city": "Duluth", "state": "Minnesota", "state_code": "MN" },
      { "city": "Fargo", "state": "North Dakota", "state_code": "ND" },
      { "city": "Bismarck", "state": "North Dakota", "state_code": "ND" },
      { "city": "Lincoln", "state": "Nebraska", "state_code": "NE" },
      { "city": "Rapid City", "state": "South Dakota", "state_code": "SD" },
      { "city": "Billings", "state": "Montana", "state_code": "MT" },
      { "city": "Missoula", "state": "Montana", "state_code": "MT" },
      { "city": "Cheyenne", "state": "Wyoming", "state_code": "WY" },
      { "city": "Casper", "state": "Wyoming", "state_code": "WY" },
      { "city": "Anchorage", "state": "Alaska", "state_code": "AK" },
      { "city": "Juneau", "state": "Alaska", "state_code": "AK" },
      { "city": "Fairbanks", "state": "Alaska", "state_code": "AK" },
      { "city": "Santa Fe", "state": "New Mexico", "state_code": "NM" },
      { "city": "Reno", "state": "Nevada", "state_code": "NV" },
      { "city": "Provo", "state": "Utah", "state_code": "UT" }
    ];

    const TIER_3_CITIES = [
      { "city": "Fort Worth", "state": "Texas", "state_code": "TX" },
      { "city": "Arlington", "state": "Texas", "state_code": "TX" },
      { "city": "Plano", "state": "Texas", "state_code": "TX" },
      { "city": "Frisco", "state": "Texas", "state_code": "TX" },
      { "city": "Garland", "state": "Texas", "state_code": "TX" },
      { "city": "Irving", "state": "Texas", "state_code": "TX" },
      { "city": "Lubbock", "state": "Texas", "state_code": "TX" },
      { "city": "Amarillo", "state": "Texas", "state_code": "TX" },
      { "city": "Midland", "state": "Texas", "state_code": "TX" },
      { "city": "Odessa", "state": "Texas", "state_code": "TX" },
      { "city": "Corpus Christi", "state": "Texas", "state_code": "TX" },
      { "city": "El Paso", "state": "Texas", "state_code": "TX" },
      { "city": "Chattanooga", "state": "Tennessee", "state_code": "TN" },
      { "city": "Knoxville", "state": "Tennessee", "state_code": "TN" },
      { "city": "Birmingham", "state": "Alabama", "state_code": "AL" },
      { "city": "Montgomery", "state": "Alabama", "state_code": "AL" },
      { "city": "Huntsville", "state": "Alabama", "state_code": "AL" },
      { "city": "Jackson", "state": "Mississippi", "state_code": "MS" },
      { "city": "Baton Rouge", "state": "Louisiana", "state_code": "LA" },
      { "city": "Shreveport", "state": "Louisiana", "state_code": "LA" },
      { "city": "Little Rock", "state": "Arkansas", "state_code": "AR" },
      { "city": "Fayetteville", "state": "Arkansas", "state_code": "AR" },
      { "city": "Springfield", "state": "Missouri", "state_code": "MO" },
      { "city": "Columbia", "state": "Missouri", "state_code": "MO" },
      { "city": "Peoria", "state": "Illinois", "state_code": "IL" },
      { "city": "Rockford", "state": "Illinois", "state_code": "IL" },
      { "city": "Davenport", "state": "Iowa", "state_code": "IA" },
      { "city": "Cedar Rapids", "state": "Iowa", "state_code": "IA" },
      { "city": "Waterloo", "state": "Iowa", "state_code": "IA" },
      { "city": "Iowa City", "state": "Iowa", "state_code": "IA" },
      { "city": "Sioux City", "state": "Iowa", "state_code": "IA" },
      { "city": "Mankato", "state": "Minnesota", "state_code": "MN" },
      { "city": "St Cloud", "state": "Minnesota", "state_code": "MN" },
      { "city": "Eau Claire", "state": "Wisconsin", "state_code": "WI" },
      { "city": "La Crosse", "state": "Wisconsin", "state_code": "WI" },
      { "city": "Appleton", "state": "Wisconsin", "state_code": "WI" },
      { "city": "Kenosha", "state": "Wisconsin", "state_code": "WI" },
      { "city": "Racine", "state": "Wisconsin", "state_code": "WI" },
      { "city": "Youngstown", "state": "Ohio", "state_code": "OH" },
      { "city": "Erie", "state": "Pennsylvania", "state_code": "PA" }
    ];

    const SERVICES = [
      'ada-website-compliance',
      'streaming-tv-advertising',
      'small-business-marketing',
      'hvac-marketing',
      'plumbing-marketing'
    ];

    // Build queue entries with priority order
    const queueEntries = [];
    let priorityOrder = 0;

    // Tier 1: Priority 0-124 (25 cities × 5 services)
    for (const city of TIER_1_CITIES) {
      queueEntries.push({
        city: city.city,
        state: city.state,
        state_code: city.state_code,
        tier: 'tier-1',
        services: SERVICES,
        priority_order: priorityOrder++
      });
    }

    // Tier 2: Priority 125-299 (35 cities × 5 services)
    for (const city of TIER_2_CITIES) {
      queueEntries.push({
        city: city.city,
        state: city.state,
        state_code: city.state_code,
        tier: 'tier-2',
        services: SERVICES,
        priority_order: priorityOrder++
      });
    }

    // Tier 3: Priority 300-499 (40 cities × 5 services)
    for (const city of TIER_3_CITIES) {
      queueEntries.push({
        city: city.city,
        state: city.state,
        state_code: city.state_code,
        tier: 'tier-3',
        services: SERVICES,
        priority_order: priorityOrder++
      });
    }

    // Batch create queue entries
    await base44.entities.PageGenerationQueue.bulkCreate(queueEntries);

    console.log(`[initializeProgrammaticSEOQueue] Created ${queueEntries.length} queue entries`);

    return Response.json({
      success: true,
      total_entries: queueEntries.length,
      total_pages: queueEntries.length * SERVICES.length,
      tier_1: TIER_1_CITIES.length,
      tier_2: TIER_2_CITIES.length,
      tier_3: TIER_3_CITIES.length,
      message: 'SEO queue initialized. Run daily automation to generate 5-10 pages/day'
    });
  } catch (error) {
    console.error('[initializeProgrammaticSEOQueue]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});