import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";

export default function AvatarSelector({ avatars, selectedAvatarId, onAvatarChange }) {
  const [selectedPreview, setSelectedPreview] = useState(selectedAvatarId);

  const selectedAvatar = avatars.find(a => a.avatar_id === selectedPreview);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">Avatar Presenter</label>
        <p className="text-xs text-gray-500 mb-3">Click to preview, select to use</p>
      </div>

      <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
        {avatars.map(a => (
          <button
            key={a.avatar_id}
            onClick={() => {
              setSelectedPreview(a.avatar_id);
              onAvatarChange(a.avatar_id);
            }}
            className={`relative group transition-all rounded-lg overflow-hidden border-2 ${
              selectedAvatarId === a.avatar_id
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <img
              src={a.preview_image_url}
              alt={a.avatar_name}
              className="w-full h-24 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
              {selectedAvatarId === a.avatar_id && (
                <Check className="w-6 h-6 text-white drop-shadow-lg" />
              )}
            </div>
            <p className="text-xs font-medium text-gray-700 bg-white px-2 py-1 truncate">
              {a.avatar_name}
            </p>
          </button>
        ))}
      </div>

      {selectedAvatar && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
          <p className="text-xs text-gray-500 mb-2">Preview</p>
          <div className="space-y-3">
            <video
              src={selectedAvatar.preview_video_url}
              autoPlay
              loop
              muted
              className="w-full rounded-lg bg-black max-h-48 object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800">{selectedAvatar.avatar_name}</p>
              <p className="text-xs text-gray-600 mt-1">
                {selectedAvatar.gender && `${selectedAvatar.gender} • `}
                {selectedAvatar.premium ? "Premium" : "Standard"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}