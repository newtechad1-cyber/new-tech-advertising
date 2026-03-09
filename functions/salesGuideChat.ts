import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const DEFAULT_PROMPTS = {
  sales_guide: `You are an expert NTA sales guide helping small business owners explore the New Tech Advertising platform. 
Your job is to answer questions clearly, honestly, and conversationally. Keep responses under 120 words.
NTA is an AI-powered marketing platform for small businesses. Key benefits: automated content creation, website, SEO, social media, video marketing, lead generation — all in one system. Plans start at affordable monthly rates compared to paying multiple agencies.
Tone: practical, clear, friendly. No hype. No agency jargon. Focus on real business outcomes.
If they seem ready to move forward, suggest starting a trial or booking a call.`,

  sales_closer: `You are an NTA sales closer. The prospect has explored the platform and is close to a decision.
Your job: help them take the next step — start a trial, request setup, or book a call. Be direct but not pushy.
Answer their specific question, then clearly suggest the most relevant next action.
Keep responses under 100 words. Be confident, practical, and specific to small businesses.`,

  objection_handler: `You handle objections from small business owners considering NTA.
Common objections: too expensive, no time to manage it, already have a website/agency, not tech-savvy, need to think about it.
Address each objection with a brief, honest, practical response. Don't oversell. Offer real comparisons.
Keep responses under 80 words. End with a clear path forward.`,
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { question, step, prospect_id, session_id } = await req.json();

    if (!question) return Response.json({ error: 'question required' }, { status: 400 });

    // Determine agent type based on step
    const agentType = (step || '').startsWith('deal_room') ? 'sales_closer' : 'sales_guide';

    // Load stored prompt if available
    let systemPrompt = DEFAULT_PROMPTS[agentType];
    try {
      const prompts = await base44.asServiceRole.entities.SalesAgentPrompts.filter({ agent_type: agentType, active: true });
      if (prompts.length > 0) {
        systemPrompt = prompts[0].prompt_text;
      }
    } catch (_e) { /* use default */ }

    // Generate AI response
    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `${systemPrompt}\n\nUser is on step: ${step || 'sales_room'}\n\nUser question: ${question}`,
    });

    const now = new Date().toISOString();

    // Save question to SalesQuestions
    await base44.asServiceRole.entities.SalesQuestions.create({
      prospect_id: prospect_id || null,
      session_id: session_id || null,
      question_text: question,
      ai_response: response,
      resolved: true,
      created_at: now,
    });

    // Also log as sales event (score +5)
    if (prospect_id || session_id) {
      await base44.asServiceRole.entities.SalesEvents.create({
        prospect_id: prospect_id || null,
        session_id: session_id || null,
        event_type: 'ai_question',
        page_path: step || '',
        created_at: now,
      });

      if (prospect_id) {
        const prospects = await base44.asServiceRole.entities.SalesProspects.filter({ id: prospect_id });
        if (prospects.length > 0) {
          const p = prospects[0];
          await base44.asServiceRole.entities.SalesProspects.update(prospect_id, {
            lead_score: (p.lead_score || 0) + 5,
            last_activity_at: now,
          });
        }
      }
    }

    return Response.json({ response });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});