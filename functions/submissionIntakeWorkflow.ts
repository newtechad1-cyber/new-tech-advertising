import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();

    // Only handle StudentVideoSubmissions creation
    if (event.entity_name !== 'StudentVideoSubmissions' || event.type !== 'create') {
      return Response.json({ message: 'Not a submission creation event' });
    }

    const submission = data;

    // Create submission intake log (optional)
    await base44.asServiceRole.entities.ContentStatusLogs.create({
      school_slug: submission.school_slug,
      entity_type: 'StudentVideoSubmissions',
      entity_id: submission.id,
      previous_status: null,
      new_status: submission.status,
      changed_by: submission.created_by,
      change_reason: 'New submission received',
      metadata: JSON.stringify({
        contributor: submission.contributor_name,
        activity_type: submission.activity_type,
      }),
    });

    // Fetch school settings to drive workflow behaviour
    const settingsArr = await base44.asServiceRole.entities.SchoolSettings.filter({ school_slug: submission.school_slug });
    const settings = {
      require_teacher_review: true,
      notify_on_new_submission: true,
      auto_approve_staff_submissions: false,
      ai_content_moderation: true,
      ...(settingsArr[0] || {})
    };

    // Auto-approve staff submissions if school setting allows it
    const staffRoles = ['teacher', 'coach', 'staff'];
    if (settings.auto_approve_staff_submissions && staffRoles.includes(submission.contributor_role)) {
      await base44.asServiceRole.entities.StudentVideoSubmissions.update(submission.id, { status: 'approved' });
      return Response.json({ success: true, message: 'Staff submission auto-approved per school settings', submissionId: submission.id });
    }

    // Queue AI content moderation only if enabled for this school
    if (settings.ai_content_moderation && !submission.ai_safety_flagged && submission.status === 'pending') {
      await base44.asServiceRole.entities.AIContentJobs.create({
        school_slug: submission.school_slug,
        job_type: 'content_analysis',
        status: 'pending',
        source_entity_type: 'StudentVideoSubmissions',
        source_entity_id: submission.id,
        requested_by: 'system',
      });
    }

    return Response.json({
      success: true,
      message: 'Submission intake workflow completed',
      submissionId: submission.id,
    });
  } catch (error) {
    console.error('Submission intake error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});