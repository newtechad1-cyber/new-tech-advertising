import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, Video, RefreshCw, Download, CheckCircle, Clock, AlertCircle, Play, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const invoke = (action, params) => base44.functions.invoke("aiVideoStudio", { action, ...params });

export default function AiVideoStudio() {
  const [avatars, setAvatars] = useState([]);
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [inputMode, setInputMode] = useState("prompt"); // prompt | content | topic
  const [userInput, setUserInput] = useState("");
  const [title, setTitle] = useState("");
  const [format, setFormat] = useState("16:9");
  const [duration, setDuration] = useState("30s");
  const [script, setScript] = useState("");
  const [avatarId, setAvatarId] = useState("");
  const [voiceId, setVoiceId] = useState("");

  // My videos
  const [myVideos, setMyVideos] = useState([]);
  const [pollingIds, setPollingIds] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const u = await base44.auth.me();
        setUser(u);
        const [avatarRes, voiceRes] = await Promise.all([
          invoke("get_avatars", {}),
          invoke("get_voices", {})
        ]);
        setAvatars(avatarRes.data?.avatars || []);
        setVoices((voiceRes.data?.voices || []).filter(v => v.language === "English"));
        loadMyVideos(u);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const loadMyVideos = async (u) => {
    const data = u?.role === "admin"
      ? await base44.entities.VideoRequests.list("-created_date", 20)
      : await base44.entities.VideoRequests.filter({ requested_by: u?.email }, "-created_date", 20);
    setMyVideos(data.filter(v => v.render_job_id));
  };

  const handleGenerateScript = async () => {
    setGenerating(true);
    const params = inputMode === "prompt" ? { prompt: userInput, duration, format }
                 : inputMode === "topic"   ? { topic: userInput, duration, format }
                 :                          { content: userInput, duration, format };
    const res = await invoke("generate_script", params);
    setScript(res.data?.script || "");
    setGenerating(false);
  };

  const handleCreateVideo = async () => {
    if (!script || !avatarId || !voiceId) return;
    setCreating(true);
    const res = await invoke("create_video", { script, avatarId, voiceId, format, duration, title: title || "AI Video" });
    setCreating(false);
    if (res.data?.record_id) {
      setPollingIds(prev => ({ ...prev, [res.data.record_id]: res.data.video_id }));
      await loadMyVideos(user);
      pollStatus(res.data.record_id, res.data.video_id);
    }
  };

  const pollStatus = async (recordId, heygenVideoId, attempts = 0) => {
    if (attempts > 40) return; // ~10 min max
    await new Promise(r => setTimeout(r, 15000));
    const res = await invoke("check_status", { heygenVideoId, recordId });
    const status = res.data?.status;
    await loadMyVideos(user);
    if (status !== "completed" && status !== "failed") {
      pollStatus(recordId, heygenVideoId, attempts + 1);
    } else {
      setPollingIds(prev => { const n = {...prev}; delete n[recordId]; return n; });
    }
  };

  const statusConfig = {
    queued:     { label: "Queued", color: "bg-gray-100 text-gray-600", icon: Clock },
    rendering:  { label: "Rendering", color: "bg-yellow-100 text-yellow-700", icon: Loader2 },
    done:       { label: "Ready", color: "bg-green-100 text-green-700", icon: CheckCircle },
    failed:     { label: "Failed", color: "bg-red-100 text-red-700", icon: AlertCircle },
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Video className="w-6 h-6 text-blue-600" /> AI Video Studio
          </h1>
          <p className="text-gray-500 text-sm mt-1">Create short promotional videos powered by OpenAI + HeyGen</p>
        </div>
        <Link to={createPageUrl("VideoIndex")}>
          <Button variant="outline" size="sm">All Videos</Button>
        </Link>
      </div>

      <Tabs defaultValue="create">
        <TabsList className="mb-6">
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="library">My Videos ({myVideos.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <div className="space-y-6">
            {/* Step 1: Input */}
            <Card>
              <CardHeader><CardTitle className="text-base">Step 1 — Write or Generate a Script</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  {[
                    { id: "prompt", label: "Custom Prompt" },
                    { id: "topic", label: "Topic" },
                    { id: "content", label: "Paste Content" }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setInputMode(m.id)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${inputMode === m.id ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                <Textarea
                  rows={4}
                  placeholder={
                    inputMode === "prompt" ? "e.g. Write a 30-second promo for a local HVAC company in Iowa..." :
                    inputMode === "topic"  ? "e.g. Summer AC tune-up special, 20% off..." :
                    "Paste blog content, website copy, or any text to convert into a script..."
                  }
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                />
                <div className="flex gap-4 flex-wrap">
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                      <SelectItem value="9:16">9:16 (Vertical)</SelectItem>
                      <SelectItem value="1:1">1:1 (Square)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15s">15 seconds</SelectItem>
                      <SelectItem value="30s">30 seconds</SelectItem>
                      <SelectItem value="60s">60 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleGenerateScript} disabled={!userInput || generating} className="bg-purple-600 hover:bg-purple-700">
                    {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                    {generating ? "Generating..." : "Generate Script with AI"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Script editor */}
            {(script || generating) && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Script</CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleGenerateScript} disabled={generating}>
                    <RefreshCw className="w-4 h-4 mr-1" /> Regenerate
                  </Button>
                </CardHeader>
                <CardContent>
                  <Textarea
                    rows={6}
                    value={script}
                    onChange={e => setScript(e.target.value)}
                    placeholder="Script will appear here..."
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-2">{script.split(" ").filter(Boolean).length} words</p>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Avatar & Voice */}
            {script && (
              <Card>
                <CardHeader><CardTitle className="text-base">Step 2 — Choose Avatar & Voice</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Avatar</label>
                    <Select value={avatarId} onValueChange={setAvatarId}>
                      <SelectTrigger><SelectValue placeholder="Select an avatar..." /></SelectTrigger>
                      <SelectContent>
                        {avatars.slice(0, 30).map(a => (
                          <SelectItem key={a.avatar_id} value={a.avatar_id}>{a.avatar_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Voice (English)</label>
                    <Select value={voiceId} onValueChange={setVoiceId}>
                      <SelectTrigger><SelectValue placeholder="Select a voice..." /></SelectTrigger>
                      <SelectContent>
                        {voices.slice(0, 30).map(v => (
                          <SelectItem key={v.voice_id} value={v.voice_id}>{v.display_name} — {v.gender}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Video Title</label>
                    <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Summer HVAC Promo" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Create button */}
            {script && avatarId && voiceId && (
              <Button onClick={handleCreateVideo} disabled={creating} size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {creating ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Sending to HeyGen...</> : <><Play className="w-4 h-4 mr-2" />Create Video</>}
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="library">
          {myVideos.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Video className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No AI videos yet. Create your first one!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {myVideos.map(v => {
                const s = statusConfig[v.render_status] || statusConfig.queued;
                const isPolling = !!pollingIds[v.id];
                return (
                  <Card key={v.id} className="border border-gray-200">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{v.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{v.format} · {v.duration} · {new Date(v.created_date).toLocaleDateString()}</p>
                          {v.script && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{v.script}</p>}
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${s.color}`}>
                            <s.icon className={`w-3 h-3 ${(v.render_status === "rendering" || isPolling) ? "animate-spin" : ""}`} />
                            {isPolling && v.render_status !== "done" && v.render_status !== "failed" ? "Rendering..." : s.label}
                          </span>
                          {v.render_status === "done" && v.render_output_url && (
                            <div className="flex gap-2">
                              <a href={v.render_output_url} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" variant="outline" className="gap-1">
                                  <Play className="w-3 h-3" /> Watch
                                </Button>
                              </a>
                              <a href={v.render_output_url} download>
                                <Button size="sm" variant="outline" className="gap-1">
                                  <Download className="w-3 h-3" /> Download
                                </Button>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      {v.render_status === "done" && v.render_output_url && (
                        <video src={v.render_output_url} controls className="w-full rounded-lg mt-4 max-h-64 bg-black" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}