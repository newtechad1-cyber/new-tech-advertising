import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Clapperboard, Loader2, RefreshCw } from "lucide-react";
import VideoPreviewPanel from "@/components/video-workspace/VideoPreviewPanel";
import WorkflowStatusStrip from "@/components/video-workspace/WorkflowStatusStrip";
import TranscriptCaptionsSection from "@/components/video-workspace/TranscriptCaptionsSection";
import BrandingPanel from "@/components/video-workspace/BrandingPanel";
import RenderOutputPanel from "@/components/video-workspace/RenderOutputPanel";
import PublishingCopyPanel from "@/components/video-workspace/PublishingCopyPanel";
import DestinationSelectionPanel from "@/components/video-workspace/DestinationSelectionPanel";
import ReviewApprovalPanel from "@/components/video-workspace/ReviewApprovalPanel";
import NextBestActionCard from "@/components/video-workspace/NextBestActionCard";
import ChannelReadinessSidebar from "@/components/video-workspace/ChannelReadinessSidebar";
import PublishStatusSection from "@/components/video-workspace/PublishStatusSection";
import ActivityTimeline from "@/components/video-workspace/ActivityTimeline";
import WebsitePublishingSection from "@/components/video-workspace/WebsitePublishingSection";
import QuickActionBar from "@/components/video-workspace/QuickActionBar";

export default function AdminVideoDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const [video, setVideo] = useState(null);
  const [publishJobs, setPublishJobs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) { 
        setLoading(false); 
        return; 
      }
      const [v, jobs, logs] = await Promise.all([
        base44.entities.VideoRequests.get(id),
        base44.entities.VideoPublishJob?.filter({ video_id: id }, '-created_date', 20) || [],
        base44.entities.VideoPublishAuditLog?.filter({ video_id: id }, '-logged_at', 30) || []
      ]);
      setVideo(v);
      setPublishJobs(jobs);
      setAuditLogs(logs);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleChange = useCallback((updates) => {
    setVideo(prev => ({ ...prev, ...updates }));
    setDirty(true);
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    base44.entities.VideoRequests.update(id, video).then(updated => {
      setVideo(updated);
      setSaving(false);
      setDirty(false);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    });
  }, [id, video]);

  const handleImmediateSave = useCallback(async (updates) => {
    const newVideo = { ...video, ...updates };
    setVideo(newVideo);
    setDirty(false);
    base44.entities.VideoRequests.update(id, newVideo).then(updated => {
      setVideo(updated);
    });
  }, [id, video]);

  const handleRefresh = async () => {
    setRefreshing(true);
    const [v, jobs, logs] = await Promise.all([
      base44.entities.VideoRequests.get(id),
      base44.entities.VideoPublishJob?.filter({ video_id: id }, '-created_date', 20) || [],
      base44.entities.VideoPublishAuditLog?.filter({ video_id: id }, '-logged_at', 30) || []
    ]);
    setVideo(v);
    setPublishJobs(jobs);
    setAuditLogs(logs);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-600 text-sm">Loading video workspace...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mx-auto">
            <Clapperboard className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-600">Video not found.</p>
          <Link to={createPageUrl("AdminVideoPublishing")}>
            <Button variant="outline">← Back to Publishing</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Top navigation bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <Link to={createPageUrl("AdminVideoPublishing")}>
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 gap-1.5 flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Command Center</span>
            </Button>
          </Link>
          <span className="text-slate-300 hidden sm:block">|</span>
          <div className="flex items-center gap-2 min-w-0">
            <Clapperboard className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="text-sm font-medium text-slate-900 truncate">{video.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {savedFlash && (
            <span className="text-xs text-green-600 font-medium hidden sm:block">Saved ✓</span>
          )}
          {dirty && !savedFlash && (
            <span className="text-xs text-amber-600 hidden sm:block">Unsaved changes</span>
          )}
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            size="sm"
            variant="outline"
            className="gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !dirty}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="hidden sm:inline">{saving ? "Saving..." : "Save"}</span>
          </Button>
        </div>
      </div>

      {/* Page header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Video Review Workspace</h1>
              <p className="text-slate-600 text-sm mt-1">Review, brand, approve, and distribute this video across website and connected channels.</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div className="flex items-center gap-4 text-sm">
                {video.brand_name && (
                  <div>
                    <span className="text-slate-600">Brand:</span>
                    <span className="text-slate-900 font-medium ml-2">{video.brand_name}</span>
                  </div>
                )}
                {video.request_type && (
                  <div>
                    <span className="text-slate-600">Type:</span>
                    <span className="text-slate-900 font-medium ml-2 capitalize">{video.request_type.replace('_', ' ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Status Strip */}
      <div className="px-4 sm:px-6 py-4 bg-white border-b border-slate-200">
        <WorkflowStatusStrip video={video} />
      </div>

      {/* Next Best Action */}
      <div className="px-4 sm:px-6 py-4">
        <NextBestActionCard video={video} handleImmediateSave={handleImmediateSave} />
      </div>

      {/* Main 3-column workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN — Video + Transcript + Publishing Copy */}
          <div className="lg:col-span-4 space-y-6">
            <VideoPreviewPanel video={video} onChange={handleChange} />
            <TranscriptCaptionsSection 
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

          {/* CENTER COLUMN — Branding + Render + Destinations */}
          <div className="lg:col-span-4 space-y-6">
            <BrandingPanel video={video} onChange={handleChange} />
            <RenderOutputPanel
              video={video}
              onChange={handleChange}
              onImmediateSave={handleImmediateSave}
            />
            <DestinationSelectionPanel
              video={video}
              onChange={handleChange}
            />
            <WebsitePublishingSection
              video={video}
              onChange={handleChange}
            />
          </div>

          {/* RIGHT COLUMN — Approval + Channels + Activity */}
          <div className="lg:col-span-4 space-y-6">
            <ReviewApprovalPanel
              video={video}
              onChange={handleChange}
              onImmediateSave={handleImmediateSave}
            />
            <ChannelReadinessSidebar video={video} publishJobs={publishJobs} />
            <PublishStatusSection
              video={video}
              publishJobs={publishJobs}
              onRetry={handleRefresh}
            />
            <ActivityTimeline auditLogs={auditLogs} />
          </div>

        </div>
      </div>

      {/* Sticky Quick Action Bar */}
      <QuickActionBar 
        video={video}
        dirty={dirty}
        saving={saving}
        onSave={handleSave}
        onRefresh={handleRefresh}
      />
    </div>
  );
}