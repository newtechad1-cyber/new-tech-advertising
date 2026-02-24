import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { Wand2, Upload, RefreshCw, Loader2, ImagePlus, X } from "lucide-react";
import VoiceSelector from "@/components/video/VoiceSelector";
import MusicTrackSelector from "@/components/video/MusicTrackSelector";

const invoke = (action, params) => base44.functions.invoke("aiVideoStudio", { action, ...params });

export default function Step3Slides({ state, setState, voices, onBack, onNext }) {
  const { slides, voiceId, title, script, musicTrackUrl, musicGenerationPrompt } = state;
  const [generatingIdeas, setGeneratingIdeas] = useState(false);
  const [generatingImageIdx, setGeneratingImageIdx] = useState(null);
  const [uploadingIdx, setUploadingIdx] = useState(null);

  const generateIdeas = async () => {
    setGeneratingIdeas(true);
    const slideCount = state.duration === "15s" ? 3 : state.duration === "30s" ? 5 : 8;
    const res = await invoke("generate_slide_ideas", { script, slideCount });
    const ideas = res.data?.slides || [];
    setState(s => ({ ...s, slides: ideas.map(sl => ({ ...sl, image_url: "" })) }));
    setGeneratingIdeas(false);
  };

  const generateImage = async (idx) => {
    setGeneratingImageIdx(idx);
    const prompt = slides[idx]?.image_prompt || slides[idx]?.title;
    const res = await invoke("generate_slide_image", { prompt });
    const url = res.data?.url || "";
    setState(s => {
      const updated = [...(s.slides || [])];
      updated[idx] = { ...updated[idx], image_url: url };
      return { ...s, slides: updated };
    });
    setGeneratingImageIdx(null);
  };

  const generateAllImages = async () => {
    for (let i = 0; i < (slides || []).length; i++) {
      if (!slides[i].image_url) {
        await generateImage(i);
      }
    }
  };

  const handleUpload = async (idx, file) => {
    setUploadingIdx(idx);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setState(s => {
      const updated = [...(s.slides || [])];
      updated[idx] = { ...updated[idx], image_url: file_url };
      return { ...s, slides: updated };
    });
    setUploadingIdx(null);
  };

  const updateSlide = (idx, field, value) => {
    setState(s => {
      const updated = [...(s.slides || [])];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...s, slides: updated };
    });
  };

  const addSlide = () => {
    setState(s => ({
      ...s,
      slides: [...(s.slides || []), { title: "", caption: "", image_prompt: "", image_url: "" }]
    }));
  };

  const removeSlide = (idx) => {
    setState(s => ({ ...s, slides: (s.slides || []).filter((_, i) => i !== idx) }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Step 3: Slides & Media</h2>
        <p className="text-sm text-gray-500">Build your slideshow with AI-generated or uploaded images.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button onClick={generateIdeas} disabled={generatingIdeas} className="bg-purple-600 hover:bg-purple-700">
          {generatingIdeas ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
          {generatingIdeas ? "Generating Slides..." : "AI Generate Slide Ideas"}
        </Button>
        {slides?.length > 0 && (
          <Button variant="outline" onClick={generateAllImages} disabled={generatingImageIdx !== null}>
            <Wand2 className="w-4 h-4 mr-2" /> Generate All Images
          </Button>
        )}
        <Button variant="outline" onClick={addSlide}>
          <ImagePlus className="w-4 h-4 mr-2" /> Add Blank Slide
        </Button>
      </div>

      {slides && slides.length > 0 && (
        <div className="space-y-4">
          {slides.map((slide, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-600">Slide {idx + 1}</span>
                <button onClick={() => removeSlide(idx)} className="text-gray-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Slide title (text overlay)"
                    value={slide.title || ""}
                    onChange={e => updateSlide(idx, "title", e.target.value)}
                  />
                  <Input
                    placeholder="Caption / supporting text"
                    value={slide.caption || ""}
                    onChange={e => updateSlide(idx, "caption", e.target.value)}
                  />
                  <Input
                    placeholder="Image description for AI generation"
                    value={slide.image_prompt || ""}
                    onChange={e => updateSlide(idx, "image_prompt", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  {slide.image_url ? (
                    <div className="relative">
                      <img src={slide.image_url} alt={`Slide ${idx + 1}`} className="w-full h-32 object-cover rounded-lg border" />
                      <button
                        onClick={() => updateSlide(idx, "image_url", "")}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-32 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                      No image yet
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled={generatingImageIdx === idx}
                      onClick={() => generateImage(idx)}
                    >
                      {generatingImageIdx === idx ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Wand2 className="w-3 h-3 mr-1" />}
                      AI Image
                    </Button>
                    <label className="flex-1">
                      <Button variant="outline" size="sm" className="w-full" disabled={uploadingIdx === idx} asChild>
                        <span>
                          {uploadingIdx === idx ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Upload className="w-3 h-3 mr-1" />}
                          Upload
                        </span>
                      </Button>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={e => e.target.files[0] && handleUpload(idx, e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4 border-t pt-4">
        <VoiceSelector
          voices={voices}
          selectedVoiceId={voiceId}
          onVoiceChange={v => setState(s => ({ ...s, voiceId: v }))}
        />
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Video Title</label>
          <Input value={title} onChange={e => setState(s => ({ ...s, title: e.target.value }))} placeholder="e.g. Summer HVAC Promo" />
        </div>
        <MusicTrackSelector
          musicTrackUrl={musicTrackUrl || ""}
          musicPrompt={musicGenerationPrompt || ""}
          onMusicChange={url => setState(s => ({ ...s, musicTrackUrl: url }))}
          onPromptChange={prompt => setState(s => ({ ...s, musicGenerationPrompt: prompt }))}
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <Button
          onClick={onNext}
          disabled={!voiceId || !slides?.length}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Next: Review & Create →
        </Button>
      </div>
    </div>
  );
}