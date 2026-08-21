// Retired legacy endpoint.
// Public rebuild intake now uses the canonical ntaUnifiedIntake path.
// Keep this route non-operational so stale clients cannot dispatch email or mutate CRM data.
Deno.serve(() => Response.json(
  { error: 'This legacy endpoint is retired. Use the canonical rebuild intake form.' },
  { status: 410 }
));

