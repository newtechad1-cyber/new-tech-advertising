import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Rocket, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const ONBOARDING_STYLES = {
  submitted: 'bg-blue-100 text-blue-700',
  business_profile_linked: 'bg-purple-100 text-purple-700',
  intelligence_generated: 'bg-indigo-100 text-indigo-700',
  weekly_plan_generated: 'bg-teal-100 text-teal-700',
  ready_for_dashboard: 'bg-green-100 text-green-700',
  needs_review: 'bg-orange-100 text-orange-700',
  failed: 'bg-red-100 text-red-700'
};

export default function TrialSignupsPanel() {
  const { data: trials = [], isLoading } = useQuery({
    queryKey: ['trial-signups'],
    queryFn: () => base44.entities.TrialAccount.list('-created_date', 30)
  });

  const needsAttention = trials.filter(t =>
    t.onboarding_status !== 'ready_for_dashboard' && t.trial_status !== 'draft'
  );
  const completed = trials.filter(t => t.onboarding_status === 'ready_for_dashboard');

  const sendEmail = async (trial) => {
    try {
      await base44.integrations.Core.SendEmail({
        to: trial.email,
        subject: `Welcome to NTA — Let's Get Your Dashboard Ready`,
        body: `Hi ${trial.full_name || trial.name},\n\nWe noticed you recently signed up for a trial. Let's make sure your dashboard is fully set up!\n\nPlease reply to this email or book a call so we can get you started.\n\nBest,\nThe NTA Team`
      });
      toast.success(`Email sent to ${trial.email}`);
    } catch {
      toast.error('Failed to send email');
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-400">Loading trials...</div>;

  return (
    <div className="space-y-4">
      {needsAttention.length > 0 && (
        <div className="bg-white rounded-lg border">
          <div className="flex items-center gap-2 p-4 border-b">
            <Rocket className="w-4 h-4 text-orange-500" />
            <h2 className="font-semibold text-gray-800">Needs Attention ({needsAttention.length})</h2>
          </div>
          <div className="divide-y">
            {needsAttention.map(trial => (
              <div key={trial.id} className="p-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-800">{trial.name}</p>
                  <p className="text-sm text-gray-500">{trial.industry} · {trial.location_city}, {trial.location_state}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {trial.email} · {trial.created_date ? formatDistanceToNow(new Date(trial.created_date), { addSuffix: true }) : ''}
                  </p>
                  <div className="mt-1.5">
                    <Badge className={`text-xs ${ONBOARDING_STYLES[trial.onboarding_status] || 'bg-gray-100 text-gray-600'}`}>
                      {trial.onboarding_status?.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => sendEmail(trial)}>
                  <Mail className="w-3.5 h-3.5 mr-1" /> Email
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border">
        <div className="flex items-center gap-2 p-4 border-b">
          <Rocket className="w-4 h-4 text-green-500" />
          <h2 className="font-semibold text-gray-800">All Recent Trials ({trials.length})</h2>
        </div>
        <div className="divide-y">
          {trials.map(trial => (
            <div key={trial.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{trial.name}</p>
                <p className="text-xs text-gray-400">{trial.industry} · {trial.location_city} · {trial.email}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Badge className={`text-xs ${ONBOARDING_STYLES[trial.onboarding_status] || 'bg-gray-100'}`}>
                  {trial.onboarding_status?.replace(/_/g, ' ')}
                </Badge>
                <span className="text-xs text-gray-400">
                  {trial.created_date ? formatDistanceToNow(new Date(trial.created_date), { addSuffix: true }) : ''}
                </span>
              </div>
            </div>
          ))}
          {trials.length === 0 && (
            <div className="p-10 text-center text-gray-400">No trial signups yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}