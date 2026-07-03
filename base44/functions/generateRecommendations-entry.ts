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
 *   5. Confidence filtering — remove recommendations below 50% threshold
 *   6. Deduplication and final ranking
 * 
 * Every recommendation includes:
 *   - Confidence score (0–100)
 *   - Human-readable reason
 *   - Related knowledge relationships
 *   - Suggested next action
 * 
 * Ranking priority (I-000 Intelligence Hierarchy):
 *   1. Context — who is using the system
 *   2. Current Task — what the user is trying to accomplish
 *   3. Business Type — industry-specific relevance
 *   4. Historical Success — what worked previously
 *   5. Knowledge Relationships — graph density supports relevance
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
const MIN_CONFIDENCE = 50; // Recommendations below this threshold are excluded

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

// Preferred domains per context — used as ranking boosts, NOT hard filters
const CONTEXT_DOMAIN_BOOSTS: Record<string, string[]> = {
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

// ── AI Ranking Prompt (I-000 Intelligence Hierarchy) ──

const RANKING_SYSTEM_PROMPT = `You are the NTA Intelligence Engine. Your job is to select the TOP recommendations from a list of candidate knowledge assets, based on the user's current context.

RANKING PRIORITIES — I-000 Intelligence Hierarchy (in strict order):
1. CONTEXT — Who is using the system? Match the user's role and department first.
2. CURRENT TASK — What is the user trying to accomplish RIGHT NOW? Assets that directly help with the current task rank highest.
3. BUSINESS TYPE — If an industry is specified, assets related to that industry rank higher. Generic assets rank lower when industry-specific alternatives exist.
4. HISTORICAL SUCCESS — Assets tied to completed projects, won deals, successful outcomes, or documented results rank higher than untested assets.
5. KNOWLEDGE RELATIONSHIPS — Assets with more verified connections to other assets are considered more valuable. Relationship density supports relevance but does not override context, task, or industry fit.

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
      relevance_score: number; // K-003 relevance score (0 if from graph)
      relationships: Array<{ type: string; connected_to: string; direction: 'source' | 'target' }>;
    }> = [];

    const seen = new Set<string>();

    // Fetch KnowledgeRelationship data ONCE — reused across steps 1a and 1c
    let cachedRelationships: any[] | null = null;
    const getRelationships = async () => {
      if (cachedRelationships !== null) return cachedRelationships;
      try {
        cachedRelationships = await base44.entities.KnowledgeRelationship.list({
          filter: { status: 'approved' },
          limit: 200,
        });
      } catch (e) {
        console.error('KnowledgeRelationship fetch failed:', e);
        cachedRelationships = [];
      }
      return cachedRelationships;
    };

    // Helper: collect relationships for a given asset
    const collectRelationships = (relationships: any[], assetType: string, assetId: string) => {
      const rels = relationships.filter((r: any) =>
        (r.source_type === assetType && r.source_id === assetId) ||
        (r.target_type === assetType && r.target_id === assetId)
      );
      return {
        count: rels.length,
        details: rels.slice(0, 5).map((r: any) => {
          const isSrc = r.source_type === assetType && r.source_id === assetId;
          return {
            type: r.relationship_type,
            connected_to: isSrc ? (r.target_label || r.target_id) : (r.source_label || r.source_id),
            direction: (isSrc ? 'source' : 'target') as 'source' | 'target',
          };
        }),
      };
    };

    // 1a. Graph-first: Find assets connected to the current asset
    if (current_asset_type && current_asset_id) {
      const relationships = await getRelationships();

      if (relationships.length > 0) {
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
            const { count, details } = collectRelationships(relationships, assetType, assetId);

            candidates.push({
              type: assetType,
              id: assetId,
              title: assetLabel || assetId,
              domain: rel.knowledge_domain || 'unclassified',
              snippet: rel.description || '',
              found_via: 'graph',
              relationship_count: count,
              relevance_score: 0,
              relationships: details,
            });
          }
        }
      }
    }

    // 1b. Knowledge Search API (K-003) — search ALL domains (no hard filter)
    try {
      const searchQuery = [
        context_description,
        business_type,
      ].filter(Boolean).join(' ');

      const searchResults = await base44.functions.searchKnowledge({
        query: searchQuery,
        context: `User context: ${context_type}. ${context_description}`,
        // No domain_filter — search all 7 domains for cross-domain discovery
        max_results: 10,
        include_relationships: true,
      });

      if (searchResults && searchResults.results) {
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
                relevance_score: item.relevance_score || 0,
                relationships: [],
              });
            }
          }
        }
      }
    } catch (searchError) {
      console.error('Knowledge search failed:', searchError);
    }

    // 1c. Enrich search results with relationship data (reuses cached fetch)
    if (candidates.some(c => c.found_via === 'search' && c.relationships.length === 0)) {
      const relationships = await getRelationships();

      if (relationships.length > 0) {
        for (const candidate of candidates) {
          if (candidate.relationships.length > 0) continue;
          const { count, details } = collectRelationships(relationships, candidate.type, candidate.id);
          candidate.relationship_count = count;
          candidate.relationships = details;
        }
      }
    }

    const totalCandidates = candidates.length;

    // ────────────────────────────────────────────
    // STEP 2: AI-powered ranking (I-000 hierarchy)
    // ────────────────────────────────────────────

    let recommendations: Recommendation[] = [];

    if (candidates.length > 0) {
      const preferredDomains = CONTEXT_DOMAIN_BOOSTS[context_type] || [];

      const candidateList = candidates
        .slice(0, 50) // Token budget limit
        .map((c, i) => {
          const typeLabel = ASSET_TYPE_LABELS[c.type] || c.type;
          const relInfo = c.relationship_count > 0
            ? ` | ${c.relationship_count} knowledge connections`
            : '';
          const domainBoost = preferredDomains.includes(c.domain) ? ' [preferred domain]' : '';
          const k003Score = c.relevance_score > 0 ? ` | K-003 relevance: ${c.relevance_score}` : '';
          return `${i}. [${typeLabel}] "${c.title}" (Domain: ${c.domain}${domainBoost}${relInfo}${k003Score}) — ${c.snippet.substring(0, 200)}`;
        })
        .join('\n');

      const userPrompt = `CURRENT CONTEXT:
- Context type: ${context_type}
- What the user is doing: ${context_description}
${business_type ? `- Business/industry: ${business_type}` : ''}
${lead_id ? `- Working with lead ID: ${lead_id}` : ''}
${current_asset_type ? `- Currently viewing: ${ASSET_TYPE_LABELS[current_asset_type] || current_asset_type}` : ''}
- Preferred domains for this context: ${preferredDomains.join(', ') || 'none'}

SELECT THE TOP ${limit} RECOMMENDATIONS from these ${candidates.length} candidates:

${candidateList}

Return exactly ${limit} recommendations (or fewer if quality candidates are limited).
Remember: Context and current task relevance rank ABOVE relationship count. Preferred domains get a boost but do not exclude other domains.`;

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

        // Heuristic fallback: I-000 hierarchy scoring
        // Context + Task (already filtered by K-003 search relevance)
        // Business Type → Domain boost → Historical (N/A in v1) → Relationships
        const scored = candidates.map(c => {
          let score = 50; // Base score (at minimum threshold)
          // K-003 relevance score as primary signal (context + task relevance)
          if (c.relevance_score > 0) score += Math.min(20, c.relevance_score * 2);
          // Domain preference boost (business type proxy)
          if (preferredDomains.includes(c.domain)) score += 10;
          // Knowledge relationship density (Level 5 — supporting signal)
          score += Math.min(15, c.relationship_count * 3);
          // Graph-connected assets get a small boost
          if (c.found_via === 'graph') score += 5;
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
              : `Matches your current ${context_type} context in the ${c.domain.replace(/_/g, ' ')} domain.`,
            domain: c.domain,
            found_via: c.found_via,
            relationships: c.relationships,
            suggested_action: ACTION_MAP[c.type] || 'Review this asset',
          });
        }
      }
    }

    // ────────────────────────────────────────────
    // STEP 3: Confidence threshold filter
    // ────────────────────────────────────────────
    // Remove any recommendations below the minimum confidence threshold.
    // This applies to both AI-ranked and heuristic-scored results.
    recommendations = recommendations.filter(r => r.confidence >= MIN_CONFIDENCE);

    // Re-rank after filtering (ranks must be sequential 1..N)
    recommendations.forEach((r, i) => { r.rank = i + 1; });

    // ────────────────────────────────────────────
    // STEP 4: Return structured output
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
