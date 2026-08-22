import { createClientFromRequest } from 'npm:@base44/sdk@0.8.41';

function safeText(value, max = 240) {
  return String(value || '').slice(0, max);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assignments = await base44.asServiceRole.entities.TenantUserAssignment.filter({
      userId: user.id,
      status: 'active',
    });

    const assignment = assignments[0];
    if (!assignment?.tenantId) {
      return Response.json({ error: 'No active reseller assignment found.' }, { status: 403 });
    }

    const tenant = await base44.asServiceRole.entities.Tenant.read(assignment.tenantId);
    if (!tenant || tenant.tenantType !== 'reseller' || tenant.status !== 'active') {
      return Response.json({ error: 'Reseller tenant is unavailable.' }, { status: 403 });
    }

    const [maps, resellerProfiles, brandProfiles] = await Promise.all([
      base44.asServiceRole.entities.TenantOrganizationMap.filter({
        tenantId: tenant.tenantId,
        status: 'active',
      }),
      base44.asServiceRole.entities.ResellerProfile.filter({ tenantId: tenant.tenantId }, null, 1),
      base44.asServiceRole.entities.BrandProfile.filter({ tenantId: tenant.tenantId }, null, 1),
    ]);

    const organizationIds = [...new Set(
      maps.map((map) => map.organizationId).filter(Boolean),
    )].slice(0, 250);

    const organizations = await Promise.all(
      organizationIds.map((organizationId) =>
        base44.asServiceRole.entities.Organization.read(organizationId).catch(() => null),
      ),
    );

    const clients = organizations
      .filter(Boolean)
      .map((organization) => ({
        id: organization.id,
        businessName: safeText(organization.businessName, 240),
        industry: safeText(organization.industry, 120),
        subscriptionPlan: safeText(organization.subscriptionPlan, 120),
        status: safeText(organization.lifecycleStage || organization.status, 120),
      }));

    const activity = organizationIds.length
      ? await base44.asServiceRole.entities.ActivityEvent.filter(
          { organizationId: { $in: organizationIds } },
          '-timestamp',
          20,
        )
      : [];

    const reseller = resellerProfiles[0];
    const brand = brandProfiles[0];
    return Response.json({
      tenant: {
        tenantId: tenant.tenantId,
        tenantName: safeText(tenant.tenantName, 240),
      },
      stats: {
        clientCount: clients.length,
        // Subscription records are user-owned, not organization-owned. Do not
        // infer them across tenants from this dashboard.
        subscriptionCount: null,
        reseller: reseller ? { companyName: safeText(reseller.companyName, 240) } : null,
        brand: brand ? {
          brandName: safeText(brand.brandName, 240),
          logoUrl: safeText(brand.logoUrl, 2048),
          primaryColor: safeText(brand.primaryColor, 32),
        } : null,
      },
      clients,
      recent_activity: activity.map((event) => ({
        id: event.id,
        eventType: safeText(event.eventType, 120),
        timestamp: event.timestamp,
      })),
    });
  } catch (error) {
    console.error('getResellerDashboard failed', error);
    return Response.json({ error: 'Unable to load reseller dashboard.' }, { status: 500 });
  }
});
