import React from 'react';
import { Lightbulb } from 'lucide-react';

const CONTEXT_MESSAGES = {
  website: 'This story on your website helps establish authority and keeps your brand top-of-mind with visitors.',
  facebook: 'This post keeps your business visible in your audience\'s Facebook feed and helps build community.',
  instagram: 'This visual content builds brand awareness and helps attract new followers interested in your business.',
  youtube: 'This video helps potential customers learn more about your business and improves your visibility.',
  tiktok: 'This short video reaches a broader audience and shows your business has a fresh, modern presence.',
  google: 'This post improves your local visibility and helps people find your business on Google.',
  linkedin: 'This professional post establishes your business expertise and builds relationships with other professionals.',
  default: 'This content helps keep your business visible and active online, building trust with potential customers.',
};

export default function WhyPostingNote({ platforms = [], status = 'scheduled' }) {
  if (status === 'published') return null;

  // Use first platform or default
  const platform = Array.isArray(platforms) ? platforms[0] : platforms;
  const message = CONTEXT_MESSAGES[platform] || CONTEXT_MESSAGES.default;

  return (
    <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-4">
      <div className="flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs font-semibold text-emerald-700 mb-1">Why we're posting this</p>
          <p className="text-sm text-emerald-900">{message}</p>
        </div>
      </div>
    </div>
  );
}