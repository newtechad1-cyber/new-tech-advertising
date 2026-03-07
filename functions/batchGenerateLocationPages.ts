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

    // Top 100 US cities data
    const TOP_100_CITIES = [
      {"city": "New York", "state": "New York", "state_code": "NY"},
      {"city": "Los Angeles", "state": "California", "state_code": "CA"},
      {"city": "Chicago", "state": "Illinois", "state_code": "IL"},
      {"city": "Houston", "state": "Texas", "state_code": "TX"},
      {"city": "Phoenix", "state": "Arizona", "state_code": "AZ"},
      {"city": "Philadelphia", "state": "Pennsylvania", "state_code": "PA"},
      {"city": "San Antonio", "state": "Texas", "state_code": "TX"},
      {"city": "San Diego", "state": "California", "state_code": "CA"},
      {"city": "Dallas", "state": "Texas", "state_code": "TX"},
      {"city": "San Jose", "state": "California", "state_code": "CA"},
      {"city": "Austin", "state": "Texas", "state_code": "TX"},
      {"city": "Jacksonville", "state": "Florida", "state_code": "FL"},
      {"city": "Fort Worth", "state": "Texas", "state_code": "TX"},
      {"city": "Columbus", "state": "Ohio", "state_code": "OH"},
      {"city": "Indianapolis", "state": "Indiana", "state_code": "IN"},
      {"city": "Charlotte", "state": "North Carolina", "state_code": "NC"},
      {"city": "Seattle", "state": "Washington", "state_code": "WA"},
      {"city": "Denver", "state": "Colorado", "state_code": "CO"},
      {"city": "Washington", "state": "District of Columbia", "state_code": "DC"},
      {"city": "Boston", "state": "Massachusetts", "state_code": "MA"},
      {"city": "El Paso", "state": "Texas", "state_code": "TX"},
      {"city": "Nashville", "state": "Tennessee", "state_code": "TN"},
      {"city": "Detroit", "state": "Michigan", "state_code": "MI"},
      {"city": "Oklahoma City", "state": "Oklahoma", "state_code": "OK"},
      {"city": "Portland", "state": "Oregon", "state_code": "OR"},
      {"city": "Las Vegas", "state": "Nevada", "state_code": "NV"},
      {"city": "Memphis", "state": "Tennessee", "state_code": "TN"},
      {"city": "Louisville", "state": "Kentucky", "state_code": "KY"},
      {"city": "Baltimore", "state": "Maryland", "state_code": "MD"},
      {"city": "Milwaukee", "state": "Wisconsin", "state_code": "WI"},
      {"city": "Albuquerque", "state": "New Mexico", "state_code": "NM"},
      {"city": "Tucson", "state": "Arizona", "state_code": "AZ"},
      {"city": "Fresno", "state": "California", "state_code": "CA"},
      {"city": "Mesa", "state": "Arizona", "state_code": "AZ"},
      {"city": "Sacramento", "state": "California", "state_code": "CA"},
      {"city": "Atlanta", "state": "Georgia", "state_code": "GA"},
      {"city": "Kansas City", "state": "Missouri", "state_code": "MO"},
      {"city": "Long Beach", "state": "California", "state_code": "CA"},
      {"city": "Miami", "state": "Florida", "state_code": "FL"},
      {"city": "Cleveland", "state": "Ohio", "state_code": "OH"},
      {"city": "Minneapolis", "state": "Minnesota", "state_code": "MN"},
      {"city": "Tulsa", "state": "Oklahoma", "state_code": "OK"},
      {"city": "Wichita", "state": "Kansas", "state_code": "KS"},
      {"city": "Arlington", "state": "Texas", "state_code": "TX"},
      {"city": "Tampa", "state": "Florida", "state_code": "FL"},
      {"city": "New Orleans", "state": "Louisiana", "state_code": "LA"},
      {"city": "Aurora", "state": "Colorado", "state_code": "CO"},
      {"city": "Saint Paul", "state": "Minnesota", "state_code": "MN"},
      {"city": "Anaheim", "state": "California", "state_code": "CA"},
      {"city": "Corpus Christi", "state": "Texas", "state_code": "TX"},
      {"city": "Lexington", "state": "Kentucky", "state_code": "KY"},
      {"city": "Stockton", "state": "California", "state_code": "CA"},
      {"city": "Saint Louis", "state": "Missouri", "state_code": "MO"},
      {"city": "Henderson", "state": "Nevada", "state_code": "NV"},
      {"city": "Riverside", "state": "California", "state_code": "CA"},
      {"city": "Cincinnati", "state": "Ohio", "state_code": "OH"},
      {"city": "Plano", "state": "Texas", "state_code": "TX"},
      {"city": "Irvine", "state": "California", "state_code": "CA"},
      {"city": "Toledo", "state": "Ohio", "state_code": "OH"},
      {"city": "Orlando", "state": "Florida", "state_code": "FL"},
      {"city": "Chula Vista", "state": "California", "state_code": "CA"},
      {"city": "Chandler", "state": "Arizona", "state_code": "AZ"},
      {"city": "Laredo", "state": "Texas", "state_code": "TX"},
      {"city": "Baton Rouge", "state": "Louisiana", "state_code": "LA"},
      {"city": "Garland", "state": "Texas", "state_code": "TX"},
      {"city": "Glendale", "state": "Arizona", "state_code": "AZ"},
      {"city": "Akron", "state": "Ohio", "state_code": "OH"},
      {"city": "Fremont", "state": "California", "state_code": "CA"},
      {"city": "Irving", "state": "Texas", "state_code": "TX"},
      {"city": "Durham", "state": "North Carolina", "state_code": "NC"},
      {"city": "Winston-Salem", "state": "North Carolina", "state_code": "NC"},
      {"city": "Raleigh", "state": "North Carolina", "state_code": "NC"},
      {"city": "San Francisco", "state": "California", "state_code": "CA"},
      {"city": "Bakersfield", "state": "California", "state_code": "CA"},
      {"city": "Fontana", "state": "California", "state_code": "CA"},
      {"city": "Modesto", "state": "California", "state_code": "CA"},
      {"city": "Hialeah", "state": "Florida", "state_code": "FL"},
      {"city": "Huntington Beach", "state": "California", "state_code": "CA"},
      {"city": "Moreno Valley", "state": "California", "state_code": "CA"},
      {"city": "Tallahassee", "state": "Florida", "state_code": "FL"},
      {"city": "Des Moines", "state": "Iowa", "state_code": "IA"},
      {"city": "Omaha", "state": "Nebraska", "state_code": "NE"},
      {"city": "Miami Gardens", "state": "Florida", "state_code": "FL"},
      {"city": "Norfolk", "state": "Virginia", "state_code": "VA"},
      {"city": "Salt Lake City", "state": "Utah", "state_code": "UT"},
      {"city": "Gilbert", "state": "Arizona", "state_code": "AZ"},
      {"city": "Spokane", "state": "Washington", "state_code": "WA"},
      {"city": "Huntsville", "state": "Alabama", "state_code": "AL"},
      {"city": "Madison", "state": "Wisconsin", "state_code": "WI"},
      {"city": "Brownsville", "state": "Texas", "state_code": "TX"},
      {"city": "Honolulu", "state": "Hawaii", "state_code": "HI"},
      {"city": "Shreveport", "state": "Louisiana", "state_code": "LA"},
      {"city": "Jackson", "state": "Mississippi", "state_code": "MS"},
      {"city": "Boise", "state": "Idaho", "state_code": "ID"},
      {"city": "Salem", "state": "Oregon", "state_code": "OR"},
      {"city": "Garland", "state": "Texas", "state_code": "TX"},
      {"city": "Scottsdale", "state": "Arizona", "state_code": "AZ"},
      {"city": "Irwin", "state": "Texas", "state_code": "TX"},
      {"city": "North Las Vegas", "state": "Nevada", "state_code": "NV"},
      {"city": "Sheepshead Bay", "state": "New York", "state_code": "NY"},
      {"city": "Santa Ana", "state": "California", "state_code": "CA"},
      {"city": "Lubbock", "state": "Texas", "state_code": "TX"},
      {"city": "Greensboro", "state": "North Carolina", "state_code": "NC"},
      {"city": "Irving", "state": "Texas", "state_code": "TX"},
      {"city": "Buffallo", "state": "New York", "state_code": "NY"},
      {"city": "Glendale", "state": "California", "state_code": "CA"},
      {"city": "Chandler", "state": "Arizona", "state_code": "AZ"}
    ];

    let cityList = cities || TOP_100_CITIES.slice(0, 100);

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