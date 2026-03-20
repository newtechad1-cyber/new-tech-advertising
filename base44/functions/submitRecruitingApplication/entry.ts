import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { full_name, email, phone, city, current_role, business_relationships, interest_reason, resume_name, cover_letter_name } = body;

    if (!full_name || !email) {
      return Response.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    // Save candidate using service role (no auth required from submitter)
    await base44.asServiceRole.entities.RecruitingCandidate.create({
      full_name,
      email,
      phone: phone || '',
      city: city || '',
      current_role: current_role || '',
      business_relationships: business_relationships || '',
      interest_reason: interest_reason || '',
      status: 'New Lead',
      submitted_at: new Date().toISOString(),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('submitRecruitingApplication error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});