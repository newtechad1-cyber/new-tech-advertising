/**
 * generateRecommendations — I-001 Recommendation Engine v1.0
 * 
 * The first production intelligence module of the NTA Operating System.
 * Returns the top 5 most relevant knowledge assets for the user's current context.
 * 
 * Architecture (per I-000 Intelligence Framework):
 *   1. Context analysis — understand what the user is doing
 *   2. Graph traversal — query KnowledgeRelationship for connected assets
 *   3. Knowledge search — call K-003 searchKnowledge for semantic matches
 *   4. AI ranking — GPT-4o scores and explains each candidate
 *   5. Deduplication and final ranking
 * 
 * Every recommendation includes:
 *   - Confidence score (0–100)
 *   - Human-readable reason
 *   - Related knowledge relationships
 *   - Suggested next action
 * 
 * Ranking priority (I-000 Intelligence Hierarchy):
 *   1. Current user context
 *   2. Knowledge relationships (graph density)
 *   3. Business type / industry
 *   4. Historical success signals
 *   5. Confidence score
 * 
 * @input {
 *   context_type: "sales" | "discovery" | "knowledge" | "executive" | "general"
 *   context_description: string        — What the user is doing right now
 *   business_type?: string             — Industry / vertical (e.g. "HVAC", "restaurant")
 *   lead_id?: string                   — SalesLead ID if in a sales context
 *   current_asset_type?: string        — If viewing a specific asset, its type
 *   current_asset_id?: string          — If viewing a specific asset, its ID
 *   max_results?: number               — How many recommendations (default 5, max 10)
 * }
 * 
 * @output {
 *   recommendations: Array<Recommendation>,
 *   context_analyzed: string,
 *   engine_version: "1.0",
 *   generated_at: string,
 *   search_method: string,
 *   total_candidates_evaluated: number
 * }
 */

import { base44 } from '../base44Client';

// ── Types ──

interface RecommendationInput {
  context_type: 'sales' | 'discovery' | 'knowledge' | 'executive' | 'general';
  context_description: string;
  business_type?: string;
  lead_id?: string;
  current_asset_type?: string;
  current_asset_id?: string;
  max_results?: number;
}

interface Recommendation {
  rank: number;
  asset_type: string;
  asset_id: string;
  title: string;
  confidence: number;
  reason: string;
  domain: string;
  found_via: 'graph' | 'search' | 'ai_ranked';
  relationships: Array<{
    type: string;
    connected_to: string;
    direction: 'source' | 'target';
  }>;
  suggested_action: string;
  tags?: string;
}

// ── Constants ──

const ENGINE_VERSION = '1.0';

const ASSET_TYPE_LABELS: Record<string, string> = {
  BlogPost: 'Blog Article',
  KnowledgeArticle: 'Learning Center Article',
  KnowledgeCapture: 'Knowledge Capture',
  CaseStudy: 'Case Study',
  GapAudit: 'AI Visibility Audit',
  DiscoveryCall: 'Discovery Call',
  SalesKnowledgeBase: 'Sales Knowledge',
  SalesAgentPrompts: 'Sales Script',
  SOPWorkflow: 'Standard Operating Procedure',
  ChatbotKnowledge: 'Chatbot Knowledge',
  BrandDNA: 'Brand DNA',
  BrandProfile: 'Brand Profile',
  VideoTemplate: 'Video Template',
  VideoScript: 'Video Script',
  AIPromptTemplates: 'AI Prompt Template',
  TopicCluster: 'Topic Cluster',
  IndustryIntel: 'Industry Intelligence',
  LocalMarketIntel: 'Local Market Intel',
  AuthorityMap: 'Authority Map',
  AuthorityPlan: 'Authority Plan',
  ExecutiveBrief: 'Executive Brief',
  KnowledgeGapSignal: 'Knowledge Gap Signal',
  TrainingProgressProfile: 'Training Progress',
  InsightPage: 'Insight Page',
  ProofAsset: 'Proof Asset',
};

