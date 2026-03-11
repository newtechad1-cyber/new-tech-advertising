import React from 'react';
import { Star } from 'lucide-react';

export default function HighlightsSection({ report }) {
  const highlights = report.highlights_json
    ? JSON.parse(report.highlights_json)
    : [
        'Consistent brand visibility maintained',
        'Content publishing cadence strengthened',
        'Multiple campaigns launched successfully',
      ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Star className="w-5 h-5 text-amber-400" />
        Highlights
      </h3>

      <div className="space-y-2">
        {highlights.map((highlight, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 bg-amber-900/20 border border-amber-700 rounded-lg">
            <Star className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-100">{highlight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}