import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AvatarSelector from "@/components/video/AvatarSelector";
import VoiceSelector from "@/components/video/VoiceSelector";
import MusicTrackSelector from "@/components/video/MusicTrackSelector";

export default function Step3Avatar({ state, setState, avatars, voices, onBack, onNext }) {
  const { avatarId, voiceId, title, musicTrackUrl, musicGenerationPrompt } = state;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Step 3: Avatar & Voice</h2>
        <p className="text-sm text-gray-500">Choose an AI presenter and voice for your video.</p>
      </div>

      <div className="space-y-6">
        <AvatarSelector
          avatars={avatars}
          selectedAvatarId={avatarId}
          onAvatarChange={v => setState(s => ({ ...s, avatarId: v }))}
        />

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
        <Button onClick={onNext} disabled={!voiceId} className="bg-blue-600 hover:bg-blue-700">
          Next: Captions & Overlays →
        </Button>
      </div>
    </div>
  );
}