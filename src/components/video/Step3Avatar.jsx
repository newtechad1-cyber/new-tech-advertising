import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Step3Avatar({ state, setState, avatars, voices, onBack, onNext }) {
  const { avatarId, voiceId, title } = state;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Step 3: Avatar & Voice</h2>
        <p className="text-sm text-gray-500">Choose an AI presenter and voice for your video.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Avatar</label>
          <Select value={avatarId} onValueChange={v => setState(s => ({ ...s, avatarId: v }))}>
            <SelectTrigger><SelectValue placeholder="Select an avatar..." /></SelectTrigger>
            <SelectContent>
              {avatars.slice(0, 40).map(a => (
                <SelectItem key={a.avatar_id} value={a.avatar_id}>{a.avatar_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Voice (English)</label>
          <Select value={voiceId} onValueChange={v => setState(s => ({ ...s, voiceId: v }))}>
            <SelectTrigger><SelectValue placeholder="Select a voice..." /></SelectTrigger>
            <SelectContent>
              {voices.slice(0, 40).map(v => (
                <SelectItem key={v.voice_id} value={v.voice_id}>{v.display_name} — {v.gender}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Video Title</label>
          <Input value={title} onChange={e => setState(s => ({ ...s, title: e.target.value }))} placeholder="e.g. Summer HVAC Promo" />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <Button onClick={onNext} disabled={!avatarId || !voiceId} className="bg-blue-600 hover:bg-blue-700">
          Next: Review & Create →
        </Button>
      </div>
    </div>
  );
}