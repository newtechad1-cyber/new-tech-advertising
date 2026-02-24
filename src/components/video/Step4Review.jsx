import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from "lucide-react";

export default function Step4Review({ state, onBack, onSubmit, creating }) {
  const { title, script, videoType, format, duration, avatarId, voiceId, slides } = state;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Step 4: Review & Create</h2>
        <p className="text-sm text-gray-500">Confirm your settings and launch your video to HeyGen for rendering.</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
        <Row label="Title" value={title || "(Untitled)"} />
        <Row label="Video Type" value={videoType === "slides" ? "Image Slideshow + Voiceover" : "AI Avatar Presenter"} />
        <Row label="Format" value={format} />
        <Row label="Duration" value={duration} />
        {videoType === "slides" && slides?.length > 0 && (
          <Row label="Slides" value={`${slides.length} slides`} />
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Script Preview</p>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{script}</p>
      </div>

      {videoType === "slides" && slides?.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {slides.map((sl, i) => (
            <div key={i} className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
              {sl.image_url
                ? <img src={sl.image_url} alt={sl.title} className="w-full h-20 object-cover" />
                : <div className="h-20 flex items-center justify-center text-gray-400 text-xs">No image</div>
              }
              <div className="p-1.5">
                <p className="text-xs font-medium text-gray-700 truncate">{sl.title || `Slide ${i+1}`}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
        ⏱ HeyGen rendering typically takes 2–5 minutes. You can close this page and check the video library later.
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <Button onClick={onSubmit} disabled={creating} size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2">
          {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending to HeyGen...</> : <><Play className="w-4 h-4" /> Create Video</>}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}