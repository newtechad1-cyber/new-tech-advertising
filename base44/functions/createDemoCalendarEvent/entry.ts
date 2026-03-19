import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Maps best_time string to an hour (CST = UTC-6)
function getEventHourUTC(bestTime) {
  if (bestTime.includes('Morning')) return 15;      // 9am CST = 15:00 UTC
  if (bestTime.includes('Late Afternoon')) return 21; // 3pm CST = 21:00 UTC
  return 18;                                          // 12pm CST = 18:00 UTC (Afternoon default)
}

// Returns next business day date string (YYYY-MM-DD)
function nextBusinessDay() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + 1);
  }
  return d.toISOString().split('T')[0];
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { name, email, phone, business_name, website_url, service_interest, best_time, message } = await req.json();

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    const dateStr = nextBusinessDay();
    const startHour = getEventHourUTC(best_time || 'Morning');
    const startTime = `${dateStr}T${String(startHour).padStart(2, '0')}:00:00Z`;
    const endTime = `${dateStr}T${String(startHour + 1).padStart(2, '0')}:00:00Z`;

    const eventBody = {
      summary: `Strategy Call: ${business_name}`,
      description: [
        `Contact: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || 'N/A'}`,
        `Website: ${website_url || 'N/A'}`,
        `Service Interest: ${service_interest || 'N/A'}`,
        `Best Time: ${best_time}`,
        message ? `\nMessage: ${message}` : '',
      ].filter(Boolean).join('\n'),
      start: { dateTime: startTime, timeZone: 'America/Chicago' },
      end: { dateTime: endTime, timeZone: 'America/Chicago' },
      attendees: [{ email }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 },
          { method: 'popup', minutes: 15 },
        ],
      },
    };

    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventBody),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Google Calendar API error: ${err}`);
    }

    const event = await response.json();
    return Response.json({ success: true, eventId: event.id, eventLink: event.htmlLink });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});