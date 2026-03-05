import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Play, RefreshCw, Wand2, CheckCircle, AlertCircle, Clock, ArrowLeft, Video, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const invoke = (action, params = {}) =>
  base44.functions.invoke("generateWebsiteVideos", { action, ...params });

const STATUS_CONFIG = {
  null: { label: "Not Generated", color: "bg-slate-700 text-slate-300", icon: Clock },
  queued: { label: "Queued", color: "bg-yellow-900/40 text-yellow-300 border border-yellow-700/40", icon: Clock },
  rendering: { label: "Rendering…", color: "bg-blue-900/40 text-blue-300 border border-blue-700/40", icon: Loader2, spin: true },
  done: { label: "Ready ✓", color: "bg-green-900/40 text-green-300 border border-green-700/40", icon: CheckCircle },
  failed: { label: "Failed", color: "bg-red-900/40 text-red-300 border border-red-700/40", icon: AlertCircle },
};

function SlotCard({ slot, onGenerate, onRegenerate, polling }) {
  const [copied, setCopied] = useState(false);
  const status = STATUS_CONFIG[slot.render_status] || STATUS_CONFIG[null];
  const Icon = status.icon;
  const isRendering = slot.render_status === "rendering" || slot.render_status === "queued" || polling;
  const isDone = slot.render_status === "done";
  const isFailed = slot.render_status === "failed";
  const hasVideo = isDone && slot.render_output_url;

  const copyUrl = () => {
    navigator.clipboard.writeText(slot.render_output_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-white font-semibold text-base">{slot.label}</h3>
            <p className="text-slate-500 text-xs mt-0.5">{slot.format} · {slot.duration}</p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${status.color}`}>
            <Icon className={`w-3 h-3 ${status.spin ? "animate-spin" : ""}`} />
            {isRendering && !polling ? status.label : polling ? "Rendering…" : status.label}
          </span>
        </div>

        {slot.script && (
          <div className="bg-slate-800/60 rounded-lg p-3 mb-4 text-slate-300 text-sm leading-relaxed line-clamp-3 border border-slate-700/40">
            {slot.script}
          </div>
        )}

        {hasVideo && (
          <div className="mb-4">
            <video src={slot.render_output_url} controls className="w-full rounded-lg bg-black max-h-48" />
            <div className="flex gap-2 mt-2">
              <a href={slot.render_output_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button size="sm" variant="outline" className="w-full border-slate-700 text-slate-300 gap-1">
                  <Play className="w-3 h-3" /> Watch
                </Button>
              </a>
              <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 gap-1" onClick={copyUrl}>
                <Copy className="w-3 h-3" /> {copied ? "Copied!" : "Copy URL"}
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {!slot.record_id && !isRendering && (
            <Button
              size="sm"
              className="bg-violet-600 hover:bg-violet-500 text-white gap-1.5 flex-1"
              onClick={() => onGenerate(slot.slot_key)}
              disabled={isRendering}
            >
              <Wand2 className="w-3.5 h-3.5" /> Generate Video
            </Button>
          )}
          {(isDone || isFailed) && (
            <Button
              size="sm"
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-1.5 flex-1"
              onClick={() => onRegenerate(slot.slot_key)}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Regenerate
            </Button>
          )}
          {isRendering && (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Rendering… check back in 2–5 min
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function WebsiteVideoManager() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState({});
  const [polling, setPolling] = useState({});

  const loadSlots = useCallback(async () => {
    const res = await invoke("list_slots");
    setSlots(res.data?.slots || []);
  }, []);

  useEffect(() => {
    loadSlots().finally(() => setLoading(false));
  }, [loadSlots]);

  // Auto-poll any rendering/queued slots
  useEffect(() => {
    const renderingSlots = slots.filter(s =>
      (s.render_status === "rendering" || s.render_status === "queued") && s.record_id && s.render_job_id
    );

    if (renderingSlots.length === 0) return;

    const timers = renderingSlots.map(slot => {
      if (polling[slot.slot_key]) return null;
      setPolling(p => ({ ...p, [slot.slot_key]: true }));

      const poll = async (attempts = 0) => {
        if (attempts > 30) {
          setPolling(p => { const n = { ...p }; delete n[slot.slot_key]; return n; });
          return;
        }
        await new Promise(r => setTimeout(r, 15000));
        const res = await invoke("check_status", {
          record_id: slot.record_id,
          heygen_video_id: slot.render_job_id
        });
        const status = res.data?.status;
        await loadSlots();
        if (status === "completed" || status === "failed" || status === "error") {
          setPolling(p => { const n = { ...p }; delete n[slot.slot_key]; return n; });
        } else {
          poll(attempts + 1);
        }
      };
      poll();
      return null;
    });

    return () => {};
  }, [slots]);

  const handleGenerate = async (slot_key) => {
    setGenerating(g => ({ ...g, [slot_key]: true }));
    try {
      const scriptRes = await invoke("generate_script", { slot_key });
      const script = scriptRes.data?.script;
      if (!script) throw new Error("Failed to generate script");
      await invoke("submit_video", { slot_key, script });
      await loadSlots();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setGenerating(g => { const n = { ...g }; delete n[slot_key]; return n; });
    }
  };

  const handleRegenerate = (slot_key) => handleGenerate(slot_key);

  const handleGenerateAll = async () => {
    const pending = slots.filter(s => !s.record_id || s.render_status === "failed");
    for (const slot of pending) {
      await handleGenerate(slot.slot_key);
    }
  };

  const anyGenerating = Object.keys(generating).length > 0;
  const readyCount = slots.filter(s => s.render_status === "done").length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <Link to={createPageUrl("AdminDashboard")}>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white gap-1">
            <ArrowLeft className="w-4 h-4" /> Admin Hub
          </Button>
        </Link>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-violet-400" />
          <span className="font-semibold text-white">Website Video Manager</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Website Video Generator</h1>
            <p className="text-slate-400 text-sm">
              AI writes the script → HeyGen renders the video → copy the URL to your website. {readyCount}/{slots.length} ready.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-1.5"
              onClick={loadSlots}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
            <Button
              className="bg-violet-600 hover:bg-violet-500 text-white gap-1.5"
              onClick={handleGenerateAll}
              disabled={anyGenerating}
            >
              {anyGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              Generate All
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
          </div>
        ) : (
          <div className="space-y-4">
            {slots.map(slot => (
              <SlotCard
                key={slot.slot_key}
                slot={slot}
                onGenerate={handleGenerate}
                onRegenerate={handleRegenerate}
                polling={!!polling[slot.slot_key] || !!generating[slot.slot_key]}
              />
            ))}
          </div>
        )}

        {readyCount > 0 && (
          <div className="mt-8 bg-green-900/20 border border-green-700/30 rounded-xl p-5">
            <h3 className="text-green-300 font-semibold mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Videos Are Ready
            </h3>
            <p className="text-green-200/70 text-sm">
              Copy each video URL and send it to your developer, or tell Base44 to embed it on the page — just paste the URL in the chat.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}