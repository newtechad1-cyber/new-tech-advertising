import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  ShieldCheck, Clock, CheckCircle2, XCircle, AlertTriangle, Send,
  Loader2, Calendar, Globe, Facebook, Instagram, Youtube, Smartphone,
  Building2, RefreshCw
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const REVIEW_STATUS_CONFIG = {
  not_submitted: { label: "Draft", color: "bg-slate-800 text-slate-400 border-slate-700", dot: "bg-slate-600" },
  pending_review: { label: "Pending Review", color: "bg-amber-900/30 text-amber-300 border-amber-700/40", dot: "bg-amber-400" },
  in_review: { label: "In Review", color: "bg-blue-900/30 text-blue-300 border-blue-700/40", dot: "bg-blue-400" },
  approved: { label: "Approved", color: "bg-green-900/30 text-green-300 border-green-700/40", dot: "bg-green-400" },
  needs_changes: { label: "Needs Changes", color: "bg-orange-900/30 text-orange-300 border-orange-700/40", dot: "bg-orange-400" },
  rejected: { label: "Rejected", color: "bg-red-900/30 text-red-300 border-red-700/40", dot: "bg-red-500" },
};

const DESTINATIONS = [
  { key: "website_publish_enabled", label: "Website", Icon: Globe },
  { key: "facebook_publish_enabled", label: "Facebook", Icon: Facebook },
  { key: "instagram_publish_enabled", label: "Instagram", Icon: Instagram },
  { key: "youtube_publish_enabled", label: "YouTube", Icon: Youtube },
  { key: "tiktok_publish_enabled", label: "TikTok", Icon: Smartphone },
  { key: "gbp_publish_enabled", label: "Google Business", Icon: Building2 },
];

function isReadyForApproval(video) {
  return (
    video.transcript_status === "completed" &&
    video.captions_status === "completed" &&
    (video.render_status === "completed" || video.render_output_url)
  );
}

