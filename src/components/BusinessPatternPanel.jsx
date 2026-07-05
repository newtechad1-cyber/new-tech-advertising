/**
 * BusinessPatternPanel — I-002 Business Pattern Recognition v1.0
 * 
 * Reusable component that displays recognized business patterns.
 * Designed to be embedded in any workspace: Sales Intelligence,
 * Discovery Call, Executive Dashboard.
 * 
 * Props:
 *   businessName       — Name of the business
 *   businessType       — Type of business (e.g. "local service")
 *   industry           — Industry vertical (e.g. "HVAC", "restaurant")
 *   location           — Location (e.g. "Mason City, IA")
 *   websiteUrl         — Business website URL
 *   currentChallenge   — What the business is struggling with
 *   contextDescription — What the user is doing right now
 *   compact            — Compact display mode (default false)
 *   onPatternClick     — Optional callback when a pattern is clicked
 *   onQuestionClick    — Optional callback when a follow-up question is clicked
 *   className          — Additional CSS classes
 */

import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import {
  Brain,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Loader2,
  Lightbulb,
  Building2,
  Search,
  FileText,
  MessageCircle,
  TrendingUp,
  MapPin,
  Target,
  Network,
  Award,
  HelpCircle,
} from 'lucide-react';

// ── Pattern type icons and colors ──

