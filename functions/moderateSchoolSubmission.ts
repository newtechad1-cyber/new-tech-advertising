import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { submission_id } = await req.json();

    const subs = await base44.asServiceRole.entities.SchoolSubmissions.filter({ id: submission_id });
    if (!subs.length) return Response.json({ error: 'Not found' }, { status: 404 });
    const sub = subs[0];

    // Fetch school settings to honour per-school moderation config
    const settingsArr = await base44.asServiceRole.entities.SchoolSettings.filter({ school_slug: sub.school || '' });
    const settings = { ai_content_moderation: true, moderation_strictness: 'standard', ...(settingsArr[0] || {}) };

    if (!settings.ai_content_moderation) {
      await base44.asServiceRole.entities.SchoolSubmissions.update(submission_id, { status: 'under_review' });
      return Response.json({ success: true, assessment: { skipped: true, reason: 'AI moderation disabled for this school' } });
    }

    const strictnessNote = settings.moderation_strictness === 'strict'
      ? 'Be conservative — flag anything that could be questionable in a school setting.'
      : settings.moderation_strictness === 'relaxed'
      ? 'Only flag clearly inappropriate content. Give submissions the benefit of the doubt.'
      : 'Apply standard school-appropriate content guidelines.';

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are reviewing a video/photo submission for a school district's student media program. ${strictnessNote}

Submission:
- Title: ${sub.submission_title}
- Description: ${sub.description || 'None provided'}
- Contributor: ${sub.contributor_role} (${sub.contributor_name})
- Activity type: ${sub.activity_type}
- Event: ${sub.event_name || 'N/A'}
- Grade level: ${sub.grade_level || 'Not specified'}

Assess for school-appropriate use and respond with JSON:
{
  "quality_score": number (0-100, based on description clarity and submission completeness),
  "safety_flag": boolean (true only if description contains concerning content),
  "content_notes": "brief 1-sentence assessment for the admin reviewer"
}`,
      response_json_schema: {
        type: 'object',
        properties: {
          quality_score: { type: 'number' },
          safety_flag: { type: 'boolean' },
          content_notes: { type: 'string' }
        }
      }
    });

    await base44.asServiceRole.entities.SchoolSubmissions.update(submission_id, {
      ai_quality_score: result.quality_score || 70,
      ai_safety_flag: result.safety_flag || false,
      moderation_notes: result.content_notes || '',
      status: 'under_review'
    });

    return Response.json({ success: true, assessment: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});