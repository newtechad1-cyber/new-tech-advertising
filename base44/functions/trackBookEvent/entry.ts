import { createClient } from 'npm:@base44/sdk@0.8.31';

const OFFICE_APP_ID = '6a7215451eb90dc843a94546';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed.' }, { status: 405 });
  }

  try {
    const payload = await req.json();
    const office = createClient({ appId: OFFICE_APP_ID });
    const response = await office.functions.invoke('trackBookEvent', payload);
    const data = response?.data ?? response;

    return Response.json(data);
  } catch (error) {
    const status = error?.response?.status || 500;
    const detail = error?.response?.data || { error: error?.message || 'Book activity could not be recorded.' };
    console.error('[public trackBookEvent] Office tracking failed:', detail);
    return Response.json(detail, { status });
  }
});
