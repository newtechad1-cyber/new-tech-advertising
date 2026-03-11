import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Clapperboard, Loader2 } from "lucide-react";
import VideoPreviewPanel from "@/components/video-workspace/VideoPreviewPanel";
import ProcessingPipeline from "@/components/video-workspace/ProcessingPipeline";
import CaptionsEditor from "@/components/video-workspace/CaptionsEditor";
import BrandingPanel from "@/components/video-workspace/BrandingPanel";
import OverlaySettings from "@/components/video-workspace/OverlaySettings";
import RenderOutputPanel from "@/components/video-workspace/RenderOutputPanel";
import BrandedPreviewCard from "@/components/video-workspace/BrandedPreviewCard";
import AIRecommendations from "@/components/video-workspace/AIRecommendations";
import ProcessingActivityLog from "@/components/video-workspace/ProcessingActivityLog";
import ReviewApprovalPanel from "@/components/video-workspace/ReviewApprovalPanel";
import PublishingCopyPanel from "@/components/video-workspace/PublishingCopyPanel";
import ReadyForReviewCallout from "@/components/video-workspace/ReadyForReviewCallout";

const PROCESSING_STAGES = [
  { key: "uploaded", label: "Uploaded" },
  { key: "processing", label: "Processing" },
  { key: "ready_for_review", label: "Ready for Review" },
  { key: "ready_to_render", label: "Ready to Render" },
  { key: "published", label: "Published" },
];

export default function AdminVideoDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) { setLoading(false); return; }
      const v = await base44.entities.VideoRequests.get(id);
      setVideo(v);
      setLoading(false);
    };
    load();
  }, [id]);

  // Merge updates into local video state
  const handleChange = useCallback((updates) => {
    setVideo(prev => ({ ...prev, ...updates }));
    setDirty(true);
  }, []);

  // Standard save (uses current video state)
  const handleSave = useCallback(async () => {
    setSaving(true);
    setVideo(prev => {
      base44.entities.VideoRequests.update(id, prev).then(updated => {
        setVideo(updated);
        setSaving(false);
        setDirty(false);
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 2000);
      });
      return prev;
    });
  }, [id]);

  // Immediate save with specific updates (used by AI generation steps)
  const handleImmediateSave = useCallback(async (updates) => {
    setVideo(prev => {
      const newVideo = { ...prev, ...updates };
      base44.entities.VideoRequests.update(id, newVideo).then(updated => {
        setVideo(updated);
        setDirty(false);
      });
      return newVideo;
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
          <p className="text-slate-500 text-sm">Loading video workspace...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto">
            <Clapperboard className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400">Video not found.</p>
          <Link to={createPageUrl("AdminVideoQueue")}>
            <Button variant="outline" className="border-slate-700 text-slate-300">← Back to Queue</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentStageIndex = PROCESSING_STAGES.findIndex(s => s.key === (video.processing_status || "uploaded"));

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Top navigation bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <Link to={createPageUrl("AdminVideoQueue")}>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white gap-1.5 flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Video Queue</span>
            </Button>
          </Link>
          <span className="text-slate-700 hidden sm:block">|</span>
          <div className="flex items-center gap-2 min-w-0">
            <Clapperboard className="w-4 h-4 text-violet-400 flex-shrink-0" />
            <span className="text-sm font-medium text-slate-300 truncate">{video.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {savedFlash && (
            <span className="text-xs text-green-400 font-medium hidden sm:block">Saved ✓</span>
          )}
          {dirty && !savedFlash && (
            <span className="text-xs text-amber-400 hidden sm:block">Unsaved changes</span>
          )}
          <Button
            onClick={handleSave}
            disabled={saving || !dirty}
            size="sm"
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="hidden sm:inline">{saving ? "Saving..." : "Save Changes"}</span>
          </Button>
        </div>
      </div>

      {/* Page header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Video Processing</h1>
              <p className="text-slate-400 text-sm mt-1">Transcribe, caption, brand, and prepare this video for publishing.</p>
            </div>

            {/* Status pipeline pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {PROCESSING_STAGES.map((stage, i) => {
                const isActive = stage.key === (video.processing_status || "uploaded");
                const isPast = i < currentStageIndex;
                return (
                  <button
                    key={stage.key}
                    onClick={() => handleChange({ processing_status: stage.key })}
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all border whitespace-nowrap ${
                      isActive
                        ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-600/20"
                        : isPast
                        ? "bg-green-900/30 border-green-700/40 text-green-400 hover:bg-green-900/40"
                        : "bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {isPast && "✓ "}{stage.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-column workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left column — video + pipeline + captions + publishing copy */}
          <div className="lg:col-span-7 space-y-6">
            <ReadyForReviewCallout
              video={video}
              onMarkForReview={() => handleImmediateSave({ review_status: "pending_review", processing_status: "ready_for_review" })}
            />
            <VideoPreviewPanel video={video} onChange={handleChange} />
            <ProcessingPipeline video={video} />
            <CaptionsEditor
              video={video}
              onChange={handleChange}
              onImmediateSave={handleImmediateSave}
            />
            <PublishingCopyPanel
              video={video}
              onChange={handleChange}
              onImmediateSave={handleImmediateSave}
            />
          </div>

          {/* Right column — review + branding + overlays + export + log */}
          <div className="lg:col-span-5 space-y-6">
            <ReviewApprovalPanel
              video={video}
              onChange={handleChange}
              onImmediateSave={handleImmediateSave}
            />
            <AIRecommendations video={video} onChange={handleChange} />
            <BrandedPreviewCard video={video} />
            <BrandingPanel video={video} onChange={handleChange} />
            <OverlaySettings video={video} onChange={handleChange} />
            <RenderOutputPanel
              video={video}
              onChange={handleChange}
              onImmediateSave={handleImmediateSave}
            />
            <ProcessingActivityLog video={video} />
          </div>

        </div>
      </div>
    </div>
  );
}