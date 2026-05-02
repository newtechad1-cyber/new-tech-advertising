import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

const PHONE = '3192900004';
const SMS_BODY = 'Hey Rick, can you take a look at my website?';
const DISPLAY = '319-290-0004';

export default function TextMeButton({ className = '' }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={`sms:${PHONE}?body=${encodeURIComponent(SMS_BODY)}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-colors ${className}`}
    >
      <MessageSquare className="w-4 h-4 flex-shrink-0" />
      <span>
        Text Me About My Website
        {hovered && (
          <span className="ml-2 text-emerald-200 font-normal hidden sm:inline">
            — {DISPLAY}
          </span>
        )}
      </span>
    </a>
  );
}