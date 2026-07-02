/**
 * captureKnowledge — A-006 Knowledge Capture Automation
 * 
 * Automatically creates KnowledgeCapture drafts from system events.
 * Does NOT publish automatically — sends to Knowledge Review Queue.
 * Rick approves all captures before they become permanent assets.
 * 
 * Triggers:
 * - Discovery Call completed
 * - AI Visibility Audit completed
 * - Proposal accepted
 * - Client onboarding
 * - Slack message tagged #knowledge
 * - Executive note
 * - Meeting transcript
 * - Voice memo
 * 
 * AI suggests: title, summary, knowledge domain, related assets,
 * recommended cross-links, possible Learning Center lesson,
 * possible blog, possible SOP, possible FAQ.
 * 
 * @input {
 *   trigger: string            — What triggered this capture
 *   source_entity_type?: string — Entity type that triggered it
 *   source_entity_id?: string  — ID of the triggering entity
 *   raw_content: string        — The content to capture
 *   context?: string           — Additional context about the capture
 *   existing_assets?: Array<{ type, id, title, domain }> — Known assets for cross-linking
 * }
 * 
 * @output {
 *   capture_id: string,
 *   title: string,
 *   summary: string,
 *   knowledge_domain: string,
 *   suggestions: {
 *     cross_links: Array<{ type, id, title, reasoning }>,
 *     learning_center_lesson: string | null,
 *     blog_post: string | null,
 *     sop: string | null,
 *     faq: string | null
 *   },
 *   status: "needs_review"
 * }
 */

import { base44 } from '../base44Client';

// ── Trigger-to-capture-type mapping ──

const TRIGGER_TYPE_MAP: Record<string, string> = {
  discovery_call_completed: 'client_pattern',
  ai_visibility_audit_completed: 'sales_insight',
  proposal_accepted: 'sales_insight',
  client_onboarding: 'lesson',
  slack_knowledge_tag: 'idea',
  executive_note: 'operating_principle',
  meeting_transcript: 'lesson',
  voice_memo: 'idea'
};

const TRIGGER_PRIORITY_MAP: Record<string, string> = {
  discovery_call_completed: 'high',
  ai_visibility_audit_completed: 'medium',
  proposal_accepted: 'high',
  client_onboarding: 'high',
  slack_knowledge_tag: 'medium',
  executive_note: 'urgent',
  meeting_transcript: 'medium',
  voice_memo: 'medium'
};

// ── AI System Prompt ──

const SYSTEM_PROMPT = `You are the NTA Knowledge Capture AI. Given raw content from a business event, you organize it into a structured knowledge asset.

NTA's 7 Knowledge Domains:
1. thought_leadership — Blog articles, insight pages, Rick's philosophies
2. education_training — AI Learning Center, knowledge articles, SOPs, training
3. sales_intelligence — Sales KB, case studies, audits, deal room
4. brand_creative — Brand profiles, video templates, prompt templates
5. market_intelligence — Industry intel, local markets, authority maps, topic clusters
6. operational_knowledge — SOPs, gap signals, executive briefs, system health
7. founder_wisdom — Rick's personal journey, faith, leadership principles

You must return a JSON object with:
{
  "title": "concise, descriptive title",
  "summary": "2-3 sentence summary of the key knowledge",
  "key_idea": "the core insight in one sentence",
  "knowledge_domain": "one of the 7 domains",
  "capture_type": "idea|lesson|sales_insight|client_pattern|operating_principle|sop_improvement|story|framework|faq|training_note|content_seed",
  "tags": "comma-separated relevant tags",
  "cross_links": [
    {"type": "entity type", "id": "entity id", "title": "title", "reasoning": "why this connects"}
  ],
  "learning_center_lesson": "suggested lesson title or null",
  "blog_post": "suggested blog post title or null",
  "sop": "suggested SOP title or null",
  "faq": "suggested FAQ entry or null",
  "possible_uses": "how this knowledge can be applied across NTA",
  "suggested_document_type": "SOP, article, framework doc, training module, etc.",
  "suggested_next_action": "what to do next with this capture"
}

Rules:
- Be specific, not generic
- Cross-links should reference actual existing assets when provided
- Only suggest derivatives (lesson, blog, SOP, FAQ) when the content genuinely supports them
- The title should be searchable and descriptive
- Tags should include industry, topic, and system keywords`;

// ── Main Function ──

