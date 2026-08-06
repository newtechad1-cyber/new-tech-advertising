/**
 * Public-site intake bridge.
 *
 * The NTA Core Admin Hub is the single source of truth for prospect intake.
 * Public forms call this function so the public app never creates a second
 * SalesLead/Lead/Prospect pipeline of its own.
 */

import { createClient } from 'npm:@base44/sdk@0.8.31';

const OFFICE_APP_ID = '6a7215451eb90dc843a94546';

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const office = createClient({ appId: OFFICE_APP_ID });
    const response = await office.functions.invoke('ntaUnifiedIntake', payload);
    const data = response?.data ?? response;

    return Response.json(data);
  } catch (error) {
    const status = error?.response?.status || 500;
    const detail = error?.response?.data || { error: error?.message || 'Canonical intake failed' };
    console.error('[public ntaUnifiedIntake] Office intake failed:', detail);
    return Response.json(detail, { status });
  }
});
