import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Sparkles } from 'lucide-react';

export default function FirstValueWelcome({ onDismiss, userName }) {
  const firstName = userName?.split(' ')[0] || 'there';

  return (
    <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                Welcome, {firstName}! 🎉
              </h3>
              <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                You're all set. Let's get your first marketing win in the next 15 minutes.
              </p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-600 transition"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white/60 rounded p-3 text-sm text-slate-700">
          <p className="font-medium mb-2">Here's the plan:</p>
          <ol className="space-y-1 text-xs text-slate-600 ml-4 list-decimal">
            <li>Pick one quick action below</li>
            <li>Complete it (5-10 minutes)</li>
            <li>See the impact immediately</li>
          </ol>
        </div>

        <Button
          onClick={onDismiss}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 font-medium"
        >
          Let's Go
        </Button>
      </div>
    </Card>
  );
}