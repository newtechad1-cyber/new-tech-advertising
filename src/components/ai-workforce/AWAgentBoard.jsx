import React from 'react';
import { Loader2, CheckCircle2, PauseCircle, AlertCircle, WifiOff, Zap } from 'lucide-react';

const STATUS_CFG = {
  running: { color: '#10b981', icon: Loader2, label: 'Running', spin: true, glow: '0 0 8px #10b98150' },
  idle:    { color: '#64748b', icon: CheckCircle2, label: 'Idle', spin: false, glow: '' },
  paused:  { color: '#f59e0b', icon: PauseCircle, label: 'Paused', spin: false, glow: '' },
  error:   { color: '#ef4444', icon: AlertCircle, label: 'Error', spin: false, glow: '0 0 8px #ef444440' },
  offline: { color: '#475569', icon: WifiOff, label: 'Offline', spin: false, glow: '' },
};

const TYPE_COLORS = {
  content_writer:    '#3b82f6', social_publisher: '#8b5cf6', seo_optimizer: '#10b981',
  video_producer:    '#f59e0b', review_monitor:   '#06b6d4', ranking_tracker: '#ec4899',
  email_marketer:    '#84cc16', lead_scorer:       '#f97316', report_generator: '#a78bfa',
  campaign_launcher: '#22d3ee',
};

const TYPE_LABELS = {
  content_writer: 'Content Writer', social_publisher: 'Social Publisher', seo_optimizer: 'SEO Optimizer',
  video_producer: 'Video Producer', review_monitor: 'Review Monitor', ranking_tracker: 'Ranking Tracker',
  email_marketer: 'Email Marketer', lead_scorer: 'Lead Scorer', report_generator: 'Report Generator',
  campaign_launcher: 'Campaign Launcher',
};

function LoadBar({ pct }) {
  const color = pct > 80 ? '#ef4444' : pct > 60 ? '#f59e0b' : '#10b981';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-bold flex-shrink-0 w-7 text-right" style={{ color }}>{pct}%</span>
    </div>
  );
}

export default function AWAgentBoard({ agents, onPause, onResume }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" /> Live Agent Status Board
        </h3>
        <span className="text-xs text-slate-500">{agents.filter(a => a.status === 'running').length} active</span>
      </div>
      <div className="grid grid-cols-4 gap-3 p-4">
        {agents.map((agent, i) => {
          const sCfg = STATUS_CFG[agent.status] || STATUS_CFG.idle;
          const Icon = sCfg.icon;
          const typeColor = TYPE_COLORS[agent.agent_type] || '#64748b';
          return (
            <div key={agent.id || i} className="p-4 rounded-xl border transition-all" style={{
              borderColor: agent.status === 'running' ? `${typeColor}40` : '#1e293b',
              background: agent.status === 'running' ? `${typeColor}08` : '#0f172a',
              boxShadow: sCfg.glow,
            }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: typeColor, boxShadow: agent.status === 'running' ? `0 0 5px ${typeColor}` : '' }} />
                    <p className="text-xs font-bold" style={{ color: typeColor }}>{TYPE_LABELS[agent.agent_type] || agent.agent_type}</p>
                  </div>
                  <p className="text-white text-sm font-bold">{agent.agent_name}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Icon className={`w-3.5 h-3.5 ${sCfg.spin ? 'animate-spin' : ''}`} style={{ color: sCfg.color }} />
                </div>
              </div>

              {agent.current_task && (
                <p className="text-slate-400 text-xs mb-2 leading-relaxed line-clamp-2">{agent.current_task}</p>
              )}
              {agent.assigned_client && (
                <p className="text-slate-600 text-xs mb-2 truncate">→ {agent.assigned_client}</p>
              )}

              <LoadBar pct={agent.load_percent || 0} />

              <div className="flex items-center justify-between mt-3 text-xs">
                <span className="text-slate-600">{agent.jobs_today || 0} jobs today</span>
                <span className="font-bold" style={{ color: (agent.success_rate || 0) > 90 ? '#10b981' : '#f59e0b' }}>
                  {agent.success_rate || 0}% ✓
                </span>
              </div>

              <div className="flex gap-1.5 mt-3">
                {agent.status === 'running' ? (
                  <button onClick={() => onPause(agent)}
                    className="flex-1 text-xs py-1.5 rounded-lg text-amber-400 border border-amber-800/40 hover:bg-amber-900/20 transition-colors font-semibold">
                    Pause
                  </button>
                ) : agent.status === 'paused' ? (
                  <button onClick={() => onResume(agent)}
                    className="flex-1 text-xs py-1.5 rounded-lg text-green-400 border border-green-800/40 hover:bg-green-900/20 transition-colors font-semibold">
                    Resume
                  </button>
                ) : agent.status === 'error' ? (
                  <button onClick={() => onResume(agent)}
                    className="flex-1 text-xs py-1.5 rounded-lg text-cyan-400 border border-cyan-800/40 hover:bg-cyan-900/20 transition-colors font-semibold">
                    Retry
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
        {agents.length === 0 && (
          <div className="col-span-4 py-10 text-center text-slate-500 text-sm">No agents deployed. Click "Deploy Agent" to get started.</div>
        )}
      </div>
    </div>
  );
}