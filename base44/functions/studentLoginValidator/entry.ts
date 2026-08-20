/**
 * Legacy login validator retired.
 *
 * Student login must use studentLoginSecure, which stores a random opaque
 * token hash server-side and enforces expiration/revocation.
 */
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  return Response.json(
    { error: 'Legacy login endpoint retired' },
    { status: 410 }
  );
});
