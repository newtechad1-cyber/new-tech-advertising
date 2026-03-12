import React from 'react';
import { BookOpen } from 'lucide-react';

export default function MonthlyNarrative() {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 mb-12">
      <div className="flex items-start gap-3 mb-4">
        <BookOpen className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
        <h2 className="text-xl font-bold text-slate-900">Your Marketing Story This Month</h2>
      </div>
      
      <p className="text-slate-700 leading-relaxed text-lg">
        This month your business gained stronger local visibility and consistent engagement across social platforms. Your content strategy is resonating with your audience—customers are interacting more, visiting your profile more often, and taking real actions like calling, requesting directions, and submitting inquiries. This is the momentum that turns interest into revenue growth.
      </p>
    </div>
  );
}