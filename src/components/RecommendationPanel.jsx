/**
 * RecommendationPanel — I-001 Recommendation Engine v1.0
 * 
 * Reusable component that displays AI-powered knowledge recommendations.
 * Designed to be embedded in any workspace: Sales Intelligence, Discovery Call,
 * Knowledge Navigator, Executive Dashboard.
 * 
 * Props:
 *   contextType      — "sales" | "discovery" | "knowledge" | "executive" | "general"
 *   contextDescription — What the user is doing right now
 *   businessType     — Industry / vertical (optional)
 *   leadId           — SalesLead ID for sales contexts (optional)
 *   currentAssetType — If viewing a specific asset (optional)
 *   currentAssetId   — If viewing a specific asset (optional)
 *   maxResults       — Number of recommendations (default 5)
 *   compact          — Reduced height mode for sidebars (default false)
 *   onAssetClick     — Callback when user clicks a recommendation (optional)
 *   autoLoad         — Fetch recommendations on mount (default true)
 *   className        — Additional CSS classes (optional)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import {
  Brain, Sparkles, ChevronRight, ChevronDown, ChevronUp,
  Loader2, RefreshCw, ExternalLink, Star, Network,
  FileText, BookOpen, Target, Phone, Briefcase, Video,
  MessageSquare, Zap, Heart, Search, Globe, Shield,
  MapPin, Bot, TrendingUp, AlertCircle, Eye, Lightbulb,
  ArrowRight, Award, Link2
} from 'lucide-react';

// ── Asset Type Configuration ──

const ASSET_CONFIG = {
  BlogPost:            { icon: FileText,       color: 'text-amber-400',   bg: 'bg-amber-500/10',   label: 'Blog Article' },
  KnowledgeArticle:    { icon: BookOpen,        color: 'text-violet-400',  bg: 'bg-violet-500/10',  label: 'Learning Center' },
  KnowledgeCapture:    { icon: Heart,           color: 'text-rose-400',    bg: 'bg-rose-500/10',    label: 'Knowledge Capture' },
  CaseStudy:           { icon: Briefcase,       color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Case Study' },
  GapAudit:            { icon: Target,          color: 'text-red-400',     bg: 'bg-red-500/10',     label: 'Visibility Audit' },
  DiscoveryCall:       { icon: Phone,           color: 'text-blue-400',    bg: 'bg-blue-500/10',    label: 'Discovery Call' },
  SalesKnowledgeBase:  { icon: Search,          color: 'text-cyan-400',    bg: 'bg-cyan-500/10',    label: 'Sales Knowledge' },
  SalesAgentPrompts:   { icon: MessageSquare,   color: 'text-pink-400',    bg: 'bg-pink-500/10',    label: 'Sales Script' },
  SOPWorkflow:         { icon: Zap,             color: 'text-orange-400',  bg: 'bg-orange-500/10',  label: 'SOP' },
  VideoTemplate:       { icon: Video,           color: 'text-indigo-400',  bg: 'bg-indigo-500/10',  label: 'Video Template' },
  AIPromptTemplates:   { icon: Bot,             color: 'text-violet-400',  bg: 'bg-violet-500/10',  label: 'AI Prompt' },
  IndustryIntel:       { icon: Globe,           color: 'text-sky-400',     bg: 'bg-sky-500/10',     label: 'Industry Intel' },
  LocalMarketIntel:    { icon: MapPin,          color: 'text-green-400',   bg: 'bg-green-500/10',   label: 'Local Market' },
  AuthorityMap:        { icon: Network,         color: 'text-teal-400',    bg: 'bg-teal-500/10',    label: 'Authority Map' },
  AuthorityPlan:       { icon: TrendingUp,      color: 'text-blue-400',    bg: 'bg-blue-500/10',    label: 'Authority Plan' },
  ExecutiveBrief:      { icon: Shield,          color: 'text-amber-400',   bg: 'bg-amber-500/10',   label: 'Executive Brief' },
  TopicCluster:        { icon: Sparkles,        color: 'text-purple-400',  bg: 'bg-purple-500/10',  label: 'Topic Cluster' },
  BrandDNA:            { icon: Award,           color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  label: 'Brand DNA' },
  BrandProfile:        { icon: Award,           color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  label: 'Brand Profile' },
};

const DEFAULT_CONFIG = { icon: FileText, color: 'text-slate-400', bg: 'bg-slate-500/10', label: 'Asset' };

// ── Confidence Bar ──

function ConfidenceBadge({ score }) {
  let color = 'text-slate-400 border-slate-600';
  let bg = 'bg-slate-800/50';
  if (score >= 90) { color = 'text-emerald-300 border-emerald-700/50'; bg = 'bg-emerald-900/30'; }
  else if (score >= 70) { color = 'text-blue-300 border-blue-700/50'; bg = 'bg-blue-900/30'; }
  else if (score >= 50) { color = 'text-amber-300 border-amber-700/50'; bg = 'bg-amber-900/30'; }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${color} ${bg}`}>
      <Star className="w-3 h-3" />
      {score}%
    </span>
  );
}

// ── Single Recommendation Card ──

function RecommendationCard({ rec, expanded, onToggle, onAssetClick, compact }) {
  const config = ASSET_CONFIG[rec.asset_type] || DEFAULT_CONFIG;
  const Icon = config.icon;

  return (
    <div className="group border border-slate-700/50 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 hover:border-slate-600 transition-all duration-200">
      {/* Main row */}
      <div
        className="flex items-start gap-3 p-3 cursor-pointer"
        onClick={onToggle}
      >
        {/* Rank badge */}
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/30 flex items-center justify-center">
          <span className="text-xs font-bold text-blue-300">#{rec.rank}</span>
        </div>

        {/* Icon */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${config.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-[10px] uppercase tracking-wider font-semibold ${config.color}`}>
              {config.label}
            </span>
            <ConfidenceBadge score={rec.confidence} />
          </div>
          <h4 className="text-sm font-semibold text-white truncate leading-tight">
            {rec.title}
          </h4>
          {!compact && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {rec.reason}
            </p>
          )}
        </div>

        {/* Expand chevron */}
        <div className="flex-shrink-0 mt-1">
          {expanded
            ? <ChevronUp className="w-4 h-4 text-slate-500" />
            : <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
          }
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-3 pb-3 pt-0 border-t border-slate-700/30">
          {/* Reason */}
          {compact && (
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {rec.reason}
            </p>
          )}

          {/* Knowledge Relationships */}
          {rec.relationships && rec.relationships.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Link2 className="w-3 h-3 text-teal-400" />
                <span className="text-[10px] uppercase tracking-wider font-semibold text-teal-400">
                  Knowledge Connections
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {rec.relationships.map((rel, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-700/50 text-[10px] text-slate-300 border border-slate-600/30"
                  >
                    <span className="text-teal-400">{rel.type}</span>
                    <ChevronRight className="w-2.5 h-2.5 text-slate-500" />
                    <span className="truncate max-w-[120px]">{rel.connected_to}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onAssetClick) {
                onAssetClick(rec);
              }
            }}
            className="mt-3 w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-blue-600/10 border border-blue-500/30 text-blue-300 hover:bg-blue-600/20 hover:border-blue-500/50 transition-all text-xs font-medium"
          >
            <span className="flex items-center gap-2">
              <Lightbulb className="w-3.5 h-3.5" />
              {rec.suggested_action}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Panel Component ──

export default function RecommendationPanel({
  contextType = 'general',
  contextDescription = '',
  businessType = '',
  leadId = '',
  currentAssetType = '',
  currentAssetId = '',
  maxResults = 5,
  compact = false,
  onAssetClick = null,
  autoLoad = true,
  className = '',
}) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [meta, setMeta] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const fetchRecommendations = useCallback(async () => {
    if (!contextDescription) return;

    setLoading(true);
    setError(null);

    try {
      const result = await base44.functions.generateRecommendations({
        context_type: contextType,
        context_description: contextDescription,
        business_type: businessType || undefined,
        lead_id: leadId || undefined,
        current_asset_type: currentAssetType || undefined,
        current_asset_id: currentAssetId || undefined,
        max_results: maxResults,
      });

      setRecommendations(result.recommendations || []);
      setMeta({
        engine_version: result.engine_version,
        search_method: result.search_method,
        total_candidates: result.total_candidates_evaluated,
        generated_at: result.generated_at,
      });
    } catch (err) {
      console.error('Recommendation fetch failed:', err);
      setError('Unable to generate recommendations right now.');
    } finally {
      setLoading(false);
    }
  }, [contextType, contextDescription, businessType, leadId, currentAssetType, currentAssetId, maxResults]);

  useEffect(() => {
    if (autoLoad && contextDescription) {
      fetchRecommendations();
    }
  }, [autoLoad, contextDescription, fetchRecommendations]);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // ── Render ──

  return (
    <div className={`rounded-2xl border border-slate-700/50 bg-slate-900/50 overflow-hidden ${className}`}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-purple-600/10 border-b border-slate-700/30 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/30 flex items-center justify-center">
            <Brain className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Intelligence Recommendations
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            </h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
              I-001 Engine v1.0
              {meta && ` • ${meta.total_candidates} candidates evaluated`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!loading && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                fetchRecommendations();
              }}
              className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
              title="Refresh recommendations"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
          {collapsed
            ? <ChevronDown className="w-4 h-4 text-slate-500" />
            : <ChevronUp className="w-4 h-4 text-slate-500" />
          }
        </div>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="p-3">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <div className="relative">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                <Brain className="w-4 h-4 text-violet-400 absolute top-2 left-2" />
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-300 font-medium">Analyzing context...</p>
                <p className="text-xs text-slate-500 mt-0.5">Searching knowledge graph + AI ranking</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-900/20 border border-red-800/30">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-300">{error}</p>
                <button
                  onClick={fetchRecommendations}
                  className="text-xs text-red-400 hover:text-red-300 underline mt-1"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && recommendations.length === 0 && contextDescription && (
            <div className="flex flex-col items-center justify-center py-6 gap-2">
              <Eye className="w-6 h-6 text-slate-600" />
              <p className="text-sm text-slate-500 text-center">
                No recommendations available for this context yet.
              </p>
              <p className="text-xs text-slate-600 text-center">
                As more knowledge is added, recommendations will appear here.
              </p>
            </div>
          )}

          {/* No Context */}
          {!loading && !contextDescription && (
            <div className="flex flex-col items-center justify-center py-6 gap-2">
              <Brain className="w-6 h-6 text-slate-600" />
              <p className="text-sm text-slate-500 text-center">
                Select a context to see intelligence recommendations.
              </p>
            </div>
          )}

          {/* Recommendations List */}
          {!loading && !error && recommendations.length > 0 && (
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <RecommendationCard
                  key={`${rec.asset_type}-${rec.asset_id}-${index}`}
                  rec={rec}
                  expanded={expandedIndex === index}
                  onToggle={() => toggleExpand(index)}
                  onAssetClick={onAssetClick}
                  compact={compact}
                />
              ))}
            </div>
          )}

          {/* Footer meta */}
          {meta && !loading && recommendations.length > 0 && (
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/50">
              <span className="text-[10px] text-slate-600">
                {meta.search_method === 'graph_and_search' ? '🔗 Graph + Search' : '🔍 Search'} •{' '}
                {new Date(meta.generated_at).toLocaleTimeString()}
              </span>
              <span className="text-[10px] text-slate-600">
                Powered by I-000 Intelligence Framework
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
