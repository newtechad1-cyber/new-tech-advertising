import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tv, Plus, RefreshCw, Search, TrendingUp, Eye, Users, DollarSign } from 'lucide-react';
import CampaignCard from '../components/streaming/CampaignCard';
import CampaignAnalyticsModal from '../components/streaming/CampaignAnalyticsModal';
import AddCampaignModal from '../components/streaming/AddCampaignModal';

export default function StreamingDashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [syncing, setSyncing] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    const data = await base44.entities.VibeCampaign.list('-created_date');
    setCampaigns(data);
    setLoading(false);
  };

  const handleSync = async (campaign) => {
    setSyncing(campaign.id);
    try {
      // Create a report for this campaign
      const reportRes = await base44.functions.invoke('vibeCampaigns', {
        action: 'create_report',
        advertiser_id: campaign.advertiser_id,
        campaign_id: campaign.campaign_id,
        metrics: ['impressions', 'spend', 'reach', 'cpm'],
        dimensions: ['campaign_name'],
      });

      // Poll for report completion
      let attempts = 0;
      const pollReport = async (reportId) => {
        if (attempts > 10) return;
        attempts++;
        const statusRes = await base44.functions.invoke('vibeCampaigns', {
          action: 'get_report_status',
          report_id: reportId,
        });

        const rows = statusRes.data?.data;
        if (rows && Array.isArray(rows) && rows.length > 0) {
          const totals = rows.reduce((acc, r) => ({
            impressions: acc.impressions + (r.impressions || 0),
            spend: acc.spend + (r.spend || 0),
            reach: acc.reach + (r.reach || 0),
            cpm: acc.cpm + (r.cpm || 0),
          }), { impressions: 0, spend: 0, reach: 0, cpm: 0 });

          await base44.entities.VibeCampaign.update(campaign.id, {
            cached_impressions: totals.impressions,
            cached_spend: totals.spend,
            cached_reach: totals.reach,
            cached_cpm: rows.length > 0 ? totals.cpm / rows.length : 0,
            last_synced_at: new Date().toISOString(),
          });
          await loadCampaigns();
        } else if (statusRes.data?.status !== 'failed') {
          setTimeout(() => pollReport(reportId), 3000);
        }
      };

      if (reportRes.data?.report_id) {
        await pollReport(reportRes.data.report_id);
      } else if (reportRes.data?.data) {
        // Direct data returned
        const rows = reportRes.data.data;
        if (Array.isArray(rows) && rows.length > 0) {
          const totals = rows.reduce((acc, r) => ({
            impressions: acc.impressions + (r.impressions || 0),
            spend: acc.spend + (r.spend || 0),
            reach: acc.reach + (r.reach || 0),
            cpm: acc.cpm + (r.cpm || 0),
          }), { impressions: 0, spend: 0, reach: 0, cpm: 0 });

          await base44.entities.VibeCampaign.update(campaign.id, {
            cached_impressions: totals.impressions,
            cached_spend: totals.spend,
            cached_reach: totals.reach,
            cached_cpm: rows.length > 0 ? totals.cpm / rows.length : 0,
            last_synced_at: new Date().toISOString(),
          });
          await loadCampaigns();
        }
      }
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setSyncing(null);
    }
  };

  const filtered = campaigns.filter(c => {
    const matchesSearch = !search || c.campaign_name?.toLowerCase().includes(search.toLowerCase()) || c.client_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalImpressions = campaigns.reduce((s, c) => s + (c.cached_impressions || 0), 0);
  const totalSpend = campaigns.reduce((s, c) => s + (c.cached_spend || 0), 0);
  const totalReach = campaigns.reduce((s, c) => s + (c.cached_reach || 0), 0);
  const avgCpm = campaigns.filter(c => c.cached_cpm).length > 0
    ? campaigns.reduce((s, c) => s + (c.cached_cpm || 0), 0) / campaigns.filter(c => c.cached_cpm).length
    : 0;

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-blue-700 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Tv className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Streaming TV Dashboard</h1>
                <p className="text-purple-200 text-sm">Powered by Vibe.co</p>
              </div>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="bg-white text-purple-700 hover:bg-purple-50 font-semibold">
              <Plus className="w-4 h-4 mr-2" /> Add Campaign
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white/15 rounded-xl p-4 text-center">
              <p className="text-purple-200 text-xs mb-1">Active Campaigns</p>
              <p className="text-2xl font-bold">{activeCampaigns}</p>
            </div>
            <div className="bg-white/15 rounded-xl p-4 text-center">
              <p className="text-purple-200 text-xs mb-1">Total Impressions</p>
              <p className="text-2xl font-bold">{totalImpressions.toLocaleString()}</p>
            </div>
            <div className="bg-white/15 rounded-xl p-4 text-center">
              <p className="text-purple-200 text-xs mb-1">Households Reached</p>
              <p className="text-2xl font-bold">{totalReach.toLocaleString()}</p>
            </div>
            <div className="bg-white/15 rounded-xl p-4 text-center">
              <p className="text-purple-200 text-xs mb-1">Total Spend</p>
              <p className="text-2xl font-bold">${totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="bg-white/15 rounded-xl p-4 text-center">
              <p className="text-purple-200 text-xs mb-1">Avg CPM</p>
              <p className="text-2xl font-bold">${avgCpm.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Search campaigns or clients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'active', 'paused', 'completed', 'draft'].map(s => (
              <Button
                key={s}
                size="sm"
                variant={statusFilter === s ? 'default' : 'outline'}
                onClick={() => setStatusFilter(s)}
                className={statusFilter === s ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Campaigns Grid */}
        {loading ? (
          <div className="text-center py-16 text-slate-400">Loading campaigns...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Tv className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-2">No campaigns yet</p>
            <p className="text-slate-400 text-sm mb-6">Add your first Vibe.co campaign to start tracking analytics.</p>
            <Button onClick={() => setShowAddModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Campaign
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(campaign => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onViewAnalytics={setSelectedCampaign}
                onSync={handleSync}
                syncing={syncing}
              />
            ))}
          </div>
        )}
      </div>

      <CampaignAnalyticsModal
        campaign={selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
      />
      <AddCampaignModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSaved={loadCampaigns}
      />
    </div>
  );
}