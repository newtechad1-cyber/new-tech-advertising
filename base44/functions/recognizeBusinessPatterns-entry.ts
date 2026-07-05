/**
 * recognizeBusinessPatterns — I-002 Business Pattern Recognition v1.0
 * 
 * Identifies similarities between the current business/prospect/client context
 * and prior knowledge assets, industries, audits, discovery calls, and
 * successful recommendations.
 * 
 * V1 uses structured pattern matching, K-003 search, KnowledgeRelationship
 * data, and explainable scoring. No advanced ML.
 * 
 * Architecture (per I-000 Intelligence Framework):
 *   1. Context normalization — parse business inputs into searchable signals
 *   2. Pattern matching — query K-003 + entities for similar businesses
 *   3. Graph enrichment — traverse KnowledgeRelationship for deeper patterns
 *   4. AI analysis — GPT-4o explains patterns and generates follow-up questions
 *   5. Confidence filtering — remove patterns below 50% threshold
 * 
 * Ranking priority (I-000 Intelligence Hierarchy):
 *   1. Context — who is using the system
 *   2. Current Task — what the user is trying to accomplish
 *   3. Business Type — industry-specific pattern matches
 *   4. Historical Success — patterns from completed projects and won deals
 *   5. Knowledge Relationships — graph density supports relevance
 * 
 * @input {
 *   business_name?: string
 *   business_type?: string
 *   industry?: string
 *   location?: string
 *   website_url?: string
 *   current_challenge?: string
 *   context_description?: string
 * }
 * 
 * @output {
 *   patterns: Array<BusinessPattern>,
 *   context_analyzed: string,
 *   engine_version: "1.0",
 *   generated_at: string,
 *   total_signals_evaluated: number,
 *   follow_up_questions: string[]
 * }
 */

import { base44 } from '../base44Client';

// ── Types ──

interface PatternInput {
  business_name?: string;
  business_type?: string;
  industry?: string;
  location?: string;
  website_url?: string;
  current_challenge?: string;
  context_description?: string;
}

interface BusinessPattern {
  rank: number;
  pattern_type: string;
  title: string;
  confidence: number;
  reason: string;
  related_assets: Array<{
    type: string;
    id: string;
    title: string;
    relevance: string;
  }>;
  suggested_action: string;
  source: 'industry_match' | 'audit_similarity' | 'knowledge_graph' | 'challenge_match' | 'ai_analyzed';
}

// ── Constants ──

const ENGINE_VERSION = '1.0';
const MIN_CONFIDENCE = 50;

const PATTERN_TYPES = {
  INDUSTRY_SIMILARITY: 'Industry Similarity',
  CHALLENGE_PATTERN: 'Common Challenge Pattern',
  AUDIT_PATTERN: 'Audit Similarity Pattern',
  SERVICE_FIT: 'Service Fit Pattern',
  GROWTH_STAGE: 'Growth Stage Pattern',
  LOCAL_MARKET: 'Local Market Pattern',
  KNOWLEDGE_CLUSTER: 'Knowledge Cluster',
  SUCCESS_PATTERN: 'Success Pattern',
};

// ── AI Prompt ──

const PATTERN_ANALYSIS_PROMPT = `You are the NTA Business Pattern Recognition Engine. Your job is to analyze business signals and identify the most valuable patterns from the available data.

RANKING PRIORITIES — I-000 Intelligence Hierarchy (strict order):
1. CONTEXT — What department is using this? Sales prep, discovery, executive review?
2. CURRENT TASK — What is the user trying to accomplish with this business?
3. BUSINESS TYPE — Industry-specific patterns from similar businesses.
4. HISTORICAL SUCCESS — Patterns from completed projects, won deals, successful audits.
5. KNOWLEDGE RELATIONSHIPS — Assets connected through the knowledge graph.

PATTERN TYPES to look for:
- Industry Similarity: This business matches a known industry vertical we have intel on.
- Common Challenge Pattern: The stated challenge matches problems we've solved before.
- Audit Similarity: The business profile matches prior audits with known outcomes.
- Service Fit: Business signals suggest specific NTA services would be valuable.
- Growth Stage: The business appears to be at a recognizable growth stage.
- Local Market: Location-based patterns from similar markets.
- Knowledge Cluster: Multiple knowledge assets converge on this business profile.
- Success Pattern: This business profile matches a prior success story.

RULES:
- Return exactly the number of patterns requested (or fewer if data is limited).
- Every pattern MUST include a clear, specific reason explaining the recognition.
- Reasons should be 1-2 sentences, written for a busy CEO.
- Include a concrete suggested action for each pattern.
- Confidence: 90-100 = strong match, 70-89 = likely match, 50-69 = possible match, below 50 = don't include.
- Generate 3-5 follow-up questions the sales team should ask based on the patterns.

Return ONLY a JSON object:
{
  "patterns": [
    {
      "index": 0,
      "pattern_type": "Industry Similarity",
      "title": "Short pattern title",
      "confidence": 85,
      "reason": "Why this pattern was recognized",
      "suggested_action": "What to do with this insight"
    }
  ],
  "follow_up_questions": [
    "Question 1?",
    "Question 2?"
  ]
}`;

