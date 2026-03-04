import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function PersonalizedWelcome({ name, city, state, industry }) {
  if (!name) return null;

  const locationParts = [city, state].filter(Boolean);
  const locationStr = locationParts.join(', ');
  const hasMeta = locationStr || industry;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 text-center"
    >
      <div className="inline-flex flex-col items-center gap-1.5">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-5 py-2">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-blue-300">
            Built for
          </span>
          <span className="text-sm font-bold text-white">{name}</span>
        </div>
        {hasMeta && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            {locationStr && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {locationStr}
              </span>
            )}
            {locationStr && industry && <span className="text-slate-600">•</span>}
            {industry && <span>{industry}</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
}