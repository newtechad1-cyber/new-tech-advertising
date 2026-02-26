import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Video, Download } from "lucide-react";

const ALL_STATUSES = ["Draft", "Ready to Render", "Rendering", "Needs Review", "Delivered", "Revision Requested"];
const APPROVAL_STATUSES = ["Pending", "Approved", "Changes Requested"];
const REVISION_STATUSES = ["Open", "In Progress", "Completed"];

const statusColors = {
  "Open": "bg-red-100 text-red-600",
  "In Progress": "bg-yellow-100 text-yellow-700",
  "Completed": "bg-green-100 text-green-700",
};

export default function AdminVideoDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const [video, setVideo] = useState(null);
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [edits, setEdits] = useState({});
  const [adminNoteEdits, setAdminNoteEdits] = useState({});

  useEffect(() => {
    const load = async () => {
      const [v, revs] = await Promise.all([
        base44.entities.VideoRequests.get(id),
        base44.entities.VideoRevision.filter({ video_request_id: id }, "-created_date"),
      ]);
      setVideo(v);
      setEdits({
        status: v.status,
        approval_status: v.approval_status,
        script: v.script || "",
        shotlist: v.shotlist || "",
        caption: v.caption || "",
        notes: v.notes || "",
        render_output_url: v.render_output_url || "",
        render_job_id: v.render_job_id || "",
        render_status: v.render_status || "",
      });
      setRevisions(revs);
      setLoading(false);
    };
    if (id) {
      load();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    const updated = await base44.entities.VideoRequests.update(id, edits);
    setVideo(updated);
    setSaving(false);
  };

  const handleRevisionStatusUpdate = async (revId, newStatus, adminNote) => {
    const updateData = { status: newStatus };
    if (adminNote !== undefined) updateData.admin_notes = adminNote;
    if (newStatus === "Completed") updateData.resolved_at = new Date().toISOString();
    await base44.entities.VideoRevision.update(revId, updateData);
    const revs = await base44.entities.VideoRevision.filter({ video_request_id: id }, "-created_date");
    setRevisions(revs);
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
        <Link to={createPageUrl("AdminVideoQueue")} className="text-blue-600 text-sm mt-2 inline-block">← Back to Queue</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link to={createPageUrl("AdminDashboard")}>
          <Button variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-gray-900">← Admin Hub</Button>
        </Link>
        <span className="text-gray-300">|</span>
        <Link to={createPageUrl("AdminVideoQueue")}>
          <Button variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-gray-900">Video Queue</Button>
        </Link>
        <span className="text-gray-300">|</span>
        <span className="text-sm font-medium text-gray-700">Video Detail</span>
      </div>
    <div className="max-w-4xl mx-auto px-4 py-10">

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
          <p className="text-sm text-gray-500 mt-1">Requested by: {video.requested_by}</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Status controls */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Status Controls</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Status</label>
            <Select value={edits.status} onValueChange={(v) => setEdits((e) => ({ ...e, status: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Approval Status</label>
            <Select value={edits.approval_status} onValueChange={(v) => setEdits((e) => ({ ...e, approval_status: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {APPROVAL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Render Output URL</label>
            <Input
              value={edits.render_output_url}
              onChange={(e) => setEdits((ed) => ({ ...ed, render_output_url: e.target.value }))}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Render Job ID</label>
            <Input
              value={edits.render_job_id}
              onChange={(e) => setEdits((ed) => ({ ...ed, render_job_id: e.target.value }))}
              placeholder="job_..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Video preview */}
      {videoUrl && (
        <div className="mb-6">
          <div className="rounded-xl overflow-hidden bg-black aspect-video">
            <video src={videoUrl} controls className="w-full h-full object-contain" />
          </div>
          <div className="mt-2 flex justify-end">
            <a href={videoUrl} download>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" /> Download
              </Button>
            </a>
          </div>
        </div>
      )}

      {/* Editable content */}
      <div className="grid gap-4 mb-8">
        {[
          { key: "script", label: "Script" },
          { key: "shotlist", label: "Shot List" },
          { key: "caption", label: "Caption" },
          { key: "notes", label: "Notes" },
        ].map(({ key, label }) => (
          <Card key={key}>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={edits[key]}
                onChange={(e) => setEdits((ed) => ({ ...ed, [key]: e.target.value }))}
                className="min-h-[100px]"
                placeholder={`Enter ${label.toLowerCase()}...`}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revisions */}
      {revisions.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-3">Revision Requests ({revisions.length})</h2>
          <div className="space-y-4">
            {revisions.map((rev) => (
              <Card key={rev.id} className="border border-gray-200">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500">{rev.requested_by}</span>
                      <span className="text-xs text-gray-400 ml-2">{new Date(rev.created_date).toLocaleDateString()}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[rev.status]}`}>{rev.status}</span>
                  </div>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{rev.notes}</p>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Admin Notes</label>
                    <Textarea
                      value={adminNoteEdits[rev.id] ?? (rev.admin_notes || "")}
                      onChange={(e) => setAdminNoteEdits((n) => ({ ...n, [rev.id]: e.target.value }))}
                      className="min-h-[70px] text-sm"
                      placeholder="Add a note for the client..."
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {REVISION_STATUSES.filter((s) => s !== rev.status).map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant="outline"
                        onClick={() => handleRevisionStatusUpdate(rev.id, s, adminNoteEdits[rev.id])}
                      >
                        Mark {s}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}