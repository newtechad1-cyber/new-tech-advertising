import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Video, Clock, ChevronRight } from "lucide-react";

const statusColors = {
  "Draft": "bg-gray-100 text-gray-700",
  "Ready to Render": "bg-blue-100 text-blue-700",
  "Rendering": "bg-yellow-100 text-yellow-700",
  "Needs Review": "bg-orange-100 text-orange-700",
  "Delivered": "bg-green-100 text-green-700",
  "Revision Requested": "bg-red-100 text-red-700",
};

const approvalColors = {
  "Pending": "bg-gray-100 text-gray-600",
  "Approved": "bg-green-100 text-green-700",
  "Changes Requested": "bg-red-100 text-red-700",
};

const STATUS_ORDER = ["Needs Review", "Revision Requested", "Ready to Render", "Rendering", "Draft", "Delivered"];

export default function AdminVideoQueue() {
  const [requests, setRequests] = useState([]);
  const [revisionCounts, setRevisionCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const load = async () => {
      const [reqs, revs] = await Promise.all([
        base44.entities.VideoRequests.list("-created_date"),
        base44.entities.VideoRevision.filter({ status: "Open" }),
      ]);
      const counts = {};
      revs.forEach((r) => {
        counts[r.video_request_id] = (counts[r.video_request_id] || 0) + 1;
      });
      setRevisionCounts(counts);
      // Sort by status priority
      reqs.sort((a, b) => {
        const ai = STATUS_ORDER.indexOf(a.status);
        const bi = STATUS_ORDER.indexOf(b.status);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      });
      setRequests(reqs);
      setLoading(false);
    };
    load();
  }, []);

  const statuses = ["All", ...STATUS_ORDER];
  const filtered = filter === "All" ? requests : requests.filter((r) => r.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video Queue</h1>
          <p className="text-gray-500 text-sm mt-1">{requests.length} total requests</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
              filter === s ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Video className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p>No requests found</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((req) => (
            <Link key={req.id} to={createPageUrl(`AdminVideoDetail?id=${req.id}`)}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 truncate">{req.title}</span>
                        {revisionCounts[req.id] > 0 && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                            {revisionCounts[req.id]} open revision{revisionCounts[req.id] > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                        <span>{req.requested_by}</span>
                        <span>{req.format}</span>
                        <span>{req.duration}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(req.created_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[req.status] || "bg-gray-100 text-gray-600"}`}>
                        {req.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${approvalColors[req.approval_status] || "bg-gray-100 text-gray-600"}`}>
                        {req.approval_status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}