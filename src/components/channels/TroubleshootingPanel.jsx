import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function TroubleshootingPanel() {
  return (
    <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex gap-3 mb-4">
        <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <h3 className="font-semibold text-slate-900">Having trouble connecting a channel?</h3>
      </div>
      
      <ul className="space-y-2 mb-4">
        <li className="text-sm text-slate-700">• Make sure you're logged into the correct account</li>
        <li className="text-sm text-slate-700">• Confirm you have business profile access</li>
        <li className="text-sm text-slate-700">• Reconnect if permissions have expired</li>
      </ul>

      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
        View Full Connection Guide →
      </button>
    </div>
  );
}