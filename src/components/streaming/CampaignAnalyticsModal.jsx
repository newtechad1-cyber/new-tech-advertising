import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, TrendingUp, Eye, Users, DollarSign } from 'lucide-react';

export default function CampaignAnalyticsModal({ campaign, onClose }) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    if (campaign) fetchReport();
  }, [campaign]);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('vibeCampaigns', {
        action: 'create_report',
        advertiser_id: campaign.advertiser_id,
        campaign_id: campaign.campaign_id,
        start_date: campaign.start_date,
        end_date: campaign.end_date || new Date().toISOString().split('T')[0],
        metrics: ['impressions', 'spend', 'reach', 'cpm'],
        dimensions: ['date'],
      });

      const { report_id } = res.data;
      if (report_id) {
        pollReport(report_id);
      } else if (res.data.data) {
        setReportData(res.data.data);
        setLoading(false);
      } else {
        // API may return data directly or an error
        setReportData(res.data);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const pollReport = async (reportId) => {
    setPolling(true);
    let attempts = 0;
    const maxAttempts = 12;

    const checkStatus = async () => {
      if (attempts >= maxAttempts) {
        setError('Report timed out. Please try again.');
        setLoading(false);
        setPolling(false);
        return;
      }
      attempts++;
      const res = await base44.functions.invoke('vibeCampaigns', {
        action: 'get_report_status',
        report_id: reportId,
      });

      if (res.data.status === 'complete' || res.data.data) {
        setReportData(res.data.data || res.data);
        setLoading(false);
        setPolling(false);
      } else if (res.data.status === 'failed') {
        setError('Report generation failed.');
        setLoading(false);
        setPolling(false);
      } else {
        setTimeout(checkStatus, 3000);
      }
    };

    setTimeout(checkStatus, 2000);
  };

  const chartData = Array.isArray(reportData)
    ? reportData.map(row => ({
        date: row.date || row.dimension_value,
        impressions: row.impressions || 0,
        spend: row.spend || 0,
        reach: row.reach || 0,
        cpm: row.cpm || 0,
      }))
    : [];

  const totals = chartData.reduce((acc, row) => ({
    impressions: acc.impressions + row.impressions,
    spend: acc.spend + row.spend,
    reach: acc.reach + row.reach,
    cpm: chartData.length ? chartData.reduce((s, r) => s + r.cpm, 0) / chartData.length : 0,
  }), { impressions: 0, spend: 0, reach: 0, cpm: 0 });

  return (
    <Dialog open={!!campaign} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{campaign?.campaign_name} — Analytics</DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <p className="text-slate-500">{polling ? 'Building report...' : 'Loading...'}</p>
          </div>
        )}

        {error && (
          <div className="py-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchReport} variant="outline">Retry</Button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Impressions', value: totals.impressions.toLocaleString(), icon: Eye, color: 'text-purple-600' },
                { label: 'Households', value: totals.reach.toLocaleString(), icon: Users, color: 'text-blue-600' },
                { label: 'Total Spend', value: `$${totals.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-green-600' },
                { label: 'Avg CPM', value: `$${totals.cpm.toFixed(2)}`, icon: TrendingUp, color: 'text-orange-600' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-slate-50 rounded-lg p-3 text-center">
                  <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="font-bold text-slate-900">{value}</p>
                </div>
              ))}
            </div>

            {chartData.length > 0 && (
              <>
                <h4 className="font-semibold text-slate-700 mb-2">Impressions Over Time</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="impressions" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}

            {chartData.length === 0 && (
              <p className="text-center text-slate-400 py-8">No data available for this campaign yet.</p>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}