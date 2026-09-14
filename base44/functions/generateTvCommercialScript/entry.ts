import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { businessName, industry, serviceArea, offer, duration, tone } = await req.json();
    if (!businessName || !industry || !serviceArea) {
      return Response.json({ error: 'businessName, industry, and serviceArea are required' }, { status: 400 });
    }

    const prompt = `Write a ${duration || '30 seconds'} streaming TV commercial script for a local ${industry} business.

Business name: ${businessName}
Service area: ${serviceArea}
Special offer or key message: ${offer || 'quality service and free estimates'}
Tone: ${tone || 'Professional'}

Format the script with:
- OPENING (hook — first 3 seconds)
- BODY (main message with benefits)
- CALL TO ACTION (clear next step)

Keep it tight to the ${duration || '30 seconds'} duration. Write conversational, spoken-word language — not marketing copy. Include a suggested voiceover note.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    return Response.json({ script: typeof result === 'string' ? result : result?.text || '' });
  } catch (error) {
    console.error('[generateTvCommercialScript] Error:', error?.message || error);
    return Response.json({ error: 'Script generation failed' }, { status: 500 });
  }
});