import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action, ...params } = body;

    const accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');

    if (action === 'create_event') {
      const { title, description, start, end, calendarId = 'primary' } = params;

      const event = {
        summary: title,
        description: description || '',
        start: { dateTime: start, timeZone: 'America/Chicago' },
        end: { dateTime: end || new Date(new Date(start).getTime() + 60 * 60 * 1000).toISOString(), timeZone: 'America/Chicago' },
      };

      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      const data = await res.json();
      if (!res.ok) return Response.json({ error: data.error?.message || 'Failed to create event' }, { status: 400 });

      return Response.json({ success: true, event: data });
    }

    if (action === 'list_calendars') {
      const res = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) return Response.json({ error: data.error?.message || 'Failed to list calendars' }, { status: 400 });
      return Response.json({ calendars: data.items || [] });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});