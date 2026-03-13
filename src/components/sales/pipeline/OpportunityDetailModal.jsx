import React, { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const stageFlow = [
  'new_lead',
  'discovery',
  'demo',
  'proposal',
  'decision',
  'closed_won',
];

export default function OpportunityDetailModal({
  opportunity,
  onClose,
  onUpdate,
  onMove,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(opportunity);

  const handleSave = () => {
    onUpdate(opportunity.id, formData);
    setIsEditing(false);
  };

  const currentStageIndex = stageFlow.indexOf(opportunity.stage);
  const nextStage = stageFlow[currentStageIndex + 1];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg border border-slate-700 max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-700 bg-slate-900">
          <div>
            <h2 className="text-lg font-bold text-white">{opportunity.company_name}</h2>
            <p className="text-sm text-slate-400">{opportunity.contact_email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stage and Timeline */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase">
                Current Stage
              </label>
              <p className="mt-1 text-lg font-bold text-blue-400">
                {opportunity.stage.replace('_', ' ')}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase">
                Decision Timeline
              </label>
              <p className="mt-1 text-lg font-bold text-amber-400">
                {opportunity.decision_timeline.replace('_', ' ')}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase">
                Deal Value
              </label>
              <p className="mt-1 text-lg font-bold text-green-400">
                ${opportunity.estimated_deal_value.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Discovery Fields */}
          <div className="space-y-3 pb-4 border-b border-slate-700">
            <h3 className="font-semibold text-slate-300">Discovery Info</h3>
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Growth Goal
                  </label>
                  <Input
                    value={formData.growth_goal || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, growth_goal: e.target.value })
                    }
                    placeholder="Primary growth objective"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Marketing Challenges
                  </label>
                  <Input
                    value={formData.marketing_challenges || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        marketing_challenges: e.target.value,
                      })
                    }
                    placeholder="Pain points and challenges"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Growth Goal</p>
                  <p className="text-sm text-slate-200">{opportunity.growth_goal || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Challenges</p>
                  <p className="text-sm text-slate-200">
                    {opportunity.marketing_challenges || '—'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Demo/Proposal Status */}
          <div className="space-y-3 pb-4 border-b border-slate-700">
            <h3 className="font-semibold text-slate-300">Engagement</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-slate-400">Lead Score</p>
                <p className="text-sm font-bold text-amber-400">
                  {opportunity.lead_score}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Demo Completed</p>
                <p className="text-sm font-bold text-slate-300">
                  {opportunity.demo_completed ? '✓ Yes' : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Proposal Status</p>
                <p className="text-sm font-bold text-slate-300">
                  {opportunity.proposal_status.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Objections */}
          {opportunity.objection_notes && (
            <div className="pb-4 border-b border-slate-700">
              <h3 className="font-semibold text-slate-300 mb-2">Objections / Notes</h3>
              {isEditing ? (
                <Input
                  value={formData.objection_notes}
                  onChange={(e) =>
                    setFormData({ ...formData, objection_notes: e.target.value })
                  }
                  placeholder="Document concerns here"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              ) : (
                <p className="text-sm text-slate-300">{opportunity.objection_notes}</p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData(opportunity);
                    setIsEditing(false);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="flex-1"
                >
                  Edit Details
                </Button>
                {nextStage && (
                  <Button
                    onClick={() => onMove(opportunity.id, nextStage)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Move to {nextStage.replace('_', ' ')}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}