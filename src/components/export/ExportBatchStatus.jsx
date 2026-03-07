import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Check, Clock, AlertCircle, Download } from 'lucide-react';

export default function ExportBatchStatus({ batchId }) {
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBatch = async () => {
      try {
        const data = await base44.entities.ContentExportBatch.get(batchId);
        setBatch(data);
      } catch (err) {
        console.error('[ExportBatchStatus] Error loading batch:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBatch();
  }, [batchId]);

  if (loading) {
    return <div className="text-slate-500">Loading...</div>;
  }

  if (!batch) {
    return <div className="text-rose-400">Batch not found</div>;
  }

  const statusConfig = {
    generating: { icon: Clock, text: 'Generating...', color: 'text-blue-400' },
    ready: { icon: Check, text: 'Ready to download', color: 'text-emerald-400' },
    failed: { icon: AlertCircle, text: 'Export failed', color: 'text-rose-400' },
  };

  const config = statusConfig[batch.status] || statusConfig.generating;
  const Icon = config.icon;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
          <div>
            <p className="text-white font-semibold text-sm">{batch.export_name}</p>
            <p className={`text-xs ${config.color}`}>{config.text}</p>
            <p className="text-slate-500 text-xs mt-1">
              {batch.record_count} posts • {batch.file_format.toUpperCase()}
            </p>
          </div>
        </div>
        {batch.status === 'ready' && batch.file_url && (
          <a
            href={batch.file_url}
            download={`export-${batch.id}.${batch.file_format}`}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-3 py-2 rounded transition-colors flex-shrink-0"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        )}
      </div>
      {batch.error_message && (
        <p className="text-rose-400 text-xs mt-2">{batch.error_message}</p>
      )}
    </div>
  );
}