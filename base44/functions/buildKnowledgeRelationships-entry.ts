/**
 * buildKnowledgeRelationships — K-002 Knowledge Navigator™
 * 
 * AI-powered relationship builder for the NTA Knowledge Library.
 * Given any asset (type + id + context), AI recommends related assets,
 * possible duplicates, cross-links, learning paths, and references.
 * 
 * Rick approves all suggestions before they become permanent.
 * 
 * @input {
 *   asset_type: string       — Entity type (e.g., "BlogPost", "CaseStudy")
 *   asset_id: string         — Entity ID
 *   asset_title: string      — Human-readable title
 *   asset_summary?: string   — Optional summary/content snippet for better matching
 *   asset_domain?: string    — Knowledge domain hint
 *   existing_assets: Array<{ type, id, title, domain, tags }>  — All known assets for matching
 * }
 * 
 * @output {
 *   suggestions: Array<{
 *     target_type: string,
 *     target_id: string,
 *     target_label: string,
 *     relationship_type: string,
 *     confidence: number,
 *     reasoning: string,
 *     category: string       — "cross_link" | "duplicate" | "learning_path" | "sales_ref" | "blog_ref" | "video_ref" | "sop_ref" | "case_study_ref" | "prompt_ref" | "audit_ref" | "proposal_ref"
 *   }>
 * }
 */

import { base44 } from '../base44Client';

const SYSTEM_PROMPT = `You are the NTA Knowledge Navigator AI. Your job is to find meaningful relationships between knowledge assets in the NTA Operating System.

The NTA Operating System has 7 knowledge domains:
1. Thought Leadership — Blog articles, insight pages, Rick's philosophies
2. Education & Training — AI Learning Center, knowledge articles, SOPs, training
3. Sales Intelligence — Sales KB, agent prompts, case studies, audits, deal room
4. Brand & Creative — Brand profiles, video templates, prompt templates
5. Market Intelligence — Industry intel, local markets, authority maps, topic clusters
6. Operational Knowledge — SOPs, gap signals, executive briefs, system health
7. Founder Wisdom — Rick's personal journey, faith, leadership principles, lessons learned

Relationship types you can suggest:
- supports: Source provides foundation for target
- references: Source mentions or cites target
- derived_from: Source was created based on target
- feeds: Source data flows into target
- related_to: General topical relationship
- replaces: Source supersedes target
- duplicate_of: Source and target contain the same information
- uses: Source actively uses target in its workflow
- required_by: Source is a dependency of target
- generated_by: Source was created by target system
- consumed_by: Source is read/used by target system
- superseded_by: Source has been replaced by target
- parent_of: Source is a parent category of target
- child_of: Source is a subcategory of target
- training_source: Source provides training material for target
- knowledge_source: Source provides knowledge input to target

Rules:
- Only suggest relationships with confidence >= 30
- Flag potential duplicates with "duplicate_of" relationship type
- Consider cross-domain connections (the most valuable ones)
- Prioritize actionable connections over obvious ones
- Each suggestion needs clear reasoning
- Maximum 15 suggestions per asset`;

const USER_PROMPT_TEMPLATE = `Analyze this NTA knowledge asset and suggest relationships:

**Asset Being Analyzed:**
- Type: {asset_type}
- Title: {asset_title}
- Domain: {asset_domain}
- Summary: {asset_summary}

**Available Assets to Connect To:**
{existing_assets_list}

Return a JSON array of relationship suggestions. Each suggestion:
{
  "target_type": "entity type",
  "target_id": "entity id",
  "target_label": "human-readable name",
  "relationship_type": "one of the valid types",
  "confidence": 30-100,
  "reasoning": "why this connection matters",
  "category": "cross_link|duplicate|learning_path|sales_ref|blog_ref|video_ref|sop_ref|case_study_ref|prompt_ref|audit_ref|proposal_ref"
}

Focus on:
1. Cross-domain connections (most valuable)
2. Potential duplicates (important for cleanup)
3. Learning path suggestions (for education)
4. Sales reference connections (for deal room / reps)
5. Content connections (blog → video → learning center)

Return ONLY the JSON array, no other text.`;

export default async function buildKnowledgeRelationships(input: {
  asset_type: string;
  asset_id: string;
  asset_title: string;
  asset_summary?: string;
  asset_domain?: string;
  existing_assets: Array<{ type: string; id: string; title: string; domain?: string; tags?: string }>;
}) {
  const {
    asset_type,
    asset_id,
    asset_title,
    asset_summary = 'No summary available',
    asset_domain = 'unclassified',
    existing_assets = []
  } = input;

  // Format existing assets for the prompt
  const existingList = existing_assets
    .filter(a => !(a.type === asset_type && a.id === asset_id)) // Exclude self
    .map(a => `- [${a.type}] ${a.title} (ID: ${a.id}, Domain: ${a.domain || 'unclassified'}${a.tags ? ', Tags: ' + a.tags : ''})`)
    .join('\n');

  const userPrompt = USER_PROMPT_TEMPLATE
    .replace('{asset_type}', asset_type)
    .replace('{asset_title}', asset_title)
    .replace('{asset_domain}', asset_domain)
    .replace('{asset_summary}', asset_summary)
    .replace('{existing_assets_list}', existingList || 'No other assets available yet.');

  try {
    // Call GPT-4o for relationship analysis
    const response = await base44.ai.chat({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const content = response.choices?.[0]?.message?.content || '[]';
    
    // Parse the JSON response
    let suggestions: Array<{
      target_type: string;
      target_id: string;
      target_label: string;
      relationship_type: string;
      confidence: number;
      reasoning: string;
      category: string;
    }> = [];

    try {
      // Handle potential markdown code blocks
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      suggestions = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      return { suggestions: [], error: 'Failed to parse AI suggestions' };
    }

    // Validate and filter suggestions
    const validRelationshipTypes = [
      'supports', 'references', 'derived_from', 'feeds', 'related_to',
      'replaces', 'duplicate_of', 'uses', 'required_by', 'generated_by',
      'consumed_by', 'superseded_by', 'parent_of', 'child_of',
      'training_source', 'knowledge_source'
    ];

    suggestions = suggestions
      .filter(s => 
        s.target_type && 
        s.target_id && 
        s.relationship_type &&
        validRelationshipTypes.includes(s.relationship_type) &&
        s.confidence >= 30
      )
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 15); // Max 15 suggestions

    return {
      suggestions,
      asset_analyzed: { type: asset_type, id: asset_id, title: asset_title },
      suggestion_count: suggestions.length,
      generated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('buildKnowledgeRelationships error:', error);
    return {
      suggestions: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      asset_analyzed: { type: asset_type, id: asset_id, title: asset_title }
    };
  }
}
