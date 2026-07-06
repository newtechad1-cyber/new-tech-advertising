/**
 * R0.6.2 — Canonical Management Admin Page
 * Resolve duplicate content. Never delete — select canonical,
 * mark secondaries, set redirects, prevent search cannibalization.
 * Route: /admin/canonical-management
 */
import React, { useState, useMemo, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import AdminGuard from '../components/auth/AdminGuard';
import NoIndexMeta from '@/components/auth/NoIndexMeta';
import { useKnowledgeGraph } from '@/lib/knowledgeGraph';
import { toast } from 'sonner';
import {
  Shield, Copy, ArrowRight, CheckCircle2, AlertTriangle,
  Loader2, RefreshCw, ExternalLink, ChevronDown, ChevronRight
} from 'lucide-react';

const STATUS_BADGES = {
  canonical: { label: 'Canonical', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  secondary: { label: 'Secondary', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  redirect:  { label: 'Redirect',  color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  merged:    { label: 'Merged',    color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
};

function DuplicateGroup({ group, articles, onUpdate }) {
  const [expanded, setExpanded] = useState(true);
  const [updating, setUpdating] = useState(false);

  const canonical = group.canonical;
  const secondaries = group.secondaries;

  async function handleResolve(secondary, action) {
    setUpdating(true);
    try {
      await base44.entities.PublishingArticle.update(secondary.id, {
        canonical_status: action,
        canonical_target: canonical?.canon_id,
        workflow_notes: `Marked as ${action} → ${canonical?.canon_id || 'unresolved'}`,
      });
      toast.success(`${secondary.title} marked as ${action}`);
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error(`Failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="rounded-xl bg-slate-900/50 border border-slate-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-800/30 transition-colors"
      >
        {expanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
        <AlertTriangle className="w-4 h-4 text-amber-400" />
        <div className="flex-1">
          <span className="text-sm font-bold text-white">
            {canonical?.title || 'Unresolved Group'}
          </span>
          <span className="text-xs text-slate-500 ml-2">
            + {secondaries.length} duplicate{secondaries.length > 1 ? 's' : ''}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Canonical */}
          {canonical && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/10">
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{canonical.title}</p>
                <p className="text-[10px] text-slate-500 font-mono">{canonical.canonical_url} · {canonical.canon_id}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                CANONICAL
              </span>
            </div>
          )}

          {/* Secondaries */}
          {secondaries.map(sec => {
            const badge = STATUS_BADGES[sec.canonical_status] || STATUS_BADGES.secondary;
            return (
              <div key={sec.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-800">
                <Copy className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{sec.title}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{sec.canonical_url} · {sec.canon_id}</p>
                  {sec.workflow_notes && (
                    <p className="text-[10px] text-slate-600 mt-1">{sec.workflow_notes}</p>
                  )}
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.color}`}>
                  {badge.label}
                </span>
                {!updating && sec.canonical_status !== 'redirect' && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleResolve(sec, 'secondary')}
                      className="px-2 py-1 text-[10px] bg-amber-500/10 text-amber-400 rounded hover:bg-amber-500/20 transition-colors"
                    >
                      Mark Secondary
                    </button>
                    <button
                      onClick={() => handleResolve(sec, 'redirect')}
                      className="px-2 py-1 text-[10px] bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors"
                    >
                      Set Redirect
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminCanonicalManagement() {
  const kg = useKnowledgeGraph();

  const duplicateGroups = useMemo(() => kg.getDuplicateGroups(), [kg]);
  const health = useMemo(() => kg.getHealth(), [kg]);

  return (
    <AdminGuard>
      <NoIndexMeta />
      <div className="min-h-screen bg-slate-950 text-white">
        <header className="border-b border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-amber-400" />
              <div>
                <h1 className="text-lg font-black">Canonical Management</h1>
                <p className="text-xs text-slate-500">Resolve duplicates · Prevent cannibalization</p>
              </div>
            </div>
            <button
              onClick={() => kg.refresh()}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <p className="text-2xl font-black">{health.totalAssets}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total Assets</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <p className="text-2xl font-black text-amber-400">{health.duplicates}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Duplicates</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <p className="text-2xl font-black text-green-400">{health.indexed}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Indexed</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <p className="text-2xl font-black text-red-400">{health.orphans}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Orphans</p>
            </div>
          </div>

          {/* Duplicate Groups */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
              Duplicate Groups ({duplicateGroups.length})
            </h2>
            {duplicateGroups.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-900/30 border border-slate-800 text-center">
                <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No duplicate groups detected</p>
                <p className="text-xs text-slate-600 mt-1">Run the Canon Migration to populate duplicate markers</p>
              </div>
            ) : (
              <div className="space-y-3">
                {duplicateGroups.map((group, i) => (
                  <DuplicateGroup
                    key={i}
                    group={group}
                    articles={kg.articles}
                    onUpdate={() => kg.refresh()}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Orphaned Assets */}
          {health.orphanList?.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
                Orphaned Assets ({health.orphans})
              </h2>
              <div className="space-y-2">
                {health.orphanList.map(a => (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/30 border border-slate-800">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{a.title}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{a.canon_id} · {a.canonical_url}</p>
                    </div>
                    <span className="text-[10px] text-slate-500">No collections or links</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
