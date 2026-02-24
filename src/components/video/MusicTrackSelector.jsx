import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from "@/api/base44Client";
import { Upload, Wand2, Music, X, Loader2 } from "lucide-react";

export default function MusicTrackSelector({ musicTrackUrl, musicPrompt, onMusicChange, onPromptChange }) {
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [prompt, setPrompt] = useState(musicPrompt || "");
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onMusicChange(file_url);
    } catch (err) {
      console.error("Error uploading music:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateMusic = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    try {
      onPromptChange(prompt);
      setPrompt("");
      alert("Music generation feature is currently a placeholder. To enable AI music generation:\n\n1. Sign up for an API at Soundraw.io or AIVA.ai\n\n2. Add the API key to your app settings\n\n3. The generated music will automatically be included in your video\n\nFor now, use the 'Upload' tab to add your own music tracks.");
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setGenerating(false);
    }
  };

  const playPreview = () => {
    if (musicTrackUrl) {
      if (audio) {
        audio.pause();
        setPlaying(false);
      } else {
        const newAudio = new Audio(musicTrackUrl);
        newAudio.onended = () => setPlaying(false);
        newAudio.play();
        setAudio(newAudio);
        setPlaying(true);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Background Music (Optional)</h3>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="generate">AI Generate</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-3 pt-4">
            <label>
              <Button
                variant="outline"
                className="w-full gap-2"
                disabled={uploading}
                asChild
              >
                <span>
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {uploading ? "Uploading..." : "Choose Music File"}
                </span>
              </Button>
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={e => e.target.files[0] && handleUpload(e.target.files[0])}
              />
            </label>
            <p className="text-xs text-gray-500">MP3, WAV, or M4A (up to 10 MB)</p>
          </TabsContent>

          <TabsContent value="generate" className="space-y-3 pt-4">
            <Input
              placeholder="e.g., Upbeat corporate, cinematic orchestral, chill ambient..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              className="text-sm"
            />
            <Button
              onClick={handleGenerateMusic}
              disabled={generating || !prompt.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700 gap-2"
            >
              {generating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              {generating ? "Generating..." : "Generate Music"}
            </Button>
            <p className="text-xs text-gray-500">Powered by AI music generation. Specify mood, style, or tempo.</p>
          </TabsContent>
        </Tabs>
      </div>

      {musicTrackUrl && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Music className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-800 truncate">Music added</span>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={playPreview}
              >
                {playing ? "Stop" : "Preview"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onMusicChange("");
                  onPromptChange("");
                  if (audio) audio.pause();
                  setPlaying(false);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}