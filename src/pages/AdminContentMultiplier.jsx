import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import AdminGuard from '@/components/auth/AdminGuard';
import AdminNav from '@/components/nav/AdminNav';
import CoreTopicForm from '@/components/content-multiplier/CoreTopicForm';
import CoreTopicRow from '@/components/content-multiplier/CoreTopicRow';
import AssetGrid from '@/components/content-multiplier/AssetGrid';
import AssetDrawer from '@/components/content-multiplier/AssetDrawer';
import { Button } from '@/components/ui/button';
import { Plus, Layers, Zap, CheckCircle2, Globe, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminContentMultiplier() {
  const [cores, setCores] = useState([]);
  const [assets, setAssets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [coreData, assetData] = await Promise.all([
      base44.entities.AuthorityContentCore.list('-created_date', 50),
      base44.entities.ContentAsset.list('-created_date', 500),
    ]);
    setCores(coreData);
    setAssets(assetData);
    if (!selected && coreData.length > 0) setSelected(coreData[0]);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Poll while any core is generating
  useEffect(() => {
    const hasGenerating = cores.some(c => c.status === 'generating');
    if (!hasGenerating) return;
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, [cores, loadData]);

  const handleGenerate = async (coreId) => {
    await base44.functions.invoke('runContentMultiplier', { core_id: coreId });
    await loadData();
  };

  const selectedAssets = selected ? assets.filter(a => a.core_content_id === selected.id) : [];

  const stats = {
    total: cores.length,
    generating: cores.filter(c => c.status === 'generating').length,
    complete: cores.filter(c => c.status === 'complete').length,
    published: cores.filter(c => c.status === 'published').length,
    totalAssets: assets.length,
  };

  return (
    <AdminGuard>
      <AdminNav currentPageName="AdminContentMultiplier">
        <div className="min-h-screen bg-slate-950 text-white">
          {/* Header */}
          <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-5">
            <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-600/20">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Content Multiplier Engine</h1>
                  <p className="text-slate-400 text-sm">One topic → 35+ production-ready assets</p>
                </div>
              </div>
              <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
                <Plus className="w-4 h-4 mr-2" /> New Authority Topic
              </Button>
            </div>
          </div>

          {/* KPI Bar */}
          <div className="border-b border-slate-800 px-6 py-3 bg-slate-900/30">
            <div className="flex items-center gap-6 max-w-screen-2xl mx-auto">
              {[
                { label: 'Topics', value: stats.total, icon: Layers, color: 'text-slate-300' },
                { label: 'Generating', value: stats.generating, icon: Zap, color: 'text-blue-400' },
                { label: 'Complete', value: stats.complete, icon: CheckCircle2, color: 'text-green-400' },
                { label: 'Published', value: stats.published, icon: Globe, color: 'text-purple-400' },
                { label: 'Total Assets', value: stats.totalAssets, icon: TrendingUp, color: 'text-orange-400' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className={`text-lg font-bold ${color}`}>{value}</span>
                  <span className="text-slate-500 text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Layout */}
          <div className="flex h-[calc(100vh-140px)] max-w-screen-2xl mx-auto">
            {/* Left — Topic Queue */}
            <div className="w-96 flex-shrink-0 border-r border-slate-800 overflow-y-auto p-4 space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Authority Topics Queue</p>
              {loading ? (
                <div className="space-y-2">
                  {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-slate-800 animate-pulse" />)}
                </div>
              ) : cores.length === 0 ? (
                <div className="text-center py-12">
                  <Zap className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">No topics yet</p>
                  <button onClick={() => setShowForm(true)} className="text-blue-400 text-sm mt-1 hover:text-blue-300">Create your first topic →</button>
                </div>
              ) : (
                cores.map(core => (
                  <CoreTopicRow
                    key={core.id}
                    core={core}
                    assetCount={assets.filter(a => a.core_content_id === core.id).length}
                    onGenerate={handleGenerate}
                    onSelect={setSelected}
                    selected={selected?.id === core.id}
                  />
                ))
              )}
            </div>

            {/* Right — Asset Panel */}
            <div className="flex-1 overflow-y-auto p-6">
              {selected ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-white">{selected.title}</h2>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-sm text-slate-400">{selected.primary_topic}</span>
                      {selected.industry && <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">{selected.industry}</span>}
                      {selected.funnel_stage && <span className="text-xs bg-slate-800 text-blue-300 px-2 py-0.5 rounded">{selected.funnel_stage}</span>}
                    </div>
                  </div>

                  {selected.longform_article && (
                    <div className="mb-6 p-4 rounded-xl border border-slate-700 bg-slate-900">
                      <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Long-form Authority Article</p>
                      <p className="text-slate-300 text-sm line-clamp-4 leading-relaxed whitespace-pre-wrap">
                        {selected.longform_article}
                      </p>
                      <button
                        onClick={() => navigator.clipboard.writeText(selected.longform_article).then(() => toast.success('Copied!'))}
                        className="text-blue-400 text-xs mt-2 hover:text-blue-300"
                      >
                        Copy full article →
                      </button>
                    </div>
                  )}

                  <AssetGrid assets={selectedAssets} onSelect={setSelectedAsset} />
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Layers className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500">Select a topic to view its assets</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {showForm && (
            <CoreTopicForm
              onClose={() => setShowForm(false)}
              onCreated={() => { loadData(); setShowForm(false); }}
            />
          )}

          {selectedAsset && (
            <AssetDrawer
              asset={selectedAsset}
              onClose={() => setSelectedAsset(null)}
              onUpdated={loadData}
            />
          )}
        </div>
      </AdminNav>
    </AdminGuard>
  );
}