export default async function captureKnowledge(input: {
  trigger: string;
  source_entity_type?: string;
  source_entity_id?: string;
  raw_content: string;
  context?: string;
  existing_assets?: Array<{ type: string; id: string; title: string; domain?: string }>;
}) {
  const {
    trigger,
    source_entity_type,
    source_entity_id,
    raw_content,
    context = '',
    existing_assets = []
  } = input;

  try {
    // ── Build prompt with existing assets for cross-linking ──
    const assetsContext = existing_assets.length > 0
      ? '\n\nExisting assets for cross-linking:\n' + existing_assets
          .slice(0, 50)
          .map(a => `- [${a.type}] "${a.title}" (ID: ${a.id}, Domain: ${a.domain || 'unclassified'})`)
          .join('\n')
      : '';

    const userPrompt = `Trigger: ${trigger}
Source: ${source_entity_type || 'manual'} ${source_entity_id ? `(ID: ${source_entity_id})` : ''}
Context: ${context || 'None provided'}

Raw Content:
${raw_content.substring(0, 5000)}
${assetsContext}

Analyze this content and return the structured JSON.`;

    // ── Call AI for classification + suggestions ──
    const response = await base44.ai.chat({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    const content = response.choices?.[0]?.message?.content || '{}';
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    let aiResult: any;

    try {
      aiResult = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      aiResult = {
        title: `Knowledge Capture — ${trigger}`,
        summary: raw_content.substring(0, 200),
        key_idea: '',
        knowledge_domain: 'operational_knowledge',
        capture_type: TRIGGER_TYPE_MAP[trigger] || 'idea',
        tags: trigger,
        cross_links: [],
        learning_center_lesson: null,
        blog_post: null,
        sop: null,
        faq: null,
        possible_uses: '',
        suggested_document_type: 'knowledge capture',
        suggested_next_action: 'Review and classify manually'
      };
    }

    // ── Create the KnowledgeCapture entity ──
    const captureData: Record<string, any> = {
      title: aiResult.title || `Knowledge Capture — ${trigger}`,
      raw_capture: raw_content,
      capture_type: aiResult.capture_type || TRIGGER_TYPE_MAP[trigger] || 'idea',
      source: `Automated: ${trigger}${source_entity_type ? ` from ${source_entity_type}` : ''}`,
      knowledge_domain: aiResult.knowledge_domain || 'operational_knowledge',
      summary: aiResult.summary || '',
      key_idea: aiResult.key_idea || '',
      possible_uses: aiResult.possible_uses || '',
      tags: aiResult.tags || trigger,
      related_assets: (aiResult.cross_links || []).map((cl: any) => cl.id).join(','),
      status: 'needs_review',
      priority: TRIGGER_PRIORITY_MAP[trigger] || 'medium',
      source_trigger: trigger,
      source_entity_type: source_entity_type || '',
      source_entity_id: source_entity_id || '',
      auto_captured: true,
      ai_suggested_cross_links: JSON.stringify(aiResult.cross_links || []),
      ai_suggested_learning_center_lesson: aiResult.learning_center_lesson || '',
      ai_suggested_blog_post: aiResult.blog_post || '',
      ai_suggested_sop: aiResult.sop || '',
      ai_suggested_faq: aiResult.faq || '',
      ai_suggested_document_type: aiResult.suggested_document_type || '',
      ai_suggested_next_action: aiResult.suggested_next_action || '',
      created_from_voice: trigger === 'voice_memo',
      created_from_chat: trigger === 'slack_knowledge_tag',
      created_from_client_conversation: ['discovery_call_completed', 'client_onboarding'].includes(trigger)
    };

    // Determine department from domain
    const domainToDept: Record<string, string> = {
      thought_leadership: '03_content_production',
      education_training: '90_knowledge_library',
      sales_intelligence: '01_sales',
      brand_creative: '03_content_production',
      market_intelligence: '01_sales',
      operational_knowledge: '04_operations',
      founder_wisdom: '00_executive_office'
    };
    captureData.department = domainToDept[aiResult.knowledge_domain] || '90_knowledge_library';

    const created = await base44.entities.KnowledgeCapture.create(captureData);

    return {
      capture_id: created.id || created._id,
      title: captureData.title,
      summary: captureData.summary,
      key_idea: captureData.key_idea,
      knowledge_domain: captureData.knowledge_domain,
      capture_type: captureData.capture_type,
      priority: captureData.priority,
      suggestions: {
        cross_links: aiResult.cross_links || [],
        learning_center_lesson: aiResult.learning_center_lesson || null,
        blog_post: aiResult.blog_post || null,
        sop: aiResult.sop || null,
        faq: aiResult.faq || null,
        document_type: aiResult.suggested_document_type || null,
        next_action: aiResult.suggested_next_action || null
      },
      status: 'needs_review',
      trigger: trigger,
      source_entity: source_entity_type ? `${source_entity_type}:${source_entity_id}` : null,
      created_at: new Date().toISOString()
    };

  } catch (error) {
    console.error('captureKnowledge error:', error);
    return {
      capture_id: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      trigger: trigger,
      status: 'failed',
      created_at: new Date().toISOString()
    };
  }
}
