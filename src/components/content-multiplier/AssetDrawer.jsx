import React from 'react';
import { X, Copy, CheckCircle } from 'lucide-react';
import { getAssetMeta } from './AssetTypeIcon';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const STATUS_COLORS = {
  draft: 'bg-slate-700 text-slate-300',
  ready: 'bg-blue-500/20 text-blue-300',
  scheduled: 'bg-yellow-500/20 text-yellow-300',
  published: 'bg-green-500/20 text-green-300',
};

export default function AssetDrawer({ asset, onClose, onUpdated }) {
  if (!asset) return null;
  const meta = getAssetMeta(asset.asset_type);

  const copy = () => {
    navigator.clipboard.writeText(asset.content_body || '');
    toast.success('Copied to clipboard');
  };

  const markReady = async () => {
    await base44.entities.ContentAsset.update(asset.id, { publish_status: 'ready' });
    toast.success('Marked as ready');
    onUpdated?.();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-end z-50">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-700 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center justify-center rounded-lg ${meta.bg} p-2`}>
              <meta.icon className={`w-5 h-5 ${meta.color}`} />
            </span>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">{meta.label}</p>
              <h3 className="text-white font-semibold leading-tight">{asset.title}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800">
          {asset.platform_target && (
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">{asset.platform_target}</span>
          )}
          {asset.keyword_focus && (
            <span className="text-xs bg-slate-800 text-blue-300 px-2 py-1 rounded">🔑 {asset.keyword_focus}</span>
          )}
          <span className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[asset.publish_status] || STATUS_COLORS.draft}`}>
            {asset.publish_status}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <pre className="text-slate-200 text-sm whitespace-pre-wrap font-sans leading-relaxed">
            {asset.content_body || 'No content generated yet.'}
          </pre>
        </div>

        <div className="p-4 border-t border-slate-800 flex gap-2">
          <Button onClick={copy} variant="outline" className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800">
            <Copy className="w-4 h-4 mr-2" /> Copy
          </Button>
          {asset.publish_status === 'draft' && (
            <Button onClick={markReady} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white">
              <CheckCircle className="w-4 h-4 mr-2" /> Mark Ready
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}