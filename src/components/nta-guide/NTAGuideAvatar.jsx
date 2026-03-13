import React from 'react';

export default function NTAGuideAvatar({ size = 44, pulse = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-shrink-0 rounded-full focus:outline-none transition-transform hover:scale-105 active:scale-95 ${pulse ? 'animate-none' : ''}`}
      style={{ width: size, height: size }}
    >
      {/* Pulse ring */}
      {pulse && (
        <span className="absolute inset-0 rounded-full border-2 border-blue-400/50 animate-ping" />
      )}

      {/* Avatar background */}
      <span className="block w-full h-full rounded-full bg-white shadow-lg overflow-hidden flex items-center justify-center">
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/4180c3dd4_faviconimage_edited.png"
          alt="NTA Growth Guide"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </span>
    </button>
  );
}