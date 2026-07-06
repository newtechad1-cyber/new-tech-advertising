/**
 * R0.6.2 — Canon Health Widgets for Editorial Dashboard
 * Dashboards for: Canon Health, Collection Health, Journal Coverage,
 * Migration Progress, Internal Link Health, Duplicate Resolution,
 * Relationship Coverage, Publishing Queue, Knowledge Graph Health.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, BookOpen, FolderOpen, Link2, Shield, Globe,
  BarChart3, CheckCircle2, AlertTriangle, TrendingUp,
  Youtube, FileText, MapPin, Building2, Briefcase,
  ArrowRight, Database, Activity
} from 'lucide-react';

// ─── Shared mini bar chart ──────────────────────────────────────────────────
function MiniBar({ value, max, color = 'bg-cyan-500' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-1.5 bg-slate-800 rounded-full flex-1">
      <div className={`h-1.5 ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ─── Canon Health Overview ──────────────────────────────────────────────────
export function CanonHealthWidget({ health }) {
  if (!health) return null;
  const grade = health.relationCoverage >= 80 ? 'A' : health.relationCoverage >= 60 ? 'B' : health.relationCoverage >= 40 ? 'C' : 'D';
  const gradeColor = grade === 'A' ? 'text-green-400' : grade === 'B' ? 'text-blue-400' : grade === 'C' ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Heart className="w-3.5 h-3.5 text-red-400" /> Canon Health
        </h3>
        <span className={`text-2xl font-black ${gradeColor}`}>{grade}</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <p className="text-lg font-black text-white">{health.totalAssets}</p>
          <p className="text-[10px] text-slate-500">Total Assets</p>
        </div>
        <div>
          <p className="text-lg font-black text-green-400">{health.withRelations}</p>
          <p className="text-[10px] text-slate-500">Connected</p>
        </div>
        <div>
          <p className="text-lg font-black text-amber-400">{health.orphans}</p>
          <p className="text-[10px] text-slate-500">Orphans</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 w-20">Relations</span>
          <MiniBar value={health.relationCoverage} max={100} color="bg-green-500" />
          <span className="text-slate-400 w-8 text-right">{health.relationCoverage}%</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 w-20">Avg Quality</span>
          <MiniBar value={health.avgQuality} max={10} color="bg-blue-500" />
          <span className="text-slate-400 w-8 text-right">{health.avgQuality}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 w-20">Avg Authority</span>
          <MiniBar value={health.avgAuthority} max={10} color="bg-purple-500" />
          <span className="text-slate-400 w-8 text-right">{health.avgAuthority}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Collection Health ──────────────────────────────────────────────────────
export function CollectionHealthWidget({ health }) {
  if (!health) return null;

  return (
    <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5">
      <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
        <FolderOpen className="w-3.5 h-3.5 text-purple-400" /> Collection Health
      </h3>
      <div className="space-y-2">
        {(health.collectionHealth || []).map(c => (
          <div key={c.slug} className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 flex-1 truncate">{c.title}</span>
            <span className={`font-mono ${c.entryCount > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {c.entryCount}
            </span>
            {c.entryCount === 0 && <AlertTriangle className="w-3 h-3 text-red-400" />}
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-600 mt-3">
        {health.totalCollections} collections · {(health.collectionHealth || []).filter(c => c.entryCount === 0).length} empty
      </p>
    </div>
  );
}

// ─── Buyer Stage Distribution ───────────────────────────────────────────────
export function BuyerStageWidget({ health }) {
  if (!health) return null;
  const dist = health.buyerStageDistribution || {};

  return (
    <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5">
      <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
        <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Buyer Stage Distribution
      </h3>
      <div className="space-y-3">
        {[
          { stage: 'Awareness', color: 'bg-blue-500', count: dist.Awareness || 0 },
          { stage: 'Consideration', color: 'bg-amber-500', count: dist.Consideration || 0 },
          { stage: 'Decision', color: 'bg-green-500', count: dist.Decision || 0 },
        ].map(s => (
          <div key={s.stage}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">{s.stage}</span>
              <span className="text-white font-bold">{s.count}</span>
            </div>
            <MiniBar value={s.count} max={Math.max(dist.Awareness || 0, dist.Consideration || 0, dist.Decision || 0, 1)} color={s.color} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Index Status ───────────────────────────────────────────────────────────
export function IndexStatusWidget({ health }) {
  if (!health) return null;

  return (
    <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5">
      <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
        <Globe className="w-3.5 h-3.5 text-green-400" /> Search Index Status
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/10">
          <p className="text-xl font-black text-green-400">{health.indexed}</p>
          <p className="text-[10px] text-slate-500">Indexed</p>
        </div>
        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
          <p className="text-xl font-black text-amber-400">{health.notIndexed}</p>
          <p className="text-[10px] text-slate-500">Not Indexed</p>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Duplicates</span>
          <span className="text-red-400 font-bold ml-auto">{health.duplicates}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Video Coverage ─────────────────────────────────────────────────────────
export function VideoCoverageWidget({ health }) {
  if (!health) return null;

  return (
    <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5">
      <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
        <Youtube className="w-3.5 h-3.5 text-red-400" /> Video Coverage
      </h3>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-2xl font-black text-white">{health.withVideo}</span>
        <span className="text-sm text-slate-500">/ {health.totalAssets} assets have video</span>
      </div>
      <MiniBar value={health.withVideo} max={health.totalAssets} color="bg-red-500" />
      <p className="text-[10px] text-slate-600 mt-2">
        {health.totalVideos} YouTube records in Knowledge Engine
      </p>
    </div>
  );
}

// ─── Knowledge Graph Summary ────────────────────────────────────────────────
export function KnowledgeGraphSummaryWidget({ health, articles }) {
  if (!health) return null;

  const assetTypes = {};
  for (const a of (articles || [])) {
    const t = a.asset_type || 'article';
    assetTypes[t] = (assetTypes[t] || 0) + 1;
  }

  const typeIcons = {
    article: FileText,
    lesson: BookOpen,
    case_study: BarChart3,
    service_page: Briefcase,
    industry_page: Building2,
    geo_page: MapPin,
    video: Youtube,
  };

  return (
    <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5">
      <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
        <Database className="w-3.5 h-3.5 text-cyan-400" /> Knowledge Graph
      </h3>
      <div className="space-y-2">
        {Object.entries(assetTypes).sort((a, b) => b[1] - a[1]).map(([type, count]) => {
          const Icon = typeIcons[type] || FileText;
          return (
            <div key={type} className="flex items-center gap-2 text-xs">
              <Icon className="w-3 h-3 text-slate-500" />
              <span className="text-slate-400 flex-1 capitalize">{type.replace(/_/g, ' ')}</span>
              <span className="text-white font-bold">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
