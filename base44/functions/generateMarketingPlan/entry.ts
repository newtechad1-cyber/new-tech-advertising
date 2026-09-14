import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { businessName, industry, city, goal, budget, channels, notes } = await req.json();
    if (!businessName || !industry || !city) {
      return Response.json({ error: 'businessName, industry, and city are required' }, { status: 400 });
    }

    const prompt = `Create a practical 90-day marketing plan for a local small business.

Business name: ${businessName}
Industry: ${industry}
City / Service area: ${city}
Primary goal: ${goal || 'grow'}
Monthly marketing budget: ${budget || 'Not specified'}
Preferred channels: ${Array.isArray(channels) && channels.length ? channels.join(', ') : 'Open to all channels'}
Additional context: ${notes || 'None provided'}

Format the plan with these sections:
1. SITUATION SUMMARY — a brief honest assessment of this type of business's marketing position
2. PRIMARY STRATEGY — the one core approach that will drive the most results given the goal and budget
3. CHANNEL BREAKDOWN — for each relevant channel, what to do and how much budget to allocate
4. 90-DAY CALENDAR — what to do in Month 1, Month 2, and Month 3
5. QUICK WINS — 3 things to do in the first 7 days
6. SUCCESS METRICS — how to know if the plan is working

Be specific, practical, and oriented toward a local service business owner who is not a marketing expert.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    return Response.json({ plan: typeof result === 'string' ? result : result?.text || '' });
  } catch (error) {
    console.error('[generateMarketingPlan] Error:', error?.message || error);
    return Response.json({ error: 'Marketing plan generation failed' }, { status: 500 });
  }
});