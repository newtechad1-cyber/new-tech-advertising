import React from 'react';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

const WORKFLOW_STAGES = [
  { key: 'uploaded', label: 'Uploaded', icon: Circle },
  { key: 'transcript_ready', label: 'Transcript', icon: Circle },
  { key: 'captions_ready', label: 'Captions', icon: Circle },
  { key: 'branding_ready', label: 'Branding', icon: Circle },
  { key: 'render_ready', label: 'Render', icon: Circle },
  { key: 'ready_for_review', label: 'Review Ready', icon: Circle },
  { key: 'approved', label: 'Approved', icon: Circle },
  { key: 'scheduled', label: 'Scheduled', icon: Circle },
  { key: 'published', label: 'Published', icon: CheckCircle2 },
];

export default function WorkflowStatusStrip({ video, publishJobs = [] }) {
  const getStageStatus = (stageKey) => {
    if (stageKey === 'uploaded') return 'completed';
    if (stageKey === 'transcript_ready' && video.transcript_status === 'completed') return 'completed';
    if (stageKey === 'captions_ready' && video.captions_status === 'completed') return 'completed';
    if (stageKey === 'branding_ready' && video.branding_status === 'applied') return 'completed';
    if (stageKey === 'render_ready' && video.render_status === 'completed') return 'completed';
    if (stageKey === 'ready_for_review' && video.review_status === 'in_review') return 'active';
    if (stageKey === 'approved' && video.review_status === 'approved') return 'completed';
    if (stageKey === 'scheduled' && publishJobs?.some(j => j.job_status === 'scheduled')) return 'active';
    if (stageKey === 'published' && publishJobs?.some(j => j.job_status === 'published')) return 'completed';
    return 'pending';
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex items-center gap-2 min-w-max">
        {WORKFLOW_STAGES.map((stage, index) => {
          const status = getStageStatus(stage.key);
          const Icon = stage.icon;
          
          const statusColors = {
            completed: 'text-green-600 bg-green-50 border-green-300',
            active: 'text-blue-600 bg-blue-50 border-blue-300',
            pending: 'text-slate-400 bg-slate-100 border-slate-300',
            failed: 'text-red-600 bg-red-50 border-red-300',
          };

          return (
            <div key={stage.key} className="flex items-center gap-1.5">
              <div className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 text-xs font-medium whitespace-nowrap transition-all ${statusColors[status]}`}>
                <Icon className="w-3.5 h-3.5" />
                {stage.label}
              </div>
              {index < WORKFLOW_STAGES.length - 1 && (
                <div className={`h-0.5 w-4 ${status === 'completed' ? 'bg-green-300' : 'bg-slate-300'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}