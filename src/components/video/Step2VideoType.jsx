import React from "react";
import { Button } from "@/components/ui/button";
import { User, Images } from "lucide-react";

export default function Step2VideoType({ state, setState, onBack, onNext }) {
  const { videoType } = state;

  const types = [
    {
      id: "avatar",
      icon: User,
      label: "AI Avatar Presenter",
      desc: "A realistic AI human reads your script on camera. Best for spokesperson-style videos."
    },
    {
      id: "slides",
      icon: Images,
      label: "Image Slideshow + Voiceover",
      desc: "AI generates background images for each scene. Upload your own or let AI create them. Great for promotional highlight reels."
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Step 2: Video Type</h2>
        <p className="text-sm text-gray-500">Choose how your video will look.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {types.map(t => (
          <button
            key={t.id}
            onClick={() => setState(s => ({ ...s, videoType: t.id }))}
            className={`text-left p-5 rounded-xl border-2 transition-all ${videoType === t.id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-white"}`}
          >
            <t.icon className={`w-8 h-8 mb-3 ${videoType === t.id ? "text-blue-600" : "text-gray-400"}`} />
            <p className={`font-semibold mb-1 ${videoType === t.id ? "text-blue-700" : "text-gray-800"}`}>{t.label}</p>
            <p className="text-sm text-gray-500">{t.desc}</p>
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <Button onClick={onNext} disabled={!videoType} className="bg-blue-600 hover:bg-blue-700">
          Next →
        </Button>
      </div>
    </div>
  );
}