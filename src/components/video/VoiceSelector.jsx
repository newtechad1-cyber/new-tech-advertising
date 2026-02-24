import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Loader2 } from "lucide-react";

export default function VoiceSelector({ voices, selectedVoiceId, onVoiceChange }) {
  const [playingId, setPlayingId] = useState(null);
  const [audio, setAudio] = useState(null);

  const selectedVoice = voices.find(v => v.voice_id === selectedVoiceId);

  const playVoicePreview = async (voiceId) => {
    setPlayingId(voiceId);
    try {
      // Stop current audio if playing
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      
      const voice = voices.find(v => v.voice_id === voiceId);
      if (voice?.preview_url) {
        const newAudio = new Audio(voice.preview_url);
        newAudio.onended = () => setPlayingId(null);
        newAudio.play();
        setAudio(newAudio);
      }
    } catch (err) {
      console.error('Error playing voice preview:', err);
      setPlayingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Voice (English)</label>
        <Select value={selectedVoiceId} onValueChange={onVoiceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a voice..." />
          </SelectTrigger>
          <SelectContent>
            {voices.slice(0, 40).map(v => (
              <SelectItem key={v.voice_id} value={v.voice_id}>
                {v.display_name} — {v.gender}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedVoice && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="space-y-2">
            <p className="font-medium text-gray-800">{selectedVoice.display_name}</p>
            <div className="flex gap-2 text-sm text-gray-600">
              <span className="bg-blue-100 px-2 py-1 rounded">{selectedVoice.gender}</span>
              {selectedVoice.accent && (
                <span className="bg-blue-100 px-2 py-1 rounded">{selectedVoice.accent} Accent</span>
              )}
            </div>
            {selectedVoice.preview_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => playVoicePreview(selectedVoice.voice_id)}
                className="gap-2"
                disabled={playingId === selectedVoice.voice_id}
              >
                {playingId === selectedVoice.voice_id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {playingId === selectedVoice.voice_id ? "Playing..." : "Preview Voice"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}