// ── Main Function ──

export default async function recognizeBusinessPatterns(input: PatternInput) {
  const {
    business_name = '',
    business_type = '',
    industry = '',
    location = '',
    website_url = '',
    current_challenge = '',
    context_description = '',
  } = input;

  const contextSummary = [
    business_name && `Business: ${business_name}`,
    industry && `Industry: ${industry}`,
    business_type && `Type: ${business_type}`,
    location && `Location: ${location}`,
    website_url && `Website: ${website_url}`,
    current_challenge && `Challenge: ${current_challenge}`,
    context_description && `Context: ${context_description}`,
  ].filter(Boolean).join('. ');

  try {
    // ────────────────────────────────────────────
    // STEP 1: Gather signals from multiple sources
    // ────────────────────────────────────────────

    const signals: Array<{
      type: string;
      id: string;
      title: string;
      domain: string;
      snippet: string;
      source: 'industry_match' | 'audit_similarity' | 'knowledge_graph' | 'challenge_match';
      relevance_score: number;
      relationship_count: number;
      relationships: Array<{ type: string; connected_to: string; direction: 'source' | 'target' }>;
    }> = [];

    const seen = new Set<string>();

    // Cache KnowledgeRelationship data (single fetch, reused)
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

    // Helper: collect relationships for an asset
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

    // 1a. Industry-specific search via K-003
    if (industry || business_type) {
      try {
        const industryQuery = [industry, business_type, 'industry patterns'].filter(Boolean).join(' ');
        const searchResults = await base44.functions.searchKnowledge({
          query: industryQuery,
          context: `Pattern recognition for ${industry || business_type} business. ${context_description}`,
          max_results: 8,
          include_relationships: true,
        });

        if (searchResults?.results) {
          for (const [_category, items] of Object.entries(searchResults.results)) {
            if (!Array.isArray(items)) continue;
            for (const item of items as any[]) {
              const key = `${item.type}:${item.id}`;
              if (!seen.has(key) && item.id) {
                seen.add(key);
                signals.push({
                  type: item.type,
                  id: item.id,
                  title: item.title || 'Untitled',
                  domain: item.domain || 'unclassified',
                  snippet: item.summary || '',
                  source: 'industry_match',
                  relevance_score: item.relevance_score || 0,
                  relationship_count: 0,
                  relationships: [],
                });
              }
            }
          }
        }
      } catch (e) {
        console.error('Industry search failed:', e);
      }
    }

    // 1b. Challenge-specific search via K-003
    if (current_challenge) {
      try {
        const challengeQuery = `${current_challenge} solutions strategies`;
        const searchResults = await base44.functions.searchKnowledge({
          query: challengeQuery,
          context: `Business facing challenge: ${current_challenge}. Looking for prior solutions and patterns.`,
          max_results: 8,
          include_relationships: true,
        });

        if (searchResults?.results) {
          for (const [_category, items] of Object.entries(searchResults.results)) {
            if (!Array.isArray(items)) continue;
            for (const item of items as any[]) {
              const key = `${item.type}:${item.id}`;
              if (!seen.has(key) && item.id) {
                seen.add(key);
                signals.push({
                  type: item.type,
                  id: item.id,
                  title: item.title || 'Untitled',
                  domain: item.domain || 'unclassified',
                  snippet: item.summary || '',
                  source: 'challenge_match',
                  relevance_score: item.relevance_score || 0,
                  relationship_count: 0,
                  relationships: [],
                });
              }
            }
          }
        }
      } catch (e) {
        console.error('Challenge search failed:', e);
      }
    }

    // 1c. Similar audits — look for GapAudits with same/similar industry
    if (industry || business_type) {
      try {
        const audits = await base44.entities.GapAudit.list({
          limit: 20,
        });

        if (audits?.length > 0) {
          const industryLower = (industry || business_type || '').toLowerCase();
          const similarAudits = audits.filter((a: any) =>
            a.industry && (
              a.industry.toLowerCase().includes(industryLower) ||
              industryLower.includes(a.industry.toLowerCase())
            )
          );

          for (const audit of similarAudits.slice(0, 5)) {
            const key = `GapAudit:${audit.id}`;
            if (!seen.has(key)) {
              seen.add(key);
              signals.push({
                type: 'GapAudit',
                id: audit.id,
                title: audit.business_name || `${audit.industry} Audit`,
                domain: 'sales_intelligence',
                snippet: audit.website_visibility_detail || audit.ai_recommendation || '',
                source: 'audit_similarity',
                relevance_score: 0,
                relationship_count: 0,
                relationships: [],
              });
            }
          }
        }
      } catch (e) {
        console.error('Audit lookup failed:', e);
      }
    }

    // 1d. Broad context search via K-003 (catches cross-domain patterns)
    if (context_description || business_name) {
      try {
        const broadQuery = [business_name, context_description, location].filter(Boolean).join(' ');
        const searchResults = await base44.functions.searchKnowledge({
          query: broadQuery,
          context: `Business pattern recognition for: ${contextSummary}`,
          max_results: 6,
          include_relationships: true,
        });

        if (searchResults?.results) {
          for (const [_category, items] of Object.entries(searchResults.results)) {
            if (!Array.isArray(items)) continue;
            for (const item of items as any[]) {
              const key = `${item.type}:${item.id}`;
              if (!seen.has(key) && item.id) {
                seen.add(key);
                signals.push({
                  type: item.type,
                  id: item.id,
                  title: item.title || 'Untitled',
                  domain: item.domain || 'unclassified',
                  snippet: item.summary || '',
                  source: 'knowledge_graph',
                  relevance_score: item.relevance_score || 0,
                  relationship_count: 0,
                  relationships: [],
                });
              }
            }
          }
        }
      } catch (e) {
        console.error('Broad search failed:', e);
      }
    }

    // 1e. Enrich all signals with relationship data (single cached fetch)
    if (signals.some(s => s.relationships.length === 0)) {
      const relationships = await getRelationships();
      if (relationships.length > 0) {
        for (const signal of signals) {
          if (signal.relationships.length > 0) continue;
          const { count, details } = collectRelationships(relationships, signal.type, signal.id);
          signal.relationship_count = count;
          signal.relationships = details;
        }
      }
    }

    const totalSignals = signals.length;

    // ────────────────────────────────────────────
    // STEP 2: AI-powered pattern analysis
    // ────────────────────────────────────────────

    let patterns: BusinessPattern[] = [];
    let followUpQuestions: string[] = [];

    if (signals.length > 0) {
      const signalList = signals
        .slice(0, 40)
        .map((s, i) => {
          const relInfo = s.relationship_count > 0
            ? ` | ${s.relationship_count} knowledge connections`
            : '';
          const k003Score = s.relevance_score > 0 ? ` | relevance: ${s.relevance_score}` : '';
          return `${i}. [${s.type}] "${s.title}" (Source: ${s.source}, Domain: ${s.domain}${relInfo}${k003Score}) — ${s.snippet.substring(0, 200)}`;
        })
        .join('\n');

      const userPrompt = `BUSINESS PROFILE:
- Business name: ${business_name || 'Unknown'}
- Industry: ${industry || business_type || 'Unknown'}
- Location: ${location || 'Unknown'}
- Website: ${website_url || 'None provided'}
- Current challenge: ${current_challenge || 'Not specified'}
- Context: ${context_description || 'General pattern recognition'}

IDENTIFY THE TOP 5 BUSINESS PATTERNS from these ${signals.length} knowledge signals:

${signalList}

Look for:
1. Industry-specific patterns (similar businesses we've served or studied)
2. Challenge patterns (problems we've solved before)
3. Service fit patterns (which NTA services match this profile)
4. Growth stage patterns (where is this business in their growth?)
5. Success patterns (what worked for similar businesses)

Also generate 3-5 follow-up questions the sales team should ask.`;

      try {
        const response = await base44.ai.chat({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: PATTERN_ANALYSIS_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 2500,
        });

        const content = response.choices?.[0]?.message?.content || '{}';
        const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const result = JSON.parse(cleaned);

        if (result.patterns && Array.isArray(result.patterns)) {
          for (let rank = 0; rank < result.patterns.length; rank++) {
            const p = result.patterns[rank];
            const signal = signals[p.index];

            // Gather related assets for this pattern
            const relatedAssets: BusinessPattern['related_assets'] = [];
            if (signal) {
              relatedAssets.push({
                type: signal.type,
                id: signal.id,
                title: signal.title,
                relevance: 'Primary match',
              });
              // Add connected assets from relationships
              for (const rel of signal.relationships) {
                relatedAssets.push({
                  type: rel.type,
                  id: '',
                  title: rel.connected_to,
                  relevance: `Connected via ${rel.type}`,
                });
              }
            }

            patterns.push({
              rank: rank + 1,
              pattern_type: p.pattern_type || PATTERN_TYPES.KNOWLEDGE_CLUSTER,
              title: p.title,
              confidence: p.confidence,
              reason: p.reason,
              related_assets: relatedAssets,
              suggested_action: p.suggested_action,
              source: signal?.source || 'ai_analyzed',
            });
          }
        }

        if (result.follow_up_questions && Array.isArray(result.follow_up_questions)) {
          followUpQuestions = result.follow_up_questions;
        }
      } catch (aiError) {
        console.error('AI pattern analysis failed, using heuristic fallback:', aiError);

        // Heuristic fallback: score by source type + relevance + relationships
        const scored = signals.map(s => {
          let score = 50;
          // K-003 relevance as primary signal
          if (s.relevance_score > 0) score += Math.min(20, s.relevance_score * 2);
          // Source priority
          if (s.source === 'audit_similarity') score += 15;
          else if (s.source === 'industry_match') score += 12;
          else if (s.source === 'challenge_match') score += 10;
          // Relationship density
          score += Math.min(10, s.relationship_count * 2);
          return { ...s, score: Math.min(100, score) };
        });

        scored.sort((a, b) => b.score - a.score);

        const typeMap: Record<string, string> = {
          industry_match: PATTERN_TYPES.INDUSTRY_SIMILARITY,
          audit_similarity: PATTERN_TYPES.AUDIT_PATTERN,
          challenge_match: PATTERN_TYPES.CHALLENGE_PATTERN,
          knowledge_graph: PATTERN_TYPES.KNOWLEDGE_CLUSTER,
        };

        for (let i = 0; i < Math.min(5, scored.length); i++) {
          const s = scored[i];
          patterns.push({
            rank: i + 1,
            pattern_type: typeMap[s.source] || PATTERN_TYPES.KNOWLEDGE_CLUSTER,
            title: `${s.title} — ${s.domain.replace(/_/g, ' ')}`,
            confidence: s.score,
            reason: s.source === 'audit_similarity'
              ? `Similar business audit found in the ${s.domain.replace(/_/g, ' ')} domain.`
              : s.source === 'industry_match'
              ? `Industry knowledge match for ${industry || business_type || 'this business type'}.`
              : `Related knowledge found for the stated challenge.`,
            related_assets: [{
              type: s.type,
              id: s.id,
              title: s.title,
              relevance: 'Pattern source',
            }],
            suggested_action: s.source === 'audit_similarity'
              ? 'Review this prior audit for comparison insights'
              : s.source === 'industry_match'
              ? 'Use this industry knowledge to prepare for the conversation'
              : 'Review this knowledge to address the business challenge',
            source: s.source,
          });
        }

        // Heuristic follow-up questions
        followUpQuestions = [];
        if (industry) followUpQuestions.push(`What's your biggest competitive challenge in the ${industry} space right now?`);
        if (current_challenge) followUpQuestions.push(`How long has "${current_challenge}" been affecting your business?`);
        followUpQuestions.push('What marketing channels are currently generating the most leads for you?');
        followUpQuestions.push('Have you worked with a marketing agency before? What did or didn\'t work?');
        if (website_url) followUpQuestions.push('How important is your website in generating new business today?');
      }
    } else {
      // No signals found — provide generic follow-up questions
      followUpQuestions = [
        'What industry would you say you\'re in?',
        'What\'s your biggest challenge in attracting new customers right now?',
        'How are people currently finding your business?',
        'What does your ideal customer look like?',
        'Have you invested in digital marketing before?',
      ];
    }

    // ────────────────────────────────────────────
    // STEP 3: Confidence threshold filter
    // ────────────────────────────────────────────
    patterns = patterns.filter(p => p.confidence >= MIN_CONFIDENCE);
    patterns.forEach((p, i) => { p.rank = i + 1; });

    // ────────────────────────────────────────────
    // STEP 4: Return structured output
    // ────────────────────────────────────────────

    return {
      patterns,
      context_analyzed: contextSummary || 'No business context provided',
      engine_version: ENGINE_VERSION,
      generated_at: new Date().toISOString(),
      total_signals_evaluated: totalSignals,
      follow_up_questions: followUpQuestions.slice(0, 5),
    };

  } catch (error) {
    console.error('recognizeBusinessPatterns error:', error);
    return {
      patterns: [],
      context_analyzed: contextSummary || 'Error during analysis',
      engine_version: ENGINE_VERSION,
      generated_at: new Date().toISOString(),
      total_signals_evaluated: 0,
      follow_up_questions: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
