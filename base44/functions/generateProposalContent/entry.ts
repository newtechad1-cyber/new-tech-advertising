import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

const SERVICE_LABELS: Record<string, string> = {
  website_new: 'New Website',
  website_rebuild: 'Website Rebuild',
  social_diy: 'Social Media DIY',
  social_dfy: 'Social Media DFY',
  ada_compliance: 'ADA Compliance',
  streaming_tv: 'Streaming TV Ads',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin' && user.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { service_type, business_name, contact_name, industry, city, state, website, notes } = await req.json();
    if (!service_type || !business_name) {
      return Response.json({ error: 'service_type and business_name are required' }, { status: 400 });
    }

    const serviceLabel = SERVICE_LABELS[service_type] || service_type;

    const prompt = `You are a professional marketing agency proposal writer for New Tech Advertising.

Write a compelling, professional proposal for a ${serviceLabel} service.

Business: ${business_name}
Contact: ${contact_name || ''}
Industry: ${industry || 'local business'}
Location: ${city ? `${city}, ${state || ''}` : 'Midwest'}
Website: ${website || 'N/A'}
Special Notes: ${notes || 'None'}

Write a proposal that includes:
1. **Executive Summary** - Brief overview of the opportunity
2. **Our Understanding of Your Needs** - Tailored to their business
3. **Proposed Solution** - Detailed description of the ${serviceLabel} service
4. **What's Included** - Bullet list of deliverables
5. **Timeline** - Realistic project timeline
6. **Investment** - Professional pricing narrative (do not use specific numbers, say "See pricing summary below")
7. **Why New Tech Advertising** - 3-4 compelling differentiators
8. **Next Steps** - Clear call to action

Write in a professional but friendly tone. Use markdown formatting. Keep it to 600-800 words.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    return Response.json({ content: typeof result === 'string' ? result : result?.text || '' });
  } catch (error) {
    console.error('[generateProposalContent] Error:', error?.message || error);
    return Response.json({ error: 'Proposal generation failed' }, { status: 500 });
  }
});