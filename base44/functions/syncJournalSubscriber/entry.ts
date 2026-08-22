import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function hasJournalConsent(subscriber) {
  return subscriber?.status === 'active'
    && subscriber?.consent_status === 'confirmed'
    && Array.isArray(subscriber?.tags)
    && subscriber.tags.includes('nta-journal');
}

async function brevoRequest(path, options = {}) {
  const apiKey = Deno.env.get('BREVO_API_KEY');
  if (!apiKey) throw new Error('BREVO_API_KEY is not configured.');

  const response = await fetch(`https://api.brevo.com/v3${path}`, {
    ...options,
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Brevo returned ${response.status}: ${detail.slice(0, 300)}`);
  }

  if (response.status === 204) return {};
  return response.json();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const authUser = await base44.auth.me().catch(() => null);
    if (!authUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (authUser.role !== 'admin' && authUser.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }
    const payload = await req.json();
    const email = normalizeEmail(payload?.email);

    if (!email) {
      return Response.json({ error: 'Email is required.' }, { status: 400 });
    }

    // The public form may request a sync, but Brevo only receives an address
    // after the matching Base44 Subscriber record and consent are verified.
    const matches = await base44.asServiceRole.entities.Subscriber.filter({ email });
    const subscriber = (matches || []).find(hasJournalConsent);

    if (!subscriber) {
      return Response.json({ error: 'An active Journal subscription was not found.' }, { status: 400 });
    }

    if (Deno.env.get('BREVO_JOURNAL_SYNC_ENABLED') !== 'true') {
      return Response.json({ success: true, status: 'disabled' });
    }

    const listId = Number(Deno.env.get('BREVO_JOURNAL_LIST_ID'));
    if (!Number.isInteger(listId) || listId <= 0) {
      return Response.json({ error: 'BREVO_JOURNAL_LIST_ID is not configured.' }, { status: 503 });
    }

    await brevoRequest('/contacts', {
      method: 'POST',
      body: JSON.stringify({
        email,
        attributes: {
          FNAME: subscriber.first_name || '',
          LNAME: subscriber.last_name || '',
        },
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    return Response.json({ success: true, status: 'synced' });
  } catch (error) {
    console.error('[syncJournalSubscriber] Sync failed:', error.message);
    return Response.json({ error: 'Journal subscription was saved, but email-list sync needs attention.' }, { status: 500 });
  }
});
