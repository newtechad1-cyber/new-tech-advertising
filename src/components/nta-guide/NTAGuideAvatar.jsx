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
      <span className="block w-full h-full rounded-full bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 shadow-lg overflow-hidden flex items-center justify-center">
        {/* NTA Logo Bot (no surfboard) — SVG inline */}
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '72%', height: '72%' }}>
          {/* Head */}
          <ellipse cx="32" cy="24" rx="13" ry="14" fill="white" opacity="0.95" />
          {/* Eyes */}
          <ellipse cx="27" cy="21" rx="3" ry="3.5" fill="#1d4ed8" />
          <ellipse cx="37" cy="21" rx="3" ry="3.5" fill="#1d4ed8" />
          {/* Pupils */}
          <circle cx="28" cy="22" r="1.2" fill="white" />
          <circle cx="38" cy="22" r="1.2" fill="white" />
          {/* Smile */}
          <path d="M26 28 Q32 33 38 28" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Body */}
          <rect x="22" y="37" width="20" height="16" rx="6" fill="white" opacity="0.85" />
          {/* NTA letters on body */}
          <text x="32" y="49" textAnchor="middle" fontSize="7" fontWeight="900" fill="#1d4ed8" fontFamily="system-ui">NTA</text>
          {/* Antenna */}
          <line x1="32" y1="10" x2="32" y2="5" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
          <circle cx="32" cy="4" r="2" fill="#60a5fa" />
        </svg>
      </span>
    </button>
  );
}