import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import OpenAI from 'npm:openai';

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') });

const PHASE_CONFIG = {
  1: {
    label: 'recap',
    name: 'Same-Day Recap',
    delay_hours: 2,
    subject_template: (co) => `Your NTA Authority Strategy Session Recap — ${co}`,
    prompt_theme: 'Warm, professional recap of the demo. Reference their specific city and industry. Include deal room link placeholder [DEAL_ROOM_LINK]. Reinforce 3 key takeaways from what the authority system does for their vertical.',
    score_trigger: null,
    channel: 'email',
  },
  2: {
    label: 'authority_proof',
    name: 'Authority Proof',
    delay_hours: 48,
    subject_template: (co) => `What ${co}'s competitors don't want you to see`,
    prompt_theme: 'Share a compelling case study or testimonial from a similar industry vertical. Focus on specific results: visibility score improvements, lead volume, and revenue attribution. Create urgency through competitor contrast.',
    score_trigger: null,
    channel: 'email',
  },
  3: {
    label: 'roi_perspective',
    name: 'ROI Perspective',
    delay_hours: 120,
    subject_template: (co) => `The 6-month growth timeline for ${co}`,
    prompt_theme: 'Paint a vivid growth timeline broken into months 1-3 and months 4-6. Use realistic but compelling projections for their industry. Address the ROI math: content volume × visibility reach × lead conversion = revenue. Make it feel inevitable.',
    score_trigger: null,
    channel: 'email',
  },
  4: {
    label: 'urgency',
    name: 'Market Timing Urgency',
    delay_hours: 192,
    subject_template: (co) => `The window in your market is closing — here's why`,
    prompt_theme: 'Address market timing with authority. Explain that digital authority compounds — early movers in their city/vertical get disproportionate search and streaming advantages. Keep urgency genuine, not pushy. Offer to answer any remaining questions.',
    score_trigger: 'low_engagement',
    channel: 'email',
  },
  5: {
    label: 'check_in',
    name: 'Strategic Check-In',
    delay_hours: 288,
    subject_template: (co) => `Quick question for ${co}`,
    prompt_theme: 'Short, personal check-in. One direct question: what would need to be true for this to be the right time? Offer to schedule a brief 15-minute call to address their specific concern. No sales pressure, pure strategic curiosity.',
    score_trigger: null,
    channel: 'email',
  },
  6: {
    label: 'long_cycle',
    name: 'Long-Cycle Re-Engagement',
    delay_hours: 720,
    subject_template: (co) => `Still thinking about authority marketing, ${co}?`,
    prompt_theme: 'Re-engagement nurture. Acknowledge the time that has passed. Share a fresh market insight about their industry or city. Keep it educational, not transactional. Offer a "no strings" market analysis update.',
    score_trigger: 'unresponsive',
    channel: 'email',
  },
};

const SIGNAL_SCORES = {
  deal_room_visit: 15,
  proposal_view: 20,
  proposal_scroll_deep: 25,
  cta_click: 30,
  email_open: 5,
  email_click: 15,
  email_reply: 40,
  call_answered: 35,
  linkedin_view: 10,
};

function calcEngagementTier(score) {
  if (score >= 80) return 'burning';
  if (score >= 50) return 'hot';
  if (score >= 25) return 'warm';
  return 'cold';
}

function calcPriorityFlag(tier, phase) {
  if (tier === 'burning') return 'critical';
  if (tier === 'hot') return 'urgent';
  if (tier === 'warm' && phase >= 4) return 'elevated';
  return 'normal';
}

