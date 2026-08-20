import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

function isAdminUser(user) {
  const adminEmails = String(Deno.env.get('ADMIN_EMAILS') || '')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(
    user &&
    (user.is_service === true ||
      user.role === 'admin' ||
      adminEmails.includes(String(user.email || '').toLowerCase()))
  );
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAdminUser(user)) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const onboarding_workroom_id = String(body?.onboarding_workroom_id || '').trim();

    if (!/^[A-Za-z0-9_-]{1,128}$/.test(onboarding_workroom_id)) {
      return Response.json({ error: 'Invalid onboarding_workroom_id' }, { status: 400 });
    }

    // Get onboarding workroom
    const onboardings = await base44.asServiceRole.entities.OnboardingWorkrooms.filter({ id: onboarding_workroom_id });
    if (onboardings.length === 0) {
      return Response.json({ error: 'Onboarding workroom not found' }, { status: 404 });
    }

    const onboarding = onboardings[0];

    // Get proposal for service type
    let serviceType = 'general';
    if (onboarding.onboarding_type) {
      const typeMap = {
        streaming_tv: 'streaming_tv',
        website_rebuild: 'website_rebuild',
        local_seo: 'local_seo',
        video_marketing: 'video_marketing',
        social_media: 'social_media',
        ada_rebuild: 'ada_rebuild',
      };
      serviceType = typeMap[onboarding.onboarding_type] || 'general';
    }

    // Call createFulfillmentWorkroom
    const response = await base44.functions.invoke('createFulfillmentWorkroom', {
      onboarding_workroom_id: onboarding_workroom_id,
      company_id: onboarding.company_id,
      proposal_id: onboarding.proposal_id || null,
      service_type: serviceType,
      assigned_admin_user_id: onboarding.assigned_admin_user_id,
    });

    return Response.json(response);
  } catch (error) {
    console.error('[autoCreateFulfillmentWorkroom] failed:', error);
    return Response.json({ error: 'Unable to create fulfillment workroom' }, { status: 500 });
  }
});