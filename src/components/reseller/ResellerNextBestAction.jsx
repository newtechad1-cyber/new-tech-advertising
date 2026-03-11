import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ResellerNextBestAction({ reseller, onboarding, domain, branding, features }) {
  const actions = [];

  // Determine next best actions
  if (!onboarding?.branding_complete) {
    actions.push({
      title: 'Complete Branding',
      description: 'Customize logo, colors, and brand identity',
      priority: 'high',
      url: '/resellersettings/branding',
      icon: '🎨',
    });
  }

  if (!domain?.verification_status === 'verified') {
    actions.push({
      title: 'Connect Domain',
      description: 'Set up custom domain or subdomain',
      priority: 'high',
      url: '/resellersettings/domain',
      icon: '🔗',
    });
  }

  if (!onboarding?.users_invited) {
    actions.push({
      title: 'Invite Team',
      description: 'Add team members to manage platform',
      priority: 'medium',
      url: '/resellersettings/team',
      icon: '👥',
    });
  }

  if (!onboarding?.first_client_created) {
    actions.push({
      title: 'Add First Client',
      description: 'Create your first client account',
      priority: 'medium',
      url: '/resellerclients',
      icon: '🎯',
    });
  }

  if (!onboarding?.first_publish_configured) {
    actions.push({
      title: 'Configure Publishing',
      description: 'Set up publishing destinations',
      priority: 'medium',
      url: '/resellerpublishing',
      icon: '📤',
    });
  }

  if (!onboarding?.training_complete) {
    actions.push({
      title: 'Complete Training',
      description: 'Review platform features and best practices',
      priority: 'low',
      url: '/reseller-training',
      icon: '📚',
    });
  }

  const nextAction = actions[0];

  if (!nextAction) {
    return (
      <div className="bg-emerald-900/20 border border-emerald-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-lg">✓</span>
          <div>
            <p className="font-semibold text-emerald-200">Platform Ready</p>
            <p className="text-sm text-emerald-100 mt-1">All setup steps complete. Begin serving your clients.</p>
          </div>
        </div>
      </div>
    );
  }

  const priorityColor = nextAction.priority === 'high' ? 'text-red-400' : nextAction.priority === 'medium' ? 'text-amber-400' : 'text-blue-400';

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Zap className="w-4 h-4 text-violet-400" />
        Next Best Action
      </h3>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{nextAction.icon}</span>
              <p className={`text-sm font-bold ${priorityColor}`}>{nextAction.title}</p>
            </div>
            <p className="text-xs text-slate-400">{nextAction.description}</p>
          </div>
        </div>

        <Button
          size="sm"
          className="w-full bg-blue-600 hover:bg-blue-700 gap-1.5 text-xs"
          onClick={() => window.location.href = nextAction.url}
        >
          Get Started <ArrowRight className="w-3 h-3" />
        </Button>
      </div>

      {actions.length > 1 && (
        <div className="text-xs text-slate-400">
          {actions.length - 1} more action{actions.length - 1 !== 1 ? 's' : ''} available
        </div>
      )}
    </div>
  );
}