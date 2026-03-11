import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Video, Clock, ChevronRight, ShieldCheck, Send, CheckCircle2, XCircle, AlertTriangle, Loader2, RefreshCw } from "lucide-react";

const PIPELINE_TABS = [
  { key: "all", label: "All" },
  { key: "awaiting_review", label: "Awaiting Review" },
  { key: "approved", label: "Approved" },
  { key: "scheduled", label: "Scheduled" },
  { key: "publishing", label: "Publishing" },
  { key: "published", label: "Published" },
  { key: "needs_changes", label: "Needs Changes" },
  { key: "rejected", label: "Rejected" },
  { key: "failed", label: "Failed" },
];

const REVIEW_STATUS_CONFIG = {
  not_submitted: { label: "Draft", dot: "bg-slate-600", text: "text-slate-500" },
  pending_review: { label: "Pending Review", dot: "bg-amber-400", text: "text-amber-400" },
  in_review: { label: "In Review", dot: "bg-blue-400", text: "text-blue-400" },
  approved: { label: "Approved", dot: "bg-green-400", text: "text-green-400" },
  needs_changes: { label: "Needs Changes", dot: "bg-orange-400", text: "text-orange-400" },
  rejected: { label: "Rejected", dot: "bg-red-500", text: "text-red-400" },
};

const PROCESSING_STATUS_CONFIG = {
  uploaded: { label: "Uploaded", color: "bg-slate-700 text-slate-400" },
  processing: { label: "Processing", color: "bg-amber-900/40 text-amber-300" },
  branding_pending: { label: "Branding Pending", color: "bg-orange-900/30 text-orange-300" },
  rendering: { label: "Rendering", color: "bg-blue-900/30 text-blue-300" },
  ready_for_review: { label: "Ready for Review", color: "bg-cyan-900/30 text-cyan-300" },
  approved: { label: "Approved", color: "bg-green-900/30 text-green-300" },
  scheduled: { label: "Scheduled", color: "bg-violet-900/30 text-violet-300" },
  publishing: { label: "Publishing", color: "bg-blue-900/40 text-blue-300" },
  published: { label: "Published", color: "bg-green-900/40 text-green-300" },
  needs_changes: { label: "Needs Changes", color: "bg-orange-900/30 text-orange-300" },
  rejected: { label: "Rejected", color: "bg-red-900/30 text-red-400" },
  failed: { label: "Failed", color: "bg-red-900/40 text-red-400" },
};

function getTabMatch(video, tab) {
  if (tab === "all") return true;
  const ps = video.processing_status || "uploaded";
  const rs = video.review_status || "not_submitted";
  if (tab === "awaiting_review") return rs === "pending_review" || rs === "in_review" || ps === "ready_for_review";
  if (tab === "approved") return rs === "approved" && ps !== "published";
  if (tab === "scheduled") return ps === "scheduled";
  if (tab === "publishing") return ps === "publishing";
  if (tab === "published") return ps === "published";
  if (tab === "needs_changes") return rs === "needs_changes" || ps === "needs_changes";
  if (tab === "rejected") return rs === "rejected" || ps === "rejected";
  if (tab === "failed") return ps === "failed";
  return false;
}

export default function AdminVideoQueue() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const load = async () => {
    setLoading(true);
    const reqs = await base44.entities.VideoRequests.list("-created_date", 100);
    setRequests(reqs);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = requests.filter(r => getTabMatch(r, activeTab));

  const tabCounts = {};
  PIPELINE_TABS.forEach(t => {
    tabCounts[t.key] = t.key === "all" ? requests.length : requests.filter(r => getTabMatch(r, t.key)).length;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top nav */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center gap-3 sticky top-0 z-30">
        <Link to={createPageUrl("AdminDashboard")}>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white gap-1.5">← Admin Hub</Button>
        </Link>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium text-slate-300">Video Pipeline</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={load}
          className="ml-auto text-slate-500 hover:text-slate-300"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Page header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 px-4 sm:px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-extrabold text-white">Video Pipeline</h1>
          <p className="text-slate-400 text-sm mt-1">Approval-first publishing workflow — no video goes live without review.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Tab filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {PIPELINE_TABS.map(tab => {
            const count = tabCounts[tab.key] || 0;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${
                  isActive
                    ? "bg-violet-600 border-violet-500 text-white"
                    : "bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-white/20 text-white" : "bg-slate-700 text-slate-400"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-600">
            <Video className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No videos in this stage</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(req => {
              const ps = req.processing_status || "uploaded";
              const rs = req.review_status || "not_submitted";
              const psCfg = PROCESSING_STATUS_CONFIG[ps] || PROCESSING_STATUS_CONFIG.uploaded;
              const rsCfg = REVIEW_STATUS_CONFIG[rs] || REVIEW_STATUS_CONFIG.not_submitted;
              const isReadyForReview = ps === "ready_for_review" || rs === "pending_review" || rs === "in_review";
              const isFailed = ps === "failed";

              return (
                <Link key={req.id} to={createPageUrl(`AdminVideoDetail?id=${req.id}`)}>
                  <Card className={`border transition-all hover:border-slate-600 cursor-pointer ${
                    isReadyForReview ? "bg-slate-900 border-amber-700/40 hover:border-amber-600/60" :
                    ps === "approved" || rs === "approved" ? "bg-slate-900 border-green-700/30" :
                    ps === "published" ? "bg-slate-900 border-green-800/30" :
                    ps === "rejected" || rs === "rejected" ? "bg-slate-900 border-red-800/30" :
                    isFailed ? "bg-slate-900 border-red-700/30" :
                    "bg-slate-900 border-slate-800"
                  }`}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between gap-4">
                        {/* Thumbnail */}
                        {req.thumbnail_url ? (
                          <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                            <img src={req.thumbnail_url} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                            <Video className="w-4 h-4 text-slate-700" />
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-200 truncate">{req.title}</span>
                            {isReadyForReview && (
                              <span className="text-[10px] bg-amber-900/30 text-amber-300 border border-amber-700/40 px-2 py-0.5 rounded-full font-semibold">
                                ⏳ Awaiting Review
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-600 flex-wrap">
                            {req.brand_name && <span>{req.brand_name}</span>}
                            {req.requested_by && <span>{req.requested_by}</span>}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(req.created_date).toLocaleDateString()}
                            </span>
                            {req.scheduled_publish_at && (
                              <span className="text-violet-400">📅 {new Date(req.scheduled_publish_at).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>

                        {/* Status badges */}
                        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                          <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${psCfg.color}`}>
                            {psCfg.label}
                          </span>
                          <div className={`flex items-center gap-1.5 text-[10px] font-semibold ${rsCfg.text}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${rsCfg.dot}`} />
                            {rsCfg.label}
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-700" />
                        </div>
                      </div>

                      {/* Pipeline mini-progress */}
                      <div className="mt-3 flex items-center gap-1">
                        {[
                          { done: req.transcript_status === "completed", label: "T" },
                          { done: req.captions_status === "completed", label: "C" },
                          { done: req.branding_status === "saved" || req.branding_status === "applied", label: "B" },
                          { done: req.render_status === "completed" || !!req.render_output_url, label: "R" },
                          { done: rs === "approved", label: "✓" },
                          { done: ps === "published", label: "🚀" },
                        ].map((step, i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all ${step.done ? "bg-green-500" : "bg-slate-800"}`}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}