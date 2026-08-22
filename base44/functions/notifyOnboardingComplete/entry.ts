import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const adminBoundaryUser = await base44.auth.me().catch(() => null);
    if (!adminBoundaryUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (adminBoundaryUser.role !== 'admin' && adminBoundaryUser.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }
    const user = await base44.auth.me().catch(() => null);

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const profileId = String(body?.profileId || '').trim();
    const userEmail = String(user.email || '').trim().toLowerCase();

    if (!/^[A-Za-z0-9_-]{1,128}$/.test(profileId) || !userEmail) {
      return Response.json({ error: 'Invalid onboarding profile' }, { status: 400 });
    }

    // The authenticated user may notify only for their own profile. The
    // browser no longer chooses the notification recipient.
    const profile = await base44.asServiceRole.entities.ClientProfile.get(profileId);
    
    if (!profile) {
      return Response.json({ error: 'Profile not found' }, { status: 404 });
    }
    if (String(profile.created_by || '').trim().toLowerCase() !== userEmail) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Send confirmation email to user
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'New Tech Advertising',
        to: userEmail,
        subject: '🎉 Welcome to New Tech Advertising!',
        body: `
Hi ${profile.business_name ? `from ${profile.business_name}` : 'there'}!

Your account setup is complete! We're excited to help you grow your business with AI-powered marketing.

Here's what happens next:

1. Review Your Dashboard
   Access your analytics, projects, and resources at any time from your client portal.

2. Connect Your Social Media
   Link your Facebook, Instagram, and other social accounts so we can start managing your online presence.

3. First Strategy Call
   Your account manager will reach out within 24 hours to schedule your first strategy call.

4. Watch Your Business Grow
   Our AI will start optimizing your website, creating content, and driving leads to your business.

Need help? Reply to this email or call us at 641-420-8816.

Welcome aboard!

Rick & The New Tech Team
New Tech Advertising
rick@newtechadvertising.com
641-420-8816
        `
      });
    } catch (emailError) {
      console.error('Failed to send user confirmation:', emailError);
    }

    // Send admin notification
    try {
      const utmData = profile.utm_data ? JSON.parse(profile.utm_data) : {};
      const utmSummary = Object.keys(utmData).length > 0 
        ? `UTM Source: ${utmData.utm_source || 'N/A'}\nUTM Campaign: ${utmData.utm_campaign || 'N/A'}`
        : 'No UTM data';

      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'New Tech Platform',
        to: 'newtechad1@gmail.com',
        subject: `🎯 New Client Onboarded: ${profile.business_name}`,
        body: `
New client has completed onboarding!

Business Details:
- Business Name: ${profile.business_name}
- Industry: ${profile.industry || 'Not specified'}
- Target Audience: ${profile.target_audience || 'Not specified'}
- Marketing Goals: ${(profile.marketing_goals || []).join(', ') || 'None selected'}

Contact Information:
- Email: ${userEmail}

Tracking:
${utmSummary}

Next Steps:
1. Review their profile in the admin dashboard
2. Schedule their first strategy call
3. Begin service fulfillment

View Profile: ${Deno.env.get('BASE44_APP_URL') || 'https://app.base44.com'}/dashboard

---
New Tech Advertising Platform
        `
      });
    } catch (adminEmailError) {
      console.error('Failed to send admin notification:', adminEmailError);
    }

    // Trigger webhook if configured
    const webhookUrl = Deno.env.get('CRM_WEBHOOK_URL');
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Source': 'newtechadvertising-onboarding'
          },
          body: JSON.stringify({
            event: 'onboarding_completed',
            timestamp: new Date().toISOString(),
            data: {
              profile_id: profileId,
              business_name: profile.business_name,
              user_email: userEmail,
              industry: profile.industry,
              marketing_goals: profile.marketing_goals,
              utm_data: profile.utm_data
            }
          })
        });
      } catch (webhookError) {
        console.error('Webhook failed (non-critical):', webhookError);
        // Don't fail the entire function if webhook fails
      }
    }

    return Response.json({ 
      success: true,
      message: 'Onboarding notifications sent successfully'
    });

  } catch (error) {
    console.error('Onboarding notification error:', error);
    return Response.json({ 
      error: 'Failed to send notifications',
      details: 'Notification delivery failed' 
    }, { status: 500 });
  }
});