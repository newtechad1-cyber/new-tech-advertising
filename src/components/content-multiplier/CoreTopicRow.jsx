import React from 'react';
import { Loader2, CheckCircle2, Clock, Globe, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const STATUS_CONFIG = {
  draft:      { icon: Clock,        color: 'text-slate-400', bg: 'bg-slate-800',       label: 'Draft' },
  generating: { icon: Loader2,      color: 'text-blue-400',  bg: 'bg-blue-500/10',     label: 'Generating…', spin: true },
  complete:   { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10',    label: 'Complete' },
  published:  { icon: Globe,        color: 'text-purple-400',bg: 'bg-purple-500/10',   label: 'Published' },
};

const FUNNEL_COLORS = {
  Awareness: 'bg-blue-500/15 text-blue-300',
  Consideration: 'bg-yellow-500/15 text-yellow-300',
  Conversion: 'bg-orange-500/15 text-orange-300',
  Authority: 'bg-purple-500/15 text-purple-300',
};

export default function CoreTopicRow({ core, assetCount, onGenerate, onSelect, selected }) {
  const cfg = STATUS_CONFIG[core.status] || STATUS_CONFIG.draft;
  const Icon = cfg.icon;

  const triggerGenerate = async (e) => {
    e.stopPropagation();
    await base44.entities.AuthorityContentCore.update(core.id, { status: 'generating' });
    toast.promise(onGenerate(core.id), {
      loading: 'Multiplying content…',
      success: 'All assets generated!',
      error: 'Generation failed',
    });
  };

  return (
    <div
      onClick={() => onSelect(core)}
      className={`group flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
        selected ? 'border-blue-500 bg-blue-500/5' : 'border-slate-800 bg-slate-900 hover:border-slate-700'
      }`}
    >
      <div className={`flex-shrink-0 p-2 rounded-lg ${cfg.bg}`}>
        <Icon className={`w-5 h-5 ${cfg.color} ${cfg.spin ? 'animate-spin' : ''}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm truncate">{core.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-500">{core.primary_topic}</span>
          {core.industry && <span className="text-xs text-slate-600">· {core.industry}</span>}
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {core.funnel_stage && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${FUNNEL_COLORS[core.funnel_stage] || ''}`}>
            {core.funnel_stage}
          </span>
        )}
        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
          {assetCount} assets
        </span>
        {core.status === 'draft' && (
          <Button size="sm" onClick={triggerGenerate} className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-7 px-2">
            <Zap className="w-3 h-3 mr-1" /> Generate
          </Button>
        )}
        {core.status === 'complete' && (
          <Button size="sm" variant="outline" onClick={triggerGenerate} className="border-slate-700 text-slate-400 hover:bg-slate-800 text-xs h-7 px-2">
            <RefreshCw className="w-3 h-3 mr-1" /> Regen
          </Button>
        )}
      </div>
    </div>
  );
}