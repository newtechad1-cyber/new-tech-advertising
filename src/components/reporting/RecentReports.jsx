import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Eye, Send, Edit2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RecentReports() {
  const { data: reports = [] } = useQuery({
    queryKey: ['recent-reports'],
    queryFn: () => base44.entities.ClientPerformanceReport?.list?.('-generated_at', 20).catch(() => []),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['reports-clients'],
    queryFn: () => base44.entities.ClientCompanies?.list?.('-updated_date', 500).catch(() => []),
  });

  const reportsWithClient = reports.map(report => {
    const client = clients.find(c => c.id === report.company_id);
    return { ...report, clientName: client?.name || 'Unknown Client' };
  });

  const getStatusColor = (status) => {
    if (status === 'sent') return 'text-emerald-400 bg-emerald-900/20';
    if (status === 'ready') return 'text-blue-400 bg-blue-900/20';
    if (status === 'failed') return 'text-red-400 bg-red-900/20';
    return 'text-slate-400 bg-slate-800/20';
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <h3 className="text-sm font-bold text-white mb-4">Recent Reports</h3>

      {reportsWithClient.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {reportsWithClient.map((report, idx) => (
            <div key={idx} className="border border-slate-700 rounded-lg p-4 hover:bg-slate-800/50 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{report.clientName}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(report.report_start_date).toLocaleDateString()} – {new Date(report.report_end_date).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${getStatusColor(report.delivery_status)}`}>
                  {report.delivery_status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                <span>{report.content_published_count} items published</span>
                <span>•</span>
                <span>{report.campaigns_active} campaigns active</span>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1 text-slate-400 hover:text-slate-300">
                  <Eye className="w-3 h-3" /> Preview
                </Button>
                {report.delivery_status !== 'sent' && (
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1 text-slate-400 hover:text-slate-300">
                    <Send className="w-3 h-3" /> Send
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1 text-slate-400 hover:text-slate-300">
                  <Edit2 className="w-3 h-3" /> Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-slate-500">
          <p className="text-sm">No reports generated yet</p>
        </div>
      )}
    </div>
  );
}