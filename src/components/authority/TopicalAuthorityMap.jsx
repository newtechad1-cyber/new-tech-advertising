/**
 * R0.7 — Topical Authority Map
 * Visual display of topic clusters showing content depth and relationships.
 * Used in Canon Explorer and Editorial Dashboard to show authority structure.
 */
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { TOPIC_CLUSTERS, getClusterDepth } from '../../data/topicClusters';

const COLOR_MAP = {
  blue: { bg: 'bg-blue-900/30', border: 'border-blue-700/50', text: 'text-blue-400', badge: 'bg-blue-800/60 text-blue-300', ring: 'ring-blue-500/30' },
  emerald: { bg: 'bg-emerald-900/30', border: 'border-emerald-700/50', text: 'text-emerald-400', badge: 'bg-emerald-800/60 text-emerald-300', ring: 'ring-emerald-500/30' },
  purple: { bg: 'bg-purple-900/30', border: 'border-purple-700/50', text: 'text-purple-400', badge: 'bg-purple-800/60 text-purple-300', ring: 'ring-purple-500/30' },
  rose: { bg: 'bg-rose-900/30', border: 'border-rose-700/50', text: 'text-rose-400', badge: 'bg-rose-800/60 text-rose-300', ring: 'ring-rose-500/30' },
  amber: { bg: 'bg-amber-900/30', border: 'border-amber-700/50', text: 'text-amber-400', badge: 'bg-amber-800/60 text-amber-300', ring: 'ring-amber-500/30' },
  cyan: { bg: 'bg-cyan-900/30', border: 'border-cyan-700/50', text: 'text-cyan-400', badge: 'bg-cyan-800/60 text-cyan-300', ring: 'ring-cyan-500/30' },
  orange: { bg: 'bg-orange-900/30', border: 'border-orange-700/50', text: 'text-orange-400', badge: 'bg-orange-800/60 text-orange-300', ring: 'ring-orange-500/30' },
  indigo: { bg: 'bg-indigo-900/30', border: 'border-indigo-700/50', text: 'text-indigo-400', badge: 'bg-indigo-800/60 text-indigo-300', ring: 'ring-indigo-500/30' },
};

const RELATIONSHIP_LABELS = {
  context: 'Context',
  education: 'Learn',
  philosophy: 'Philosophy',
  extension: 'Extends',
  application: 'Applied',
  solution: 'Solution',
  problem: 'Problem',
  diagnostic: 'Diagnostic',
  planning: 'Planning',
  'entry-point': 'Start Here',
  'deep-dive': 'Deep Dive',
  example: 'Example',
  proof: 'Proof',
  continuation: 'Continues',
  local: 'Local',
  execution: 'Execute',
};

function ClusterCard({ cluster, isExpanded, onToggle }) {
  const colors = COLOR_MAP[cluster.color] || COLOR_MAP.blue;
  const IconComponent = LucideIcons[cluster.icon] || LucideIcons.Layers;
  const depth = getClusterDepth(cluster.id);
  const ChevronIcon = isExpanded ? LucideIcons.ChevronUp : LucideIcons.ChevronDown;

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} transition-all duration-200 hover:ring-2 ${colors.ring}`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start gap-3 text-left"
      >
        <div className={`p-2 rounded-lg ${colors.badge}`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${colors.text}`}>{cluster.name}</h3>
          <p className="text-sm text-slate-400 mt-0.5 line-clamp-2">{cluster.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-slate-500">
              {cluster.supporting.length + 1} pages
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-500">
              Depth: {depth.depth}/10
            </span>
            <span className="text-xs text-slate-500">·</span>
            <div className="flex gap-1">
              {cluster.buyer_stages.map(stage => (
                <span key={stage} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {stage}
                </span>
              ))}
            </div>
          </div>
        </div>
        <ChevronIcon className="w-4 h-4 text-slate-500 mt-1 flex-shrink-0" />
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-700/50">
          {/* Pillar page */}
          <div className="mt-3">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Pillar Page</span>
            <Link
              to={cluster.pillar.url}
              className={`block mt-1 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors`}
            >
              <div className="flex items-center gap-2">
                <LucideIcons.Crown className={`w-4 h-4 ${colors.text}`} />
                <span className="text-sm text-slate-200 font-medium">{cluster.pillar.title}</span>
              </div>
            </Link>
          </div>

          {/* Supporting content */}
          <div className="mt-3">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Supporting Content</span>
            <div className="mt-1 space-y-1">
              {cluster.supporting.map((item, i) => (
                <Link
                  key={i}
                  to={item.url}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-slate-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <LucideIcons.ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300 truncate">{item.title}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${colors.badge} flex-shrink-0 ml-2`}>
                    {RELATIONSHIP_LABELS[item.relationship] || item.relationship}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div className="mt-3">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Target Keywords</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {cluster.keywords.map((kw, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/50">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TopicalAuthorityMap({ compact = false }) {
  const [expandedId, setExpandedId] = useState(null);

  const stats = useMemo(() => {
    const totalPages = TOPIC_CLUSTERS.reduce((sum, c) => sum + c.supporting.length + 1, 0);
    const totalKeywords = TOPIC_CLUSTERS.reduce((sum, c) => sum + c.keywords.length, 0);
    const avgDepth = TOPIC_CLUSTERS.reduce((sum, c) => sum + getClusterDepth(c.id).depth, 0) / TOPIC_CLUSTERS.length;
    return { totalPages, totalKeywords, avgDepth: avgDepth.toFixed(1), clusters: TOPIC_CLUSTERS.length };
  }, []);

  if (compact) {
    return (
      <div className="space-y-2">
        {TOPIC_CLUSTERS.map(cluster => {
          const colors = COLOR_MAP[cluster.color] || COLOR_MAP.blue;
          const IconComponent = LucideIcons[cluster.icon] || LucideIcons.Layers;
          return (
            <Link
              key={cluster.id}
              to={cluster.pillar.url}
              className={`flex items-center gap-3 p-3 rounded-lg ${colors.bg} border ${colors.border} hover:ring-1 ${colors.ring} transition-all`}
            >
              <IconComponent className={`w-4 h-4 ${colors.text}`} />
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-medium ${colors.text}`}>{cluster.name}</span>
                <span className="text-xs text-slate-500 ml-2">
                  {cluster.supporting.length + 1} pages
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 text-center">
          <div className="text-2xl font-bold text-white">{stats.clusters}</div>
          <div className="text-xs text-slate-400 mt-0.5">Topic Clusters</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 text-center">
          <div className="text-2xl font-bold text-white">{stats.totalPages}</div>
          <div className="text-xs text-slate-400 mt-0.5">Connected Pages</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 text-center">
          <div className="text-2xl font-bold text-white">{stats.totalKeywords}</div>
          <div className="text-xs text-slate-400 mt-0.5">Target Keywords</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 text-center">
          <div className="text-2xl font-bold text-white">{stats.avgDepth}</div>
          <div className="text-xs text-slate-400 mt-0.5">Avg Depth</div>
        </div>
      </div>

      {/* Cluster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TOPIC_CLUSTERS.map(cluster => (
          <ClusterCard
            key={cluster.id}
            cluster={cluster}
            isExpanded={expandedId === cluster.id}
            onToggle={() => setExpandedId(expandedId === cluster.id ? null : cluster.id)}
          />
        ))}
      </div>
    </div>
  );
}
