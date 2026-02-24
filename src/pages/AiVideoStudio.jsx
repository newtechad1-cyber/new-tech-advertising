import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, CheckCircle, Clock, AlertCircle, Play, Loader2, Download, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import WizardStep from "@/components/video/WizardStep";
import Step1Script from "@/components/video/Step1Script";
import Step2VideoType from "@/components/video/Step2VideoType";
import Step3Avatar from "@/components/video/Step3Avatar";
import Step3Slides from "@/components/video/Step3Slides";
import Step4CaptionsOverlays from "@/components/video/Step4CaptionsOverlays";
import Step4Review from "@/components/video/Step4Review";

const invoke = (action, params) => base44.functions.invoke("aiVideoStudio", { action, ...params });

const WIZARD_STEPS = ["Script", "Video Type", "Style / Media", "Captions & Overlays", "Review"];

const statusConfig = {
  queued:    { label: "Queued", color: "bg-gray-100 text-gray-600", icon: Clock },
  rendering: { label: "Rendering", color: "bg-yellow-100 text-yellow-700", icon: Loader2 },
  done:      { label: "Ready", color: "bg-green-100 text-green-700", icon: CheckCircle },
  failed:    { label: "Failed", color: "bg-red-100 text-red-700", icon: AlertCircle },
};

const defaultState = {
  inputMode: "prompt",
  userInput: "",
  format: "16:9",
  duration: "30s",
  script: "",
  videoType: "",
  avatarId: "",
  voiceId: "",
  title: "",
  slides: [],
  musicTrackUrl: "",
  musicGenerationPrompt: "",
  captions: {},
  overlays: {}
};

export default function AiVideoStudio() {
  const [avatars, setAvatars] = useState([]);
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [creating, setCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formState, setFormState] = useState(defaultState);
  const [myVideos, setMyVideos] = useState([]);
  const [pollingIds, setPollingIds] = useState({});
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("create");
  const [successMsg, setSuccessMsg] = useState("");

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
    const { inputMode, userInput, duration, format } = formState;
    const params = inputMode === "prompt" ? { prompt: userInput, duration, format }
                 : inputMode === "topic"   ? { topic: userInput, duration, format }
                 :                          { content: userInput, duration, format };
    const res = await invoke("generate_script", params);
    setFormState(s => ({ ...s, script: res.data?.script || "" }));
    setGenerating(false);
  };

  const handleCreateVideo = async () => {
    try {
      setCreating(true);
      const { script, avatarId, voiceId, format, duration, title, videoType, slides, musicTrackUrl, musicGenerationPrompt, captions, overlays } = formState;
      const res = await invoke("create_video", { script, avatarId, voiceId, format, duration, title: title || "AI Video", videoType, slides, musicTrackUrl, musicGenerationPrompt, captions, overlays });
      if (res.data?.record_id) {
        setPollingIds(prev => ({ ...prev, [res.data.record_id]: res.data.video_id }));
        await loadMyVideos(user);
        setSuccessMsg("Video sent to HeyGen! Rendering usually takes 2–5 minutes. Check the library below.");
        setActiveTab("library");
        setCurrentStep(0);
        setFormState(defaultState);
        pollStatus(res.data.record_id, res.data.video_id);
      } else {
        alert("Error: Could not create video. " + (res.data?.error || ""));
      }
    } catch (err) {
      console.error("Error creating video:", err);
      alert("Error creating video: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  const pollStatus = async (recordId, heygenVideoId, attempts = 0) => {
    if (attempts > 40) return;
    await new Promise(r => setTimeout(r, 15000));
    const res = await invoke("check_status", { heygenVideoId, recordId });
    const status = res.data?.status;
    await loadMyVideos(user);
    if (status !== "completed" && status !== "failed" && status !== "error") {
      pollStatus(recordId, heygenVideoId, attempts + 1);
    } else {
      setPollingIds(prev => { const n = { ...prev }; delete n[recordId]; return n; });
    }
  };

  const getStep3Component = () => {
    if (formState.videoType === "slides") {
      return (
        <Step3Slides
          state={formState}
          setState={setFormState}
          voices={voices}
          onBack={() => setCurrentStep(1)}
          onNext={() => setCurrentStep(3)}
        />
      );
    }
    return (
      <Step3Avatar
        state={formState}
        setState={setFormState}
        avatars={avatars}
        voices={voices}
        onBack={() => setCurrentStep(1)}
        onNext={() => setCurrentStep(3)}
      />
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="library">My Videos ({myVideos.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardContent className="pt-6">
              <WizardStep steps={WIZARD_STEPS} currentStep={currentStep} />

              {currentStep === 0 && (
                <Step1Script
                  state={formState}
                  setState={setFormState}
                  onGenerate={handleGenerateScript}
                  generating={generating}
                  onNext={() => setCurrentStep(1)}
                />
              )}
              {currentStep === 1 && (
                <Step2VideoType
                  state={formState}
                  setState={setFormState}
                  onBack={() => setCurrentStep(0)}
                  onNext={() => setCurrentStep(2)}
                />
              )}
              {currentStep === 2 && getStep3Component()}
              {currentStep === 3 && (
                <Step4CaptionsOverlays
                  state={formState}
                  setState={setFormState}
                  onBack={() => setCurrentStep(2)}
                  onNext={() => setCurrentStep(4)}
                />
              )}
              {currentStep === 4 && (
                <Step4Review
                  state={formState}
                  onBack={() => setCurrentStep(3)}
                  onSubmit={handleCreateVideo}
                  creating={creating}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library">
          {successMsg && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-3">
              ✅ {successMsg}
            </div>
          )}
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
                                <Button size="sm" variant="outline" className="gap-1"><Play className="w-3 h-3" /> Watch</Button>
                              </a>
                              <a href={v.render_output_url} download>
                                <Button size="sm" variant="outline" className="gap-1"><Download className="w-3 h-3" /> Download</Button>
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