const CONTEXT_DOMAIN_WEIGHTS: Record<string, string[]> = {
  sales: ['sales_intelligence', 'market_intelligence', 'brand_creative'],
  discovery: ['sales_intelligence', 'education_training', 'founder_wisdom'],
  knowledge: ['education_training', 'thought_leadership', 'operational_knowledge'],
  executive: ['operational_knowledge', 'market_intelligence', 'sales_intelligence'],
  general: ['thought_leadership', 'education_training', 'sales_intelligence'],
};

const ACTION_MAP: Record<string, string> = {
  BlogPost: 'Read this article for relevant insights',
  KnowledgeArticle: 'Review this training material',
  KnowledgeCapture: 'Review this captured knowledge',
  CaseStudy: 'Use this case study as a reference',
  GapAudit: 'Review audit findings for similar businesses',
  DiscoveryCall: 'Review notes from this similar call',
  SalesKnowledgeBase: 'Use these talking points in your conversation',
  SalesAgentPrompts: 'Use this script as a conversation guide',
  SOPWorkflow: 'Follow this standard procedure',
  VideoTemplate: 'Use this template for video content',
  AIPromptTemplates: 'Apply this prompt for AI assistance',
  IndustryIntel: 'Review industry data before the conversation',
  LocalMarketIntel: 'Check local market conditions',
  AuthorityPlan: 'Reference this authority building plan',
  ExecutiveBrief: 'Review the executive summary',
  BrandDNA: 'Reference brand guidelines',
  TopicCluster: 'Explore related content topics',
};

// ── AI Ranking Prompt ──

const RANKING_SYSTEM_PROMPT = `You are the NTA Intelligence Engine. Your job is to select the TOP recommendations from a list of candidate knowledge assets, based on the user's current context.

RANKING PRIORITIES (in order):
1. CONTEXT RELEVANCE — How directly does this asset help with what the user is doing RIGHT NOW?
2. KNOWLEDGE RELATIONSHIPS — Assets with more verified connections to other assets are more valuable.
3. BUSINESS TYPE — If an industry is specified, assets related to that industry rank higher.
4. HISTORICAL SUCCESS — Assets tied to completed projects, won deals, or successful outcomes rank higher.
5. CONFIDENCE — Higher confidence scores break ties.

RULES:
- Select exactly the number of recommendations requested (or fewer if not enough quality candidates).
- Every recommendation MUST include a clear, specific reason explaining WHY it's relevant to the user's current context.
- Reasons should be 1-2 sentences, written for a busy CEO.
- Suggest a concrete next action for each recommendation.
- Confidence scores: 90-100 = directly relevant, 70-89 = strongly related, 50-69 = useful context, below 50 = don't include.
- Cross-domain recommendations are often the most valuable — don't stay in one silo.

Return ONLY a JSON array:
[{
  "index": 0,
  "confidence": 85,
  "reason": "Why this is relevant to the user's current task",
  "suggested_action": "What the user should do with this asset"
}]`;

// ── Main Function ──

