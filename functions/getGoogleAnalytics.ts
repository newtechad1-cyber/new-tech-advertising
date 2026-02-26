import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const propertyId = Deno.env.get('GA_PROPERTY_ID');
    const serviceAccountJson = Deno.env.get('GA_SERVICE_ACCOUNT_JSON');

    if (!propertyId || !serviceAccountJson) {
      return Response.json({ error: 'Missing GA credentials' }, { status: 500 });
    }

    const serviceAccount = JSON.parse(serviceAccountJson);

    // Get JWT token for Google API
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const payload = {
      iss: serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    };

    const encode = (obj) => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const signingInput = `${encode(header)}.${encode(payload)}`;

    // Import the private key
    const pemKey = serviceAccount.private_key;
    const pemBody = pemKey.replace(/-----BEGIN PRIVATE KEY-----/, '').replace(/-----END PRIVATE KEY-----/, '').replace(/\s/g, '');
    const binaryKey = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));

    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      binaryKey,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      new TextEncoder().encode(signingInput)
    );

    const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const jwt = `${signingInput}.${sigB64}`;

    // Exchange JWT for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return Response.json({ error: 'Failed to get access token', details: tokenData }, { status: 500 });
    }

    const accessToken = tokenData.access_token;
    const gaApiUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    // Fetch main metrics: pageviews, sessions, users, bounce rate
    const [metricsRes, trafficRes] = await Promise.all([
      fetch(gaApiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'date' }],
          metrics: [
            { name: 'screenPageViews' },
            { name: 'activeUsers' },
            { name: 'sessions' },
            { name: 'bounceRate' },
          ],
          orderBys: [{ dimension: { dimensionName: 'date' } }],
        }),
      }),
      fetch(gaApiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'sessionDefaultChannelGroup' }],
          metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 6,
        }),
      }),
    ]);

    const [metricsData, trafficData] = await Promise.all([metricsRes.json(), trafficRes.json()]);

    // Aggregate totals
    let totalPageViews = 0, totalUsers = 0, totalSessions = 0, totalBounceRate = 0, bounceCount = 0;
    const dailyData = [];

    if (metricsData.rows) {
      for (const row of metricsData.rows) {
        const date = row.dimensionValues[0].value;
        const pv = parseInt(row.metricValues[0].value) || 0;
        const users = parseInt(row.metricValues[1].value) || 0;
        const sessions = parseInt(row.metricValues[2].value) || 0;
        const bounce = parseFloat(row.metricValues[3].value) || 0;

        totalPageViews += pv;
        totalUsers += users;
        totalSessions += sessions;
        totalBounceRate += bounce;
        bounceCount++;

        dailyData.push({
          date: `${date.slice(4, 6)}/${date.slice(6, 8)}`,
          pageViews: pv,
          users,
          sessions,
        });
      }
    }

    const avgBounceRate = bounceCount > 0 ? (totalBounceRate / bounceCount) * 100 : 0;

    // Traffic sources
    const trafficSources = (trafficData.rows || []).map(row => ({
      source: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value) || 0,
      users: parseInt(row.metricValues[1].value) || 0,
    }));

    return Response.json({
      summary: {
        pageViews: totalPageViews,
        uniqueVisitors: totalUsers,
        sessions: totalSessions,
        bounceRate: Math.round(avgBounceRate * 10) / 10,
      },
      dailyData,
      trafficSources,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});