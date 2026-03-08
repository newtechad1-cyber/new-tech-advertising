import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminGuard from '../components/auth/AdminGuard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, Zap, RefreshCw, FileText, CheckCircle2, Loader2, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import NewAssetForm from '../components/content-engine/NewAssetForm';
import ContentAssetDetail from '../components/content-engine/ContentAssetDetail';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: 'bg-slate-100 text-slate-600',  icon: Clock },
  generating: { label: 'Generating', color: 'bg-yellow-100 text-yellow-700', icon: Loader2 },
  complete:   { label: 'Complete',   color: 'bg-green-100 text-green-700',   icon: CheckCircle2 },
  failed:     { label: 'Failed',     color: 'bg-red-100 text-red-700',       icon: AlertCircle },
};

const TYPE_LABELS = {
  authority_pack: 'Authority Pack',
  blog_article: 'Blog Article',
  case_study: 'Case Study',
  service_page: 'Service Page',
  video_script: 'Video Script',
};

export default function ContentEngine() {
  const [view, setView] = useState('list'); // list | new | detail
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [runningWeekly, setRunningWeekly] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.ContentAsset.list('-created_date', 50);
      setAssets(data);
    } catch (err) {
      toast.error('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreated = async (assetId) => {
    await load();
    const updated = await base44.entities.ContentAsset.filter({ id: assetId });
    if (updated[0]) {
      setSelectedAsset(updated[0]);
      setView('detail');
    }
  };

  const openDetail = async (asset) => {
    setSelectedAsset(asset);
    setView('detail');
  };

  const refreshDetail = async () => {
    if (!selectedAsset) return;
    const updated = await base44.entities.ContentAsset.filter({ id: selectedAsset.id });
    if (updated[0]) setSelectedAsset(updated[0]);
    await load();
  };

  const runWeekly = async () => {
    setRunningWeekly(true);
    try {
      const res = await base44.functions.invoke('weeklyContentMultiplication', {});
      if (res.data?.success) {
        toast.success(`Processed ${res.data.processed} content sources`);
        await load();
      } else {
        toast.error(res.data?.error || 'Weekly run failed');
      }
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setRunningWeekly(false);
    }
  };

  // Stats
  const totalAssets = assets.length;
  const completedAssets = assets.filter(a => a.status === 'complete').length;
  const totalPieces = assets.reduce((sum, a) => sum + (a.assets_generated || 0), 0);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50 pt-14 lg:pt-0">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3 sticky top-14 lg:top-0 z-10">
          <Link to={createPageUrl('AdminDashboard')}>
            <Button variant="ghost" size="sm" className="gap-1 text-slate-500 hover:text-slate-900">← Admin Hub</Button>
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-medium text-slate-700">Content Multiplication Engine</span>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={load}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={runWeekly}
              disabled={runningWeekly}
              className="border-violet-300 text-violet-700 hover:bg-violet-50"
            >
              {runningWeekly ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Zap className="w-3.5 h-3.5 mr-1.5" />}
              Run Weekly Auto
            </Button>
            <Button
              size="sm"
              onClick={() => setView('new')}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              New
            </Button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8">
          {view === 'new' && (
            <NewAssetForm onCancel={() => setView('list')} onCreated={handleCreated} />
          )}

          {view === 'detail' && selectedAsset && (
            <div>
              <div className="mb-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={refreshDetail}>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />Refresh
                </Button>
              </div>
              <ContentAssetDetail asset={selectedAsset} onBack={() => setView('list')} />
            </div>
          )}

          {view === 'list' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-5 pb-4 text-center">
                    <p className="text-3xl font-bold text-slate-900">{totalAssets}</p>
                    <p className="text-sm text-slate-500 mt-1">Content Sources</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5 pb-4 text-center">
                    <p className="text-3xl font-bold text-green-600">{completedAssets}</p>
                    <p className="text-sm text-slate-500 mt-1">Fully Generated</p>
                  </CardContent>
                </Card>
                <Card className="bg-violet-50 border-violet-200">
                  <CardContent className="pt-5 pb-4 text-center">
                    <p className="text-3xl font-bold text-violet-700">{totalPieces}</p>
                    <p className="text-sm text-violet-600 mt-1">Total Assets Created</p>
                  </CardContent>
                </Card>
              </div>

              {/* Asset List */}
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
              ) : assets.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No content multiplied yet</p>
                  <p className="text-sm text-slate-400 mt-1 mb-4">Paste a blog article, case study, or authority pack to generate 9 marketing assets</p>
                  <Button onClick={() => setView('new')} className="bg-violet-600 hover:bg-violet-700">
                    <Plus className="w-4 h-4 mr-2" />Start Multiplying
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {assets.map(asset => {
                    const sc = STATUS_CONFIG[asset.status] || STATUS_CONFIG.pending;
                    const StatusIcon = sc.icon;
                    return (
                      <button
                        key={asset.id}
                        onClick={() => openDetail(asset)}
                        className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-violet-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <Badge className={`text-xs ${sc.color}`}>
                                <StatusIcon className={`w-3 h-3 mr-1 ${asset.status === 'generating' ? 'animate-spin' : ''}`} />
                                {sc.label}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {TYPE_LABELS[asset.content_type] || asset.content_type}
                              </Badge>
                              {asset.assets_generated > 0 && (
                                <span className="text-xs text-emerald-600 font-medium">
                                  {asset.assets_generated}/9 assets
                                </span>
                              )}
                            </div>
                            <p className="font-semibold text-slate-900 truncate">{asset.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {new Date(asset.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>

                          {/* Asset completion pills */}
                          {asset.status === 'complete' && (
                            <div className="hidden sm:flex flex-wrap gap-1 max-w-xs justify-end">
                              {['Blog', 'YouTube', 'TikTok', 'LinkedIn', 'FB', 'Email', 'Guide', 'Images', 'Video'].map((label, i) => (
                                <span key={i} className="text-xs bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-medium">
                                  {label}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}