async function generateMessage(phase, company, industry, city, contactName) {
  const cfg = PHASE_CONFIG[phase];
  const prompt = `You are an elite B2B sales copywriter for NTA (National Territory Authority), a premium AI-powered local marketing platform for service businesses.

Write a follow-up email for:
- Company: ${company}
- Industry: ${industry}
- City: ${city}
- Contact: ${contactName}
- Phase: ${cfg.name}
- Theme: ${cfg.prompt_theme}

Rules:
- 150-250 words max
- No generic language — reference their industry and city specifically
- Authority-first tone: we help businesses dominate, not just market
- Sign off as "The NTA Growth Team"
- Return ONLY the email body, no subject line

Write the email body now:`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 400,
  });

  return res.choices[0].message.content.trim();
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { action, ...params } = body;

  // === START SEQUENCE ===
  if (action === 'start_sequence') {
    const { opportunity_id } = params;
    const opp = await base44.asServiceRole.entities.SalesOpportunity.filter({ id: opportunity_id });
    if (!opp?.length) return Response.json({ error: 'Opportunity not found' }, { status: 404 });
    const o = opp[0];

    // Check no existing active sequence
    const existing = await base44.asServiceRole.entities.SalesFollowUpSequence.filter({ opportunity_id, status: 'active' });
    if (existing?.length) return Response.json({ sequence: existing[0], already_exists: true });

    const today = new Date();
    const nextDate = new Date(today.getTime() + PHASE_CONFIG[1].delay_hours * 3600000);

    const seq = await base44.asServiceRole.entities.SalesFollowUpSequence.create({
      opportunity_id,
      company_name: o.company_name,
      contact_name: o.contact_name || '',
      contact_email: o.contact_email,
      industry: o.industry || '',
      city: o.city || '',
      demo_completed_date: today.toISOString().split('T')[0],
      current_phase: 1,
      status: 'active',
      engagement_score: 10,
      engagement_tier: 'warm',
      next_follow_up_date: nextDate.toISOString().split('T')[0],
      next_follow_up_action: PHASE_CONFIG[1].name,
      assigned_owner: o.assigned_owner || user.email,
      deal_value: o.deal_value || 0,
      priority_flag: 'normal',
    });

    // Generate phase 1 message
    const body = await generateMessage(1, o.company_name, o.industry, o.city, o.contact_name);
    await base44.asServiceRole.entities.FollowUpMessage.create({
      sequence_id: seq.id,
      opportunity_id,
      company_name: o.company_name,
      contact_email: o.contact_email,
      phase: 1,
      phase_label: 'recap',
      subject: PHASE_CONFIG[1].subject_template(o.company_name),
      body,
      status: 'scheduled',
      scheduled_for: nextDate.toISOString(),
      channel: 'email',
      is_ai_generated: true,
    });

    return Response.json({ success: true, sequence: seq });
  }

  // === RECORD ENGAGEMENT SIGNAL ===
  if (action === 'record_signal') {
    const { sequence_id, signal_type, metadata } = params;
    const seqs = await base44.asServiceRole.entities.SalesFollowUpSequence.filter({ id: sequence_id });
    if (!seqs?.length) return Response.json({ error: 'Sequence not found' }, { status: 404 });
    const seq = seqs[0];

    const delta = SIGNAL_SCORES[signal_type] || 10;
    const newScore = Math.min(100, (seq.engagement_score || 0) + delta);
    const newTier = calcEngagementTier(newScore);
    const newPriority = calcPriorityFlag(newTier, seq.current_phase);

    await base44.asServiceRole.entities.FollowUpEngagementSignal.create({
      sequence_id,
      opportunity_id: seq.opportunity_id,
      company_name: seq.company_name,
      signal_type,
      signal_strength: delta >= 30 ? 'critical' : delta >= 20 ? 'high' : delta >= 10 ? 'medium' : 'low',
      score_delta: delta,
      metadata: metadata ? JSON.stringify(metadata) : '',
      triggered_action: newTier === 'burning' ? 'escalate_owner_alert' : '',
      recorded_at: new Date().toISOString(),
    });

    // Update sequence
    const updates = {
      engagement_score: newScore,
      engagement_tier: newTier,
      priority_flag: newPriority,
      last_engagement_date: new Date().toISOString(),
    };

    // Accelerate cadence if hot/burning
    if ((newTier === 'hot' || newTier === 'burning') && seq.current_phase < 5) {
      const nextPhase = Math.min(seq.current_phase + 1, 5);
      const fastNext = new Date(Date.now() + 24 * 3600000);
      updates.next_follow_up_date = fastNext.toISOString().split('T')[0];
      updates.next_follow_up_action = `Accelerated: ${PHASE_CONFIG[nextPhase].name}`;
      updates.cadence_override = 'accelerated';
    }

    if (signal_type === 'proposal_view') {
      updates.proposal_viewed = true;
      updates.proposal_view_count = (seq.proposal_view_count || 0) + 1;
    }
    if (signal_type === 'deal_room_visit') {
      updates.deal_room_visits = (seq.deal_room_visits || 0) + 1;
    }
    if (signal_type === 'cta_click') {
      updates.cta_clicks = (seq.cta_clicks || 0) + 1;
    }

    await base44.asServiceRole.entities.SalesFollowUpSequence.update(sequence_id, updates);
    return Response.json({ success: true, new_score: newScore, new_tier: newTier, new_priority: newPriority });
  }

  // === ADVANCE PHASE ===
  if (action === 'advance_phase') {
    const { sequence_id } = params;
    const seqs = await base44.asServiceRole.entities.SalesFollowUpSequence.filter({ id: sequence_id });
    if (!seqs?.length) return Response.json({ error: 'Not found' }, { status: 404 });
    const seq = seqs[0];

    const nextPhase = Math.min((seq.current_phase || 1) + 1, 6);
    const cfg = PHASE_CONFIG[nextPhase];
    const nextDate = new Date(Date.now() + cfg.delay_hours * 3600000);

    const msgBody = await generateMessage(nextPhase, seq.company_name, seq.industry, seq.city, seq.contact_name);
    await base44.asServiceRole.entities.FollowUpMessage.create({
      sequence_id,
      opportunity_id: seq.opportunity_id,
      company_name: seq.company_name,
      contact_email: seq.contact_email,
      phase: nextPhase,
      phase_label: cfg.label,
      subject: cfg.subject_template(seq.company_name),
      body: msgBody,
      status: 'scheduled',
      scheduled_for: nextDate.toISOString(),
      channel: cfg.channel,
      is_ai_generated: true,
    });

    await base44.asServiceRole.entities.SalesFollowUpSequence.update(sequence_id, {
      current_phase: nextPhase,
      next_follow_up_date: nextDate.toISOString().split('T')[0],
      next_follow_up_action: cfg.name,
      cadence_override: null,
    });

    return Response.json({ success: true, new_phase: nextPhase, message_generated: true });
  }

  // === GENERATE MESSAGE FOR PHASE ===
  if (action === 'generate_message') {
    const { sequence_id, phase } = params;
    const seqs = await base44.asServiceRole.entities.SalesFollowUpSequence.filter({ id: sequence_id });
    if (!seqs?.length) return Response.json({ error: 'Not found' }, { status: 404 });
    const seq = seqs[0];
    const cfg = PHASE_CONFIG[phase];
    const msgBody = await generateMessage(phase, seq.company_name, seq.industry, seq.city, seq.contact_name);
    return Response.json({
      subject: cfg.subject_template(seq.company_name),
      body: msgBody,
      phase,
      channel: cfg.channel,
    });
  }

  // === LIST SEQUENCES (dashboard) ===
  if (action === 'list_sequences') {
    const { status } = params;
    const filter = status ? { status } : {};
    const sequences = await base44.asServiceRole.entities.SalesFollowUpSequence.list('-engagement_score', 100);
    return Response.json({ sequences });
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 });
});