export default async function generateRecommendations(input: RecommendationInput) {
  const {
    context_type,
    context_description,
    business_type = '',
    lead_id = '',
    current_asset_type = '',
    current_asset_id = '',
    max_results = 5,
  } = input;

  const limit = Math.min(max_results, 10);

  try {
    // ────────────────────────────────────────────
    // STEP 1: Gather candidates from multiple sources
    // ────────────────────────────────────────────

    const candidates: Array<{
      type: string;
      id: string;
      title: string;
      domain: string;
      snippet: string;
      found_via: 'graph' | 'search';
      relationship_count: number;
      relationships: Array<{ type: string; connected_to: string; direction: 'source' | 'target' }>;
    }> = [];

    const seen = new Set<string>();

    // 1a. Graph-first: Find assets connected to the current asset
    if (current_asset_type && current_asset_id) {
      try {
        const relationships = await base44.entities.KnowledgeRelationship.list({
          filter: { status: 'approved' },
          limit: 200,
        });

        if (relationships && relationships.length > 0) {
          // Find all relationships involving the current asset
          const directConnections = relationships.filter((rel: any) =>
            (rel.source_type === current_asset_type && rel.source_id === current_asset_id) ||
            (rel.target_type === current_asset_type && rel.target_id === current_asset_id)
          );

          for (const rel of directConnections) {
            const isSource = rel.source_type === current_asset_type && rel.source_id === current_asset_id;
            const assetType = isSource ? rel.target_type : rel.source_type;
            const assetId = isSource ? rel.target_id : rel.source_id;
            const assetLabel = isSource ? rel.target_label : rel.source_label;
            const key = `${assetType}:${assetId}`;

            if (!seen.has(key)) {
              seen.add(key);

              // Count total relationships for this asset (graph density)
              const relCount = relationships.filter((r: any) =>
                (r.source_type === assetType && r.source_id === assetId) ||
                (r.target_type === assetType && r.target_id === assetId)
              ).length;

              // Collect all relationships for this asset
              const assetRels = relationships
                .filter((r: any) =>
                  (r.source_type === assetType && r.source_id === assetId) ||
                  (r.target_type === assetType && r.target_id === assetId)
                )
                .slice(0, 5)
                .map((r: any) => {
                  const isSrc = r.source_type === assetType && r.source_id === assetId;
                  return {
                    type: r.relationship_type,
                    connected_to: isSrc ? (r.target_label || r.target_id) : (r.source_label || r.source_id),
                    direction: (isSrc ? 'source' : 'target') as 'source' | 'target',
                  };
                });

              candidates.push({
                type: assetType,
                id: assetId,
                title: assetLabel || assetId,
                domain: rel.knowledge_domain || 'unclassified',
                snippet: rel.description || '',
                found_via: 'graph',
                relationship_count: relCount,
                relationships: assetRels,
              });
            }
          }
        }
      } catch (graphError) {
        console.error('Graph traversal failed:', graphError);
      }
    }

    // 1b. Knowledge Search API (K-003) for semantic matches
    try {
      const preferredDomains = CONTEXT_DOMAIN_WEIGHTS[context_type] || [];

      const searchQuery = [
        context_description,
        business_type,
      ].filter(Boolean).join(' ');

      const searchResults = await base44.functions.searchKnowledge({
        query: searchQuery,
        context: `User context: ${context_type}. ${context_description}`,
        domain_filter: preferredDomains.length > 0 ? preferredDomains : undefined,
        max_results: 10,
        include_relationships: true,
      });

      if (searchResults && searchResults.results) {
        // Flatten all category results
        for (const [_category, items] of Object.entries(searchResults.results)) {
          if (!Array.isArray(items)) continue;
          for (const item of items as any[]) {
            const key = `${item.type}:${item.id}`;
            if (!seen.has(key) && item.id) {
              seen.add(key);
              candidates.push({
                type: item.type,
                id: item.id,
                title: item.title || 'Untitled',
                domain: item.domain || 'unclassified',
                snippet: item.summary || '',
                found_via: 'search',
                relationship_count: 0,
                relationships: [],
              });
            }
          }
        }
      }
    } catch (searchError) {
      console.error('Knowledge search failed:', searchError);
    }

    // 1c. Enrich search results with relationship data
    if (candidates.some(c => c.found_via === 'search' && c.relationships.length === 0)) {
      try {
        const allRelationships = await base44.entities.KnowledgeRelationship.list({
          filter: { status: 'approved' },
          limit: 200,
        });

        if (allRelationships && allRelationships.length > 0) {
          for (const candidate of candidates) {
            if (candidate.relationships.length > 0) continue;

            const rels = allRelationships.filter((r: any) =>
              (r.source_type === candidate.type && r.source_id === candidate.id) ||
              (r.target_type === candidate.type && r.target_id === candidate.id)
            );

            candidate.relationship_count = rels.length;
            candidate.relationships = rels.slice(0, 5).map((r: any) => {
              const isSrc = r.source_type === candidate.type && r.source_id === candidate.id;
              return {
                type: r.relationship_type,
                connected_to: isSrc ? (r.target_label || r.target_id) : (r.source_label || r.source_id),
                direction: (isSrc ? 'source' : 'target') as 'source' | 'target',
              };
            });
          }
        }
      } catch (e) {
        console.error('Relationship enrichment failed:', e);
      }
    }

    const totalCandidates = candidates.length;

    // ────────────────────────────────────────────
    // STEP 2: AI-powered ranking
    // ────────────────────────────────────────────

    let recommendations: Recommendation[] = [];

    if (candidates.length > 0) {
      const candidateList = candidates
        .slice(0, 50) // Token budget limit
        .map((c, i) => {
          const typeLabel = ASSET_TYPE_LABELS[c.type] || c.type;
          const relInfo = c.relationship_count > 0
            ? ` | ${c.relationship_count} knowledge connections`
            : '';
          return `${i}. [${typeLabel}] "${c.title}" (Domain: ${c.domain}${relInfo}) — ${c.snippet.substring(0, 200)}`;
        })
        .join('\n');

      const userPrompt = `CURRENT CONTEXT:
- Context type: ${context_type}
- What the user is doing: ${context_description}
${business_type ? `- Business/industry: ${business_type}` : ''}
${lead_id ? `- Working with lead ID: ${lead_id}` : ''}
${current_asset_type ? `- Currently viewing: ${ASSET_TYPE_LABELS[current_asset_type] || current_asset_type}` : ''}

SELECT THE TOP ${limit} RECOMMENDATIONS from these ${candidates.length} candidates:

${candidateList}

Return exactly ${limit} recommendations (or fewer if quality candidates are limited).`;

      try {
        const response = await base44.ai.chat({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: RANKING_SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.2,
          max_tokens: 2000,
        });

        const content = response.choices?.[0]?.message?.content || '[]';
        const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const rankings = JSON.parse(cleaned);

        for (let rank = 0; rank < rankings.length; rank++) {
          const r = rankings[rank];
          const candidate = candidates[r.index];
          if (!candidate) continue;

          recommendations.push({
            rank: rank + 1,
            asset_type: candidate.type,
            asset_id: candidate.id,
            title: candidate.title,
            confidence: r.confidence,
            reason: r.reason,
            domain: candidate.domain,
            found_via: candidate.found_via === 'graph' ? 'graph' : 'ai_ranked',
            relationships: candidate.relationships,
            suggested_action: r.suggested_action || ACTION_MAP[candidate.type] || 'Review this asset',
            tags: undefined,
          });
        }
      } catch (aiError) {
        console.error('AI ranking failed, using heuristic fallback:', aiError);

        // Heuristic fallback: score by relationship count + domain relevance
        const preferredDomains = CONTEXT_DOMAIN_WEIGHTS[context_type] || [];

        const scored = candidates.map(c => {
          let score = 40; // Base score
          score += Math.min(30, c.relationship_count * 5); // Graph density bonus
          if (preferredDomains.includes(c.domain)) score += 15; // Domain relevance
          if (c.found_via === 'graph') score += 10; // Direct connection bonus
          return { ...c, score: Math.min(100, score) };
        });

        scored.sort((a, b) => b.score - a.score);

        for (let i = 0; i < Math.min(limit, scored.length); i++) {
          const c = scored[i];
          recommendations.push({
            rank: i + 1,
            asset_type: c.type,
            asset_id: c.id,
            title: c.title,
            confidence: c.score,
            reason: c.found_via === 'graph'
              ? `Directly connected to your current asset via the knowledge graph (${c.relationship_count} connections).`
              : `Matches your current context in the ${c.domain.replace(/_/g, ' ')} domain.`,
            domain: c.domain,
            found_via: c.found_via,
            relationships: c.relationships,
            suggested_action: ACTION_MAP[c.type] || 'Review this asset',
          });
        }
      }
    }

    // ────────────────────────────────────────────
    // STEP 3: Return structured output
    // ────────────────────────────────────────────

    return {
      recommendations,
      context_analyzed: `${context_type}: ${context_description}`,
      engine_version: ENGINE_VERSION,
      generated_at: new Date().toISOString(),
      search_method: candidates.some(c => c.found_via === 'graph') ? 'graph_and_search' : 'search_only',
      total_candidates_evaluated: totalCandidates,
    };

  } catch (error) {
    console.error('generateRecommendations error:', error);
    return {
      recommendations: [],
      context_analyzed: `${context_type}: ${context_description}`,
      engine_version: ENGINE_VERSION,
      generated_at: new Date().toISOString(),
      search_method: 'error',
      total_candidates_evaluated: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
