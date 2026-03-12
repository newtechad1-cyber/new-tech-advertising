import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Download, Share2, Phone, Eye, Check } from 'lucide-react';

function MonthButton({ month, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${
        isActive
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
      }`}
    >
      {month}
    </button>
  );
}

export default function ClientROIReports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.ClientMonthlyROIReport.list('-report_month', 50).then(r => {
      setReports(r);
      if (r.length > 0) {
        setSelectedReport(r[0]);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-sm animate-pulse">Loading your growth reports…</div>
      </div>
    );
  }

  const reportMonths = reports.map(r => ({
    label: new Date(r.report_month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    date: r.report_month,
    id: r.id,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-5 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Monthly Growth Reports</h1>
          <p className="text-slate-600 text-sm mt-1">Clear insights into your marketing progress</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 space-y-8">

        {/* SECTION 1 — Report Month Selector */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-3">Select Report</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {reportMonths.map(month => (
              <MonthButton
                key={month.id}
                month={month.label}
                isActive={selectedReport?.id === month.id}
                onClick={() => {
                  const report = reports.find(r => r.id === month.id);
                  setSelectedReport(report);
                }}
              />
            ))}
          </div>
        </div>

        {selectedReport && (
          <>
            {/* SECTION 2 — Growth Highlight Hero */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-100 p-6 sm:p-8">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-100 mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  {new Date(selectedReport.report_month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                {selectedReport.growth_highlight}
              </h2>
            </div>

            {/* SECTION 3 — Visibility & Engagement Narrative */}
            <div className="space-y-5">
              {/* Visibility */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-6 rounded-full bg-blue-600" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Visibility Momentum</h3>
                </div>
                <p className="text-base text-slate-700 leading-relaxed">
                  {selectedReport.visibility_summary}
                </p>
              </div>

              {/* Engagement */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-6 rounded-full bg-emerald-600" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Engagement Growth</h3>
                </div>
                <p className="text-base text-slate-700 leading-relaxed">
                  {selectedReport.engagement_summary}
                </p>
              </div>
            </div>

            {/* SECTION 4 — Marketing Activity Review */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">Marketing Performance</p>
              <div className="space-y-4">
                {/* Campaign Activity */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h4 className="text-sm font-black text-slate-900 mb-2">Campaign Consistency</h4>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {selectedReport.campaign_activity_summary}
                  </p>
                </div>

                {/* Video Performance */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h4 className="text-sm font-black text-slate-900 mb-2">Video Performance</h4>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {selectedReport.video_performance_summary}
                  </p>
                </div>

                {/* Content Activity */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h4 className="text-sm font-black text-slate-900 mb-2">Content Activity</h4>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {selectedReport.campaign_activity_summary ? 'Your consistent publishing schedule continues to build visibility with your audience. Regular content keeps you top-of-mind.' : 'Content activity tracking.'}
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 5 — Next Focus Recommendation */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💡</div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-2">Next Month's Focus</h3>
                  <p className="text-base text-slate-800 leading-relaxed">
                    {selectedReport.next_focus_recommendation}
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 6 — Client Action Strip */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-600">What's Next?</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
                  <Check className="w-4 h-4" /> Mark Reviewed
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold rounded-xl transition-colors">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold rounded-xl transition-colors">
                  <Phone className="w-4 h-4" /> Strategy Call
                </button>
              </div>
            </div>

            {/* Print Friendly Note */}
            <div className="text-center text-xs text-slate-500">
              💾 This report is printable and shareable. Use your browser's print function or download.
            </div>
          </>
        )}

        {reports.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-slate-600">No reports available yet. Check back soon!</p>
          </div>
        )}

      </div>
    </div>
  );
}