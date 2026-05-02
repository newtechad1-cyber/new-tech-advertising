import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { prospect_id } = await req.json();
  if (!prospect_id) return Response.json({ error: 'prospect_id required' }, { status: 400 });

  const prospects = await base44.asServiceRole.entities.Prospect.filter({ id: prospect_id });
  const prospect = prospects[0];
  if (!prospect) return Response.json({ error: 'Prospect not found' }, { status: 404 });

  // Create Client record
  const client = await base44.asServiceRole.entities.Client.create({
    business_name: prospect.business_name,
    contact_name: prospect.contact_name || '',
    email: prospect.email || '',
    phone: prospect.phone || '',
    website: prospect.website || '',
    industry: prospect.industry || '',
    service_area: prospect.city || '',
    status: 'onboarding',
    notes: `Converted from prospect on ${new Date().toLocaleDateString()}`,
  });

  // Create default starter Campaign
  const campaign = await base44.asServiceRole.entities.Campaign.create({
    client_id: client.id,
    campaign_name: `${prospect.business_name} — Starter Campaign`,
    season: 'year_round',
    service_focus: prospect.industry || 'General Services',
    status: 'planning',
    notes: 'Auto-created onboarding campaign. Update service focus, offer, and location.',
  });

  // Create onboarding checklist as ContentAssets (task-type notes)
  const tasks = [
    { title: 'Onboarding: Collect brand voice and service details', notes: 'Schedule intake call with client' },
    { title: 'Onboarding: Set up Google Business Profile access', notes: 'Request access via Google Business Profile' },
    { title: 'Onboarding: Connect social media accounts', notes: 'Facebook, Instagram, LinkedIn' },
    { title: 'Onboarding: Define target keywords and service areas', notes: 'Use industry + city combinations' },
  ];

  for (const task of tasks) {
    await base44.asServiceRole.entities.ContentAsset.create({
      client_id: client.id,
      campaign_id: campaign.id,
      asset_type: 'landing_page',
      title: task.title,
      content: '',
      platform: 'website',
      status: 'draft',
      approval_status: 'not_needed',
      notes: task.notes,
    });
  }

  // Create first SEO page task
  await base44.asServiceRole.entities.SEOPage.create({
    client_id: client.id,
    campaign_id: campaign.id,
    page_title: `${prospect.industry || 'Services'} in ${prospect.city || 'Your City'} | ${prospect.business_name}`,
    url_slug: `${(prospect.industry || 'services').toLowerCase().replace(/\s+/g, '-')}-${(prospect.city || 'local').toLowerCase().replace(/\s+/g, '-')}`,
    target_keyword: `${prospect.industry || 'services'} ${prospect.city || 'local'}`,
    city: prospect.city || '',
    service: prospect.industry || '',
    status: 'draft',
  });

  // Mark prospect as converted
  await base44.asServiceRole.entities.Prospect.update(prospect_id, {
    status: 'converted',
  });

  return Response.json({
    success: true,
    client_id: client.id,
    campaign_id: campaign.id,
    message: `${prospect.business_name} converted to active client with starter campaign and onboarding tasks.`,
  });
});