import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Clock, Plus } from "lucide-react";
import { Link } from "react-router-dom";

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

export default function VideoIndex() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const u = await base44.auth.me();
        setUser(u);
        let data;
        if (u?.role === "admin") {
          data = await base44.entities.VideoRequests.list("-created_date");
        } else {
          data = await base44.entities.VideoRequests.filter(
            { requested_by: u.email },
            "-created_date"
          );
        }
        setRequests(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Videos</h1>
          <p className="text-gray-500 text-sm mt-1">Track your video requests and deliveries</p>
        </div>
        {user?.role === "admin" && (
          <Link to={createPageUrl("AdminVideoQueue")}>
            <Button variant="outline" size="sm">Admin Queue</Button>
          </Link>
        )}
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Video className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No video requests yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <Link key={req.id} to={createPageUrl(`VideoDetail?id=${req.id}`)}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-base font-semibold text-gray-900">{req.title}</CardTitle>
                    <div className="flex gap-2 shrink-0">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[req.status] || "bg-gray-100 text-gray-600"}`}>
                        {req.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${approvalColors[req.approval_status] || "bg-gray-100 text-gray-600"}`}>
                        {req.approval_status}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{req.format}</span>
                    <span>{req.duration}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(req.created_date).toLocaleDateString()}
                    </span>
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