/**
 * Legacy endpoint retired.
 *
 * The former implementation accepted only student_user_id + school_slug and
 * returned student identity data. Student pages must use
 * validateStudentSessionSecure with the opaque session token instead.
 */
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  return Response.json(
    { error: 'Legacy session endpoint retired' },
    { status: 410 }
  );
});