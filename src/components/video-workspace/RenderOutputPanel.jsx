import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Settings2, Monitor, Square, Smartphone, Play, RotateCcw, Rocket, Loader2, ExternalLink } from "lucide-react";

const FORMATS = [
  { key: "export_landscape", label: "Landscape 16:9", Icon: Monitor, desc: "YouTube, Website, TV" },
  { key: "export_square", label: "Square 1:1", Icon: Square, desc: "Instagram Feed, Facebook" },
  { key: "export_vertical", label: "Vertical 9:16", Icon: Smartphone, desc: "TikTok, Reels, Shorts" },
];

const PLATFORMS = [
  { key: "export_website", label: "Website" },
  { key: "export_facebook", label: "Facebook" },
  { key: "export_instagram", label: "Instagram" },
  { key: "export_youtube", label: "YouTube" },
  { key: "export_tiktok", label: "TikTok" },
];

const READINESS_CHECKS = [
  { key: "transcript_status", label: "Transcript", doneValue: "completed" },
  { key: "captions_status", label: "Captions", doneValue: "completed" },
  { key: "brand_name", label: "Brand Info", doneCheck: (v) => !!(v.brand_name || v.primary_logo_url) },
  { key: "export_landscape", label: "Format Selected", doneCheck: (v) => !!(v.export_landscape || v.export_square || v.export_vertical) },
];

export default function RenderOutputPanel({ video, onChange, onImmediateSave }) {
  const [actionLoading, setActionLoading] = useState(null);

  const checkDone = (check) => {
    if (check.doneCheck) return check.doneCheck(video);
    return video[check.key] === check.doneValue;
  };

  const allReady = READINESS_CHECKS.every(c => checkDone(c));

  const handleMarkReady = async () => {
    setActionLoading("ready");
    await onImmediateSave({ processing_status: "ready_to_render", branding_status: "saved" });
    setActionLoading(null);
  };

  const handleQueueRender = async () => {
    setActionLoading("render");
    await onImmediateSave({ render_status: "queued", processing_status: "processing" });
    setActionLoading(null);
  };

  const handleResetPipeline = async () => {
    setActionLoading("reset");
    await onImmediateSave({
      transcript_status: "not_started",
      captions_status: "not_started",
      branding_status: "not_started",
      render_status: "not_started",
      processing_status: "uploaded"
    });
    setActionLoading(null);
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-violet-400" />
          Output & Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">

        {/* Readiness checklist */}
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Render Readiness</p>
          {READINESS_CHECKS.map((check) => {
            const done = checkDone(check);
            return (
              <div key={check.key} className="flex items-center gap-2.5">
                <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${done ? "text-green-400" : "text-slate-700"}`} />
                <span className={`text-xs flex-1 ${done ? "text-slate-300" : "text-slate-600"}`}>{check.label}</span>
                <span className={`text-[10px] font-medium ${done ? "text-green-500" : "text-slate-600"}`}>
                  {done ? "✓ Done" : "Pending"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Output formats */}
        <div className="space-y-2">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Output Formats</p>
          {FORMATS.map(({ key, label, Icon, desc }) => (
            <div
              key={key}
              onClick={() => onChange({ [key]: !video[key] })}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none ${
                video[key]
                  ? "bg-violet-900/20 border-violet-600/40"
                  : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${video[key] ? "text-violet-400" : "text-slate-600"}`} />
              <div className="flex-1">
                <p className={`text-sm font-medium ${video[key] ? "text-violet-200" : "text-slate-400"}`}>{label}</p>
                <p className="text-xs text-slate-600">{desc}</p>
              </div>
              <Checkbox checked={!!video[key]} className="pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Platform targets */}
        <div className="space-y-2">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Export Targets</p>
          <div className="grid grid-cols-2 gap-2">
            {PLATFORMS.map(({ key, label }) => (
              <div
                key={key}
                onClick={() => onChange({ [key]: !video[key] })}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-all select-none ${
                  video[key]
                    ? "bg-violet-900/20 border-violet-600/40 text-violet-300"
                    : "bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-400"
                }`}
              >
                <Checkbox checked={!!video[key]} className="pointer-events-none w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Render output URL */}
        <div className="space-y-2 pt-1 border-t border-slate-800">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Render Output URL</p>
          <Input
            value={video.render_output_url || ""}
            onChange={(e) => onChange({ render_output_url: e.target.value })}
            placeholder="https://rendered-video.mp4"
            className="bg-slate-800 border-slate-700 text-white placeholder-slate-600 text-sm focus:border-violet-500"
          />
          {video.render_output_url && (
            <a href={video.render_output_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors">
              <ExternalLink className="w-3 h-3" /> Preview output
            </a>
          )}
        </div>

        {/* Action buttons */}
        <div className="space-y-2 pt-1 border-t border-slate-800">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Actions</p>

          <Button
            onClick={handleMarkReady}
            disabled={!!actionLoading}
            className={`w-full gap-2 font-bold ${allReady ? "bg-green-600 hover:bg-green-500" : "bg-violet-600 hover:bg-violet-500"}`}
          >
            {actionLoading === "ready"
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Rocket className="w-4 h-4" />}
            Mark Ready for Publishing
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!!actionLoading}
              onClick={handleQueueRender}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-1.5 text-xs"
            >
              {actionLoading === "render"
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Play className="w-3.5 h-3.5" />}
              Queue Render
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!!actionLoading}
              onClick={handleResetPipeline}
              className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-red-400 gap-1.5 text-xs"
            >
              {actionLoading === "reset"
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <RotateCcw className="w-3.5 h-3.5" />}
              Reset Pipeline
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}