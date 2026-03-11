import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, Loader2, XCircle, ArrowRight, Activity } from "lucide-react";

const STEPS = [
  { key: "transcript", label: "Transcript", statusKey: "transcript_status" },
  { key: "captions", label: "Captions", statusKey: "captions_status" },
  { key: "branding", label: "Branding", statusKey: "branding_status" },
  { key: "render", label: "Render", statusKey: "render_status" },
  { key: "output", label: "Published", statusKey: "processing_status" },
];

const STATUS_CONFIG = {
  not_started: { Icon: Circle, color: "text-slate-600", bg: "bg-slate-800/60", border: "border-slate-700", label: "Not started" },
  running:     { Icon: Loader2, color: "text-amber-400", bg: "bg-amber-900/20", border: "border-amber-700/40", label: "Running", spin: true },
  completed:   { Icon: CheckCircle2, color: "text-green-400", bg: "bg-green-900/20", border: "border-green-700/40", label: "Completed" },
  failed:      { Icon: XCircle, color: "text-red-400", bg: "bg-red-900/20", border: "border-red-700/40", label: "Failed" },
  saved:       { Icon: CheckCircle2, color: "text-green-400", bg: "bg-green-900/20", border: "border-green-700/40", label: "Saved" },
  in_progress: { Icon: Loader2, color: "text-amber-400", bg: "bg-amber-900/20", border: "border-amber-700/40", label: "In progress", spin: true },
  applied:     { Icon: CheckCircle2, color: "text-violet-400", bg: "bg-violet-900/20", border: "border-violet-700/40", label: "Applied" },
  queued:      { Icon: Loader2, color: "text-blue-400", bg: "bg-blue-900/20", border: "border-blue-700/40", label: "Queued", spin: true },
  rendering:   { Icon: Loader2, color: "text-amber-400", bg: "bg-amber-900/20", border: "border-amber-700/40", label: "Rendering", spin: true },
  // processing_status values mapped
  uploaded:        { Icon: CheckCircle2, color: "text-blue-400", bg: "bg-blue-900/20", border: "border-blue-700/40", label: "Uploaded" },
  processing:      { Icon: Loader2, color: "text-amber-400", bg: "bg-amber-900/20", border: "border-amber-700/40", label: "Processing", spin: true },
  ready_for_review:{ Icon: CheckCircle2, color: "text-cyan-400", bg: "bg-cyan-900/20", border: "border-cyan-700/40", label: "In Review" },
  ready_to_render: { Icon: CheckCircle2, color: "text-violet-400", bg: "bg-violet-900/20", border: "border-violet-700/40", label: "Ready" },
  published:       { Icon: CheckCircle2, color: "text-green-400", bg: "bg-green-900/20", border: "border-green-700/40", label: "Published" },
};

function getStepStatus(step, video) {
  const raw = video[step.statusKey];
  if (!raw) return "not_started";
  return raw;
}

export default function ProcessingPipeline({ video }) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
          <Activity className="w-4 h-4 text-violet-400" />
          Processing Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-stretch gap-1">
          {STEPS.map((step, i) => {
            const status = getStepStatus(step, video);
            const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.not_started;
            const { Icon } = cfg;
            return (
              <React.Fragment key={step.key}>
                <div className={`flex-1 flex flex-col items-center gap-1.5 px-2 py-3 rounded-lg border ${cfg.bg} ${cfg.border}`}>
                  <Icon className={`w-5 h-5 ${cfg.color} ${cfg.spin ? "animate-spin" : ""}`} />
                  <span className="text-xs font-semibold text-slate-300 text-center leading-tight">{step.label}</span>
                  <span className={`text-[10px] font-medium ${cfg.color} text-center leading-tight`}>{cfg.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex items-center self-center">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-700" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}