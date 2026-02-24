import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from "@/api/base44Client";
import { Upload, X, Loader2, Type, Image as ImageIcon } from "lucide-react";

const invoke = (action, params) => base44.functions.invoke("aiVideoStudio", { action, ...params });

export default function Step4CaptionsOverlays({ state, setState, onBack, onNext }) {
  const { slides, script, captions = {}, overlays = {}, videoType } = state;
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const [generatingIdx, setGeneratingIdx] = useState(null);

  // Only show if slides exist (for slide videos) or for avatar videos
  const shouldShowCaptions = videoType === "slides" ? slides?.length > 0 : true;

  const handleUploadOverlay = async (slideIdx, file) => {
    if (!file) return;
    setUploadingIdx(slideIdx);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setState(s => ({
        ...s,
        overlays: {
          ...s.overlays,
          [slideIdx]: { ...s.overlays?.[slideIdx], image_url: file_url }
        }
      }));
    } catch (err) {
      console.error("Error uploading overlay:", err);
    } finally {
      setUploadingIdx(null);
    }
  };

  const updateCaption = (slideIdx, text) => {
    setState(s => ({
      ...s,
      captions: {
        ...s.captions,
        [slideIdx]: text
      }
    }));
  };

  const updateOverlay = (slideIdx, field, value) => {
    setState(s => ({
      ...s,
      overlays: {
        ...s.overlays,
        [slideIdx]: {
          ...s.overlays?.[slideIdx],
          [field]: value
        }
      }
    }));
  };

  const removeOverlay = (slideIdx) => {
    setState(s => {
      const newOverlays = { ...s.overlays };
      delete newOverlays[slideIdx];
      return { ...s, overlays: newOverlays };
    });
  };

  const generateCaption = async (slideIdx) => {
    setGeneratingIdx(`caption-${slideIdx}`);
    try {
      const slide = slides[slideIdx];
      const res = await invoke("generate_caption", {
        slideTitle: slide.title,
        slideContent: slide.content,
        videoScript: script
      });
      if (res.data?.caption) {
        updateCaption(slideIdx, res.data.caption);
      }
    } catch (err) {
      console.error("Error generating caption:", err);
    } finally {
      setGeneratingIdx(null);
    }
  };

  const generateOverlayImage = async (slideIdx) => {
    setGeneratingIdx(`overlay-${slideIdx}`);
    try {
      const slide = slides[slideIdx];
      const res = await invoke("generate_overlay_image", {
        slideTitle: slide.title,
        slideContent: slide.content,
        videoScript: script
      });
      if (res.data?.image_url) {
        setState(s => ({
          ...s,
          overlays: {
            ...s.overlays,
            [slideIdx]: { image_url: res.data.image_url, x: "10", y: "10" }
          }
        }));
      }
    } catch (err) {
      console.error("Error generating overlay:", err);
    } finally {
      setGeneratingIdx(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          {videoType === "slides" ? "Step 4: Captions & Overlays" : "Step 4: Video Captions"}
        </h2>
        <p className="text-sm text-gray-500">
          {videoType === "slides"
            ? "Add text captions and overlay images to each slide."
            : "Add text captions to your video."}
        </p>
      </div>

      {videoType === "slides" && slides && slides.length > 0 ? (
        <div className="space-y-4">
          {slides.map((slide, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-600">Slide {idx + 1}: {slide.title || "Untitled"}</span>
              </div>

              <Tabs defaultValue="captions" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="captions" className="gap-2">
                    <Type className="w-4 h-4" /> Caption
                  </TabsTrigger>
                  <TabsTrigger value="overlay" className="gap-2">
                    <ImageIcon className="w-4 h-4" /> Overlay
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="captions" className="space-y-3">
                   <Input
                     placeholder="Add text caption for this slide (e.g., pricing info, call-to-action)"
                     value={captions?.[idx] || ""}
                     onChange={e => updateCaption(idx, e.target.value)}
                     className="text-sm"
                   />
                   <Button
                     size="sm"
                     variant="outline"
                     onClick={() => generateCaption(idx)}
                     disabled={generatingIdx === `caption-${idx}`}
                     className="w-full gap-2"
                   >
                     {generatingIdx === `caption-${idx}` ? (
                       <Loader2 className="w-4 h-4 animate-spin" />
                     ) : (
                       <Type className="w-4 h-4" />
                     )}
                     {generatingIdx === `caption-${idx}` ? "Generating..." : "AI Generate Caption"}
                   </Button>
                   <p className="text-xs text-gray-400">Caption will appear at the bottom of the slide</p>
                 </TabsContent>

                <TabsContent value="overlay" className="space-y-3">
                  {overlays?.[idx]?.image_url ? (
                    <div className="space-y-3">
                      <div className="relative inline-block">
                        <img
                          src={overlays[idx].image_url}
                          alt="Overlay"
                          className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={() => removeOverlay(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Position X</label>
                          <Input
                            type="number"
                            placeholder="0-100"
                            value={overlays[idx].x || ""}
                            onChange={e => updateOverlay(idx, "x", e.target.value)}
                            className="text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Position Y</label>
                          <Input
                            type="number"
                            placeholder="0-100"
                            value={overlays[idx].y || ""}
                            onChange={e => updateOverlay(idx, "y", e.target.value)}
                            className="text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label>
                        <Button
                          variant="outline"
                          className="w-full gap-2"
                          disabled={uploadingIdx === idx}
                          asChild
                        >
                          <span>
                            {uploadingIdx === idx ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4" />
                            )}
                            {uploadingIdx === idx ? "Uploading..." : "Upload Overlay (Logo/Image)"}
                          </span>
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => e.target.files[0] && handleUploadOverlay(idx, e.target.files[0])}
                        />
                      </label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateOverlayImage(idx)}
                        disabled={generatingIdx === `overlay-${idx}`}
                        className="w-full gap-2"
                      >
                        {generatingIdx === `overlay-${idx}` ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ImageIcon className="w-4 h-4" />
                        )}
                        {generatingIdx === `overlay-${idx}` ? "Generating..." : "AI Generate Overlay"}
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-gray-400">Position (%) = where on slide it appears. 0,0 = top-left, 100,100 = bottom-right</p>
                  </TabsContent>
              </Tabs>
            </div>
          ))}
        </div>
      ) : videoType !== "slides" ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-gray-800">Video Caption (Optional)</p>
          <Input
            placeholder="Add a caption/subtitle for your avatar video"
            value={captions?.[0] || ""}
            onChange={e => updateCaption(0, e.target.value)}
            className="text-sm"
          />
          <p className="text-xs text-gray-500">This caption will display at the bottom of the video</p>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p>No slides added yet. Go back and add slides in the previous step.</p>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700">
          Next: Review & Create →
        </Button>
      </div>
    </div>
  );
}