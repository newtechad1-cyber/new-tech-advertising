import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { TrendingUp, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function ProgrammaticSEODashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initLoading, setInitLoading] = useState(false);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [queued, completed, failed] = await Promise.all([
        base44.entities.PageGenerationQueue.filter({ generation_status: 'queued' }),
        base44.entities.PageGenerationQueue.filter({ generation_status: 'completed' }),
        base44.entities.PageGenerationQueue.filter({ generation_status: 'failed' }),
      ]);

      setStats({
        queued: queued.length,
        completed: completed.length,
        failed: failed.length,
        total: queued.length + completed.length + failed.length,
        pages_generated: completed.length * 5,
        pages_potential: (queued.length + completed.length + failed.length) * 5,
        traffic_estimate: completed.length * 5 * 50, // 50 visits per page
        completion_percent: Math.round((completed.length / (queued.length + completed.length + failed.length)) * 100),
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const initializeQueue = async () => {
    try {
      setInitLoading(true);
      const response = await base44.functions.invoke('initializeProgrammaticSEOQueue', {
        reset_existing: true
      });
      alert(`✅ Queue initialized!\n\n${response.data.total_entries} entries created (${response.data.total_pages} total pages)`);
      await loadStats();
    } catch (err) {
      alert('❌ Error: ' + err.message);
    } finally {
      setInitLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Programmatic SEO Dashboard</h1>
          <p className="text-slate-400">500-page rollout: 100 cities × 5 services, 7 pages/day</p>
        </div>

        {/* Main Stats */}
        <div className="grid lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-2">Pages Generated</p>
            <p className="text-4xl font-bold text-green-400">{stats.pages_generated}</p>
            <p className="text-slate-500 text-xs mt-2">of {stats.pages_potential}</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-2">Completion</p>
            <p className="text-4xl font-bold text-violet-400">{stats.completion_percent}%</p>
            <p className="text-slate-500 text-xs mt-2">{stats.completed + stats.failed} of {stats.total}</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-2">Organic Traffic Est.</p>
            <p className="text-4xl font-bold text-blue-400">{stats.traffic_estimate.toLocaleString()}</p>
            <p className="text-slate-500 text-xs mt-2">visits/month</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-2">Days Remaining</p>
            <p className="text-4xl font-bold text-amber-400">{Math.ceil(stats.queued / 7)}</p>
            <p className="text-slate-500 text-xs mt-2">at 7 cities/day</p>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-emerald-900/20 border border-emerald-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              <h3 className="text-white font-semibold">Completed</h3>
            </div>
            <p className="text-3xl font-bold text-emerald-400">{stats.completed}</p>
            <p className="text-emerald-300 text-sm mt-2">Cities fully processed</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-slate-400" />
              <h3 className="text-white font-semibold">Queued</h3>
            </div>
            <p className="text-3xl font-bold text-slate-300">{stats.queued}</p>
            <p className="text-slate-400 text-sm mt-2">Waiting to process</p>
          </div>

          <div className="bg-rose-900/20 border border-rose-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-rose-400" />
              <h3 className="text-white font-semibold">Failed</h3>
            </div>
            <p className="text-3xl font-bold text-rose-400">{stats.failed}</p>
            <p className="text-rose-300 text-sm mt-2">Need retry</p>
          </div>
        </div>

        {/* Initialize Queue */}
        {stats.total === 0 && (
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-8 text-center">
            <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Ready to Begin?</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Initialize the queue to start generating 500 pages across 100 cities. Daily automation will generate 7 pages/day.
            </p>
            <button
              onClick={initializeQueue}
              disabled={initLoading}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-lg"
            >
              {initLoading ? 'Initializing...' : 'Initialize SEO Queue'}
            </button>
          </div>
        )}

        {/* Info */}
        <div className="mt-12 bg-slate-900 border border-slate-700 rounded-lg p-8">
          <h3 className="text-lg font-bold text-white mb-4">📊 Rollout Strategy</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-300">
            <div>
              <p className="font-semibold text-white mb-2">🎯 Tier 1 (Days 1-26)</p>
              <p>25 cities × 5 services = 125 pages. Highest opportunity metro areas.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">📈 Tier 2 (Days 27-58)</p>
              <p>35 cities × 5 services = 175 pages. Strong regional markets.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">🚀 Tier 3 (Days 59-100+)</p>
              <p>40 cities × 5 services = 200 pages. High contractor density.</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-slate-800 rounded border border-slate-600">
            <p className="text-xs text-slate-400">
              <strong>Google-Safe Pacing:</strong> 5-10 pages/day prevents spam detection. Natural rollout looks like gradual content expansion, not automated spam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}