export default function ReviewApprovalPanel({ video, onChange, onImmediateSave }) {
  const [actionLoading, setActionLoading] = useState(null);
  const [reviewNotes, setReviewNotes] = useState(video.review_notes || "");
  const [scheduleDate, setScheduleDate] = useState(
    video.scheduled_publish_at ? video.scheduled_publish_at.slice(0, 16) : ""
  );

  const reviewStatus = video.review_status || "not_submitted";
  const cfg = REVIEW_STATUS_CONFIG[reviewStatus] || REVIEW_STATUS_CONFIG.not_submitted;
  const canApprove = isReadyForApproval(video);
  const isApproved = reviewStatus === "approved";
  const isRejected = reviewStatus === "rejected";

  const selectedDestinations = DESTINATIONS.filter(d => video[d.key]);

  const runAction = async (action, updates) => {
    setActionLoading(action);
    const now = new Date().toISOString();
    const user = await base44.auth.me().catch(() => ({ email: "admin" }));
    await onImmediateSave({ ...updates, review_notes: reviewNotes });
    setActionLoading(null);
  };

  const handleMarkForReview = () => runAction("submit", {
    review_status: "pending_review",
    processing_status: "ready_for_review",
  });

  const handleApproveNow = () => runAction("approve_now", {
    review_status: "approved",
    processing_status: "publishing",
    publish_immediately: true,
    approved_at: new Date().toISOString(),
  });

  const handleApproveSchedule = () => runAction("approve_schedule", {
    review_status: "approved",
    processing_status: "scheduled",
    publish_immediately: false,
    scheduled_publish_at: scheduleDate ? new Date(scheduleDate).toISOString() : null,
    approved_at: new Date().toISOString(),
  });

  const handleSendBack = () => runAction("send_back", {
    review_status: "needs_changes",
    processing_status: "needs_changes",
    changes_requested_at: new Date().toISOString(),
  });

  const handleReject = () => runAction("reject", {
    review_status: "rejected",
    processing_status: "rejected",
    rejected_at: new Date().toISOString(),
  });

  const handleRetry = () => runAction("retry", {
    processing_status: "publishing",
    review_status: "approved",
  });

  return (
    <Card className={`border-2 ${isApproved ? "bg-green-950/20 border-green-800/50" : isRejected ? "bg-red-950/20 border-red-800/40" : "bg-slate-900 border-violet-800/40"}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm font-semibold text-slate-200 uppercase tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-violet-400" />
            Review & Publishing
          </CardTitle>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${cfg.color}`}>
            <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">

        {/* Readiness gate */}
        {!canApprove && (
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Pipeline Readiness</p>
            {[
              { label: "Transcript", done: video.transcript_status === "completed", status: video.transcript_status },
              { label: "Captions", done: video.captions_status === "completed", status: video.captions_status },
              { label: "Render / Video File", done: !!(video.render_status === "completed" || video.render_output_url), status: video.render_status },
            ].map(({ label, done, status }) => (
              <div key={label} className="flex items-center gap-2.5">
                {done
                  ? <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  : <div className="w-4 h-4 rounded-full border-2 border-slate-700 flex-shrink-0" />
                }
                <span className={`text-xs flex-1 ${done ? "text-slate-300" : "text-slate-600"}`}>{label}</span>
                <span className={`text-[10px] font-medium capitalize ${done ? "text-green-500" : "text-slate-600"}`}>
                  {done ? "✓ Ready" : status?.replace("_", " ") || "pending"}
                </span>
              </div>
            ))}
            <p className="text-[10px] text-slate-600 pt-1">Complete all pipeline steps to unlock approval actions.</p>
          </div>
        )}

        {/* Destination selection */}
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">Publish Destinations</p>
          <div className="grid grid-cols-3 gap-2">
            {DESTINATIONS.map(({ key, label, Icon }) => {
              const active = !!video[key];
              return (
                <button
                  key={key}
                  onClick={() => onChange({ [key]: !active })}
                  disabled={isRejected}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all ${
                    active
                      ? "bg-violet-900/25 border-violet-600/50 text-violet-300"
                      : "bg-slate-800/40 border-slate-700 text-slate-600 hover:border-slate-500 hover:text-slate-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] font-semibold">{label}</span>
                </button>
              );
            })}
          </div>
          {selectedDestinations.length === 0 && (
            <p className="text-[10px] text-slate-600 mt-2 italic">Select at least one destination before approving.</p>
          )}
        </div>

        {/* Publish timing */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 space-y-3">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Publish Timing</p>
          <div className="flex gap-3">
            <button
              onClick={() => onChange({ publish_immediately: true })}
              className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                video.publish_immediately
                  ? "bg-violet-900/25 border-violet-600/50 text-violet-200"
                  : "bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500"
              }`}
            >
              <Send className="w-3.5 h-3.5" /> Publish Immediately
            </button>
            <button
              onClick={() => onChange({ publish_immediately: false })}
              className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                !video.publish_immediately
                  ? "bg-violet-900/25 border-violet-600/50 text-violet-200"
                  : "bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Schedule
            </button>
          </div>
          {!video.publish_immediately && (
            <div>
              <label className="text-[10px] text-slate-500 mb-1 block uppercase tracking-wide">Scheduled Date & Time</label>
              <Input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white text-sm focus:border-violet-500"
              />
            </div>
          )}
        </div>

        {/* Reviewer notes */}
        <div>
          <label className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2 block">Reviewer Notes</label>
          <Textarea
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            placeholder="Add notes for the client or team about this review decision..."
            className="bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-600 text-sm min-h-[80px] resize-none focus:border-violet-500"
          />
        </div>

        {/* Approval history */}
        {(video.approved_by || video.reviewed_by || video.rejected_by || video.changes_requested_by) && (
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-4 space-y-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Approval History</p>
            {video.approved_by && (
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                <span className="text-slate-400">Approved by <span className="text-slate-200 font-medium">{video.approved_by}</span></span>
                {video.approved_at && <span className="text-slate-600 ml-auto">{new Date(video.approved_at).toLocaleDateString()}</span>}
              </div>
            )}
            {video.reviewed_by && (
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span className="text-slate-400">Reviewed by <span className="text-slate-200 font-medium">{video.reviewed_by}</span></span>
                {video.reviewed_at && <span className="text-slate-600 ml-auto">{new Date(video.reviewed_at).toLocaleDateString()}</span>}
              </div>
            )}
            {video.rejected_by && (
              <div className="flex items-center gap-2 text-xs">
                <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span className="text-slate-400">Rejected by <span className="text-slate-200 font-medium">{video.rejected_by}</span></span>
                {video.rejected_at && <span className="text-slate-600 ml-auto">{new Date(video.rejected_at).toLocaleDateString()}</span>}
              </div>
            )}
            {video.changes_requested_by && (
              <div className="flex items-center gap-2 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                <span className="text-slate-400">Changes requested by <span className="text-slate-200 font-medium">{video.changes_requested_by}</span></span>
                {video.changes_requested_at && <span className="text-slate-600 ml-auto">{new Date(video.changes_requested_at).toLocaleDateString()}</span>}
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-2.5 pt-1 border-t border-slate-800">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Actions</p>

          {/* Primary action based on state */}
          {reviewStatus === "not_submitted" || reviewStatus === "needs_changes" ? (
            <Button
              onClick={handleMarkForReview}
              disabled={!canApprove || !!actionLoading}
              className="w-full bg-violet-600 hover:bg-violet-500 gap-2 font-bold disabled:opacity-40"
            >
              {actionLoading === "submit" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Mark Ready for Review
            </Button>
          ) : null}

          {(reviewStatus === "pending_review" || reviewStatus === "in_review") && (
            <>
              {video.publish_immediately ? (
                <Button
                  onClick={handleApproveNow}
                  disabled={selectedDestinations.length === 0 || !!actionLoading}
                  className="w-full bg-green-600 hover:bg-green-500 gap-2 font-bold disabled:opacity-40"
                >
                  {actionLoading === "approve_now" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Approve & Publish Now
                </Button>
              ) : (
                <Button
                  onClick={handleApproveSchedule}
                  disabled={selectedDestinations.length === 0 || !!actionLoading}
                  className="w-full bg-green-600 hover:bg-green-500 gap-2 font-bold disabled:opacity-40"
                >
                  {actionLoading === "approve_schedule" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                  Approve & Schedule
                </Button>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSendBack}
                  disabled={!!actionLoading}
                  className="border-orange-700/50 text-orange-400 hover:bg-orange-900/20 hover:border-orange-600 gap-1.5 text-xs"
                >
                  {actionLoading === "send_back" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  Send Back
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReject}
                  disabled={!!actionLoading}
                  className="border-red-700/50 text-red-400 hover:bg-red-900/20 hover:border-red-600 gap-1.5 text-xs"
                >
                  {actionLoading === "reject" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                  Reject
                </Button>
              </div>
            </>
          )}

          {isApproved && (
            <div className="rounded-xl border border-green-700/40 bg-green-900/10 p-3 text-center">
              <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <p className="text-sm font-semibold text-green-300">
                {video.publish_immediately ? "Approved — Publishing Now" : "Approved — Scheduled for Publishing"}
              </p>
              {video.scheduled_publish_at && !video.publish_immediately && (
                <p className="text-xs text-slate-500 mt-1">{new Date(video.scheduled_publish_at).toLocaleString()}</p>
              )}
            </div>
          )}

          {isRejected && (
            <div className="rounded-xl border border-red-700/40 bg-red-900/10 p-3 text-center">
              <XCircle className="w-5 h-5 text-red-400 mx-auto mb-1" />
              <p className="text-sm font-semibold text-red-300">Video Rejected</p>
              <p className="text-xs text-slate-500 mt-1">Publishing is blocked for this video.</p>
            </div>
          )}

          {video.processing_status === "failed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={!!actionLoading}
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 gap-2 text-xs"
            >
              {actionLoading === "retry" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Retry Failed Publish
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}