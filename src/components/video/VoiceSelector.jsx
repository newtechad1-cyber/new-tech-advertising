import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Loader2, Volume2 } from "lucide-react";

export default function VoiceSelector({ voices, selectedVoiceId, onVoiceChange }) {
  const [playingId, setPlayingId] = useState(null);
  const [audio, setAudio] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const selectedVoice = voices.find(v => v.voice_id === selectedVoiceId);

  const playVoicePreview = async (voiceId) => {
    setPlayingId(voiceId);
    try {
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
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-gray-700 block">Voice (English)</label>
        <p className="text-xs text-gray-500 mt-1">Click preview button to listen, click name to select</p>
      </div>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <div className="max-h-80 overflow-y-auto">
          <div className="space-y-0">
            {voices.slice(0, 40).map(v => (
              <button
                key={v.voice_id}
                onClick={() => onVoiceChange(v.voice_id)}
                className={`w-full text-left p-3 border-b transition-all flex items-center justify-between hover:bg-gray-50 ${
                  selectedVoiceId === v.voice_id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex-1">
                  <p className={`font-medium ${selectedVoiceId === v.voice_id ? "text-blue-700" : "text-gray-800"}`}>
                    {v.display_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {v.gender} {v.accent ? `• ${v.accent} Accent` : ""}
                  </p>
                </div>
                {v.preview_url && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      playVoicePreview(v.voice_id);
                    }}
                    disabled={playingId === v.voice_id}
                    className="ml-2"
                  >
                    {playingId === v.voice_id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-gray-600" />
                    )}
                  </Button>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedVoice && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-2">Selected Voice</p>
          <p className="font-semibold text-gray-800">{selectedVoice.display_name}</p>
          <div className="flex gap-2 mt-2">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{selectedVoice.gender}</span>
            {selectedVoice.accent && (
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">{selectedVoice.accent} Accent</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}