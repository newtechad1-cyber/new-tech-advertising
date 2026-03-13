import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

const triggerEvents = [
  { group: 'Lifecycle', items: ['user_signup', 'onboarding_complete', 'first_milestone'] },
  { group: 'Retention', items: ['inactivity_detected', 'momentum_drop', 'engagement_increase'] },
  { group: 'Sales Signals', items: ['upgrade_readiness_high', 'leads_logged', 'growth_score_milestone'] },
  { group: 'Billing', items: ['payment_failed', 'subscription_cancelled'] },
  { group: 'Pipeline', items: ['discovery_done', 'proposal_not_viewed', 'deal_won'] },
];

const actionTypes = [
  'send_email',
  'show_modal',
  'send_notification',
  'create_record',
  'update_record',
  'flag_entity',
  'trigger_workflow',
  'update_dashboard',
];

export default function RuleDetailModal({ rule, onClose, onSave }) {
  const [formData, setFormData] = useState(
    rule || {
      rule_name: '',
      description: '',
      trigger_event: '',
      trigger_category: '',
      action_type: '',
      action_target: '',
      action_payload: '{}',
      priority: 5,
      is_active: true,
      execution_limit_per_user: 1,
      cooldown_hours: 24,
      trigger_condition: '',
    }
  );

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (rule?.id) {
        return await base44.entities.AutomationRule.update(rule.id, data);
      } else {
        return await base44.entities.AutomationRule.create(data);
      }
    },
    onSuccess: () => {
      onSave();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      JSON.parse(formData.action_payload);
    } catch {
      alert('Invalid JSON in Action Payload');
      return;
    }

    saveMutation.mutate(formData);
  };

  const selectedTriggerEvent = formData.trigger_event;
  const triggerCategory = triggerEvents
    .find(group => group.items.includes(selectedTriggerEvent))
    ?.group?.toLowerCase().replace(' ', '_');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {rule ? 'Edit Rule' : 'Create Rule'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rule Name & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Rule Name *
              </label>
              <Input
                value={formData.rule_name}
                onChange={(e) => setFormData({ ...formData, rule_name: e.target.value })}
                placeholder="e.g., Welcome New User"
                className="bg-slate-800 border-slate-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What does this rule do?"
                className="bg-slate-800 border-slate-700 h-20"
              />
            </div>
          </div>

          {/* Trigger Configuration */}
          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-sm font-semibold text-white mb-4">Trigger Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Trigger Event *
                </label>
                <Select value={formData.trigger_event} onValueChange={(value) => {
                  const category = triggerEvents
                    .find(group => group.items.includes(value))
                    ?.group?.toLowerCase().replace(' ', '_') || '';
                  setFormData({
                    ...formData,
                    trigger_event: value,
                    trigger_category: category,
                  });
                }}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Select trigger event" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {triggerEvents.map(group => (
                      <optgroup key={group.group} label={group.group}>
                        {group.items.map(item => (
                          <SelectItem key={item} value={item}>
                            {item.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </optgroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Trigger Condition (Optional)
                </label>
                <Input
                  value={formData.trigger_condition}
                  onChange={(e) => setFormData({ ...formData, trigger_condition: e.target.value })}
                  placeholder="e.g., upgrade_readiness_score >= 75"
                  className="bg-slate-800 border-slate-700 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Action Configuration */}
          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-sm font-semibold text-white mb-4">Action Configuration</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Action Type *
                  </label>
                  <Select value={formData.action_type} onValueChange={(value) => 
                    setFormData({ ...formData, action_type: value })
                  }>
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {actionTypes.map(action => (
                        <SelectItem key={action} value={action}>
                          {action.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Action Target *
                  </label>
                  <Input
                    value={formData.action_target}
                    onChange={(e) => setFormData({ ...formData, action_target: e.target.value })}
                    placeholder="e.g., user, diy_subscription"
                    className="bg-slate-800 border-slate-700"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Action Payload (JSON)
                </label>
                <textarea
                  value={formData.action_payload}
                  onChange={(e) => setFormData({ ...formData, action_payload: e.target.value })}
                  className="w-full h-32 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm font-mono"
                  placeholder='{"template": "welcome"}'
                />
              </div>
            </div>
          </div>

          {/* Execution Settings */}
          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-sm font-semibold text-white mb-4">Execution Settings</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Priority (1-10)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="bg-slate-800 border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Limit Per User/Day
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.execution_limit_per_user}
                  onChange={(e) => setFormData({ ...formData, execution_limit_per_user: parseInt(e.target.value) })}
                  className="bg-slate-800 border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Cooldown (Hours)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.cooldown_hours}
                  onChange={(e) => setFormData({ ...formData, cooldown_hours: parseInt(e.target.value) })}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="border-t border-slate-700 pt-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-white font-semibold">Rule is Active</span>
            </label>
          </div>

          {/* Actions */}
          <div className="border-t border-slate-700 pt-6 flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Saving...' : 'Save Rule'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}