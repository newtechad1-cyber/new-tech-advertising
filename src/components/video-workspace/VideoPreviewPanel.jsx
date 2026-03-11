import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Clock, Building2, Download, Upload, Image } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function VideoPreviewPanel({ video, onChange }) {
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);

  const sourceUrl = video.source_file_url || video.final_video || video.render_output_url;

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingVideo(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onChange({ source_file_url: file_url, processing_status: "uploaded" });
    setUploadingVideo(false);
  };

  const handleThumbUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingThumb(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onChange({ thumbnail_url: file_url });
    setUploadingThumb(false);
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
          <Video className="w-4 h-4 text-violet-400" />
          Video Source
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Player / Thumbnail */}
        {sourceUrl ? (
          <div className="rounded-xl overflow-hidden bg-black aspect-video shadow-lg shadow-black/40">
            <video src={sourceUrl} controls className="w-full h-full object-contain" />
          </div>
        ) : video.thumbnail_url ? (
          <div className="rounded-xl overflow-hidden aspect-video bg-slate-800 relative">
            <img src={video.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-14 h-14 rounded-full bg-violet-600/90 flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-slate-800/60 border-2 border-dashed border-slate-700 aspect-video flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center">
              <Video className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-500 text-sm">No video uploaded yet</p>
            <label className="cursor-pointer">
              <span className="inline-flex items-center gap-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-300 text-sm px-4 py-2 rounded-lg transition-all">
                <Upload className="w-4 h-4" />
                {uploadingVideo ? "Uploading..." : "Upload Video File"}
              </span>
              <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} disabled={uploadingVideo} />
            </label>
          </div>
        )}

        {/* Action row */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="cursor-pointer">
            <span className="inline-flex items-center gap-1.5 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 text-xs px-3 py-1.5 rounded-lg transition-all bg-slate-800/50 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              {uploadingVideo ? "Uploading..." : sourceUrl ? "Replace Video" : "Upload Video"}
            </span>
            <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} disabled={uploadingVideo} />
          </label>
          {sourceUrl && (
            <a href={sourceUrl} download>
              <span className="inline-flex items-center gap-1.5 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 text-xs px-3 py-1.5 rounded-lg transition-all bg-slate-800/50 cursor-pointer">
                <Download className="w-3.5 h-3.5" /> Download
              </span>
            </a>
          )}
          <label className="cursor-pointer">
            <span className="inline-flex items-center gap-1.5 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 text-xs px-3 py-1.5 rounded-lg transition-all bg-slate-800/50 cursor-pointer">
              <Image className="w-3.5 h-3.5" />
              {uploadingThumb ? "Uploading..." : "Set Thumbnail"}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handleThumbUpload} disabled={uploadingThumb} />
          </label>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 py-2 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-600" />
            {video.created_date ? new Date(video.created_date).toLocaleDateString() : "Upload date unknown"}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            {video.duration_target || "Duration TBD"}
          </div>
          {video.requested_by && (
            <div className="flex items-center gap-2 text-xs text-slate-500 col-span-2">
              <Building2 className="w-3.5 h-3.5 text-slate-600" />
              Requested by: {video.requested_by}
            </div>
          )}
        </div>

        {/* Editable fields */}
        <div className="space-y-3 pt-1 border-t border-slate-800">
          <div>
            <Label className="text-xs text-slate-500 mb-1 block">Video Title</Label>
            <Input
              value={video.title || ""}
              onChange={(e) => onChange({ title: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-600 text-sm focus:border-violet-500"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-500 mb-1 block">Source File URL</Label>
            <Input
              value={video.source_file_url || ""}
              onChange={(e) => onChange({ source_file_url: e.target.value })}
              placeholder="https://..."
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-600 text-sm focus:border-violet-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}