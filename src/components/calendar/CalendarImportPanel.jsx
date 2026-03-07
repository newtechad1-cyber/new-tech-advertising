import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Upload, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export default function CalendarImportPanel({ businessProfileId, onImportComplete }) {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const csvContent = await file.text();

      const response = await base44.functions.invoke('importPostsCalendar', {
        csv_content: csvContent,
        business_profile_id: businessProfileId,
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Import failed');
      }

      setResults(response.data.results);
      if (onImportComplete) {
        onImportComplete(response.data.results);
      }
    } catch (err) {
      console.error('[CalendarImportPanel] Error:', err);
      setError(err.message || 'Import failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-white font-semibold text-lg mb-2">Import Posts to Calendar</h3>
        <p className="text-slate-400 text-sm">
          Upload a CSV file exported from the posting system to add posts to your calendar.
        </p>
      </div>

      {!results ? (
        <div>
          <label className="block">
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 cursor-pointer hover:border-slate-500 transition-colors">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isLoading}
                className="hidden"
              />
              <div className="text-center">
                {isLoading ? (
                  <Loader className="w-8 h-8 text-slate-400 mx-auto mb-2 animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                )}
                <p className="text-white font-semibold text-sm">
                  {isLoading ? 'Importing...' : 'Click to upload CSV or drag and drop'}
                </p>
                <p className="text-slate-500 text-xs mt-1">Only .csv files supported</p>
              </div>
            </div>
          </label>

          {error && (
            <div className="mt-4 bg-rose-900/30 border border-rose-700 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-rose-300 font-semibold text-sm">Import Error</p>
                <p className="text-rose-200 text-xs mt-1">{error}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-slate-300 text-sm">Imported</p>
              <p className="text-emerald-400 font-semibold">{results.imported}</p>
            </div>
            {results.updated > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-slate-300 text-sm">Updated</p>
                <p className="text-blue-400 font-semibold">{results.updated}</p>
              </div>
            )}
            {results.failed > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-slate-300 text-sm">Failed</p>
                <p className="text-rose-400 font-semibold">{results.failed}</p>
              </div>
            )}
          </div>

          {results.errors && results.errors.length > 0 && (
            <div className="bg-rose-900/20 border border-rose-700 rounded-lg p-4">
              <p className="text-rose-300 font-semibold text-sm mb-2">Import Errors</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {results.errors.slice(0, 5).map((err, idx) => (
                  <p key={idx} className="text-rose-200 text-xs">
                    Row {err.row}: {err.reason}
                  </p>
                ))}
                {results.errors.length > 5 && (
                  <p className="text-rose-200 text-xs">
                    +{results.errors.length - 5} more errors
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            onClick={() => setResults(null)}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Import Another File
          </button>
        </div>
      )}
    </div>
  );
}