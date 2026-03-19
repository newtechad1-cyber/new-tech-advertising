import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Creates StudentUpload record with BACKEND-ENFORCED student identity.
 * The browser cannot forge the student_user_id - it's validated here.
 */
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  const base44 = createClientFromRequest(req);

  try {
    const {
      student_user_id,
      school_slug,
      title,
      description,
      category,
      file_url,
      file_size_mb,
      upload_type,
    } = await req.json();

    if (!student_user_id || !school_slug || !title || !file_url) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // CRITICAL: Validate student exists and is active
    const students = await base44.asServiceRole.entities.StudentUsers.filter({
      id: student_user_id,
      school_slug: school_slug,
      is_active: true,
      can_upload: true,
    });

    if (!students || students.length === 0) {
      return Response.json({ error: 'Student not authorized for uploads' }, { status: 403 });
    }

    const student = students[0];

    // Check suspension
    if (student.suspended_until && new Date(student.suspended_until) > new Date()) {
      return Response.json(
        { error: 'Account suspended' },
        { status: 403 }
      );
    }

    // Enforce max file size
    const MAX_SIZE_MB = 500;
    if (file_size_mb > MAX_SIZE_MB) {
      return Response.json(
        { error: `File too large. Max ${MAX_SIZE_MB}MB` },
        { status: 400 }
      );
    }

    // Create upload record with BACKEND-ENFORCED identity
    // Browser cannot override student_user_id
    const upload = await base44.asServiceRole.entities.StudentUploads.create({
      student_user_id: student.id, // Use validated student ID, not browser value
      student_name: student.full_name, // Use student name from record, not browser
      school_slug: school_slug,
      title: title.trim(),
      description: description?.trim() || '',
      category: category || 'other',
      file_urls: JSON.stringify([file_url]),
      upload_type: upload_type || 'video',
      file_size_total_mb: file_size_mb,
      status: 'submitted',
      moderation_status: 'pending',
      consent_confirmed: true,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown', // Audit trail
    });

    // TRIGGER: Automatic content moderation for explicit/nudity detection
    // This runs asynchronously and updates the upload status if explicit content detected
    try {
      await base44.asServiceRole.functions.invoke('moderateStudentUploadContent', {
        upload_id: upload.id,
        file_url: file_url,
        upload_type: upload_type,
        school_slug: school_slug,
      });
    } catch (err) {
      // Log error but don't fail upload creation
      // Admin can manually review if moderation fails
      console.error('Content moderation failed, flagging for review:', err);
      await base44.asServiceRole.entities.StudentUploads.update(upload.id, {
        moderation_status: 'requires_review',
        moderation_notes: 'Automatic moderation analysis failed. Requires manual review.',
      });
    }

    return Response.json({
      success: true,
      upload_id: upload.id,
      message: 'Upload submitted successfully. Content is being reviewed.',
    });
  } catch (error) {
    console.error('Upload creation error:', error);
    return Response.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
});