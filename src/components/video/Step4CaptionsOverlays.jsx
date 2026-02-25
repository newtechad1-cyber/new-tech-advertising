import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Subtitles } from "lucide-react";

export default function Step4CaptionsOverlays({ state, setState, onBack, onNext }) {
  const enableCaptions = Object.values(state.captions || {}).some(c => c === true || c === "true" || c === "enabled");

  const toggleCaptions = (val) => {
    setState(s => ({
      ...s,
      captions: val ? { enabled: true } : {}
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Step 4: Captions</h2>
        <p className="text-sm text-gray-500">
          Enable auto-generated captions (subtitles) for your video.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-start gap-4">
        <Subtitles className="w-6 h-6 text-blue-500 mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-gray-800 mb-1">Auto-Captions</p>
          <p className="text-sm text-gray-500 mb-4">
            HeyGen will automatically generate synchronized captions based on the spoken audio in your video.
          </p>
          <div className="flex items-center gap-3">
            <Switch
              id="captions-toggle"
              checked={enableCaptions}
              onCheckedChange={toggleCaptions}
            />
            <Label htmlFor="captions-toggle" className="text-sm font-medium cursor-pointer">
              {enableCaptions ? "Captions enabled" : "Captions disabled"}
            </Label>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700">
          Next: Review & Create →
        </Button>
      </div>
    </div>
  );
}