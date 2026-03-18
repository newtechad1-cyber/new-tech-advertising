import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Validates student login credentials and returns secure session token.
 * This is the security boundary - all student identity must flow through the backend.
 */
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  const base44 = createClientFromRequest(req);

  try {
    const { school_slug, email, access_code } = await req.json();

    if (!school_slug || !email || !access_code) {
      return Response.json({ error: 'school_slug, email, and access_code required' }, { status: 400 });
    }

    // Query StudentUsers directly - this is the security check
    const students = await base44.asServiceRole.entities.StudentUsers.filter({
      school_slug: school_slug.trim(),
      email: email.toLowerCase().trim(),
      access_code: access_code.trim(),
      is_active: true,
    });

    if (!students || students.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const student = students[0];

    // Check suspension
    if (student.suspended_until && new Date(student.suspended_until) > new Date()) {
      return Response.json(
        { error: 'Account suspended' },
        { status: 403 }
      );
    }

    // Check upload access
    if (!student.can_upload) {
      return Response.json(
        { error: 'Upload access disabled' },
        { status: 403 }
      );
    }

    // Update last login
    await base44.asServiceRole.entities.StudentUsers.update(student.id, {
      last_login_at: new Date().toISOString(),
    });

    // Return secure session data
    // Session token is just the student_user_id + school_slug combination
    // Browser can store this but backend always validates
    return Response.json({
      success: true,
      session: {
        student_user_id: student.id,
        student_name: student.full_name,
        email: student.email,
        school_slug: student.school_slug,
        can_upload: student.can_upload,
        // Create a session token (in production, this would be a signed JWT)
        session_token: Buffer.from(`${student.id}:${school_slug}:${new Date().getTime()}`).toString('base64'),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
});