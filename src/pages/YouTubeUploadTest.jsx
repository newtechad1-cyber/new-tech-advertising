import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function YouTubeUploadTest() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    base44.auth.me().then((user) => {
      if (user?.role === "admin") setIsAdmin(true);
      setLoading(false);
    });
  }, []);

  const handleUpload = async () => {
    setUploading(true);
    setResult(null);
    setError(null);
    try {
      const res = await base44.functions.invoke("youtubeUploadTest", { video_url: videoUrl });
      if (res.data?.success) {
        setResult(res.data);
      } else {
        setError(res.data?.error || "Unknown error");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (!isAdmin) return <div className="p-8 text-red-600 font-semibold">Admin access required.</div>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">YouTube Upload Test</h1>
      <p className="text-sm text-gray-500 mb-6">
        Uploads a public MP4 as an UNLISTED video to the connected YouTube account.
      </p>

      <div className="space-y-3">
        <Input
          placeholder="https://example.com/test-video.mp4"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <Button
          onClick={handleUpload}
          disabled={uploading || !videoUrl.trim()}
          className="w-full"
        >
          {uploading ? "Uploading..." : "Upload Test Video"}
        </Button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-semibold mb-1">✓ Upload Successful</p>
          <p className="text-sm text-gray-600">Video ID: <code className="bg-gray-100 px-1 rounded">{result.video_id}</code></p>
          <a
            href={result.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 underline mt-1 block"
          >
            {result.video_url}
          </a>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-semibold mb-1">✗ Upload Failed</p>
          <pre className="text-xs text-red-600 whitespace-pre-wrap break-all">{error}</pre>
        </div>
      )}
    </div>
  );
}