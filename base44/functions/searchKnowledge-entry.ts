/**
 * searchKnowledge — K-003 Knowledge Search API
 * 
 * The Intelligence Layer's core service. Every part of the NTA Operating System
 * can call this to retrieve relevant knowledge before creating anything new.
 * 
 * Architecture Rule: Search existing knowledge FIRST. Only create new assets if necessary.
 * 
 * Uses KnowledgeRelationship graph BEFORE keyword search.
 * Goal: Semantic knowledge retrieval across all 7 domains.
 * 
 * @input {
 *   query: string              — Natural language search query
 *   context?: string           — Additional context (e.g., "preparing for sales call")
 *   domain_filter?: string[]   — Filter to specific knowledge domains
 *   asset_types?: string[]     — Filter to specific asset types
 *   lead_id?: string           — If searching for a specific lead, include industry/context
 *   max_results?: number       — Maximum results per category (default 5)
 *   include_relationships?: boolean — Whether to traverse KnowledgeRelationship graph (default true)
 * }
 * 
 * @output {
 *   results: {
 *     k_series: Array<KnowledgeResult>,
 *     blog_articles: Array<KnowledgeResult>,
 *     learning_center: Array<KnowledgeResult>,
 *     discovery_questions: Array<KnowledgeResult>,
 *     gap_audit_recommendations: Array<KnowledgeResult>,
 *     case_studies: Array<KnowledgeResult>,
 *     videos: Array<KnowledgeResult>,
 *     prompt_templates: Array<KnowledgeResult>,
 *     sops: Array<KnowledgeResult>,
 *     founder_wisdom: Array<KnowledgeResult>,
 *     related_via_graph: Array<KnowledgeResult>
 *   },
 *   total_results: number,
 *   search_method: "graph_first" | "keyword_only",
 *   domains_searched: string[],
 *   generated_at: string
 * }
 */

import { base44 } from '../base44Client';

// ── Types ──

interface KnowledgeResult {
  type: string;
  id: string;
  title: string;
  summary: string;
  relevance_score: number;
  domain: string;
  found_via: 'graph' | 'keyword' | 'ai_match';
  relationship_path?: string;
  tags?: string;
}

interface SearchInput {
  query: string;
  context?: string;
  domain_filter?: string[];
  asset_types?: string[];
  lead_id?: string;
  max_results?: number;
  include_relationships?: boolean;
}

// ── Knowledge Domain Mapping ──

const DOMAIN_ENTITY_MAP: Record<string, string[]> = {
  thought_leadership: ['BlogPost', 'InsightPage'],
  education_training: ['KnowledgeArticle', 'ChatbotKnowledge', 'TrainingProgressProfile'],
  sales_intelligence: ['SalesKnowledgeBase', 'SalesAgentPrompts', 'CaseStudy', 'GapAudit', 'DiscoveryCall', 'NtaProposal'],
  brand_creative: ['BrandDNA', 'BrandProfile', 'VideoTemplate', 'VideoScript'],
  market_intelligence: ['IndustryIntel', 'LocalMarketIntel', 'AuthorityMap', 'AuthorityPlan', 'TopicCluster'],
  operational_knowledge: ['SOPWorkflow', 'KnowledgeGapSignal', 'ExecutiveBrief'],
  founder_wisdom: ['KnowledgeCapture']
};

// ── AI System Prompt ──

const SEARCH_SYSTEM_PROMPT = `You are the NTA Knowledge Search AI. Given a search query and a list of knowledge assets, rank them by relevance.

For each asset, return:
- id: the asset's ID
- relevance_score: 0-100 (how relevant to the query)
- summary: 1-2 sentence explanation of why this is relevant

Rules:
- Only include assets with relevance_score >= 40
- Consider semantic meaning, not just keyword matches
- Cross-domain connections are often the most valuable
- Industry context matters (e.g., "HVAC" should match plumbing/trades content too)
- Prioritize actionable knowledge over general information

Return ONLY a JSON array, no other text.`;

// ── Main Function ──

