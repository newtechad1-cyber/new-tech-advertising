import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Video, RefreshCw, Zap } from 'lucide-react';
import AgencyLayout from '../components/agency/AgencyLayout';
import VideoAssetCard from '../components/video-engine/VideoAssetCard';
import VideoAssetFormModal from '../components/video-engine/VideoAssetFormModal';

const TYPE_FILTERS = ['All', 'Outreach', 'Educational', 'Follow-Up', 'Ad'];
const STATUS_FILTERS = ['All', 'Draft', 'Ready', 'Used'];

export default function VideoEngineList() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.VideoAsset.list('-created_date', 100);
    setAssets(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markUsed = async (id) => {
    const today = new Date().toISOString().split('T')[0];
    const asset = assets.find(a => a.id === id);
    await base44.entities.VideoAsset.update(id, {
      status: 'Used',
      times_used: (asset?.times_used || 0) + 1,
      last_used_date: today,
    });
    setAssets(prev => prev.map(a => a.id === id ? { ...a, status: 'Used', times_used: (a.times_used || 0) + 1, last_used_date: today } : a));
  };

  const filtered = assets.filter(a => {
    if (typeFilter !== 'All' && a.video_type !== typeFilter) return false;
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    return true;
  });

  const readyCount = assets.filter(a => a.status === 'Ready').length;
  const needsContent = assets.filter(a => !a.content_generated).length;

  return (
    <AgencyLayout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-400" /> Video Content Engine
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {assets.length} videos · {readyCount} ready
              {needsContent > 0 && <span className="text-amber-400 ml-2">· {needsContent} need content generated</span>}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg"><RefreshCw className="w-4 h-4" /></button>
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-4 py-2 rounded-lg">
              <Plus className="w-4 h-4" /> New Video Asset
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Videos', value: assets.length, color: 'text-white' },
            { label: 'Ready to Use', value: readyCount, color: 'text-emerald-400' },
            { label: 'Content Generated', value: assets.filter(a => a.content_generated).length, color: 'text-blue-400' },
            { label: 'Times Used', value: assets.reduce((s, a) => s + (a.times_used || 0), 0), color: 'text-violet-400' },
          ].map(s => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-600 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map(f => (
            <button key={f} onClick={() => setTypeFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${typeFilter === f ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {f}
            </button>
          ))}
          <div className="w-px bg-slate-700 mx-1" />
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === f ? 'bg-slate-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-48 bg-slate-900 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <Video className="w-8 h-8 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">No video assets found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(asset => (
              <VideoAssetCard key={asset.id} asset={asset} onMarkUsed={markUsed} />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <VideoAssetFormModal
          onClose={() => setShowForm(false)}
          onSaved={(a) => { setAssets(prev => [a, ...prev]); setShowForm(false); }}
        />
      )}
    </AgencyLayout>
  );
}