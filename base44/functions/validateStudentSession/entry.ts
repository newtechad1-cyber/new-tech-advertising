import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Validates that a student's session is still valid.
 * Backend enforces whether student can still upload.
 */
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  const base44 = createClientFromRequest(req);

  try {
    const { student_user_id, school_slug } = await req.json();

    if (!student_user_id || !school_slug) {
      return Response.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Fetch student record to validate they still exist and are active
    const students = await base44.asServiceRole.entities.StudentUsers.filter({
      id: student_user_id,
      school_slug: school_slug,
      is_active: true,
    });

    if (!students || students.length === 0) {
      return Response.json({ error: 'Student not found or inactive' }, { status: 401 });
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

    return Response.json({
      valid: true,
      student: {
        student_user_id: student.id,
        student_name: student.full_name,
        email: student.email,
        can_upload: student.can_upload,
      },
    });
  } catch (error) {
    console.error('Session validation error:', error);
    return Response.json(
      { error: 'Validation failed' },
      { status: 500 }
    );
  }
});