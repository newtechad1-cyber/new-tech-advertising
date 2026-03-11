import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Type, Mic, RefreshCw, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

const CAPTION_STYLES = [
  { value: "clean_minimal", label: "Clean Minimal" },
  { value: "bold_social", label: "Bold Social" },
  { value: "news_broadcast", label: "News / Broadcast" },
  { value: "promo_highlight", label: "Promo Highlight" },
];
const CAPTION_POSITIONS = [
  { value: "bottom", label: "Bottom" },
  { value: "center", label: "Center" },
  { value: "top", label: "Top" },
];
const CAPTION_SIZES = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];
const CAPTION_ANIMATIONS = [
  { value: "none", label: "None" },
  { value: "word_by_word", label: "Word by Word" },
  { value: "line_fade", label: "Line Fade" },
  { value: "pop_in", label: "Pop In" },
];

function StepStatusBadge({ status, label }) {
  const map = {
    completed: "bg-green-900/30 text-green-400 border-green-700/40",
    running: "bg-amber-900/30 text-amber-400 border-amber-700/40",
    failed: "bg-red-900/30 text-red-400 border-red-700/40",
    not_started: "bg-slate-800 text-slate-500 border-slate-700",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${map[status] || map.not_started}`}>
      {label}
    </span>
  );
}

export default function CaptionsEditor({ video, onChange, onImmediateSave }) {
  const [genTranscript, setGenTranscript] = useState(false);
  const [genCaptions, setGenCaptions] = useState(false);

  const transcriptStatus = video.transcript_status || "not_started";
  const captionsStatus = video.captions_status || "not_started";

  const handleGenerateTranscript = async () => {
    setGenTranscript(true);
    onChange({ transcript_status: "running" });
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Write a professional 60-90 second video script / voiceover transcript for a marketing video with these details:
Title: "${video.title || "Marketing Video"}"
Type: ${video.request_type || "promotional"}
Goal: ${video.goal || "promote the business"}
Industry: ${video.industry || "general business"}
Target audience: ${video.audience || "local consumers"}
Offer: ${video.offer || ""}
CTA: ${video.cta || "Contact us today"}

Write a natural, energetic, human-sounding voiceover transcript. Include natural pauses indicated with [pause] and emphasis with CAPS. Format it as running paragraphs. Do not add timestamps. Do not add headers.`,
    });
    setGenTranscript(false);
    await onImmediateSave({ transcript_text: result, transcript_status: "completed" });
  };

  const handleGenerateCaptions = async () => {
    setGenCaptions(true);
    onChange({ captions_status: "running" });
    const source = video.transcript_text || video.title || "Marketing video content";
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Convert this video transcript into formatted caption blocks for a branded marketing video.

Transcript:
"${source}"

Caption requirements:
- Style: ${video.caption_style || "clean_minimal"} (clean_minimal = lowercase subtle; bold_social = ALL CAPS punchy; news_broadcast = title case formal; promo_highlight = highlight key words)
- Position: ${video.caption_position || "bottom"}
- Size: ${video.caption_size || "medium"}
- Animation: ${video.caption_animation || "none"}

Output format: one caption block per line, with approximate timestamp in [HH:MM:SS] format at the start of each line. Keep each caption to 6-8 words max. Be punchy and readable. Return only the caption lines, no headers or extra text.

Example output:
[00:00:00] Ready to grow your business?
[00:00:03] We help local companies win online.`,
    });
    setGenCaptions(false);
    await onImmediateSave({ captions_json: result, captions_status: "completed" });
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
            <Type className="w-4 h-4 text-violet-400" />
            AI Captions
          </CardTitle>
          <div className="flex items-center gap-2">
            <StepStatusBadge status={transcriptStatus} label={`Transcript: ${transcriptStatus.replace("_", " ")}`} />
            <StepStatusBadge status={captionsStatus} label={`Captions: ${captionsStatus.replace("_", " ")}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">

        {/* Step 1: Transcript */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${transcriptStatus === "completed" ? "bg-green-500/20 text-green-400" : "bg-slate-700 text-slate-400"}`}>
                {transcriptStatus === "completed" ? <CheckCircle2 className="w-3.5 h-3.5" /> : "1"}
              </div>
              <span className="text-sm font-medium text-slate-200">Generate Transcript</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleGenerateTranscript}
              disabled={genTranscript}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 gap-1.5 text-xs"
            >
              {genTranscript
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                : transcriptStatus === "completed"
                  ? <><RefreshCw className="w-3.5 h-3.5" /> Regenerate</>
                  : <><Mic className="w-3.5 h-3.5" /> Generate Transcript</>
              }
            </Button>
          </div>
          <Textarea
            value={video.transcript_text || ""}
            onChange={(e) => onChange({ transcript_text: e.target.value })}
            placeholder="Transcript will appear here after AI generation — or paste your own voiceover script..."
            className="bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-600 text-sm min-h-[110px] resize-none focus:border-violet-500"
          />
          {transcriptStatus === "failed" && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Generation failed. Try again.
            </p>
          )}
        </div>

        {/* Caption style settings */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium uppercase tracking-wide">Style</label>
            <Select value={video.caption_style || "clean_minimal"} onValueChange={(v) => onChange({ caption_style: v })}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-300 text-sm h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {CAPTION_STYLES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium uppercase tracking-wide">Position</label>
            <Select value={video.caption_position || "bottom"} onValueChange={(v) => onChange({ caption_position: v })}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-300 text-sm h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {CAPTION_POSITIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium uppercase tracking-wide">Size</label>
            <Select value={video.caption_size || "medium"} onValueChange={(v) => onChange({ caption_size: v })}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-300 text-sm h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {CAPTION_SIZES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium uppercase tracking-wide">Animation</label>
            <Select value={video.caption_animation || "none"} onValueChange={(v) => onChange({ caption_animation: v })}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-300 text-sm h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {CAPTION_ANIMATIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Suggested action: transcript exists but captions are empty */}
        {transcriptStatus === "completed" && (!captionsStatus || captionsStatus === "not_started") && (
          <div className="rounded-xl border border-amber-700/40 bg-amber-900/10 p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-900/30 flex items-center justify-center flex-shrink-0">
              <Mic className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-200">Transcript found. Generate AI captions now.</p>
              <p className="text-xs text-amber-300/70 mt-0.5">Your transcript is ready — click below to instantly generate timed caption blocks.</p>
            </div>
            <Button
              size="sm"
              onClick={handleGenerateCaptions}
              disabled={genCaptions}
              className="flex-shrink-0 bg-amber-600 hover:bg-amber-500 text-white gap-1.5 text-xs"
            >
              {genCaptions ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Type className="w-3.5 h-3.5" />}
              Generate Now
            </Button>
          </div>
        )}

        {/* Step 2: Caption blocks */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${captionsStatus === "completed" ? "bg-green-500/20 text-green-400" : "bg-slate-700 text-slate-400"}`}>
                {captionsStatus === "completed" ? <CheckCircle2 className="w-3.5 h-3.5" /> : "2"}
              </div>
              <span className="text-sm font-medium text-slate-200">Generate Caption Blocks</span>
            </div>
            <Button
              size="sm"
              onClick={handleGenerateCaptions}
              disabled={genCaptions}
              className={captionsStatus === "completed"
                ? "border border-slate-600 bg-transparent text-slate-300 hover:bg-slate-700 gap-1.5 text-xs"
                : "bg-violet-600 hover:bg-violet-500 gap-1.5 text-xs"
              }
            >
              {genCaptions
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                : captionsStatus === "completed"
                  ? <><RefreshCw className="w-3.5 h-3.5" /> Regenerate</>
                  : <><Type className="w-3.5 h-3.5" /> Generate Captions</>
              }
            </Button>
          </div>

          {!captionsStatus || captionsStatus === "not_started" ? (
            <div className="text-center py-5 text-slate-600 text-sm">
              {transcriptStatus === "completed"
                ? "Click Generate Captions to create timed caption blocks from your transcript."
                : "Generate a transcript first — AI will then create captions from it."}
            </div>
          ) : (
            <Textarea
              value={video.captions_json || ""}
              onChange={(e) => onChange({ captions_json: e.target.value })}
              placeholder="Caption blocks will appear here..."
              className="bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-600 text-sm min-h-[160px] font-mono resize-none focus:border-violet-500"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}