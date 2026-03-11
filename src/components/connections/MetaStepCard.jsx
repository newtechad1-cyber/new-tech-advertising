import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2, XCircle, Circle, Loader2, ChevronDown, ChevronUp, AlertTriangle
} from "lucide-react";

const STEP_STATUS = {
  ready:       { label: "Ready",       cls: "bg-green-900/40 text-green-300 border-green-700/40",  dot: "bg-green-400",  numBg: "bg-green-900/40 border-green-700 text-green-300" },
  incomplete:  { label: "Incomplete",  cls: "bg-amber-900/30 text-amber-300 border-amber-700/40", dot: "bg-amber-400",  numBg: "bg-amber-900/40 border-amber-700 text-amber-300" },
  blocked:     { label: "Blocked",     cls: "bg-red-900/30 text-red-300 border-red-700/40",        dot: "bg-red-400",    numBg: "bg-red-900/40 border-red-700 text-red-300" },
  pending:     { label: "Pending",     cls: "bg-blue-900/30 text-blue-300 border-blue-700/40",     dot: "bg-blue-400",   numBg: "bg-blue-900/40 border-blue-700 text-blue-300" },
  not_started: { label: "Not Started", cls: "bg-slate-800 text-slate-500 border-slate-700",         dot: "bg-slate-600",  numBg: "bg-slate-800 border-slate-700 text-slate-600" },
};

export default function MetaStepCard({ step, title, status = 'not_started', description, checks = [], actions = [], result }) {
  const [expanded, setExpanded] = useState(status !== 'ready');
  const cfg = STEP_STATUS[status] || STEP_STATUS.not_started;

  return (
    <div className={`rounded-2xl border-2 transition-all ${
      status === 'ready'      ? 'bg-slate-900 border-green-800/25' :
      status === 'incomplete' ? 'bg-slate-900 border-amber-800/25' :
      status === 'blocked'    ? 'bg-slate-900 border-red-800/25' :
                                'bg-slate-900 border-slate-800'
    }`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-800/20 rounded-2xl transition-colors"
      >
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${cfg.numBg}`}>
          {status === 'ready' ? <CheckCircle2 className="w-4 h-4" /> : step}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-100">{title}</p>
          {!expanded && description && (
            <p className="text-[11px] text-slate-500 truncate mt-0.5">{description}</p>
          )}
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold flex-shrink-0 ${cfg.cls}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-600 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-600 flex-shrink-0" />}
      </button>

      {/* Body */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-800">
          {description && <p className="text-xs text-slate-400 leading-relaxed pt-4">{description}</p>}

          {/* Checks */}
          {checks.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[9px] text-slate-600 uppercase tracking-widest font-semibold">Verification Checks</p>
              {checks.map((check, i) => (
                <div key={i} className={`flex items-start gap-2.5 px-3 py-2 rounded-lg border ${
                  check.passed === true  ? 'bg-green-950/20 border-green-800/20' :
                  check.passed === false ? 'bg-red-950/20 border-red-800/20' :
                                           'bg-slate-800/30 border-slate-700/40'
                }`}>
                  {check.passed === true  ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" /> :
                   check.passed === false ? <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" /> :
                                            <Circle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium leading-snug ${
                      check.passed === true ? 'text-green-300' :
                      check.passed === false ? 'text-red-300' : 'text-slate-500'
                    }`}>{check.label}</p>
                    {check.note && <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">{check.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {actions.map((action, i) => (
                <Button key={i} size="sm"
                  variant={action.primary ? "default" : "outline"}
                  onClick={action.onClick}
                  disabled={action.loading || action.disabled}
                  className={action.primary
                    ? "bg-violet-600 hover:bg-violet-500 gap-1.5 text-xs font-bold"
                    : "border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 gap-1.5 text-xs"
                  }
                >
                  {action.loading && <Loader2 className="w-3 h-3 animate-spin" />}
                  {!action.loading && action.Icon && <action.Icon className="w-3 h-3" />}
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {/* Result */}
          {result && !result.loading && (
            <div className={`flex items-start gap-2 px-3 py-2.5 rounded-lg border text-xs ${
              result.success
                ? 'bg-green-900/20 border-green-700/30 text-green-300'
                : 'bg-red-900/20 border-red-700/30 text-red-300'
            }`}>
              {result.success
                ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                : <XCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
              <p className="leading-snug">{result.success ? result.message : (result.error || 'Test failed')}</p>
            </div>
          )}
          {result?.loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Running check...
            </div>
          )}
        </div>
      )}
    </div>
  );
}