export default async function searchKnowledge(input: SearchInput) {
  const {
    query,
    context = '',
    domain_filter = [],
    asset_types = [],
    max_results = 5,
    include_relationships = true
  } = input;

  const allResults: Record<string, KnowledgeResult[]> = {
    k_series: [],
    blog_articles: [],
    learning_center: [],
    discovery_questions: [],
    gap_audit_recommendations: [],
    case_studies: [],
    videos: [],
    prompt_templates: [],
    sops: [],
    founder_wisdom: [],
    related_via_graph: []
  };

  let searchMethod: 'graph_first' | 'keyword_only' = 'keyword_only';
  const domainsSearched: string[] = [];

  try {
    // ────────────────────────────────────────────
    // STEP 1: Graph-first search via KnowledgeRelationship
    // ────────────────────────────────────────────
    if (include_relationships) {
      try {
        const relationships = await base44.entities.KnowledgeRelationship.list({
          filter: { status: 'approved' },
          limit: 200
        });

        if (relationships && relationships.length > 0) {
          searchMethod = 'graph_first';

          // Find relationships where source or target labels match query terms
          const queryTerms = query.toLowerCase().split(/\s+/);
          const graphMatches = relationships.filter((rel: any) => {
            const searchText = [
              rel.source_label, rel.target_label,
              rel.description, rel.tags
            ].filter(Boolean).join(' ').toLowerCase();

            return queryTerms.some(term => searchText.includes(term));
          });

          // Traverse graph: for each match, include both source and target
          for (const match of graphMatches.slice(0, max_results * 2)) {
            allResults.related_via_graph.push({
              type: match.source_type,
              id: match.source_id,
              title: match.source_label || match.source_id,
              summary: `Connected via "${match.relationship_type}" relationship: ${match.description || ''}`,
              relevance_score: match.confidence || 50,
              domain: match.knowledge_domain || 'unclassified',
              found_via: 'graph',
              relationship_path: `${match.source_label} → ${match.relationship_type} → ${match.target_label}`
            });

            allResults.related_via_graph.push({
              type: match.target_type,
              id: match.target_id,
              title: match.target_label || match.target_id,
              summary: `Connected via "${match.relationship_type}" relationship: ${match.description || ''}`,
              relevance_score: match.confidence || 50,
              domain: match.knowledge_domain || 'unclassified',
              found_via: 'graph',
              relationship_path: `${match.source_label} → ${match.relationship_type} → ${match.target_label}`
            });
          }

          // Deduplicate graph results
          const seen = new Set<string>();
          allResults.related_via_graph = allResults.related_via_graph.filter(r => {
            const key = `${r.type}:${r.id}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          }).slice(0, max_results);
        }
      } catch (graphError) {
        console.error('Graph search failed, falling back to keyword:', graphError);
      }
    }

    // ────────────────────────────────────────────
    // STEP 2: Entity-type keyword + AI search
    // ────────────────────────────────────────────

    // Determine which domains to search
    const domains = domain_filter.length > 0
      ? domain_filter
      : Object.keys(DOMAIN_ENTITY_MAP);

    for (const domain of domains) {
      domainsSearched.push(domain);
    }

    // Build a combined asset list for AI ranking
    const allAssets: Array<{ type: string; id: string; title: string; domain: string; snippet: string }> = [];

    // Query each relevant entity type
    const entityQueries = [
      { key: 'blog_articles', entity: 'BlogPost', titleField: 'title', summaryField: 'excerpt', domain: 'thought_leadership' },
      { key: 'learning_center', entity: 'KnowledgeArticle', titleField: 'title', summaryField: 'content', domain: 'education_training' },
      { key: 'case_studies', entity: 'CaseStudy', titleField: 'title', summaryField: 'summary', domain: 'sales_intelligence' },
      { key: 'gap_audit_recommendations', entity: 'GapAudit', titleField: 'business_name', summaryField: 'website_visibility_detail', domain: 'sales_intelligence' },
      { key: 'discovery_questions', entity: 'DiscoveryCall', titleField: 'lead_name', summaryField: 'ai_summary', domain: 'sales_intelligence' },
      { key: 'prompt_templates', entity: 'AIPromptTemplates', titleField: 'name', summaryField: 'description', domain: 'brand_creative' },
      { key: 'sops', entity: 'SOPWorkflow', titleField: 'title', summaryField: 'description', domain: 'operational_knowledge' },
      { key: 'videos', entity: 'VideoTemplate', titleField: 'name', summaryField: 'description', domain: 'brand_creative' },
      { key: 'founder_wisdom', entity: 'KnowledgeCapture', titleField: 'title', summaryField: 'summary', domain: 'founder_wisdom' },
      { key: 'k_series', entity: 'SalesKnowledgeBase', titleField: 'title', summaryField: 'content', domain: 'sales_intelligence' }
    ];

    // Filter by domain if specified
    const filteredQueries = domain_filter.length > 0
      ? entityQueries.filter(q => domain_filter.includes(q.domain))
      : entityQueries;

    // Filter by asset type if specified
    const finalQueries = asset_types.length > 0
      ? filteredQueries.filter(q => asset_types.includes(q.entity))
      : filteredQueries;

    // Fetch all entity data in parallel
    const queryPromises = finalQueries.map(async (q) => {
      try {
        const entities = await base44.entities[q.entity].list({ limit: 50 });
        if (entities && entities.length > 0) {
          for (const entity of entities) {
            const title = entity[q.titleField] || entity.title || entity.name || 'Untitled';
            const snippet = entity[q.summaryField] || entity.description || entity.summary || '';
            allAssets.push({
              type: q.entity,
              id: entity.id || entity._id || '',
              title: String(title).substring(0, 200),
              domain: q.domain,
              snippet: String(snippet).substring(0, 300)
            });
          }
        }
      } catch (e) {
        console.error(`Failed to query ${q.entity}:`, e);
      }
    });

    await Promise.all(queryPromises);

    // ────────────────────────────────────────────
    // STEP 3: AI-powered relevance ranking
    // ────────────────────────────────────────────

    if (allAssets.length > 0) {
      const assetList = allAssets
        .slice(0, 100) // Limit to 100 for token budget
        .map((a, i) => `${i}. [${a.type}] "${a.title}" (ID: ${a.id}, Domain: ${a.domain}) — ${a.snippet.substring(0, 150)}`)
        .join('\n');

      const userPrompt = `Search Query: "${query}"${context ? `\nContext: ${context}` : ''}

Assets to rank:
${assetList}

Return a JSON array of relevant assets:
[{"index": 0, "relevance_score": 85, "summary": "why this is relevant"}]`;

      try {
        const response = await base44.ai.chat({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: SEARCH_SYSTEM_PROMPT },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.2,
          max_tokens: 2000
        });

        const content = response.choices?.[0]?.message?.content || '[]';
        const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const rankings = JSON.parse(cleaned);

        // Map rankings back to results
        for (const rank of rankings) {
          const asset = allAssets[rank.index];
          if (!asset) continue;

          const result: KnowledgeResult = {
            type: asset.type,
            id: asset.id,
            title: asset.title,
            summary: rank.summary || asset.snippet.substring(0, 200),
            relevance_score: rank.relevance_score,
            domain: asset.domain,
            found_via: 'ai_match'
          };

          // Route to correct category
          const categoryMap: Record<string, string> = {
            BlogPost: 'blog_articles',
            KnowledgeArticle: 'learning_center',
            CaseStudy: 'case_studies',
            GapAudit: 'gap_audit_recommendations',
            DiscoveryCall: 'discovery_questions',
            AIPromptTemplates: 'prompt_templates',
            SOPWorkflow: 'sops',
            VideoTemplate: 'videos',
            KnowledgeCapture: 'founder_wisdom',
            SalesKnowledgeBase: 'k_series'
          };

          const category = categoryMap[asset.type] || 'k_series';
          if (allResults[category]) {
            allResults[category].push(result);
          }
        }
      } catch (aiError) {
        console.error('AI ranking failed, using keyword fallback:', aiError);

        // Keyword fallback: simple term matching
        const terms = query.toLowerCase().split(/\s+/);
        for (const asset of allAssets) {
          const text = `${asset.title} ${asset.snippet}`.toLowerCase();
          const matchCount = terms.filter(t => text.includes(t)).length;
          if (matchCount > 0) {
            const score = Math.min(90, (matchCount / terms.length) * 80 + 10);
            const categoryMap: Record<string, string> = {
              BlogPost: 'blog_articles',
              KnowledgeArticle: 'learning_center',
              CaseStudy: 'case_studies',
              GapAudit: 'gap_audit_recommendations',
              DiscoveryCall: 'discovery_questions',
              AIPromptTemplates: 'prompt_templates',
              SOPWorkflow: 'sops',
              VideoTemplate: 'videos',
              KnowledgeCapture: 'founder_wisdom',
              SalesKnowledgeBase: 'k_series'
            };
            const category = categoryMap[asset.type] || 'k_series';
            if (allResults[category]) {
              allResults[category].push({
                type: asset.type,
                id: asset.id,
                title: asset.title,
                summary: asset.snippet.substring(0, 200),
                relevance_score: score,
                domain: asset.domain,
                found_via: 'keyword'
              });
            }
          }
        }
      }
    }

    // ────────────────────────────────────────────
    // STEP 4: Sort and limit results per category
    // ────────────────────────────────────────────

    let totalResults = 0;
    for (const key of Object.keys(allResults)) {
      allResults[key] = allResults[key]
        .sort((a, b) => b.relevance_score - a.relevance_score)
        .slice(0, max_results);
      totalResults += allResults[key].length;
    }

    return {
      results: allResults,
      total_results: totalResults,
      search_method: searchMethod,
      query_analyzed: query,
      context: context || null,
      domains_searched: domainsSearched,
      generated_at: new Date().toISOString()
    };

  } catch (error) {
    console.error('searchKnowledge error:', error);
    return {
      results: allResults,
      total_results: 0,
      search_method: 'keyword_only' as const,
      query_analyzed: query,
      error: error instanceof Error ? error.message : 'Unknown error',
      domains_searched: domainsSearched,
      generated_at: new Date().toISOString()
    };
  }
}
