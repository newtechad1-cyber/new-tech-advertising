import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Download, FileJson, FileText, Calendar, Loader } from 'lucide-react';

export default function ExportOptionsMenu({ postIds, businessProfileId, exportType = 'selected_posts' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExport = async (format) => {
    if (!postIds || postIds.length === 0) {
      setError('No posts selected for export');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let response;

      if (format === 'calendar') {
        response = await base44.functions.invoke('exportPostsCalendar', {
          post_ids: postIds,
          business_profile_id: businessProfileId,
          template_slug: 'base44-posting-calendar-csv',
        });
      } else {
        response = await base44.functions.invoke('exportSocialPosts', {
          post_ids: postIds,
          export_type: exportType,
          file_format: format,
          business_profile_id: businessProfileId,
        });
      }

      if (!response.data.success) {
        throw new Error(response.data.error || 'Export failed');
      }

      // Download file
      const fileContent = response.data.file_content;
      const fileName = response.data.file_name;
      const mimeType = format === 'json' ? 'application/json' : 'text/csv';

      const blob = new Blob([fileContent], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      setIsOpen(false);
    } catch (err) {
      console.error('[ExportOptionsMenu] Error:', err);
      setError(err.message || 'Export failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
      >
        {isLoading ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        Export
      </button>

      {isOpen && !isLoading && (
        <div className="absolute right-0 top-full mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 min-w-56">
          <div className="p-2">
            <button
              onClick={() => handleExport('calendar')}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800 rounded transition-colors text-left border-b border-slate-700"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-white font-semibold text-sm">Posting Calendar (CSV)</p>
                <p className="text-slate-500 text-xs">Import into calendar</p>
              </div>
            </button>

            <button
              onClick={() => handleExport('csv')}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800 rounded transition-colors text-left border-b border-slate-700"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-white font-semibold text-sm">Generic CSV</p>
                <p className="text-slate-500 text-xs">For spreadsheets</p>
              </div>
            </button>

            <button
              onClick={() => handleExport('json')}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800 rounded transition-colors text-left"
            >
              <FileJson className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-white font-semibold text-sm">JSON</p>
                <p className="text-slate-500 text-xs">For integrations</p>
              </div>
            </button>
          </div>
          {error && (
            <div className="px-4 py-2 bg-rose-900/30 border-t border-slate-700 text-rose-300 text-xs">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}