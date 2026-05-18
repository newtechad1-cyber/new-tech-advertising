import React from 'react';
import { Shield } from 'lucide-react';

export default function ADAComplianceBanner() {
  return (
    <div className="bg-slate-900 border-t border-slate-800 py-4 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Shield className="w-4 h-4 text-emerald-400/80 flex-shrink-0" />
          <p className="text-xs text-slate-400 leading-snug">
            <span className="font-semibold text-slate-300 mr-2">Accessibility Statement:</span>
            We are committed to ensuring digital accessibility for all users. If you encounter any accessibility barriers on this website, please contact us for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}