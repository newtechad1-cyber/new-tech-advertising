import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Clock, CheckCircle, Circle, Zap, ArrowRight } from 'lucide-react';

const TYPE_COLORS = {
  Outreach: 'bg-blue-900/50 text-blue-300',
  Educational: 'bg-violet-900/50 text-violet-300',
  'Follow-Up': 'bg-amber-900/50 text-amber-300',
  Ad: 'bg-emerald-900/50 text-emerald-300',
};

const STATUS_COLORS = {
  Draft: 'bg-slate-700 text-slate-400',
  Ready: 'bg-emerald-900/50 text-emerald-300',
  Used: 'bg-slate-800 text-slate-500',
};

export default function VideoAssetCard({ asset, onMarkUsed }) {
  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col gap-3 transition-all group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 bg-blue-900/40 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <Video className="w-4 h-4 text-blue-400" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white truncate group-hover:text-blue-300 transition-colors">
              {asset.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{asset.topic}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[asset.status] || STATUS_COLORS.Draft}`}>
            {asset.status}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[asset.video_type] || TYPE_COLORS.Outreach}`}>
          {asset.video_type}
        </span>
        {asset.duration_seconds && (
          <span className="flex items-center gap-1 text-xs text-slate-600">
            <Clock className="w-3 h-3" />{asset.duration_seconds}s
          </span>
        )}
        {asset.content_generated && (
          <span className="flex items-center gap-1 text-xs text-emerald-600">
            <CheckCircle className="w-3 h-3" /> Content ready
          </span>
        )}
        {!asset.content_generated && (
          <span className="flex items-center gap-1 text-xs text-amber-600">
            <Zap className="w-3 h-3" /> Needs content
          </span>
        )}
      </div>

      {asset.hook && (
        <p className="text-xs text-slate-400 italic line-clamp-2">"{asset.hook}"</p>
      )}

      <div className="flex items-center gap-2 pt-1">
        <Link to={`/agency/video-engine/${asset.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition-colors">
          Open <ArrowRight className="w-3 h-3" />
        </Link>
        {asset.status !== 'Used' && (
          <button onClick={() => onMarkUsed(asset.id)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors">
            <CheckCircle className="w-3 h-3" /> Used
          </button>
        )}
      </div>
    </div>
  );
}