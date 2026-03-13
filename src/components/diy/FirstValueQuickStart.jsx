import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, FileText, Video, Share2, Clock } from 'lucide-react';

const QUICK_START_ACTIONS = [
  {
    id: 'social_post',
    title: 'Create First Social Post',
    description: 'Generate AI-powered post in 5 minutes',
    icon: Share2,
    time: '5 min',
    color: 'from-orange-50 to-orange-100',
    borderColor: 'border-orange-300',
    badgeColor: 'bg-orange-100 text-orange-900',
    action: 'GenerateSocialPost'
  },
  {
    id: 'campaign',
    title: 'Launch First Campaign',
    description: 'Set up your first marketing campaign',
    icon: Zap,
    time: '10 min',
    color: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-300',
    badgeColor: 'bg-blue-100 text-blue-900',
    action: 'CreateCampaign'
  },
  {
    id: 'video_script',
    title: 'Write First Video Script',
    description: 'Create a script for your first video',
    icon: Video,
    time: '7 min',
    color: 'from-purple-50 to-purple-100',
    borderColor: 'border-purple-300',
    badgeColor: 'bg-purple-100 text-purple-900',
    action: 'GenerateVideoScript'
  }
];

export default function FirstValueQuickStart({ onActionStart, completedActions = [] }) {
  return (
    <Card className="border-2 border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Quick-Start Actions
        </CardTitle>
        <p className="text-sm text-slate-600 mt-2">
          Choose one action to get your first result
        </p>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {QUICK_START_ACTIONS.map((action) => {
            const Icon = action.icon;
            const isCompleted = completedActions.includes(action.id);

            return (
              <button
                key={action.id}
                onClick={() => onActionStart(action.id, action.action)}
                disabled={isCompleted}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  isCompleted
                    ? 'opacity-60 bg-slate-50 border-slate-200 cursor-default'
                    : `bg-gradient-to-br ${action.color} border-2 ${action.borderColor} hover:shadow-md hover:scale-105`
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon className="w-5 h-5 text-slate-700 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-900">
                          {action.title}
                        </h4>
                        {isCompleted && (
                          <Badge className="bg-green-500 text-white text-xs">
                            ✓ Done
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-700">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-600 font-medium">
                      {action.time}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-600">
          <p className="font-medium mb-1">💡 Pro tip:</p>
          <p>Start with social post—it's the fastest way to see real activity.</p>
        </div>
      </CardContent>
    </Card>
  );
}