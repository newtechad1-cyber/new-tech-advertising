import React from 'react';
import { Calendar, BarChart3 } from 'lucide-react';

export default function ReportHeader({ report }) {
  const startDate = new Date(report.report_start_date);
  const endDate = new Date(report.report_end_date);

  const formatDateRange = () => {
    return `${startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} – ${endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="bg-gradient-to-r from-cyan-900/30 to-slate-900 border border-cyan-700 rounded-xl p-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Your Marketing Performance</h2>
          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{formatDateRange()}</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm capitalize">{report.report_period} report</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-slate-300 max-w-2xl">
        This report summarizes your marketing activity, brand visibility growth, and strategic progress over the reporting period.
      </p>
    </div>
  );
}