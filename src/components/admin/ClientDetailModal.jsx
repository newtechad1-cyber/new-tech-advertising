import React, { useState } from 'react';
import { X, Mail, Users, Lightbulb, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

export default function ClientDetailModal({
  client,
  events,
  onClose,
  onSendMessage,
  onAssignCoach,
  onSaveNotes,
}) {
  const [notes, setNotes] = useState(client?.notes || '');
  const [isEditing, setIsEditing] = useState(false);

  if (!client) return null;

  const handleSaveNotes = async () => {
    await onSaveNotes?.(client.id, notes);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-700 bg-slate-900">
          <div>
            <h2 className="text-xl font-bold text-white">{client.business_name}</h2>
            <p className="text-sm text-slate-400">{client.user_email}</p>
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
          {/* Key Metrics */}
          <div>
            <h3 className="font-semibold text-white mb-3">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/50 rounded p-3">
                <div className="text-xs text-slate-400">Health Score</div>
                <div className="text-2xl font-bold text-white">{client.health}</div>
              </div>
              <div className="bg-slate-700/50 rounded p-3">
                <div className="text-xs text-slate-400">Growth Score</div>
                <div className="text-2xl font-bold text-white">
                  {client.retention?.growth_score || 0}
                </div>
              </div>
              <div className="bg-slate-700/50 rounded p-3">
                <div className="text-xs text-slate-400">Upgrade Readiness</div>
                <div className="text-2xl font-bold text-white">
                  {client.upgrade_readiness_score || 0}%
                </div>
              </div>
              <div className="bg-slate-700/50 rounded p-3">
                <div className="text-xs text-slate-400">Streak (Weeks)</div>
                <div className="text-2xl font-bold text-white">
                  {client.retention?.streak_weeks || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div>
            <h3 className="font-semibold text-white mb-3">Subscription</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Plan</span>
                <Badge className="capitalize">
                  {client.current_plan?.replace(/_/g, ' ')}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <Badge
                  className={
                    client.status === 'active'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                  }
                >
                  {client.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Onboarding</span>
                <span className="text-white">
                  {client.onboarding_completed ? '✓ Complete' : `${client.onboarding_step}/11`}
                </span>
              </div>
            </div>
          </div>

          {/* Growth Data */}
          <div>
            <h3 className="font-semibold text-white mb-3">Growth Data</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Campaigns Launched', client.retention?.campaigns_launched],
                ['Videos Created', client.retention?.videos_created],
                ['SEO Pages', client.retention?.seo_pages_published],
                ['Leads Logged', client.retention?.leads_logged],
                ['Posts Created', client.retention?.posts_created],
                ['Inactive Days', client.retention?.inactive_days],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-white font-semibold">{value || 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Onboarding Responses */}
          {client.marketing_frustration && (
            <div className="bg-slate-700/50 rounded p-4">
              <h3 className="font-semibold text-white mb-2">Onboarding Insights</h3>
              <div className="text-sm space-y-2">
                <div>
                  <span className="text-slate-400">Growth Goal: </span>
                  <span className="text-white capitalize">
                    {client.primary_growth_goal?.replace(/_/g, ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Main Frustration: </span>
                  <span className="text-white capitalize">
                    {client.marketing_frustration?.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Internal Notes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Internal Notes</h3>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  size="sm"
                  variant="ghost"
                >
                  Edit
                </Button>
              )}
            </div>
            {isEditing ? (
              <div>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes..."
                  className="bg-slate-700 border-slate-600 text-white mb-3"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveNotes}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setNotes(client.notes || '');
                    }}
                    size="sm"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-700/50 rounded p-3 text-sm text-slate-300">
                {notes || 'No notes yet'}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-slate-700">
            <Button
              onClick={() => onSendMessage?.(client)}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            <Button
              onClick={() => onAssignCoach?.(client)}
              variant="outline"
              className="flex-1"
            >
              <Users className="w-4 h-4 mr-2" />
              Assign Coach
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}