const PATTERN_STYLES = {
  'Industry Similarity':       { icon: Building2,    color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
  'Common Challenge Pattern':  { icon: Target,       color: 'text-orange-400',  bg: 'bg-orange-500/10',  border: 'border-orange-500/20' },
  'Audit Similarity Pattern':  { icon: Search,       color: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20' },
  'Service Fit Pattern':       { icon: Lightbulb,    color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/20' },
  'Growth Stage Pattern':      { icon: TrendingUp,   color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  'Local Market Pattern':      { icon: MapPin,       color: 'text-pink-400',    bg: 'bg-pink-500/10',    border: 'border-pink-500/20' },
  'Knowledge Cluster':         { icon: Network,      color: 'text-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/20' },
  'Success Pattern':           { icon: Award,        color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
};

const DEFAULT_STYLE = { icon: Brain, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' };

// ── Confidence badge ──

function ConfidenceBadge({ score }) {
  const style =
    score >= 90 ? 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50' :
    score >= 70 ? 'bg-blue-900/60 text-blue-300 border-blue-700/50' :
    score >= 50 ? 'bg-yellow-900/60 text-yellow-300 border-yellow-700/50' :
                  'bg-slate-800/60 text-slate-400 border-slate-700/50';

  return (
    <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${style}`}>
      {score}%
    </span>
  );
}

// ── Pattern Card ──

function PatternCard({ pattern, compact, onPatternClick }) {
  const [expanded, setExpanded] = useState(false);
  const { icon: Icon, color, bg, border } = PATTERN_STYLES[pattern.pattern_type] || DEFAULT_STYLE;

  return (
    <div
      className={`rounded-xl border transition-all ${border} ${expanded ? 'bg-slate-800/40' : 'bg-slate-900/40'} hover:bg-slate-800/30`}
    >
      {/* Header */}
      <button
        onClick={() => {
          setExpanded(!expanded);
          if (onPatternClick) onPatternClick(pattern);
        }}
        className="w-full text-left px-3 py-2.5 flex items-start gap-3"
      >
        <div className={`mt-0.5 p-1.5 rounded-lg ${bg} flex-shrink-0`}>
          <Icon className={`w-3.5 h-3.5 ${color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-white text-sm font-medium truncate">{pattern.title}</span>
            <ConfidenceBadge score={pattern.confidence} />
          </div>
          <p className={`text-xs ${color} font-medium`}>{pattern.pattern_type}</p>
          {!compact && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{pattern.reason}</p>
          )}
        </div>
        <div className="flex-shrink-0 mt-1">
          {expanded
            ? <ChevronDown className="w-4 h-4 text-slate-500" />
            : <ChevronRight className="w-4 h-4 text-slate-500" />
          }
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-slate-800/50 pt-2 mx-3">
          {compact && (
            <p className="text-xs text-slate-300">{pattern.reason}</p>
          )}

          {/* Suggested Action */}
          <div className="flex items-start gap-2">
            <Lightbulb className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-yellow-200/80">{pattern.suggested_action}</p>
          </div>

          {/* Related Assets */}
          {pattern.related_assets && pattern.related_assets.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-slate-500 font-medium">Related Assets</p>
              {pattern.related_assets.slice(0, 4).map((asset, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <FileText className="w-3 h-3 text-slate-500 flex-shrink-0" />
                  <span className="text-slate-300 truncate">{asset.title}</span>
                  <span className="text-slate-600">—</span>
                  <span className="text-slate-500 text-[10px]">{asset.relevance}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Follow-up Questions ──

function FollowUpQuestions({ questions, compact, onQuestionClick }) {
  const [showQuestions, setShowQuestions] = useState(!compact);

  if (!questions || questions.length === 0) return null;

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-900/10">
      <button
        onClick={() => setShowQuestions(!showQuestions)}
        className="w-full text-left px-3 py-2 flex items-center gap-2"
      >
        <HelpCircle className="w-4 h-4 text-violet-400" />
        <span className="text-sm text-violet-300 font-medium flex-1">Follow-up Questions</span>
        <span className="text-xs text-violet-500">{questions.length}</span>
        {showQuestions
          ? <ChevronDown className="w-3.5 h-3.5 text-violet-500" />
          : <ChevronRight className="w-3.5 h-3.5 text-violet-500" />
        }
      </button>
      {showQuestions && (
        <div className="px-3 pb-3 space-y-1.5">
          {questions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onQuestionClick && onQuestionClick(q)}
              className="w-full text-left flex items-start gap-2 text-xs text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-800/30 px-2 py-1.5"
            >
              <MessageCircle className="w-3 h-3 text-violet-400 mt-0.5 flex-shrink-0" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ──

export default function BusinessPatternPanel({
  businessName = '',
  businessType = '',
  industry = '',
  location = '',
  websiteUrl = '',
  currentChallenge = '',
  contextDescription = '',
  compact = false,
  onPatternClick = null,
  onQuestionClick = null,
  className = '',
}) {
  const [patterns, setPatterns] = useState([]);
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [totalSignals, setTotalSignals] = useState(0);

  // Determine if we have enough context to run
  const hasContext = !!(businessName || industry || businessType || currentChallenge || contextDescription);

  const loadPatterns = useCallback(async () => {
    if (!hasContext) return;

    setLoading(true);
    setError(null);

    try {
      const result = await base44.functions.recognizeBusinessPatterns({
        business_name: businessName,
        business_type: businessType,
        industry: industry,
        location: location,
        website_url: websiteUrl,
        current_challenge: currentChallenge,
        context_description: contextDescription,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setPatterns(result.patterns || []);
        setFollowUpQuestions(result.follow_up_questions || []);
        setTotalSignals(result.total_signals_evaluated || 0);
      }
    } catch (err) {
      console.error('BusinessPatternPanel error:', err);
      setError(err.message || 'Failed to analyze patterns');
    } finally {
      setLoading(false);
    }
  }, [businessName, businessType, industry, location, websiteUrl, currentChallenge, contextDescription, hasContext]);

  // Load on mount and when key inputs change
  useEffect(() => {
    loadPatterns();
  }, [loadPatterns]);

  // ── No context state ──
  if (!hasContext) {
    return (
      <div className={`rounded-2xl border border-slate-800 bg-slate-900/50 p-4 ${className}`}>
        <div className="flex items-center gap-2 text-slate-500">
          <Brain className="w-4 h-4" />
          <span className="text-sm">Provide business details to recognize patterns</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Brain className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-semibold text-white">Business Patterns</span>
          {!loading && patterns.length > 0 && (
            <span className="text-xs text-slate-500 font-normal">
              {patterns.length} recognized • {totalSignals} signals
            </span>
          )}
          {collapsed
            ? <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          }
        </button>
        <button
          onClick={loadPatterns}
          disabled={loading}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
          title="Re-analyze patterns"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="p-3 space-y-2">
          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center gap-2 py-6">
              <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
              <span className="text-sm text-slate-400">Analyzing patterns…</span>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-red-900/20 border border-red-800/30">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-300">{error}</p>
                <button
                  onClick={loadPatterns}
                  className="text-xs text-red-400 hover:text-red-300 mt-1 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* No patterns */}
          {!loading && !error && patterns.length === 0 && (
            <div className="flex items-center gap-2 px-3 py-4 text-slate-500">
              <Brain className="w-4 h-4" />
              <span className="text-sm">No patterns recognized yet. Add more business details.</span>
            </div>
          )}

          {/* Pattern cards */}
          {!loading && !error && patterns.map((pattern) => (
            <PatternCard
              key={`${pattern.rank}-${pattern.title}`}
              pattern={pattern}
              compact={compact}
              onPatternClick={onPatternClick}
            />
          ))}

          {/* Follow-up questions */}
          {!loading && !error && followUpQuestions.length > 0 && (
            <FollowUpQuestions
              questions={followUpQuestions}
              compact={compact}
              onQuestionClick={onQuestionClick}
            />
          )}
        </div>
      )}
    </div>
  );
}
