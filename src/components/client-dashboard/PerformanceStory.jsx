import React from 'react';
import { Sparkles } from 'lucide-react';

export default function PerformanceStory({ companyName = 'Your brand' }) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-blue-100 shrink-0">
          <Sparkles className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 mb-2">Your Marketing Strategy in Action</h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            This month {companyName} is gaining consistent visibility through scheduled video marketing and website content. 
            Your team is actively building brand presence across social platforms, reaching new customers, and reinforcing 
            your market position with regular, professional content distribution.
          </p>
        </div>
      </div>
    </div>
  );
}