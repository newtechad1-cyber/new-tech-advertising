import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export default function WorkflowProgressBar({ video }) {
  const steps = [
    { key: 'upload', label: 'Upload', complete: !!video?.source_file_url },
    { key: 'captions', label: 'Captions', complete: video?.captions_status === 'completed' },
    { key: 'branding', label: 'Branding', complete: video?.branding_status === 'applied' },
    { key: 'render', label: 'Render', complete: video?.render_status === 'completed' },
    { key: 'approval', label: 'Approval', complete: video?.review_status === 'approved' },
    { key: 'publish', label: 'Publish', complete: video?.processing_status === 'published' },
  ];

  const completedCount = steps.filter(s => s.complete).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-700">Workflow Progress</span>
        <span className="text-slate-500">{completedCount}/{steps.length}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {steps.map((step, idx) => (
          <div key={step.key} className="flex-1">
            <div className={`h-1.5 rounded-full ${step.complete ? 'bg-green-500' : 'bg-slate-200'}`} />
            <div className="text-xs text-slate-600 mt-1 text-center">{step.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}