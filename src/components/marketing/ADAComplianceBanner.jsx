import React from 'react';
import { Shield } from 'lucide-react';

export default function ADAComplianceBanner() {
  return (
    <div className="bg-slate-800 border-t border-slate-700 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start gap-4">
          <Shield className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-white mb-2">ADA Compliance Statement</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              We are committed to ensuring digital accessibility for individuals with disabilities. We continuously work to improve the user experience for everyone and apply the relevant accessibility standards. If you encounter any accessibility issues on this website, please contact us and we will do our best to resolve them promptly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}