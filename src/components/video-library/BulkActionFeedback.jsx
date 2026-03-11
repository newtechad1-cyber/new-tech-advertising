import React, { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function BulkActionFeedback({ actionResult, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (visible && actionResult) {
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [visible, actionResult]);

  if (!visible || !actionResult) return null;

  const successCount = actionResult.success || 0;
  const failureCount = actionResult.failed || 0;

  return (
    <div className="fixed bottom-6 right-6 max-w-md z-50 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white border-l-4 border-green-500 rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3 flex-1 min-w-0">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="font-semibold text-slate-900">{actionResult.title}</p>
              <div className="text-sm text-slate-600 mt-1 space-y-0.5">
                {successCount > 0 && <p>✓ {successCount} {actionResult.successLabel || 'items'} processed</p>}
                {failureCount > 0 && <p className="text-red-600">✗ {failureCount} failed</p>}
              </div>
            </div>
          </div>
          <button 
            onClick={() => { setVisible(false); onClose?.(); }}
            className="text-slate-400 hover:text-slate-600 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}