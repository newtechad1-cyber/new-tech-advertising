import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, CheckCircle, MessageSquare, Video } from "lucide-react";

const statusColors = {
  "Draft": "bg-gray-100 text-gray-700",
  "Ready to Render": "bg-blue-100 text-blue-700",
  "Rendering": "bg-yellow-100 text-yellow-700",
  "Needs Review": "bg-orange-100 text-orange-700",
  "Delivered": "bg-green-100 text-green-700",
  "Revision Requested": "bg-red-100 text-red-700",
};

export default function VideoDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const [video, setVideo] = useState(null);
  const [revisions, setRevisions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const u = await base44.auth.me();
      setUser(u);
      const [v, revs] = await Promise.all([
        base44.entities.VideoRequests.get(id),
        base44.entities.VideoRevision.filter({ video_request_id: id }, "-created_date"),
      ]);
      setVideo(v);
      setRevisions(revs);
      setLoading(false);
    };
    if (id) load();
  }, [id]);

  const handleApprove = async () => {
    setSubmitting(true);
    await base44.entities.VideoRequests.update(id, {
      approval_status: "Approved",
      status: "Delivered",
    });
    setVideo((v) => ({ ...v, approval_status: "Approved", status: "Delivered" }));
    setSubmitting(false);
  };

  const handleRequestChanges = async () => {
    if (!revisionNotes.trim()) return;
    setSubmitting(true);
    await Promise.all([
      base44.entities.VideoRequests.update(id, {
        approval_status: "Changes Requested",
        status: "Revision Requested",
      }),
      base44.entities.VideoRevision.create({
        video_request_id: id,
        requested_by: user?.email || "Client",
        notes: revisionNotes,
        status: "Open",
      }),
    ]);
    const revs = await base44.entities.VideoRevision.filter({ video_request_id: id }, "-created_date");
    setRevisions(revs);
    setVideo((v) => ({ ...v, approval_status: "Changes Requested", status: "Revision Requested" }));
    setRevisionNotes("");
    setShowRevisionForm(false);
    setSubmitting(false);
  };

  const videoUrl = video?.final_video || video?.render_output_url;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p>Video not found.</p>
        <Link to={createPageUrl("VideoIndex")} className="text-blue-600 text-sm mt-2 inline-block">← Back to Videos</Link>
      </div>
    );
  }

  const canAct = video.status === "Needs Review" && video.approval_status === "Pending";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Back */}
      <Link to={createPageUrl("VideoIndex")} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Videos
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[video.status] || "bg-gray-100 text-gray-600"}`}>
              {video.status}
            </span>
            <span className="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-600">
              {video.approval_status}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{video.format}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{video.duration}</span>
          </div>
        </div>

        {/* Action buttons */}
        {canAct && (
          <div className="flex gap-2">
            <Button
              onClick={handleApprove}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Approve
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowRevisionForm((v) => !v)}
              disabled={submitting}
              className="gap-2 border-red-300 text-red-600 hover:bg-red-50"
            >
              <MessageSquare className="w-4 h-4" /> Request Changes
            </Button>
          </div>
        )}
      </div>

      {/* Revision request form */}
      {showRevisionForm && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-red-700">Describe the changes needed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              placeholder="Please be as specific as possible..."
              className="min-h-[100px] bg-white"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleRequestChanges}
                disabled={submitting || !revisionNotes.trim()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </Button>
              <Button variant="ghost" onClick={() => setShowRevisionForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video player */}
      {videoUrl ? (
        <div className="mb-6">
          <div className="rounded-xl overflow-hidden bg-black aspect-video">
            <video
              src={videoUrl}
              controls
              className="w-full h-full object-contain"
            />
          </div>
          <div className="mt-3 flex justify-end">
            <a href={videoUrl} download>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" /> Download Video
              </Button>
            </a>
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center py-16 text-gray-400">
          <Video className="w-10 h-10 mb-2 opacity-30" />
          <p className="text-sm">Video not yet available</p>
        </div>
      )}

      {/* Details */}
      <div className="grid gap-4 mb-8">
        {video.script && (
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Script</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{video.script}</p>
            </CardContent>
          </Card>
        )}
        {video.shotlist && (
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Shot List</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{video.shotlist}</p>
            </CardContent>
          </Card>
        )}
        {video.caption && (
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Caption</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{video.caption}</p>
            </CardContent>
          </Card>
        )}
        {video.notes && (
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{video.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Revision history */}
      {revisions.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-3">Revision History</h2>
          <div className="space-y-3">
            {revisions.map((rev) => (
              <Card key={rev.id} className="border border-gray-200">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-500">{rev.requested_by}</span>
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        rev.status === "Open" ? "bg-red-100 text-red-600" :
                        rev.status === "In Progress" ? "bg-yellow-100 text-yellow-700" :
                        "bg-green-100 text-green-700"
                      }`}>{rev.status}</span>
                      <span className="text-xs text-gray-400">{new Date(rev.created_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{rev.notes}</p>
                  {rev.admin_notes && (
                    <p className="text-sm text-blue-700 mt-2 bg-blue-50 rounded p-2 whitespace-pre-wrap">
                      <span className="font-semibold">Admin: </span>{rev.admin_notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}