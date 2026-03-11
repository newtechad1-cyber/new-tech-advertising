import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, Loader2, XCircle, FileText, Type, Palette, Play, Rocket, Upload } from "lucide-react";

function deriveEvents(video) {
  const events = [];
  const created = video.created_date ? new Date(video.created_date) : null;

  if (created) {
    events.push({
      id: "upload",
      icon: Upload,
      color: "text-blue-400",
      bg: "bg-blue-900/20 border-blue-700/30",
      label: "Video uploaded to workspace",
      detail: video.title,
      time: created,
      status: "done",
    });
  }

  if (video.transcript_status && video.transcript_status !== "not_started") {
    const isRunning = video.transcript_status === "running";
    const isFailed = video.transcript_status === "failed";
    events.push({
      id: "transcript",
      icon: FileText,
      color: isRunning ? "text-amber-400" : isFailed ? "text-red-400" : "text-green-400",
      bg: isRunning ? "bg-amber-900/20 border-amber-700/30" : isFailed ? "bg-red-900/20 border-red-700/30" : "bg-green-900/20 border-green-700/30",
      label: isRunning ? "Generating transcript..." : isFailed ? "Transcript generation failed" : "Transcript generated",
      detail: video.transcript_status === "completed" && video.transcript_text
        ? `${video.transcript_text.split(" ").length} words`
        : null,
      time: null,
      status: video.transcript_status,
    });
  }

  if (video.captions_status && video.captions_status !== "not_started") {
    const isRunning = video.captions_status === "running";
    const isFailed = video.captions_status === "failed";
    const captionCount = video.captions_json ? video.captions_json.trim().split("\n").filter(Boolean).length : 0;
    events.push({
      id: "captions",
      icon: Type,
      color: isRunning ? "text-amber-400" : isFailed ? "text-red-400" : "text-green-400",
      bg: isRunning ? "bg-amber-900/20 border-amber-700/30" : isFailed ? "bg-red-900/20 border-red-700/30" : "bg-green-900/20 border-green-700/30",
      label: isRunning ? "Generating captions..." : isFailed ? "Caption generation failed" : "AI captions created",
      detail: captionCount > 0 ? `${captionCount} caption block${captionCount > 1 ? "s" : ""} · ${(video.caption_style || "clean_minimal").replace("_", " ")}` : null,
      time: null,
      status: video.captions_status,
    });
  }

  if (video.branding_status && video.branding_status !== "not_started") {
    const statusMap = {
      in_progress: { color: "text-amber-400", bg: "bg-amber-900/20 border-amber-700/30", label: "Branding assets being configured..." },
      saved: { color: "text-green-400", bg: "bg-green-900/20 border-green-700/30", label: "Branding assets saved" },
      applied: { color: "text-violet-400", bg: "bg-violet-900/20 border-violet-700/30", label: "Branding applied to video" },
    };
    const cfg = statusMap[video.branding_status] || statusMap.saved;
    const logoCount = [video.primary_logo_url, video.secondary_logo_url, video.watermark_logo_url].filter(Boolean).length;
    events.push({
      id: "branding",
      icon: Palette,
      color: cfg.color,
      bg: cfg.bg,
      label: cfg.label,
      detail: logoCount > 0 ? `${logoCount} logo asset${logoCount > 1 ? "s" : ""} · ${video.brand_name || ""}` : video.brand_name || null,
      time: null,
      status: video.branding_status,
    });
  }

  if (video.render_status && video.render_status !== "not_started") {
    const renderMap = {
      queued: { color: "text-blue-400", bg: "bg-blue-900/20 border-blue-700/30", label: "Render job queued" },
      rendering: { color: "text-amber-400", bg: "bg-amber-900/20 border-amber-700/30", label: "Render in progress..." },
      completed: { color: "text-green-400", bg: "bg-green-900/20 border-green-700/30", label: "Render completed" },
      failed: { color: "text-red-400", bg: "bg-red-900/20 border-red-700/30", label: "Render failed" },
    };
    const cfg = renderMap[video.render_status] || renderMap.queued;
    events.push({
      id: "render",
      icon: Play,
      color: cfg.color,
      bg: cfg.bg,
      label: cfg.label,
      detail: video.render_output_url ? "Output URL set" : null,
      time: null,
      status: video.render_status,
    });
  }

  if (video.processing_status === "published") {
    events.push({
      id: "published",
      icon: Rocket,
      color: "text-violet-400",
      bg: "bg-violet-900/20 border-violet-700/30",
      label: "Video marked ready for publishing",
      detail: null,
      time: video.updated_date ? new Date(video.updated_date) : null,
      status: "done",
    });
  }

  return events;
}

function StatusIcon({ status }) {
  if (status === "running" || status === "in_progress") return <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />;
  if (status === "failed") return <XCircle className="w-3.5 h-3.5 text-red-400" />;
  return <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />;
}

export default function ProcessingActivityLog({ video }) {
  const events = deriveEvents(video);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
          <Clock className="w-4 h-4 text-violet-400" />
          Processing History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-6 text-slate-600 text-sm">
            No processing activity yet. Start by generating a transcript.
          </div>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[15px] top-0 bottom-0 w-px bg-slate-800" />

            <div className="space-y-3">
              {events.map((event) => {
                const Icon = event.icon;
                return (
                  <div key={event.id} className="flex items-start gap-3 pl-1">
                    {/* Icon circle */}
                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${event.bg}`}>
                      <Icon className={`w-3.5 h-3.5 ${event.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-slate-200 font-medium">{event.label}</p>
                        <StatusIcon status={event.status} />
                      </div>
                      {event.detail && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{event.detail}</p>
                      )}
                      {event.time && (
                        <p className="text-[10px] text-slate-600 mt-0.5">
                          {event.time.toLocaleDateString()} {event.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}